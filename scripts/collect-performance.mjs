import { execFile } from 'node:child_process'
import { mkdir, writeFile } from 'node:fs/promises'
import { resolve } from 'node:path'
import { promisify } from 'node:util'
import { fileURLToPath } from 'node:url'

// Read-only collection. The scheduled Codex task reviews these results before publishing.
const execute = promisify(execFile)
const repository = fileURLToPath(new URL('../', import.meta.url))
const output = resolve(process.argv[2] || `${repository}/.vercel/performance/latest`)
const until = new Date()
// The metrics backend rounds week-long queries to four-hour buckets.
// Align both periods so their actual aggregation windows do not overlap.
until.setUTCHours(Math.floor(until.getUTCHours() / 4) * 4)
until.setUTCMinutes(0, 0, 0)
const week = 7 * 24 * 60 * 60 * 1000
const metrics = ['lcp_ms', 'inp_ms', 'cls', 'fcp_ms', 'ttfb_ms']
const windows = {
  current: { since: new Date(+until - week).toISOString(), until: until.toISOString() },
  previous: { since: new Date(+until - 2 * week).toISOString(), until: new Date(+until - week).toISOString() },
}

async function vercel(args) {
  const { stdout } = await execute('npx', ['--yes', 'vercel@59.16.0', ...args, '--json', '--non-interactive'], {
    cwd: repository, timeout: 90_000, maxBuffer: 8 * 1024 * 1024,
  })
  return JSON.parse(stdout)
}

await mkdir(output, { recursive: true })
const schema = await vercel(['metrics', 'schema', 'vercel.speed_insights'])
const available = new Set(schema.map(({ id }) => id))
const report = { collectedAt: new Date().toISOString(), source: 'Vercel Speed Insights',
  project: 'jimmyflix', environment: 'production', hostname: 'jimmyflix.vercel.app', windows, queries: [], errors: [] }
const jobs = Object.entries(windows).flatMap(([period, range]) => metrics.flatMap((metric) =>
  ['p75', 'count'].map((aggregation) => ({ period, range, metric, aggregation })),
))

async function collect({ period, range, metric, aggregation }) {
  const id = `vercel.speed_insights.${metric}`
  if (!available.has(id)) {
    report.errors.push({ period, metric, aggregation, error: 'Metric unavailable in the account schema' })
    return
  }
  try {
    const result = await vercel(['metrics', id, '--aggregation', aggregation,
      '--project', 'prj_egb0GjkG9oeZ3AZIIrVzf7SNAjJv', '--prod',
      '--filter', 'requestHostname:"jimmyflix.vercel.app"', '--group-by', 'route', '--group-by', 'deviceType',
      '--since', range.since, '--until', range.until, '--granularity', '1h', '--limit', '100'])
    if (!Array.isArray(result.summary)) throw new Error('Missing metrics summary')
    report.queries.push({ period, metric, aggregation, query: result.query, summary: result.summary })
    if (result.query?.startTime !== range.since || result.query?.endTime !== range.until) {
      report.errors.push({ period, metric, aggregation, error: 'Backend changed the time window; use query.startTime/endTime and do not compare overlapping periods' })
    }
    if (result.summary.length >= 100) report.errors.push({ period, metric, aggregation, error: 'Group limit reached; narrow queries before drawing conclusions' })
  } catch {
    // Never write CLI authentication details or raw stderr into a public report.
    report.errors.push({ period, metric, aggregation, error: 'Metrics query failed; check CLI access and retry' })
  }
}

// Keep platform queries bounded and avoid triggering rate limits.
for (let index = 0; index < jobs.length; index += 2) {
  await Promise.all(jobs.slice(index, index + 2).map(collect))
}

const groups = new Map()
for (const query of report.queries) {
  for (const row of query.summary) {
    const key = JSON.stringify([row.route, row.deviceType])
    if (!groups.has(key)) groups.set(key, { route: row.route, device: row.deviceType, current: {}, previous: {} })
    const value = row[`vercel_speed_insights_${query.metric}_${query.aggregation}`]
    groups.get(key)[query.period][`${query.metric}_${query.aggregation}`] = Number.isFinite(value) ? value : null
  }
}
report.groups = [...groups.values()].sort((a, b) => a.route.localeCompare(b.route) || a.device.localeCompare(b.device))
const cell = (value, digits = 0) => Number.isFinite(value) ? value.toFixed(digits) : '—'
const metricCell = (row, metric) => `${cell(row[`${metric}_p75`], metric === 'cls' ? 3 : 0)} / ${cell(row[`${metric}_count`])}`
const delta = (row, metric) => {
  const current = row.current[`${metric}_p75`]
  const previous = row.previous[`${metric}_p75`]
  if (report.errors.length) return '—'
  if (!Number.isFinite(current) || !Number.isFinite(previous)) return '—'
  const change = current - previous
  return `${change > 0 ? '+' : ''}${cell(change, metric === 'cls' ? 3 : 0)}`
}
const md = [
  '# Jimmyflix 주간 성능 리포트', '',
  `수집: ${report.collectedAt}`, `기간(UTC): ${windows.current.since} ~ ${windows.current.until}`, '',
  'Vercel Speed Insights · 프로덕션 도메인 · 화면/기기별 실사용 p75. 각 셀은 **p75 / 해당 지표 표본 수**입니다.',
  '시간 단위는 ms, CLS는 단위 없는 점수입니다. `—`는 데이터 없음/조회 실패이며 0이 아닙니다. 표본은 방문자 수가 아닙니다.', '',
  '| 화면 | 기기 | LCP / n | INP / n | CLS / n | FCP / n | TTFB / n |',
  '|---|---|---:|---:|---:|---:|---:|',
  ...report.groups.map((row) => `| ${row.route.replaceAll('|', '\\|')} | ${row.device} | ${metrics.map((metric) => metricCell(row.current, metric)).join(' | ')} |`), '',
  '좋음 기준: LCP ≤ 2,500ms · INP ≤ 200ms · CLS ≤ 0.1. 소수 표본의 p75만으로 안정적인 개선/악화를 단정하지 않습니다.', '',
  '## 직전 7일 대비 p75 변화', '',
  '| 화면 | 기기 | Δ LCP(ms) | Δ INP(ms) | Δ CLS |', '|---|---|---:|---:|---:|',
  ...report.groups.map((row) => `| ${row.route.replaceAll('|', '\\|')} | ${row.device} | ${['lcp_ms', 'inp_ms', 'cls'].map((metric) => delta(row, metric)).join(' | ')} |`), '',
  report.errors.length ? `조회 경고: ${report.errors.length}건. 수집 JSON의 errors를 확인하세요.` : '모든 지표 조회 성공. 비어 있는 화면은 아직 표본이 없습니다.', '',
  '[측정 정의](https://web.dev/articles/vitals) · [Vercel CLI 지표](https://vercel.com/docs/speed-insights/accessing-metrics-with-vercel-cli)', '',
]
await writeFile(resolve(output, 'metrics.json'), JSON.stringify(report, null, 2) + '\n')
await writeFile(resolve(output, 'report.md'), md.join('\n'))
console.log(JSON.stringify({ output, groups: report.groups.length, errors: report.errors }, null, 2))
if (report.errors.length) process.exitCode = 1
