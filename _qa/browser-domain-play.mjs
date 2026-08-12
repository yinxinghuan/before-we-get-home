import fs from 'node:fs/promises'
import { chromium } from '/Users/yin/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright/index.mjs'

const evidenceDir = new URL('./ui/domain-rules/', import.meta.url)
await fs.mkdir(evidenceDir, { recursive: true })
const browser = await chromium.launch({ headless: true })
const context = await browser.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 1 })
const page = await context.newPage()
const transparentGif = 'R0lGODlhAQABAIAAAAAAAP///ywAAAAAAQABAAACAUwAOw=='
await page.route('https://images.aiwaves.tech/alteru/guest-shell.js', (route) => route.fulfill({ contentType: 'application/javascript', body: '' }))
await page.route('https://game.aiwaves.tech/alteru-media/api/v1/images/generations', (route) => route.fulfill({ contentType: 'application/json', body: JSON.stringify({ request_id: 'qa', task_id: 'qa-image', type: 'image', status: 'succeeded', media: { type: 'image', url: `data:image/gif;base64,${transparentGif}`, width: 512, height: 640, format: 'png' } }) }))
await page.route('https://chat.aiwaves.tech/aigram/api/gen-image', (route) => route.fulfill({ contentType: 'application/json', body: JSON.stringify({ url: `data:image/gif;base64,${transparentGif}` }) }))
await page.addInitScript(() => { localStorage.clear(); sessionStorage.clear() })
const qaBase = process.env.QA_BASE || 'http://127.0.0.1:4175/'
await page.goto(`${qaBase}?story_mode=demo&ui=civic&lang=zh`, { waitUntil: 'domcontentloaded' })
await page.addStyleTag({ content: '#alteru-guest-banner{display:none!important}' })
await page.getByRole('button', { name: /听完最后一条语音/ }).click()

async function advance() {
  const next = page.getByRole('button', { name: /查看下一步选择/ })
  if (await next.isVisible()) { await next.click(); await next.waitFor({ state: 'hidden' }) }
  const captionNext = page.locator('.ct-stage__caption-page')
  while (await captionNext.isVisible().catch(() => false)) await captionNext.click()
  await page.locator('.st-composer input').waitFor()
}

async function finishResult() {
  const nextPage = page.locator('.ct-result-story button')
  const nextChoices = page.getByRole('button', { name: /查看下一步选择/ })
  await Promise.race([
    nextPage.waitFor({ timeout: 10_000 }).catch(() => undefined),
    nextChoices.waitFor({ timeout: 10_000 }).catch(() => undefined),
  ])
  while (await nextPage.isVisible().catch(() => false)) await nextPage.click()
  await nextChoices.waitFor()
}

await finishResult()
await advance()

async function act(text) {
  const input = page.locator('.st-composer input')
  await input.fill(text)
  await input.press('Enter')
  await finishResult()
}

let body = await page.locator('body').innerText()
if (!body.includes('47 降到 43') && !body.includes('43')) throw new Error('Entry action did not render the exact battery result')
await page.screenshot({ path: new URL('01-voice-clue-platform-layout-390x844.png', evidenceDir).pathname, fullPage: true })

await page.getByRole('button', { name: /请橙色雨衣骑手带你走旧市场小路/ }).click()
await finishResult()
body = await page.locator('body').innerText()
if (!body.includes('才说自己叫阿禾')) throw new Error('Ahe did not receive a visible ordered debut')
if (!body.includes('天亮前 -7') || !body.includes('天亮前\n77')) throw new Error(`Ahe route did not render the exact time cost:\n${body.slice(-1800)}`)
await page.screenshot({ path: new URL('02-ahe-introduced-platform-layout-390x844.png', evidenceDir).pathname, fullPage: true })

await advance()
await act('再请骑手带你走旧市场小路')
body = await page.locator('body').innerText()
if (!body.includes('已经离开车站')) throw new Error('Repeated station exit did not explain rejection')
await page.screenshot({ path: new URL('03-repeat-rejected-platform-layout-390x844.png', evidenceDir).pathname, fullPage: true })

console.log(JSON.stringify({ ok: true, viewport: '390x844', steps: ['voice clue cost exactly once', 'Ahe visible debut and party route', 'repeat exit rejected'] }))
await browser.close()
