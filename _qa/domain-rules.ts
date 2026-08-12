import assert from 'node:assert/strict'
import { beforeWeGetHome } from '../src/story/cartridges/beforeWeGetHome'
import { resolveDomainAction } from '../src/story/engine/domainRules'
import { parseStoryProtocol } from '../src/story/engine/protocol'
import { applyParsedScene, createInitialSave } from '../src/story/engine/reducer'
import type { StorySave } from '../src/story/types'

function play(save: StorySave, action: string) {
  const domain = resolveDomainAction(save, beforeWeGetHome, action)
  const hostile = `模型试图改写裁判结果。
[widget: battery, add: 99]
[widget: time, add: 99]
[fact: id="station-exited" value="false"]
[map_update: new_location="模型捏造的安全区"]
[party_change: character_id="zhoulan-nurse" character="周岚" change="add"]
[choices: "错误一"|"错误二"|"错误三"]`
  return {
    domain,
    next: applyParsedScene(save, parseStoryProtocol(hostile, 'zh'), beforeWeGetHome, action, undefined, undefined, undefined, domain),
  }
}

let save = createInitialSave(beforeWeGetHome)
assert.deepEqual(save.characters.map((character) => character.id), ['lin-lan-mother', 'xiaoyu-brother'])

let turn = play(save, '重听语音，分辨背景里的路线声音')
assert.equal(turn.domain?.status, 'accepted')
assert.equal(turn.next.stats.battery, 43)
assert.equal(turn.next.facts['voice-old-market-clue'], true)
assert.equal(turn.next.characters.some((character) => character.id === 'zhoulan-nurse'), false)
assert.deepEqual(turn.next.choices.map((choice) => choice.label), ['请橙色雨衣骑手带你走旧市场小路', '记住线索，独自沿高架离开', '把线索告诉车站救援人员核对'])
save = turn.next

turn = play(save, '再听一次语音')
assert.equal(turn.domain?.status, 'rejected')
assert.equal(turn.next.stats.battery, 43)
save = turn.next

turn = play(save, '请橙色雨衣骑手带你走旧市场小路')
assert.equal(turn.domain?.status, 'accepted')
assert.equal(turn.next.stats.time, 77)
assert.equal(turn.next.facts['station-exited'], true)
assert.equal(turn.next.map.find((node) => node.current)?.id, 'old-market')
assert.deepEqual(turn.next.partyMemberIds, ['ahe-rider'])
assert.equal(turn.next.characters.find((character) => character.id === 'ahe-rider')?.origin, 'cartridge')
save = turn.next

turn = play(save, '再请骑手带你走旧市场小路')
assert.equal(turn.domain?.status, 'rejected')
assert.equal(turn.next.stats.time, 77)
assert.deepEqual(turn.next.partyMemberIds, ['ahe-rider'])

assert.equal(resolveDomainAction(turn.next, beforeWeGetHome, '我想问阿禾为什么寻找姐姐'), undefined)
console.log(JSON.stringify({ ok: true, battery: turn.next.stats.battery, time: turn.next.stats.time, companion: 'ahe-rider' }))
