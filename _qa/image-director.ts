import assert from 'node:assert/strict'
import { beforeWeGetHome } from '../src/story/cartridges/beforeWeGetHome'
import { parseStoryProtocol } from '../src/story/engine/protocol'
import { applyParsedScene, createInitialSave } from '../src/story/engine/reducer'
import { shouldUsePlayerImageReference } from '../src/story/engine/imageDirector'

const latestImage = (save: ReturnType<typeof createInitialSave>) => [...save.blocks].reverse().find((block) => block.kind === 'image')
const initial = createInitialSave(beforeWeGetHome)

const direct = applyParsedScene(
  initial,
  parseStoryProtocol('你把阿禾从倒下的摩托旁拉开。\n[choices: "检查伤势"|"移开摩托"|"寻找出口"]', 'zh'),
  beforeWeGetHome,
  '把阿禾拉离正在坠落的招牌',
  'the ordinary traveler pulls Ahe away from a falling blank metal sign beside a scooter in heavy rain',
  'others',
)
const directImage = latestImage(direct)
assert.equal(directImage?.data?.playerVisible, 'true')
assert.equal(shouldUsePlayerImageReference(String(directImage?.data?.prompt), beforeWeGetHome.playerImageAliases), true)
assert.match(String(directImage?.data?.prompt), /dominant visual actor/i)

const delegated = applyParsedScene(
  initial,
  parseStoryProtocol('阿禾蹲下检查摩托，你在雨棚下警戒。\n[choices: "等待阿禾"|"观察道路"|"询问居民"]', 'zh'),
  beforeWeGetHome,
  '让阿禾检查摩托',
  'Ahe inspects the fallen scooter while the ordinary traveler remains a distant supporting figure',
  'others',
)
assert.equal(latestImage(delegated)?.data?.playerVisible, 'false')

const environment = applyParsedScene(
  initial,
  parseStoryProtocol('空荡的高架桥在暴雨中摇晃。\n[choices: "绕行"|"等待"|"检查桥墩"]', 'zh'),
  beforeWeGetHome,
  '观察高架桥',
  'empty damaged overpass in heavy rain, environment-only wide shot, no people',
  'environment',
)
assert.equal(latestImage(environment)?.data?.playerVisible, 'false')

console.log(JSON.stringify({ ok: true, correctedDirectPlayer: true, delegatedNpc: true, environment: true }))
