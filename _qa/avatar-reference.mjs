import { chromium } from '/Users/yin/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright/index.mjs'

const testCase = process.argv[2] || 'direct'
const baseUrl = process.env.STORY_QA_URL || 'http://127.0.0.1:4185/'
const avatarUrl = 'https://qa.invalid/generated-player-avatar.png'
const transparentGif = 'R0lGODlhAQABAIAAAAAAAP///ywAAAAAAQABAAACAUwAOw=='

function installProfileBridge() {
  return ({ avatarUrl, kind }) => {
    let profileCalls = 0
    if (kind === 'slow') window.Aigram = { isInAigram: true, telegramId: 'slow-home-player' }
    window.addEventListener('message', (event) => {
      if (typeof event.data !== 'string' || !event.data.startsWith('callAPI-')) return
      try {
        const request = JSON.parse(decodeURIComponent(escape(atob(event.data.slice(8)))))
        if (!String(request.url).includes('/note/telegram/user/get/info/by/telegram_id')) return
        profileCalls += 1
        if (kind === 'slow' && profileCalls === 1) return
        window[`__aigram_cb_${String(request.request_id).replace(/-/g, '_')}`]?.(JSON.stringify({
          request_id: request.request_id,
          success: true,
          data: { retcode: 0, msg: 'ok', data: { name: 'Covered Home Player', head_url: avatarUrl } },
        }))
      } catch { /* bridge timeout exposes regressions */ }
    })
  }
}

const browser = await chromium.launch({ headless: true })
const context = await browser.newContext({ viewport: { width: 390, height: 844 }, locale: 'zh-CN' })
if (testCase === 'late') {
  await context.addInitScript(({ avatarUrl }) => {
    window.addEventListener('message', (event) => {
      if (typeof event.data !== 'string' || !event.data.startsWith('callAPI-')) return
      try {
        const request = JSON.parse(decodeURIComponent(escape(atob(event.data.slice(8)))))
        if (!String(request.url).includes('/note/telegram/user/get/info/by/telegram_id')) return
        window[`__aigram_cb_${String(request.request_id).replace(/-/g, '_')}`]?.(JSON.stringify({
          request_id: request.request_id,
          success: true,
          data: { retcode: 0, msg: 'ok', data: { name: 'Late Homebound Player', head_url: avatarUrl } },
        }))
      } catch { /* bridge timeout exposes regressions */ }
    })
    window.setTimeout(() => {
      window.Aigram = { isInAigram: true, telegramId: 'late-home-player' }
      window.postMessage('qa-shell-identity-ready', '*')
    }, 4_200)
  }, { avatarUrl })
}
if (testCase === 'platform-query' || testCase === 'slow') {
  await context.addInitScript(installProfileBridge(), { avatarUrl, kind: testCase })
}

const page = await context.newPage()
const imageRequests = []
let uploadRequests = 0
await page.route('https://images.aiwaves.tech/alteru/guest-shell.js', (route) => route.fulfill({ contentType: 'application/javascript', body: '' }))
await page.route(avatarUrl, (route) => route.fulfill({ contentType: 'image/gif', body: Buffer.from(transparentGif, 'base64') }))
await page.route('https://chat.aiwaves.tech/aigram/api/upload', (route) => { uploadRequests += 1; return route.fulfill({ status: 500, body: '{}' }) })
await page.route('https://game.aiwaves.tech/alteru-media/api/v1/images/generations', (route) => {
  const payload = route.request().postDataJSON()
  imageRequests.push({ ...payload, ref_url: payload.reference_urls?.[0] })
  const now = Date.now()
  return route.fulfill({ contentType: 'application/json', body: JSON.stringify({
    request_id: payload.request_id,
    task_id: `qa-home-image-${imageRequests.length}`,
    type: 'image', status: 'succeeded',
    media: { type: 'image', url: `data:image/gif;base64,${transparentGif}`, width: payload.size.width, height: payload.size.height, format: 'png' },
    created_at: now, updated_at: now,
  }) })
})

