import assert from 'node:assert/strict'
import { beforeWeGetHome, beforeWeGetHomeEn } from '../src/story/cartridges/beforeWeGetHome'
import { selectDemoTurn } from '../src/story/adapters/mock'
import { parseStoryProtocol } from '../src/story/engine/protocol'
import { applyParsedScene, createInitialSave } from '../src/story/engine/reducer'
import type { StoryCartridge } from '../src/story/types'

const zh = [
  '重听语音，分辨背景里的路线声音', '请骑手带你走旧市场小路', '和阿禾先拉下市场总电闸', '沿老板指的干燥后巷赶去医院',
  '先帮护士把担架送进大厅', '答应把胰岛素冷藏箱送到山坡社区', '去屋顶天线听最新水位预报', '走积水隧道，争取最快抵达',
  '用随身工具测试最安全的落脚点', '跟随水塔下仍亮着的三盏灯', '去修社区发电机换取可靠路况', '冲进教室带孩子从后门撤离',
  '重听林岚提到河湾学校的完整录音', '沿消防阶梯直下体育馆北门', '去登记台找小宇的红书包记录', '检查南门水深和公交倾斜角度',
  '用体育馆牵引绳把人逐个拉回', '把纸图与眼前水流重新核对', '沿主街追赶学校转移队', '清理堵塞排水口降低街角水位',
  '合力移开堵门的书柜和桌子', '逐间教室喊家里的约定暗号', '安静坐一分钟，听家人的呼吸', '先检查小宇的伤和林岚的肩膀',
  '根据水位估算救援船靠近时间', '用手机和对讲机组成双重信标', '让伤员与孩子先走，自己留下组织第二趟', '和家人一起登上最后一趟船',
]

const en = [
  'Replay the message and identify background route sounds', 'Ask the rider to guide you through the Old Market', 'Pull the market main breaker with Ahe', 'Take the dry service alley to the hospital',
  'Help the nurse carry a stretcher inside', 'Carry the insulin cooler to Hillside Community', 'Use the rooftop antenna for the latest water forecast', 'Take the flooded tunnel for the fastest route',
  'Use your tools to test the safest footing', 'Follow the three lights still burning below the water tower', 'Repair the community generator for reliable road news', 'Enter the classroom and lead children out the rear door',
  'Replay the complete recording in which Lin Lan mentions the school', 'Take the fire stair directly to the stadium north gate', 'Search registration for Xiaoyu’s red backpack', 'Check water depth and the bus angle',
  'Use the stadium tow rope to pull people back one by one', 'Recheck the paper map against the visible current', 'Follow the school transfer group along the main street', 'Clear a blocked drain to lower the corner current',
  'Move the bookcases and desks blocking the gate', 'Call the family’s private phrase through each classroom', 'Sit quietly for one minute and hear the family breathe', 'Check Xiaoyu’s knee and Lin Lan’s shoulder first',
  'Estimate the boat approach time from the water level', 'Combine phone and radio into a double beacon', 'Send injured people and children first and stay for the second run', 'Board the final boat with your family',
]

function run(cartridge: StoryCartridge, actions: string[]) {
  let save = createInitialSave(cartridge)
  for (const action of actions) {
    const turn = selectDemoTurn(action, cartridge.demoTurns, save.scene)
    assert(turn, `No turn matched scene ${save.scene}: ${action}`)
    save = applyParsedScene(save, parseStoryProtocol(turn.content, cartridge.locale), cartridge, action, turn.imagePrompt, turn.imageSubject)
  }
  return save
}

for (const [cartridge, route] of [[beforeWeGetHome, zh], [beforeWeGetHomeEn, en]] as const) {
  const save = run(cartridge, route)
  assert.equal(save.scene, 28)
  assert.equal(save.facts['family-found'], true)
  assert.equal(save.facts['final-rescue-decided'], true)
  assert.equal(save.finale.status, 'ready')
  assert.equal(save.choices.length, 0)
  assert(save.partyMemberIds.includes('ahe-rider'))
  assert(save.inventory.some((item) => item.id === 'linlan-hairclip'))
}

console.log(JSON.stringify({ ok: true, turns: zh.length, chapters: 8, endings: beforeWeGetHome.endingDirector?.anchors.length }))
