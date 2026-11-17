import { execFileSync } from 'node:child_process'
import fs from 'node:fs'
import path from 'node:path'
import process from 'node:process'

const ROOT = process.cwd()
const EM_DASH = String.fromCodePoint(0x2014)
const ESCAPED_EM_DASH = '\\u' + '2014'
const ENTITY_RE = /&mdash;|&#8212;|&#x2014;/i

const failures = []

function assert(condition, message) {
  if (!condition) failures.push(message)
}

function readText(relPath) {
  const full = path.join(ROOT, relPath)
  if (!fs.existsSync(full)) {
    failures.push(`Missing required file: ${relPath}`)
    return ''
  }
  return fs.readFileSync(full, 'utf8')
}

function walkFiles(dirRel, skipDirs = new Set()) {
  const start = path.join(ROOT, dirRel)
  if (!fs.existsSync(start)) return []
  const out = []
  for (const entry of fs.readdirSync(start, { withFileTypes: true })) {
    if (skipDirs.has(entry.name)) continue
    const rel = path.join(dirRel, entry.name)
    if (entry.isDirectory()) {
      out.push(...walkFiles(rel, skipDirs))
    } else {
      out.push(rel)
    }
  }
  return out
}

// 1. Static build outputs
const requiredDistFiles = [
  'dist/index.html',
  'dist/resume/index.html',
  'dist/travel/index.html',
  'dist/explorations/index.html',
  'dist/operator/index.html',
  'dist/404.html',
  'dist/robots.txt',
  'dist/_headers',
  'dist/life-lab.html',
  'dist/life-lab.js',
  'dist/vendor/Tone.js',
  'dist/vendor/Tone.LICENSE.txt',
]

for (const rel of requiredDistFiles) {
  assert(fs.existsSync(path.join(ROOT, rel)), `Expected build artifact missing: ${rel}`)
}

assert(!fs.existsSync(path.join(ROOT, 'dist/_worker.js')), 'Unexpected dist/_worker.js bundle present')
assert(!fs.existsSync(path.join(ROOT, 'dist/client')), 'Unexpected dist/client directory from Worker Vite plugin')
assert(!fs.existsSync(path.join(ROOT, 'public/_redirects')), 'Self-looping public/_redirects must not exist')

// 2. Config and Worker quota checks
assert(!fs.existsSync(path.join(ROOT, 'worker.js')), 'worker.js must be removed to avoid Worker quota consumption')
assert(
  !fs.existsSync(path.join(ROOT, '.wrangler/cache/wrangler-account.json')),
  '.wrangler/cache/wrangler-account.json must not be present'
)

const wranglerText = readText('wrangler.jsonc')
assert(!wranglerText.includes('worker.js'), 'wrangler.jsonc must not reference worker.js')
assert(!wranglerText.includes('run_worker_first'), 'wrangler.jsonc must not enable run_worker_first')
assert(!wranglerText.includes('single-page-application'), 'wrangler.jsonc must not use single-page-application fallback')
assert(wranglerText.includes('"404-page"'), 'wrangler.jsonc must configure 404-page not_found_handling')

const pkgText = readText('package.json')
assert(!pkgText.includes('--commit-dirty'), 'package.json must not use --commit-dirty')
assert(!pkgText.includes('@cloudflare/vite-plugin'), 'package.json must not depend on @cloudflare/vite-plugin')

// 3. Headers, CSP, and robots.txt checks
const headersText = readText('dist/_headers')
assert(!headersText.includes('cdnjs.cloudflare.com'), 'dist/_headers must not allowlist cdnjs.cloudflare.com')
assert(headersText.includes("script-src 'self';"), "dist/_headers must enforce script-src 'self'")
assert(headersText.includes("object-src 'none'"), "dist/_headers must include object-src 'none'")
assert(headersText.includes("base-uri 'self'"), "dist/_headers must include base-uri 'self'")
assert(
  headersText.includes("form-action 'self' https://formspree.io"),
  'dist/_headers must restrict form-action to self and formspree.io'
)
assert(headersText.includes('X-Content-Type-Options: nosniff'), 'dist/_headers must set X-Content-Type-Options: nosniff')
assert(headersText.includes('Strict-Transport-Security:'), 'dist/_headers must set Strict-Transport-Security')
assert(headersText.includes('X-Frame-Options: SAMEORIGIN'), 'dist/_headers must set X-Frame-Options: SAMEORIGIN')
assert(headersText.includes('Referrer-Policy:'), 'dist/_headers must set Referrer-Policy')