const query = new URLSearchParams({ story_mode: 'demo', lang: 'zh' })
if (testCase === 'platform-query') {
  query.set('api_origin', new URL(baseUrl).origin)
  query.set('telegram_id', '987654321')
} else if (testCase === 'direct' || testCase === 'saved-repair') {
  query.set('avatar_url', avatarUrl)
  query.set('user_name', 'Generated QA Player')
}
await page.goto(`${baseUrl}?${query}`, { waitUntil: 'networkidle' })
await page.evaluate(() => window.alteruLocalStorage.clear())
await page.reload({ waitUntil: 'networkidle' })
await page.getByRole('button', { name: '听完最后一条语音' }).click()
for (let index = 0; index < 60 && imageRequests.length < 1; index += 1) await page.waitForTimeout(200)

const opening = imageRequests[0]
if (!opening) throw new Error('opening image was not generated')
if (opening.ref_url !== avatarUrl) throw new Error(`opening did not use the original avatar URL: ${JSON.stringify(opening)}`)
if (opening.mode !== 'edit') throw new Error(`opening used ${opening.mode} instead of edit`)
if (!String(opening.prompt).includes('HARD FULL-VISUAL-IDENTITY CAST MAP')) throw new Error('opening omitted the full visual identity cast map')
for (const required of ['exact complete visible identity', 'sheet ghost', 'MUST NOT be invented', 'silhouette', 'costume', 'CURRENT SCENE']) {
  if (!String(opening.prompt).includes(required)) throw new Error(`opening omitted full-appearance rule: ${required}`)
}
if (String(opening.prompt).length > 4000) throw new Error(`opening prompt exceeded 4000: ${String(opening.prompt).length}`)
if (uploadRequests !== 0) throw new Error('the original avatar was unexpectedly cropped and re-uploaded')

if (testCase === 'saved-repair') {
  const firstChoice = page.locator('.st-quick-replies button').first()
  await firstChoice.waitFor({ state: 'visible' })
  await firstChoice.click()
  for (let index = 0; index < 80 && imageRequests.length < 2; index += 1) await page.waitForTimeout(200)
  if (imageRequests.length < 2) throw new Error('second story image was not generated before migration setup')
  await page.evaluate(() => {
    const key = 'before-we-get-home-save'
    const archive = JSON.parse(window.alteruLocalStorage.getItem(key) || '{}')
    archive.worlds['before-we-get-home'].blocks = archive.worlds['before-we-get-home'].blocks.map((block) => {
      if (block.id !== 'image-0' && block.id !== 'image-1') return block
      const data = { ...block.data, status: 'ready', url: `https://qa.invalid/legacy-${block.id}.png`, playerVisible: 'true' }
      delete data.identityRefVersion
      return { ...block, data }
    })
    window.alteruLocalStorage.setItem(key, JSON.stringify(archive))
  })
  const beforeRepair = imageRequests.length
  await page.reload({ waitUntil: 'networkidle' })
  await page.waitForFunction(() => {
    const archive = JSON.parse(window.alteruLocalStorage.getItem('before-we-get-home-save') || '{}')
    const early = archive.worlds?.['before-we-get-home']?.blocks?.filter((block) => block.id === 'image-0' || block.id === 'image-1') ?? []
    return early.length === 2 && early.every((block) => block.data?.status === 'ready' && block.data?.identityRefVersion === 2)
  }, null, { timeout: 15000 })
  const repaired = imageRequests.slice(beforeRepair)
  if (repaired.length !== 2 || repaired.some((request) => request.ref_url !== avatarUrl || request.mode !== 'edit')) {
    throw new Error(`saved opening images were not repaired with the player reference: ${JSON.stringify(repaired)}`)
  }
}

console.log(JSON.stringify({ ok: true, case: testCase, mode: opening.mode, originalAvatar: opening.ref_url === avatarUrl, uploadRequests }))
await browser.close()
