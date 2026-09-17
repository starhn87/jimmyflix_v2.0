import assert from 'node:assert/strict'
import test from 'node:test'
import { collectPerformance, performanceWindows } from '../scripts/performance-report.mjs'

const until = '2026-09-17T03:45:00Z'
const schema = ['lcp_ms', 'inp_ms', 'cls', 'fcp_ms', 'ttfb_ms'].map((name) => ({ id: `vercel.speed_insights.${name}` }))
const query = (count = 30, alterWindow = false) => async (args) => {
  if (args[1] === 'schema') return schema
  const value = (flag) => args[args.indexOf(flag) + 1]
  const metric = args[1].split('.').at(-1)
  const aggregation = value('--aggregation')
  return {
    query: { startTime: alterWindow ? '2026-01-01T00:00:00Z' : value('--since'), endTime: value('--until') },
    summary: [{ route: '/[locale]', deviceType: 'mobile', [`vercel_speed_insights_${metric}_${aggregation}`]: aggregation === 'count' ? count : 123 }],
  }
}

test('explicit reporting periods are reproducible, aligned and adjacent without overlap', () => {
  const windows = performanceWindows(until)
  assert.equal(windows.current.until, '2026-09-17T00:00:00.000Z')
  assert.equal(windows.previous.until, windows.current.since)
  assert.equal(Date.parse(windows.current.until) - Date.parse(windows.current.since), 7 * 86400000)
  assert.throws(() => performanceWindows('invalid'))
})

test('an initial schema outage produces a report artifact without leaking CLI errors', async () => {
  const { report, markdown } = await collectPerformance({ until, vercel: async () => { throw new Error('secret cli auth stderr') } })
  assert.equal(report.errors.length, 1)
  assert.deepEqual(report.groups, [])
  assert.equal(report.queries.length, 0)
  assert.ok(markdown.includes('조회 경고'))
  assert.ok(!JSON.stringify(report).includes('secret'))
})

test('healthy results preserve raw windows and per-metric counts', async () => {
  const { report, markdown } = await collectPerformance({ until, vercel: query() })
  assert.equal(report.queries.length, 20)
  assert.equal(report.errors.length, 0)
  assert.equal(report.groups[0].current.lcp_ms_count, 30)
  assert.ok(markdown.includes('| /[locale] | mobile | 0 | 0 | 0.000 |'))
})

test('sparse samples or adjusted time windows suppress comparative claims', async () => {
  for (const vercel of [query(2), query(30, true)]) {
    const { markdown } = await collectPerformance({ until, vercel })
    assert.ok(markdown.includes('| /[locale] | mobile | — | — | — |'))
  }
})