const robotsText = readText('dist/robots.txt')
assert(robotsText.includes('User-agent: *') && robotsText.includes('Allow: /'), 'dist/robots.txt must allow indexing')

// 4. HTML, Contact form, and Tone.js vendor checks
const distIndex = readText('dist/index.html')
assert(!/\son[a-z]+\s*=/i.test(distIndex), 'dist/index.html must not contain inline event handlers')
assert(!distIndex.includes('fonts.googleapis.com'), 'dist/index.html must not load Google Fonts on initial load')
assert(distIndex.includes('maxlength="100"'), 'dist/index.html must cap #cf-name at maxlength="100"')
assert(distIndex.includes('maxlength="254"'), 'dist/index.html must cap #cf-email at maxlength="254"')
assert(distIndex.includes('maxlength="5000"'), 'dist/index.html must cap #cf-msg at maxlength="5000"')
assert(distIndex.includes('name="_gotcha"'), 'dist/index.html must include _gotcha honeypot input')

const lifeLabHtml = readText('dist/life-lab.html')
const lifeLabJs = readText('dist/life-lab.js')
assert(!/\son[a-z]+\s*=/i.test(lifeLabHtml), 'dist/life-lab.html must not contain inline event handlers')
assert(!lifeLabHtml.includes('cdnjs.cloudflare.com'), 'dist/life-lab.html must not reference cdnjs.cloudflare.com')
assert(!lifeLabJs.includes('cdnjs.cloudflare.com'), 'dist/life-lab.js must not reference cdnjs.cloudflare.com')
assert(lifeLabJs.includes('/vendor/Tone.js'), 'dist/life-lab.js must load vendored /vendor/Tone.js')

// 5. Em-dash and innerHTML hygiene checks across index.html, public/, src/, and docs
const textExt = /\.(js|jsx|mjs|html|css|md)$/i
const filesToCheck = [
  'index.html',
  'README.md',
  'DESIGN_BRIEF.md',
  ...walkFiles('src'),
  ...walkFiles('public', new Set(['vendor', 'fonts'])),
].filter((f) => textExt.test(f))

for (const rel of filesToCheck) {
  const content = readText(rel)
  if (content.includes(EM_DASH) || content.includes(ESCAPED_EM_DASH) || ENTITY_RE.test(content)) {
    failures.push(`Em dash found in ${rel}`)
  }
  if ((rel === 'index.html' || rel.startsWith('src/')) && content.includes('innerHTML')) {
    failures.push(`Unsafe innerHTML usage found in ${rel}`)
  }
}

// 6. npm audit check (0 vulnerabilities)
try {
  const auditRaw = execFileSync('npm', ['audit', '--json'], {
    cwd: ROOT,
    encoding: 'utf8',
    stdio: ['ignore', 'pipe', 'pipe'],
  })
  const audit = JSON.parse(auditRaw)
  const totalVulns = audit?.metadata?.vulnerabilities?.total ?? 1
  assert(totalVulns === 0, `npm audit reported ${totalVulns} vulnerabilities (expected 0)`)
} catch (err) {
  failures.push(`npm audit check failed: ${err.message}`)
}

if (failures.length > 0) {
  console.error('Build verification failed:')
  for (const f of failures) {
    console.error(` - ${f}`)
  }
  process.exit(1)
}

console.log(
  `Build verification passed: ${requiredDistFiles.length} artifacts checked, ${filesToCheck.length} source files clean, 0 vulnerabilities.`
)
