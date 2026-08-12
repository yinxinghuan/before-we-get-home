import assert from 'node:assert/strict'
import { beforeWeGetHome, beforeWeGetHomeEn } from '../src/story/cartridges/beforeWeGetHome'

for (const cartridge of [beforeWeGetHome, beforeWeGetHomeEn]) {
  const beats = cartridge.opening.blocks
  assert.equal(beats.length, 6)
  assert.match(beats[0]?.text ?? '', /普通人|ordinary person/i)
  assert.match(beats[1]?.text ?? '', /灯突然全灭|Every light dies/i)
  assert.match(beats[2]?.text ?? '', /十八秒语音|eighteen-second message/i)
  assert.equal(beats[3]?.kind, 'dialogue')
  assert.match(beats[3]?.text ?? '', /河滨体育馆|Riverside Stadium/i)
  assert.match(beats[4]?.text ?? '', /47%/)
  assert.match(beats[5]?.text ?? '', /橙色雨衣|orange rain jacket/i)
  assert.equal(cartridge.opening.choices.length, 0)
  assert.ok(cartridge.opening.entryAction)
  assert(beats.every((beat) => beat.text.trim().length > 0))
}

console.log(JSON.stringify({ ok: true, openingBeats: 6, entryAction: true, choicesBeforeEntryAction: 0 }))
