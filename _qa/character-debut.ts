import assert from 'node:assert/strict'
import { beforeWeGetHome } from '../src/story/cartridges/beforeWeGetHome'
import { parseStoryProtocol } from '../src/story/engine/protocol'
import { applyParsedScene, createInitialSave, normalizeCharacterState } from '../src/story/engine/reducer'
import type { StoryCharacter } from '../src/story/types'

const initial = createInitialSave(beforeWeGetHome)
assert.deepEqual(initial.characters.map((character) => character.id), ['lin-lan-mother', 'xiaoyu-brother'])

const definition = beforeWeGetHome.characters.find((character) => character.id === 'ahe-rider')
assert(definition?.hiddenUntilIntroduced)
const legacy: StoryCharacter = { ...definition, status: 'known', origin: 'cartridge', updatedAtScene: 0 }
const repaired = normalizeCharacterState({ ...initial, characters: [...initial.characters, legacy] }, beforeWeGetHome)
assert.equal(repaired.characters.some((character) => character.id === 'ahe-rider'), false)

const introduced = applyParsedScene(initial, parseStoryProtocol(`穿旧橙色雨衣的骑手先扶正电动车，才说自己叫阿禾；她正在找夜班下班的姐姐，愿意带你走旧市场小路。
[character_update: character_id="ahe-rider" character="阿禾" role="外卖骑手" detail="穿旧橙色雨衣，正在找夜班姐姐" lore="熟悉旧市场小路"]
[party_change: character_id="ahe-rider" character="阿禾" change="add"]
[choices: "请阿禾带路"|"先核对语音线索"|"帮助广场居民撤离"]`, 'zh'), beforeWeGetHome, '帮助骑手')
assert.equal(introduced.characters.find((character) => character.id === 'ahe-rider')?.origin, 'cartridge')
assert.deepEqual(introduced.partyMemberIds, ['ahe-rider'])
assert.equal(introduced.characters.some((character) => character.id === 'zhoulan-nurse'), false)

console.log(JSON.stringify({ ok: true, openingRoster: initial.characters.map((character) => character.id), introduced: 'ahe-rider' }))
