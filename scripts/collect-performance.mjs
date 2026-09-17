import { execFile } from 'node:child_process'
import { mkdir, writeFile } from 'node:fs/promises'
import { resolve } from 'node:path'
import { promisify } from 'node:util'
import { fileURLToPath } from 'node:url'
import { collectPerformance } from './performance-report.mjs'

// Read-only collection. The scheduled Codex task reviews these results before publishing.
const execute = promisify(execFile)
const repository = fileURLToPath(new URL('../', import.meta.url))

async function vercel(args) {
  const { stdout } = await execute('npx', ['--yes', 'vercel@59.16.0', ...args, '--json', '--non-interactive'], {
    cwd: repository, timeout: 90_000, maxBuffer: 8 * 1024 * 1024,
  })
  return JSON.parse(stdout)
}


const args = process.argv.slice(2)
let output = `${repository}/.vercel/performance/latest`
let until
for (let index = 0; index < args.length; index++) {
  if (args[index] === '--until' && args[index + 1]) {
    until = args[++index]
    if (!/^\d{4}-\d{2}-\d{2}T.*(?:Z|[+-]\d{2}:\d{2})$/.test(until)) throw new Error('--until requires an ISO 8601 timestamp with timezone')
  } else if (!args[index].startsWith('-') && index === 0) output = args[index]
  else throw new Error('Usage: node scripts/collect-performance.mjs [output-directory] [--until ISO-timestamp]')
}
output = resolve(output)
await mkdir(output, { recursive: true })
const { report, markdown } = await collectPerformance({ vercel, until })
await writeFile(resolve(output, 'metrics.json'), JSON.stringify(report, null, 2) + '\n')
await writeFile(resolve(output, 'report.md'), markdown)
console.log(JSON.stringify({ output, groups: report.groups.length, errors: report.errors }, null, 2))
if (report.errors.length) process.exitCode = 1
