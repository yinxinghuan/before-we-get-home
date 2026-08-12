import type {
  Locale, StoryCartridge, StoryDangerDirector, StoryEndingAnchor, StoryEndingCapability,
  StoryDomainRules, StoryEndingDirector, StoryImageDirector,
} from '../types'
import { buildBeforeWeGetHomeCampaign } from './beforeWeGetHomeCampaign'

const coverImage = new URL('../img/worlds/before-we-get-home.webp', import.meta.url).href
const entryImage = new URL('../img/worlds/before-we-get-home-entry.png', import.meta.url).href

function build(locale: Locale): StoryCartridge {
  const zh = locale === 'zh'
  const s = (cn: string, en: string) => zh ? cn : en

  const domainRules: StoryDomainRules = {
    rules: [
      {
        id: 'hear-last-message', intent: 'hear-last-message',
        match: zh ? ['播放母亲留下的最后一条语音'] : ["play mother's last message"],
        requirements: [{ type: 'fact', id: 'opening-message-heard', notEquals: true, reason: s('这段语音已经播放过，不能重复结算第一次听见它的代价。', 'The message has already played; its first-hearing cost cannot resolve twice.') }],
        effects: [{ type: 'stat', id: 'battery', delta: -4 }, { type: 'fact', id: 'opening-message-heard', value: true }, { type: 'fact', id: 'voice-old-market-clue', value: true }, { type: 'fact', id: 'battery-stat-revealed', value: true }],
        successText: s('你亲手播放那十八秒语音。母亲让你别走河边；雨声后还有三次高架伸缩缝的低响和一句“旧市场”。手机电量从 47 降到 43。近处，一个穿橙色雨衣的骑手正独自抬倒下的车。', 'You play the eighteen-second message yourself. Mother warns you away from the river; beneath the rain are three overpass-joint thumps and “Old Market.” Battery falls from 47 to 43. Nearby, a rider in an orange rain jacket struggles with a fallen scooter.'),
        successChoices: zh ? ['请橙色雨衣骑手带你走旧市场小路', '记住线索，独自沿高架离开', '把线索告诉车站救援人员核对'] : ['Ask the orange-jacket rider to guide you through Old Market', 'Keep the clue and leave alone by the elevated road', 'Share the clue with station rescuers for verification'],
      },
      {
        id: 'replay-last-message', intent: 'replay-last-message',
        match: zh ? ['重听语音', '分辨背景里的路线声音', '再听一次语音'] : ['replay the message', 'identify background route sounds', 'listen to the message again'],
        requirements: [{ type: 'fact', id: 'voice-old-market-clue', notEquals: true, reason: s('你已经确认了旧市场线索，重复播放不会产生第二条线索。', 'You already confirmed the Old Market clue; replaying cannot create a second clue.') }],
        effects: [{ type: 'stat', id: 'battery', delta: -4 }, { type: 'fact', id: 'voice-old-market-clue', value: true }, { type: 'fact', id: 'battery-stat-revealed', value: true }],
        successText: s('你从十八秒语音里分辨出高架伸缩缝与“旧市场”：家人没有走河边。手机电量减少 4。', 'You isolate elevated-road joints and “Old Market” in the message: the family avoided the river. Battery falls by 4.'),
        successChoices: zh ? ['请橙色雨衣骑手带你走旧市场小路', '记住线索，独自沿高架离开', '把线索告诉车站救援人员核对'] : ['Ask the orange-jacket rider to guide you through Old Market', 'Keep the clue and leave alone by the elevated road', 'Share the clue with station rescuers for verification'],
        rejectionChoices: zh ? ['请橙色雨衣骑手带路', '立即沿高架离开车站', '先帮助广场居民撤离'] : ['Ask the orange-jacket rider for directions', 'Leave immediately by the elevated road', 'Help residents evacuate the plaza'],
      },
      {
        id: 'help-ahe-and-exit', intent: 'help-ahe-and-exit',
        match: zh ? ['帮广场上的骑手抬开倒下的车', '请橙色雨衣骑手带你走旧市场小路', '请骑手带你走旧市场小路'] : ['help a rider move a fallen scooter', 'ask the orange-jacket rider to guide you through Old Market', 'ask the rider to guide you through the Old Market'],
        requirements: [{ type: 'fact', id: 'station-exited', notEquals: true, reason: s('你们已经离开车站，不能再次结算同一次相遇。', 'You have already left the station; the same meeting cannot resolve twice.') }],
        effects: [{ type: 'party', change: 'add', characterId: 'ahe-rider' }, { type: 'map', nodeId: 'old-market' }, { type: 'stat', id: 'time', delta: -7 }, { type: 'stat', id: 'stamina', delta: -3 }, { type: 'fact', id: 'station-exited', value: true }, { type: 'fact', id: 'time-stat-revealed', value: true }, { type: 'fact', id: 'stamina-stat-revealed', value: true }, { type: 'objective', value: s('穿过旧市场火点，继续追踪家人', 'Cross the Old Market fire and continue tracking the family') }, { type: 'clock', value: s('凌晨 02:05', '02:05 AM') }],
        successText: s('橙色雨衣骑手先扶正电动车，才说自己叫阿禾；她也在找夜班姐姐，并与你同行到旧市场。天亮前减少 7。', 'The orange-jacket rider rights the scooter before naming herself Ahe. She is searching for her night-shift sister and joins you to Old Market. Before-dawn time falls by 7.'),
        successChoices: zh ? ['和阿禾先拉下市场总电闸', '从屋顶雨棚绕过火点继续赶路', '呼喊店内的人并组织居民撤离'] : ['Pull the market main breaker with Ahe', 'Use the awning roofs to bypass the fire', 'Call to the trapped people and organize evacuation'],
        rejectionChoices: zh ? ['查看旧市场当前火势', '沿已确认路线继续前进', '检查阿禾是否仍在同行'] : ['Check the current Old Market fire', 'Continue along the confirmed route', 'Check whether Ahe is still with you'],
      },
      {
        id: 'exit-alone', intent: 'exit-alone', match: zh ? ['记住线索，独自沿高架离开', '立即沿高架方向离开车站'] : ['keep the clue and leave alone by the elevated road', 'leave now toward the elevated road'],
        requirements: [{ type: 'fact', id: 'station-exited', notEquals: true, reason: s('你已经离开车站，不能重复领取同一段赶路时间。', 'You already left the station; the same travel segment cannot resolve twice.') }],
        effects: [{ type: 'map', nodeId: 'old-market' }, { type: 'stat', id: 'time', delta: -4 }, { type: 'stat', id: 'stamina', delta: -5 }, { type: 'fact', id: 'station-exited', value: true }, { type: 'fact', id: 'direct-route-kept', value: true }, { type: 'fact', id: 'time-stat-revealed', value: true }, { type: 'fact', id: 'stamina-stat-revealed', value: true }, { type: 'objective', value: s('独自穿过旧市场，继续追踪家人', 'Cross Old Market alone and continue tracking the family') }, { type: 'clock', value: s('凌晨 01:58', '01:58 AM') }],
        successText: s('你没有等待同行者，沿高架快步抵达旧市场。你保住了三分钟，却在碎石和积水里消耗了体力；这条直接路线以后会被记住。', 'You do not wait for a companion and reach Old Market by the elevated road. You save three minutes but spend stamina crossing rubble and water; the direct route is now remembered.'),
        successChoices: zh ? ['先拉下市场总电闸', '从屋顶雨棚绕过火点', '呼喊店内的人并组织撤离'] : ['Pull the market main breaker', 'Use awning roofs to bypass the fire', 'Call to the trapped people and organize evacuation'],
        rejectionChoices: zh ? ['查看旧市场当前火势', '沿已确认路线继续前进', '检查车站线索是否已保存'] : ['Check the current Old Market fire', 'Continue along the confirmed route', 'Check whether the station clue was saved'],
      },
      {
        id: 'share-message', intent: 'share-message', match: zh ? ['把线索告诉车站救援人员核对', '把语音分享给车站救援人员核对'] : ['share the clue with station rescuers for verification', 'share the message with station rescuers for verification'],
        requirements: [{ type: 'fact', id: 'voice-shared-with-rescue', notEquals: true, reason: s('救援人员已经收到这段语音，重复分享不会产生第二份验证。', 'Rescuers already received the message; sharing it again creates no second verification.') }],
        effects: [{ type: 'stat', id: 'battery', delta: -3 }, { type: 'stat', id: 'time', delta: -5 }, { type: 'fact', id: 'voice-shared-with-rescue', value: true }, { type: 'fact', id: 'battery-stat-revealed', value: true }, { type: 'fact', id: 'time-stat-revealed', value: true }],
        successText: s('你把母亲的私人语音交给车站救援员核对。他们确认“旧市场”广播来自东向高架，也把这条线索加入整片街区的搜救记录；手机再少 3 格电，天亮前少 5。', 'You let station rescuers verify Mother’s private message. They confirm the Old Market broadcast came from the eastbound overpass and add the clue to the district search record; Battery falls by 3 and Before Dawn by 5.'),
        successChoices: zh ? ['请橙色雨衣骑手带路', '立即沿高架离开车站', '先帮助广场居民撤离'] : ['Ask the orange-jacket rider for directions', 'Leave immediately by the elevated road', 'Help residents evacuate the plaza'],
        rejectionChoices: zh ? ['请橙色雨衣骑手带路', '立即沿高架离开车站', '查看救援人员的路线标记'] : ['Ask the orange-jacket rider for directions', 'Leave immediately by the elevated road', 'Check the rescuers route mark'],
      },
    ],
  }

  const capabilities: StoryEndingCapability[] = [
    {
      id: 'reach-family-before-crest', label: s('在洪峰前抵达', 'Arrive Before the Crest'),
      meaning: s('在洪峰进入河湾前亲自抵达家人所在屋顶。', 'Reach the family roof before the flood crest enters the river bend.'),
      requires: [{ type: 'fact', id: 'river-school-reached', equals: true }, { type: 'stat', id: 'time', min: 1 }],
      mandatoryCosts: ['the_city_route_cannot_be_retraced_tonight'],
    },
    {
      id: 'phone-beacon', label: s('让手机成为信标', 'Turn the Phone into a Beacon'),
      meaning: s('保留足够电量完成最后定位或照明。', 'Keep enough battery for the final location signal or light.'),
      requires: [{ type: 'stat', id: 'battery', min: 8 }, { type: 'item', id: 'phone' }],
      mandatoryCosts: ['the_last_private_message_becomes_public_rescue_evidence'],
    },
    {
      id: 'ahe-two-family-route', label: s('两家人的路线', 'A Route for Two Families'),
      meaning: s('与阿禾同行，并让两个人寻找家人的路线最终相连。', 'Stay with Ahe until both searches become one route.'),
      requires: [{ type: 'character', id: 'ahe-rider', status: 'companion' }, { type: 'fact', id: 'ahe-sister-status-known', equals: true }],
      mandatoryCosts: ['neither_search_gets_the_fastest_route'],
    },
    {
      id: 'city-answers-back', label: s('让城市回答你', 'Make the City Answer Back'),
      meaning: s('沿途帮助的人在终局提供物资、路线或人手。', 'People helped along the way return with supplies, routes, or hands at the finale.'),
      requires: [{ type: 'fact', id: 'market-evacuated', equals: true }, { type: 'fact', id: 'hospital-helped', equals: true }],
      mandatoryCosts: ['help_costs_irrecoverable_time'],
    },
    {
      id: 'carry-insulin', label: s('把药送到屋顶', 'Carry the Medicine to the Roof'),
      meaning: s('把医院冷藏箱送给被困孩子，稳定屋顶等待时间。', 'Deliver the hospital cooler to the stranded child and buy time on the roof.'),
      requires: [{ type: 'item', id: 'insulin-cooler' }, { type: 'fact', id: 'river-school-reached', equals: true }],
      mandatoryCosts: ['the_cooler_is_spent_and_cannot_help_another_ward'],
    },
    {
      id: 'follow-family-only', label: s('只追家人的路线', 'Follow Only the Family Route'),
      meaning: s('拒绝主要支线，把所有剩余时间压到家人路线。', 'Refuse the largest detours and put remaining time into the family route.'),
      requires: [{ type: 'fact', id: 'direct-route-kept', equals: true }],
      mandatoryCosts: ['some_people_met_on_the_road_receive_no_help'],
    },
    {
      id: 'share-last-message', label: s('公开最后一条语音', 'Share the Last Voice Message'),
      meaning: s('把私人语音中的环境声交给救援者，帮助定位整片街区。', 'Give rescuers the private message audio so its background sounds can locate a whole block.'),
      requires: [{ type: 'fact', id: 'voice-shared-with-rescue', equals: true }, { type: 'item', id: 'last-voice-message' }],
      mandatoryCosts: ['a_private_family_moment_can_never_be_private_again'],
    },
    {
      id: 'stay-on-roof', label: s('留在屋顶守到天亮', 'Stay on the Roof Until Dawn'),
      meaning: s('放弃立即离开，留下协调最后一批屋顶撤离。', 'Give up immediate departure and coordinate the final roof evacuation.'),
      requires: [{ type: 'fact', id: 'final-choice-stay', equals: true }],
      mandatoryCosts: ['homecoming_is_delayed_beyond_dawn'],
    },
  ]

  const anchor = (
    id: string, titleCn: string, titleEn: string, thesisCn: string, thesisEn: string,
    capabilityIds: string[], irreversibleCosts: string[], preserved: string[], lost: string[], unresolved: string[],
    finaleCn: string[], finaleEn: string[], finalImagePrompt: string,
  ): StoryEndingAnchor => ({
    id, title: s(titleCn, titleEn), thesis: s(thesisCn, thesisEn), capabilityIds, irreversibleCosts,
    preserved, lost, unresolved, finaleScenes: zh ? finaleCn : finaleEn, finalImagePrompt,
  })

  const anchors: StoryEndingAnchor[] = [
    anchor('home-together', '一起回家', 'Home Together', '你没有把这座城市救完，但你让家人和同行者一起走出洪水。', 'You do not save the whole city, but your family and companions leave the flood together.',
      ['reach-family-before-crest', 'ahe-two-family-route'], ['the_city_route_cannot_be_retraced_tonight', 'neither_search_gets_the_fastest_route'],
      ['the family reunion', 'Ahe and her sister', 'one shared route home'], ['the apartment as it was before the quake'], ['where everyone will live next'],
      ['你在屋顶水箱旁抱住母亲和小宇。', '阿禾的姐姐跟着第二艘橡皮艇抵达。', '两家人沿同一条高处路线离开河湾。', '天亮时，你们没有回到原来的房子，却第一次能一起说接下来去哪。'],
      ['You find your mother and Xiaoyu beside the roof tank.', 'Ahe’s sister arrives with the second rescue boat.', 'Both families leave the river bend by one high route.', 'At dawn you cannot return to the old apartment, but you can decide where to go together.'],
      'grounded contemporary disaster dawn on a school roof, reunited family and young bicycle courier beside rescue boat, flooded city below, warm restrained light, no text, no UI'),
    anchor('late-reunion', '迟到的团聚', 'The Late Reunion', '你错过了原定地点，却因一路留下的帮助被家人反向找到。', 'You miss the planned place, and the help you left behind lets your family find you instead.',
      ['city-answers-back'], ['help_costs_irrecoverable_time'], ['people helped along the route', 'a verified family trail'], ['the chance to arrive first'], ['how much lateness a promise can bear'],
      ['你抵达空屋顶时，洪峰已经过去。', '医院志愿者认出你的名字，把你送往山坡临时点。', '母亲从人群另一端跑来，她不是在等待被救，而是一直在找你。', '你们在早晨八点才真正团聚。'],
      ['The roof is empty when you arrive after the crest.', 'A hospital volunteer recognizes your name and sends you uphill.', 'Your mother runs from the other side of the shelter; she was looking for you too.', 'The reunion comes at eight in the morning, not before dawn.'],
      'ordinary family finding each other inside a crowded hillside shelter after sunrise, wet clothes, exhausted relief, documentary realism, no text, no UI'),
    anchor('roof-watch', '屋顶守夜', 'Watch on the Roof', '你找到家人后没有立刻离开，而是和他们一起把最后一批人送走。', 'After finding your family, you stay and help the last people leave.',
      ['stay-on-roof', 'city-answers-back'], ['homecoming_is_delayed_beyond_dawn', 'help_costs_irrecoverable_time'],
      ['the roof survivors', 'the family together', 'a functioning rescue chain'], ['the first safe vehicle out'], ['whether another aftershock will come'],
      ['母亲只问了一次你是否确定。', '小宇把最后一件救生衣给了更小的孩子。', '你们用沿途认识的名字把屋顶逐层清空。', '太阳升起时，一家人仍在原地，却不再只是等待。'],
      ['Your mother asks only once whether you are sure.', 'Xiaoyu gives the last life jacket to a smaller child.', 'You clear the roof using every name learned along the road.', 'At sunrise the family is still there, but no longer merely waiting.'],
      'family coordinating a final rooftop evacuation at rainy dawn, ordinary rescue gestures, orange safety light against blue floodwater, no text, no UI'),
    anchor('road-left-behind', '把路留给别人', 'Leave the Route to Others', '你把唯一安全车位让给伤员，家人陪你步行走向更远的安置点。', 'You give the only safe vehicle place to the injured and walk farther with your family.',
      ['reach-family-before-crest', 'city-answers-back'], ['the_city_route_cannot_be_retraced_tonight', 'help_costs_irrecoverable_time'],
      ['an injured stranger', 'family solidarity', 'the high road'], ['the fast ride home'], ['whether the old neighborhood can reopen'],
      ['救援车只剩一个位置。', '小宇先把伤员的担架推上车。', '母亲握住你的手，一家人沿高架步行。', '你们走得很慢，但再没有人需要独自等。'],
      ['One place remains in the rescue vehicle.', 'Xiaoyu pushes the injured stretcher aboard first.', 'Your mother takes your hand and the family walks the elevated road.', 'You move slowly, but no one has to wait alone again.'],
      'ordinary family walking together along an elevated city road after the storm while rescue vehicle carries an injured person, warm dawn, no text, no UI'),
    anchor('no-signal-dawn', '没有信号的黎明', 'A Dawn Without Signal', '手机熄灭以后，你靠人和实物完成了最后一段路。', 'After the phone dies, people and physical clues carry you through the final route.',
      ['city-answers-back'], ['the_last_private_message_becomes_public_rescue_evidence'],
      ['human directions', 'the last voice message in memory', 'a family location'], ['digital proof of the reunion'], ['whether the phone can ever be recovered'],
      ['手机在最后一次定位后变黑。', '阿禾记住每一个转弯，周岚在纸图上画出高处路线。', '你没有拍下团聚照片。', '很多年后，一家人对那一刻有三个不同版本。'],
      ['The phone goes dark after one final location check.', 'Ahe remembers every turn and Zhoulan marks the high route on paper.', 'There is no photograph of the reunion.', 'Years later, the family remembers that moment three different ways.'],
      'unlit phone in a traveler hand as family silhouettes appear through rain on a school roof at dawn, grounded contemporary realism, no visible writing, no UI'),
    anchor('two-family-convoy', '两家人的队伍', 'A Convoy for Two Families', '你和阿禾没有把寻找家人变成竞赛，而是把两条线索合成一支队伍。', 'You and Ahe refuse to make family searches compete and combine both trails into one convoy.',
      ['ahe-two-family-route', 'phone-beacon'], ['neither_search_gets_the_fastest_route', 'the_last_private_message_becomes_public_rescue_evidence'],
      ['both sibling pairs', 'a working phone beacon', 'shared transport'], ['privacy', 'the fastest direct route'], ['which neighborhood the convoy serves next'],
      ['两部手机只剩下一部有电。', '阿禾的姐姐带来一辆还能发动的小巴。', '小宇在车门边数清每一个上车的人。', '第一趟车没有开向任何人的旧家，而是开向最近的安全高地。'],
      ['Only one of two phones still has power.', 'Ahe’s sister arrives with a minibus that can still run.', 'Xiaoyu counts every person aboard.', 'The first trip goes not to anyone’s old home, but to the nearest safe high ground.'],
      'small city minibus convoy at dawn carrying two reunited families and neighbors through rain, practical documentary disaster drama, no text, no UI'),
    anchor('light-in-empty-room', '空房间的灯', 'A Light in the Empty Room', '你确认家人安全，却回到受损的家为仍在寻找的人留下一盏灯。', 'You confirm your family is safe, then return to the damaged home and leave a light for others still searching.',
      ['follow-family-only', 'phone-beacon'], ['some_people_met_on_the_road_receive_no_help', 'the_last_private_message_becomes_public_rescue_evidence'],
      ['family safety', 'one recognizable home marker'], ['a simple reunion night'], ['who will return to the neighborhood'],
      ['救援电话确认母亲和小宇已经转移。', '你没有追上他们，却第一次知道他们具体在哪里。', '你把充电灯放在裂开的窗边。', '天亮后，那盏灯先替三个陌生人指回了自己的楼。'],
      ['A rescue call confirms your mother and Xiaoyu have moved safely.', 'You do not catch them, but finally know exactly where they are.', 'You leave a charged lamp in the cracked window.', 'After dawn it guides three strangers back toward their own buildings first.'],
      'single warm emergency lamp in a cracked apartment window above a rain-dark empty street at dawn, grounded realism, no text, no UI'),
    anchor('keep-searching', '继续寻找', 'Keep Searching', '这一夜没有给你完整答案，但留下了下一段寻找所需要的人和方向。', 'The night gives no complete answer, but leaves the people and direction needed to continue.',
      ['share-last-message'], ['a_private_family_moment_can_never_be_private_again'],
      ['a verified next location', 'the rescue network', 'the family message'], ['privacy', 'the promise of reunion before dawn'], ['what happened after the second transfer'],
      ['广播站分析出语音里的高架警报声。', '你抵达学校时，只找到母亲留下的红围巾。', '围巾是确认，不是遗物：她们在洪峰前继续向北。', '你在天亮后的第一辆救援车上重新开始寻找。'],
      ['The radio team identifies the overpass alarm inside the message.', 'At the school you find only your mother’s red scarf.', 'It is confirmation, not a memorial: they moved north before the crest.', 'You begin searching again on the first rescue vehicle after dawn.'],
      'exhausted traveler boarding the first rescue truck after dawn holding a red scarf, flooded modern city receding behind, hopeful unresolved realism, no text, no UI'),
  ]

  const endingDirector: StoryEndingDirector = {
    startRequirements: [{ type: 'fact', id: 'river-school-reached', equals: true }, { type: 'fact', id: 'family-location-confirmed', equals: 'riverbend-school' }, { type: 'scene', min: 18 }],
    capabilities, anchors,
    requiredCharacterIds: ['lin-lan-mother', 'xiaoyu-brother', 'ahe-rider', 'zhoulan-nurse'],
    minRegionalEpilogues: 3,
    maxRepairAttempts: 2,
  }

  const dangerDirector: StoryDangerDirector = {
    minSafeTurns: 2, maxSafeTurns: 4, cooldownTurns: 2,
    escalationStats: ['stamina', 'time', 'battery'],
    threatPalette: zh ? [
      '余震正在让当前建筑或道路失去稳定', '快速上涨的积水把人困在两条路线之间',
      '电气火灾封住出口，烟雾正在加重', '拥挤人群因唯一车辆或医疗物资发生冲突',
      '黑暗下穿通道里有碎玻璃、失控动物和突来的水流', '受损高架的栏杆在负重下继续开裂',
    ] : [
      'an aftershock destabilizes the current building or road', 'fast-rising water traps people between two routes',
      'an electrical fire seals an exit as smoke thickens', 'a crowd contests the only vehicle or medical supply',
      'a dark underpass hides broken glass, loose animals and a sudden current', 'a damaged overpass rail continues cracking under load',
    ],
    methods: zh ? ['用身体保护并直接突破', '观察环境，寻找安全路线', '与同伴协作或消耗工具'] : ['protect people and push through physically', 'read the environment and find a safer route', 'coordinate with a companion or spend a tool'],
    physicalCombat: 'rare',
    resolution: { skill: s('灾后应变', 'Disaster Response'), modifier: 2, dcBySeverity: [7, 10, 13, 16, 19], fallbackCosts: [{ statId: 'stamina', operation: 'remove', amount: 14 }] },
  }

  return {
    schemaVersion: 1, id: 'before-we-get-home', locale, coverImage, entryImage,
    copy: {
      title: s('回家之前', 'BEFORE WE GET HOME'),
      subtitle: s('天亮前，穿过这座城市找到家人', 'Cross the city and find your family before dawn'),
      promise: s('这不是末日。只是一个普通人，在最坏的一夜里努力回家。', 'This is not the end of the world. It is one ordinary person trying to get home on the worst night.'),
      enter: s('听完最后一条语音', 'Play the last voice message'),
      continue: s('继续回家的路', 'Continue the way home'),
      customAction: s('也可以写下你真正想做的事', 'Or write what you truly want to do'),
      itemImagingTitle: s('应急包正在清点', 'The emergency bag is being checked'),
      itemImagingBody: s('车站的应急灯扫过背包。水、钥匙、绷带和工具会按这场雨夜的真实材质逐件显影，其余内容在旅途中后台完成。', 'Station emergency light crosses the bag. Water, keys, bandages and tools develop in the same wet-night material while the remaining plates finish quietly in the background.'),
    },
    theme: { outer: '#0d151b', surface: '#152129', paper: '#eef1ef', ink: '#101820', muted: '#667179', accent: '#f3b61f', danger: '#d84a3a', gold: '#39a9c8', material: 'apartment' },
    audioTheme: {
      material: 'apartment', bpm: 62, rootHz: 110, scale: [0, 2, 5, 7, 9],
      levels: { music: .13, ambient: .16, sfx: .4, master: .46 },
      tension: [{ statId: 'stamina', direction: 'low', weight: .35 }, { statId: 'time', direction: 'low', weight: .4 }, { statId: 'battery', direction: 'low', weight: .25 }],
    },
    itemImageDirection: 'grounded contemporary emergency object study on dark wet fabric and neutral concrete, practical wear, sodium-orange and cool rain reflections, object only, no people, no writing or readable text',
    sceneImageDirection: 'cinematic contemporary disaster journey at night, rain-dark asphalt, wet concrete, sodium-orange emergency light, practical modern clothing, grounded natural anatomy, humane documentary realism, one decisive current event, 4:5 portrait master',
    sceneImageAvoid: 'the central station opening composition, generic lone traveler looking at a phone, movie poster staging, military apocalypse, ruined skyline spectacle, readable signs, text, logo, border or UI',
    transitionAnchor: s('手机离线地图与母亲最后一条语音', 'the offline phone map and the mother’s last voice message'),
    playerImageAliases: ['ordinary traveler', 'the traveler', 'returning traveler', 'player protagonist', '旅人', '赶路人', '玩家'],
    playerImageRole: 'the unnamed player-controlled returning traveler; the supplied reference is authoritative for the traveler’s entire visible form, covering, costume and face visibility, while a small emergency backpack and blank phone are optional story props; this subject is never Ahe, Lin Lan, Xiaoyu or a responder',
    playerImageExclusions: [
      'Ahe is a nineteen-year-old delivery rider in an orange waterproof jacket with her own different face',
      'Lin Lan is the player family mother in her fifties with her own different face',
      'Xiaoyu is the sixteen-year-old younger brother with his own different face',
      'Zhoulan is a tired hospital nurse with her own different face',
      'rescue workers, evacuees, children and animals can never inherit any reference-derived face, covering, costume, silhouette, colors or body traits',
    ],
    imageDirector: { maxQuietTurns: 1, softCooldownTurns: 0, guaranteedTriggers: ['new-location', 'rare-item', 'party-change', 'chapter-checkpoint', 'relationship-change', 'objective-change', 'skill-outcome'], softTriggers: [] } satisfies StoryImageDirector,
    mediaDirector: { imageProfile: 'fast-small', imageTarget: { width: 512, height: 640 }, videoEnabled: true, videoDuration: 5, minVideoGapTurns: 8 },
    director: {
      mode: 'guided', maxActiveThreads: 3,
      mainQuest: s('在洪峰抵达河湾前穿过受损城市，依据母亲最后一条语音找到母亲林岚与弟弟小宇，并让一路做出的承诺在最终营救中产生真实后果。', 'Cross the damaged city before the flood crest, use the mother’s last voice message to find Lin Lan and Xiaoyu, and let every promise made along the road matter in the final rescue.'),
      chapters: [
        { id: 'central-station', title: s('第一章：停电的中央车站', 'Chapter I: Central Station in the Dark'), unlock: s('开局立即进行', 'Available immediately'), emotionalPurpose: s('用一句家人语音和一个具体目的地建立直观目标。', 'Establish an immediate objective through one family message and one destination.'), beats: s('听语音；确认体育馆；认识阿禾；离开车站；第一次付出时间或电量', 'Hear the message; confirm the stadium; meet Ahe; leave the station; pay the first time or battery cost').split(zh ? '；' : ';'), completionFacts: ['station-exited'] },
        { id: 'old-market', title: s('第二章：旧市场的火', 'Chapter II: Fire in the Old Market'), unlock: s('离开中央车站后', 'After leaving Central Station'), emotionalPurpose: s('让回家速度第一次与具体陌生人的安全发生冲突。', 'Put speed toward home into conflict with the safety of specific strangers.'), beats: s('发现电气火灾；三种路线应对；疏散或绕行；取得家人目击线索；决定是否保留阿禾同行', 'Find the electrical fire; choose among three methods; evacuate or bypass; obtain a family sighting; decide whether Ahe remains').split(zh ? '；' : ';'), completionFacts: ['market-route-open'] },
        { id: 'renhe-hospital', title: s('第三章：仁和医院', 'Chapter III: Renhe Hospital'), unlock: s('取得家人经过旧市场的线索', 'After confirming the family passed the market'), emotionalPurpose: s('在疲惫与助人之间建立可回响的互助关系。', 'Build reciprocal help between fatigue and responsibility.'), beats: s('查询伤员；认识周岚；运送或拒绝药物；确认体育馆二次转移可能；取得纸图或冷藏箱', 'Check casualties; meet Zhoulan; carry or refuse medicine; learn a second transfer is possible; obtain a paper map or cooler').split(zh ? '；' : ';'), completionFacts: ['hospital-clue-confirmed'] },
        { id: 'flood-routes', title: s('第四章：积水隧道与断桥', 'Chapter IV: Flooded Tunnel and Broken Bridge'), unlock: s('离开仁和医院', 'After leaving Renhe Hospital'), emotionalPurpose: s('把数值、物品和伙伴转成三条真正不同的路线。', 'Turn stats, items and companions into three materially different routes.'), beats: s('比较隧道、高架、山路；经历危险；使用或保留关键工具；确认弟弟离开体育馆', 'Compare tunnel, overpass and hill road; face danger; spend or preserve a tool; learn Xiaoyu left the stadium').split(zh ? '；' : ';'), completionFacts: ['flood-route-crossed'] },
        { id: 'hillside', title: s('第五章：山坡社区', 'Chapter V: Hillside Community'), unlock: s('穿过洪水路线后', 'After crossing the flood routes'), emotionalPurpose: s('揭示家人不是被动等待，而是在做与玩家相似的选择。', 'Reveal that the family is not waiting passively but making choices like the player.'), beats: s('找到弟弟同学；理解偏离原因；确认母亲跟随；处理阿禾姐姐线索；打开体育馆路线', 'Find Xiaoyu’s classmate; understand the detour; confirm the mother followed; resolve Ahe’s sister clue; open the stadium route').split(zh ? '；' : ';'), completionFacts: ['family-left-stadium-known'] },
        { id: 'empty-stadium', title: s('第六章：空体育馆', 'Chapter VI: The Empty Stadium'), unlock: s('确认家人已离开山坡社区', 'After confirming the family left the hillside'), emotionalPurpose: s('制造最低点：抵达目标却没有家人，同时给出可信的新方向。', 'Create the low point: reach the destination without the family, but gain a credible new direction.'), beats: s('体育馆二次转移；找到红围巾；重听语音；决定休息或继续；确认河湾学校', 'Find the stadium transferred; recover the red scarf; replay the message; rest or continue; confirm Riverbend School').split(zh ? '；' : ';'), completionFacts: ['family-location-confirmed'] },
        { id: 'river-school', title: s('第七章：河湾学校屋顶', 'Chapter VII: Riverbend School Roof'), unlock: s('确认家人在河湾学校', 'After confirming the family is at Riverbend School'), emotionalPurpose: s('让沿途人物、物品、路线和承诺在最终营救中回归。', 'Bring back people, objects, routes and promises in the final rescue.'), beats: s('抵达学校；找到家人；洪峰抵达；处理最后一批被困者；作出离开、留下或继续寻找的不可逆决定', 'Reach the school; find the family; face the crest; help the last trapped people; choose irreversibly to leave, stay or keep searching').split(zh ? '；' : ';'), completionFacts: ['river-school-reached', 'final-rescue-decided'] },
        { id: 'after-dawn', title: s('尾声：天亮以后', 'Epilogue: After Dawn'), unlock: s('完成最终营救决定', 'After the final rescue decision'), emotionalPurpose: s('用具体团聚、错过、去向和代价回答“家是什么”。', 'Answer what home means through concrete reunion, absence, destinations and cost.'), beats: s('冻结终局状态；生成相容尾声；交代四名固定人物和三个地区；保留一个未来问题', 'Freeze the final state; generate a compatible epilogue; resolve four fixed characters and three regions; leave one future question').split(zh ? '；' : ';'), completionFacts: ['true-ending-generated'] },
      ],
      finaleRule: s('只有玩家在河湾学校屋顶明确开始最后营救决定后才能触发真结局；普通休息、转移与章节节点都继续游戏。', 'A true ending starts only after the player explicitly begins the final rescue decision on the Riverbend School roof; rest, transfer and chapter checkpoints remain resumable.'),
      fixedWorldRules: zh ? [
        '这是现实可理解的现代灾后城市。地震、洪水、道路、时间、伤势、物品所有权和承诺必须保持连续。',
        '手机信号不稳定，电量有限；通话、地图、语音增强、手电与求救都有明确电量代价。',
        '林岚、小宇、阿禾和周岚持续存在；新人物不能替换或静默删除他们。',
        '人物只知道亲眼所见、被告知或从可靠物证确认的事情。',
        '失败改变时间、伤势、电量、物品、路线或关系，不删除存档。',
      ] : [
        'This is a grounded modern disaster city. Earthquake, flood, roads, time, injuries, ownership and promises remain continuous.',
        'Phone service is intermittent and battery is finite; calls, maps, audio enhancement, flashlight and rescue signals have explicit costs.',
        'Lin Lan, Xiaoyu, Ahe and Zhoulan persist; new characters cannot replace or silently erase them.',
        'People know only what they witnessed, were told, or verified through reliable physical evidence.',
        'Failure changes time, injuries, battery, items, routes or relationships and never deletes the save.',
      ],
      generationRules: zh ? [
        '每轮推进寻找家人的主线，或改变一个地点、时间、电量、伤势、物品、关系、路线、线索或已确认家人状态。',
        'AI 可以创建普通居民、志愿者、建筑内部、天气变化、小型救援问题与日常物资，但不能加入超自然规则或末日军团。',
        '正文与三个按钮必须描述同一个眼前局面；不能把正文里的具体方案压成通用继续按钮。',
        '获得、交出、消耗、遗失与损坏必须同步背包；看见物品不等于拥有。',
      ] : [
        'Every turn advances the family search or changes a location, time, battery, injury, item, relationship, route, clue or confirmed family status.',
        'AI may create residents, volunteers, interiors, weather changes, small rescue problems and ordinary supplies, but no supernatural rule or apocalypse army.',
        'Visible prose and three buttons must describe the same immediate situation; never compress concrete options into a generic continue button.',
        'Obtaining, giving, spending, losing or breaking an item must update inventory; seeing an object is not ownership.',
      ],
      choiceIntents: zh ? ['更快向家人前进', '帮助或协调眼前的人', '调查安全路线或节省资源'] : ['move faster toward family', 'help or coordinate with people here', 'investigate a safer route or conserve resources'],
    },
    dangerDirector,
    domainRules,
    endingDirector,
    initialFacts: { 'family-last-known-stadium': true, 'player-has-last-message': true, 'direct-route-kept': false, 'opening-message-heard': false, 'voice-old-market-clue': false, 'voice-shared-with-rescue': false, 'station-exited': false, 'battery-stat-revealed': false, 'time-stat-revealed': false, 'stamina-stat-revealed': false },
    statDefinitions: [
      { id: 'stamina', label: s('体力', 'Stamina'), min: 0, max: 100, initial: 82, inverse: true, display: 'bar', warningAt: 30, dangerAt: 0, maxDelta: 22, revealedByFact: 'stamina-stat-revealed' },
      { id: 'time', label: s('天亮前', 'Before dawn'), min: 0, max: 100, initial: 84, inverse: true, display: 'bar', warningAt: 28, dangerAt: 0, maxDelta: 18, revealedByFact: 'time-stat-revealed' },
      { id: 'battery', label: s('手机电量', 'Phone battery'), min: 0, max: 100, initial: 47, inverse: true, display: 'bar', warningAt: 20, dangerAt: 0, maxDelta: 20, revealedByFact: 'battery-stat-revealed' },
    ],
    drawerLabels: { party: s('同行者', 'Companions'), map: s('城市路线', 'City route'), inventory: s('应急包', 'Emergency bag'), log: s('线索', 'Clues') },
    opening: {
      location: s('中央车站 · 南广场', 'Central Station · South Plaza'), time: s('凌晨 01:40', '01:40 AM'), objective: s('离开停电车站，去河滨体育馆寻找母亲和小宇', 'Leave the disabled station and reach Riverside Stadium to find your mother and Xiaoyu'),
      imagePrompt: 'outside a disabled central railway station at night just after an earthquake, SUBJECT A shown with the complete visual identity from the supplied player reference, with a dim blank phone and a small practical backpack resting beside SUBJECT A instead of being held, rain, wet asphalt, residents helping each other, damaged road toward distant emergency glow, before the player chooses a route, grounded contemporary documentary realism, 4:5 portrait, all signs and screens blank, no writing, no text, no UI',
      entryImagePrompt: 'SUBJECT A pressing play on a blank-screen phone under the dark station awning after an earthquake, rain and broken paving, an orange-jacket rider struggling with a fallen scooter nearby, grounded contemporary documentary realism, complete visible player identity, 4:5 portrait, no writing, no text, no UI',
      entryAction: s('播放母亲留下的最后一条语音', "Play mother's last message"),
      blocks: [
        { id: 'bh0', kind: 'narration', text: s('凌晨一点四十分，你只是个赶着回家的普通人，刚走到中央车站南广场。', 'At 1:40 AM, you are simply an ordinary person trying to get home, just arriving at Central Station’s South Plaza.') },
        { id: 'bh1', kind: 'event', text: s('灯突然全灭。余震掀动脚下的地砖，雨水随即从裂开的站台边缘灌进广场。', 'Every light dies at once. An aftershock lifts the paving beneath you, and rain spills from the cracked platform edge into the plaza.') },
        { id: 'bh2', kind: 'event', text: s('震动停下时，口袋里的手机亮了一次：母亲留下了一段十八秒语音。', 'When the shaking stops, the phone in your pocket lights once: your mother has left an eighteen-second message.') },
        { id: 'bh3', kind: 'dialogue', speaker: s('母亲的语音', 'Mother’s message'), tone: s('压低声音，背景里有雨和远处广播', 'trying to stay calm over rain and a distant announcement'), text: s('“我和小宇正去河滨体育馆。你回来时别走河边，听见没有？手机快没电了。”', '“Xiaoyu and I are heading to Riverside Stadium. Do not take the river road when you come back. Do you hear me? My phone is almost dead.”') },
        { id: 'bh4', kind: 'event', text: s('语音停在二十三分钟前。信号随即消失；你的手机还剩 47% 电量。', 'The message is stamped twenty-three minutes ago. The signal drops away; your phone has 47% battery left.') },
        { id: 'bh5', kind: 'event', text: s('高架方向仍能通行，语音里的背景声也许藏着路线；近处，一个穿橙色雨衣的骑手正独自抬倒下的电动车。', 'The elevated road still looks passable, and the message may hide a route clue; nearby, a rider in an orange rain jacket strains alone against a fallen scooter.') },
      ],
      choices: [],
    },
    characters: [
      { id: 'lin-lan-mother', name: s('林岚', 'Lin Lan'), role: s('玩家的母亲', 'Player’s mother'), vitality: 72, stress: 68, detail: s('努力保持冷静，带着小宇和一名行动不便的邻居转移。', 'Trying to stay calm while moving Xiaoyu and a mobility-impaired neighbor.'), lore: s('做过社区急救培训，遇到危险会先确认身边最需要帮助的人。', 'Completed community first-aid training and checks who nearby needs help most.'), skills: [{ id: 'first-aid', label: s('急救', 'First aid'), value: 3 }, { id: 'coordinate', label: s('协调', 'Coordinate'), value: 3 }] },
      { id: 'xiaoyu-brother', name: s('小宇', 'Xiaoyu'), role: s('十六岁的弟弟', 'Sixteen-year-old brother'), vitality: 78, stress: 62, detail: s('离开体育馆寻找走散同学，留下了能被核对的路线痕迹。', 'Left the stadium to find a separated classmate and left a verifiable trail.'), lore: s('熟悉河湾学校和体育馆之间的自行车小路，但不是专业救援者。', 'Knows bicycle lanes between Riverbend School and the stadium but is not a trained rescuer.'), skills: [{ id: 'routes', label: s('熟悉街区', 'Local routes'), value: 3 }, { id: 'courage', label: s('勇气', 'Courage'), value: 3 }] },
      { id: 'ahe-rider', name: s('阿禾', 'Ahe'), role: s('外卖骑手', 'Delivery rider'), vitality: 84, stress: 55, hiddenUntilIntroduced: true, detail: s('十九岁，穿旧橙色雨衣，熟悉小路，也在找夜班下班的姐姐。', 'Nineteen, in an old orange rain jacket, knows side roads and is searching for an older sister finishing a night shift.'), lore: s('手机已经进水，记路主要靠送餐时形成的身体记忆。', 'Her phone is water-damaged, so she navigates through delivery-route memory.'), skills: [{ id: 'routes', label: s('城市小路', 'Side streets'), value: 4 }, { id: 'balance', label: s('平衡', 'Balance'), value: 3 }] },
      { id: 'zhoulan-nurse', name: s('周岚', 'Zhoulan'), role: s('仁和医院护士', 'Renhe Hospital nurse'), vitality: 65, stress: 78, hiddenUntilIntroduced: true, detail: s('负责拥挤急诊的伤员流向和二次转移记录。', 'Tracks casualty flow and secondary transfers through an overcrowded emergency ward.'), lore: s('只掌握经过医院或正式转移点的信息，不会凭空知道家人后续位置。', 'Knows only hospital and formal transfer information, never the family’s later location without evidence.'), skills: [{ id: 'triage', label: s('分诊', 'Triage'), value: 4 }, { id: 'records', label: s('核对', 'Verification'), value: 4 }] },
    ],
    initialMap: [
      { id: 'central-station', label: s('中央车站', 'Central Station'), current: true, detail: s('停电、积水、南广场道路开裂，仍有人互相帮助。', 'Dark, flooding and cracked at South Plaza, with residents still helping each other.'), lore: s('车站是城市交通中心，也是灾后最先拥堵的离开点。', 'The station is the city’s transit hub and the first evacuation bottleneck.'), facts: [s('余震刚停', 'The aftershock just stopped'), s('南广场有三条出口', 'South Plaza has three exits')] },
      { id: 'old-market', label: s('旧市场', 'Old Market'), connectedTo: s('中央车站', 'Central Station'), detail: s('低矮商铺和雨棚形成近路，电路老化。', 'Low shops and awnings make a shortcut through aging electrical infrastructure.'), lore: s('林岚常带小宇来这里买早餐，店主可能认得他们。', 'Lin Lan often brought Xiaoyu here for breakfast, so vendors may recognize them.'), facts: [s('离车站最近的东向路线', 'Closest eastbound route from the station')] },
      { id: 'renhe-hospital', label: s('仁和医院', 'Renhe Hospital'), connectedTo: s('旧市场', 'Old Market'), detail: s('急诊仍有备用电，伤员和转移信息集中。', 'Emergency wards retain backup power and concentrate casualty and transfer information.'), lore: s('医院通向隧道、高架和山坡三条主要路线。', 'The hospital connects to the tunnel, overpass and hillside routes.') },
      { id: 'flooded-underpass', label: s('积水隧道', 'Flooded Underpass'), connectedTo: s('仁和医院', 'Renhe Hospital'), detail: s('最快但水位不稳定，只有维修平台高于水面。', 'Fastest, but water rises unpredictably and only maintenance ledges stay above it.') },
      { id: 'hillside-community', label: s('山坡社区', 'Hillside Community'), connectedTo: s('仁和医院', 'Renhe Hospital'), detail: s('较远但地势高，临时广播与居民互助仍在运作。', 'Longer but elevated, with local radio and mutual aid still operating.') },
      { id: 'riverside-stadium', label: s('河滨体育馆', 'Riverside Stadium'), connectedTo: s('山坡社区', 'Hillside Community'), detail: s('家人的原定避难点，可能在洪峰前二次转移。', 'The family’s planned shelter, subject to secondary transfer before the flood crest.') },
      { id: 'riverbend-school', label: s('河湾学校', 'Riverbend School'), connectedTo: s('河滨体育馆', 'Riverside Stadium'), detail: s('屋顶高于洪峰线，是附近最后的临时集合点。', 'Its roof stands above the crest line and serves as the area’s last gathering point.') },
    ],
    initialInventory: [
      { id: 'phone', label: s('手机', 'Phone'), count: 1, detail: s('屏幕边缘开裂但仍能使用，电量与常驻数值同步。', 'Cracked along one edge but functional; charge matches the persistent battery stat.'), effect: s('可通话、地图、播放/增强语音、照明和发送求救；所有功能消耗有限电量。', 'Calls, maps, message playback/enhancement, light and rescue signals consume finite battery.'), lore: s('这是家人唯一知道一定能联系到你的号码。', 'It is the one number the family expects can reach you.'), metrics: [{ label: s('电量', 'Charge'), value: '47%' }, { label: s('信号', 'Signal'), value: s('间歇', 'Intermittent') }], imagePrompt: 'single modern phone with a cracked edge and completely blank glowing screen on dark wet fabric, practical emergency object study, no icons, no writing, no people, square' },
      { id: 'last-voice-message', label: s('最后一条语音', 'Last Voice Message'), count: 1, rarity: 'rare', detail: s('母亲在第一次地震后发出的 18 秒语音，背景包含雨、远处广播和车辆转弯声。', 'An eighteen-second message sent after the first quake, containing rain, distant radio and a turning vehicle.'), effect: s('可重听并分析路线声音；增强、分享或定位会消耗电量，无法显示录制后的事件。', 'Can be replayed for route sounds; enhancement, sharing or location analysis costs battery and cannot reveal later events.'), lore: s('它是家人的计划，也是他们在失联前留给你的最后一项可核实证据。', 'It preserves the family plan and the last verifiable evidence before contact failed.'), metrics: [{ label: s('长度', 'Length'), value: s('18 秒', '18 sec') }, { label: s('发出时间', 'Sent'), value: s('23 分钟前', '23 min ago') }], imagePrompt: 'single modern phone audio memory represented by a blank unlit screen and small wired earbud on dark wet cloth, no waveform, no icons, no writing, no people, square' },
      { id: 'home-keys', label: s('家门钥匙', 'Home Keys'), count: 1, detail: s('三把普通钥匙和一枚磨损的红色塑料钥匙扣。', 'Three ordinary keys and a worn red plastic fob.'), effect: s('打开受损公寓的外门与储物柜；不能打开公共避难设施。', 'Open the damaged apartment entrance and storage locker, not public shelters.'), lore: s('红色钥匙扣是小宇小学时挑的，边角已经磨白。', 'Xiaoyu chose the red fob in primary school; its edges are worn pale.'), metrics: [{ label: s('钥匙', 'Keys'), value: '3' }, { label: s('状态', 'Condition'), value: s('可用', 'Usable') }], imagePrompt: 'three ordinary home keys on a worn blank red plastic fob, dark wet fabric, contemporary emergency object study, no writing, no people, square' },
      { id: 'water-bottle', label: s('半瓶水', 'Half Bottle of Water'), count: 1, detail: s('车站便利店买的普通水，瓶身没有标签。', 'Ordinary station water in an unlabelled bottle.'), effect: s('恢复少量体力，或交给同行者；开封后不能长期保存。', 'Restores a small amount of stamina or can be given away; cannot be stored long after opening.'), lore: s('地震前只是随手买的东西，现在成为第一件需要决定归谁的物资。', 'Bought casually before the quake, now the first resource whose owner matters.'), metrics: [{ label: s('剩余', 'Remaining'), value: '450 ml' }, { label: s('封口', 'Seal'), value: s('已开', 'Open') }], imagePrompt: 'single half-full unlabelled clear water bottle with rain droplets on dark fabric, contemporary emergency object study, no text, no people, square' },
    ],
    demoTurns: [
      {
        match: zh ? ['重听', '语音', '背景'] : ['Replay', 'message', 'background'], imageSubject: 'player',
        imagePrompt: 'inside the dark edge of Central Station plaza, ordinary returning traveler shelters a blank phone from rain while listening closely, orange-jacket delivery rider lifting a fallen scooter nearby, current pre-departure moment, grounded contemporary disaster realism, 4:5 portrait, no writing, no text, no UI',
        content: s(`你把音量压到最低，重听那十八秒。雨声后面有连续三次高架伸缩缝的低响，还有一句被广播噪声盖住的“旧市场”。母亲和小宇不是沿河走的。
[skill_check: skill="分辨环境声" dc="9" rolls="12" modifier="2" total="14" result="success"]
[widget: battery, remove: 4]
[fact: id="voice-old-market-clue" value="true"]
橙色雨衣的骑手刚把倒下的电动车扶起，她抬头看见你在听路线。
[choices: "请骑手带你走旧市场小路"|"记住线索，独自沿高架离开"|"把语音分享给车站救援人员核对"]`, `You lower the volume and replay the eighteen seconds. Behind the rain are three low thumps from elevated expansion joints and one phrase buried in radio noise: “old market.” Your mother and Xiaoyu did not take the river road.
[skill_check: skill="Read background sound" dc="9" rolls="12" modifier="2" total="14" result="success"]
[widget: battery, remove: 4]
[fact: id="voice-old-market-clue" value="true"]
The rider in the orange rain jacket has just lifted a fallen scooter. She looks up when she realizes you are listening for a route.
[choices: "Ask the rider to guide you through the Old Market"|"Keep the clue and leave alone by the elevated road"|"Share the message with station rescuers for verification"]`),
      },
      {
        match: zh ? ['骑手', '独自', '高架', '分享', '救援人员', '帮广场', '抬开'] : ['rider', 'alone', 'elevated', 'Share', 'rescuers', 'fallen scooter'], imageSubject: 'player',
        imagePrompt: 'Central Station exit in heavy rain, ordinary traveler and young delivery rider in old orange rain jacket moving a fallen scooter aside before leaving toward the Old Market, residents and blank emergency panels behind, grounded contemporary realism, 4:5 portrait, no writing, no text, no UI',
        content: s(`骑手叫阿禾，十九岁。她的手机进了水，但送餐路线还记在身体里；她也在找夜班下班的姐姐。你们把车推到不挡路的位置，决定先同行到旧市场。
[character_update: character_id="ahe-rider" character="阿禾" role="外卖骑手" detail="穿旧橙色雨衣，手机进水，熟悉车站到旧市场的小路，也在寻找姐姐" lore="靠送餐形成的身体记忆辨认灾后路线" vitality="84" stress="55" skills="城市小路: 4|平衡: 3"]
[party_change: character_id="ahe-rider" character="阿禾" change="add" role="外卖骑手" detail="与你暂时同行到旧市场，同时寻找夜班下班的姐姐" lore="在中央车站南广场因共同搬开倒车而结伴" vitality="84" stress="55" skills="城市小路: 4|平衡: 3"]
[map_update: new_location="旧市场入口" connected_to="中央车站" detail="雨棚下积着浅水，主街前方有电火花" lore="林岚和小宇常在这里买早餐" facts="有人在二十分钟前见过一名母亲带着少年经过|东侧电路冒烟"]
[clock: value="凌晨 02:05"]
[widget: time, remove: 7]
[fact: id="station-exited" value="true"]
雨棚尽头亮起不正常的蓝白电弧，一家早餐铺的卷帘门后传来敲击声。
[choices: "和阿禾先拉下市场总电闸"|"从屋顶雨棚绕过火点继续赶路"|"呼喊店内的人并组织附近居民撤离"]`, `The rider is Ahe, nineteen. Her phone is water-damaged, but delivery routes remain in muscle memory; she is also looking for her sister after a night shift. You move the scooter clear and agree to travel together as far as the Old Market.
[character_update: character_id="ahe-rider" character="Ahe" role="Delivery rider" detail="Wears an old orange rain jacket, has a water-damaged phone, knows the station-to-market alleys and is searching for her sister" lore="Navigates damaged streets through delivery-route memory" vitality="84" stress="55" skills="Side streets: 4|Balance: 3"]
[party_change: character_id="ahe-rider" character="Ahe" change="add" role="Delivery rider" detail="Travels with you toward the Old Market while searching for her night-shift sister" lore="Joined after you cleared a fallen scooter together at South Plaza" vitality="84" stress="55" skills="Side streets: 4|Balance: 3"]
[map_update: new_location="Old Market Entrance" connected_to="Central Station" detail="Shallow water pools beneath awnings while electrical sparks flash ahead" lore="Lin Lan often brought Xiaoyu here for breakfast" facts="Someone saw a mother and teenager pass twenty minutes ago|The east circuit is smoking"]
[clock: value="02:05 AM"]
[widget: time, remove: 7]
[fact: id="station-exited" value="true"]
An unnatural blue-white arc flashes at the end of the awning. Knocking comes from behind a breakfast shop shutter.
[choices: "Pull the market main breaker with Ahe"|"Use the awning roofs to bypass the fire and keep moving"|"Call to the trapped people and organize a local evacuation"]`),
      },
      {
        match: zh ? ['总电闸', '屋顶雨棚', '绕过', '居民撤离', '呼喊'] : ['main breaker', 'awning roofs', 'bypass', 'evacuation', 'trapped people'], imageSubject: 'player',
        imagePrompt: 'Old Market electrical fire in heavy rain, ordinary traveler and orange-jacket rider coordinating residents beneath awnings while one blank metal breaker box sparks, grounded contemporary disaster drama, 4:5 portrait, no readable signs, no writing, no text, no UI',
        content: s(`阿禾踩上货架断开高处支线，你用绝缘木柄把总闸压下。火没有立刻熄灭，但卷帘门终于能被三个人合力抬起。
[skill_check: skill="灾后应变" dc="11" rolls="11" modifier="2" total="13" result="success"]
[widget: stamina, remove: 6]
[fact: id="market-evacuated" value="true"]
早餐铺老板咳着把一只干燥的折叠雨衣塞给你。他确认二十分钟前见过林岚和小宇：小宇手里拿着医院方向的纸条。
[inventory: action="add" item_id="folding-raincoat" item="折叠雨衣" count="1" rarity="common" detail="未拆封的轻便雨衣，接缝只适合一次长时间暴雨" effect="保护一人免于失温或穿过一次无遮蔽雨区；破损后失效" lore="旧市场早餐铺老板在获救后交给玩家" metrics="防雨: 1 人|耐用: 一次长途" image_prompt="single folded unbranded emergency raincoat in clear blank wrapping on dark wet cloth, practical contemporary object, no writing, no people, square"]
[fact: id="family-seen-old-market" value="true"]
[state: value="前往仁和医院，核对林岚和小宇是否经过"]
[choices: "沿老板指的干燥后巷赶去医院"|"先为被烟呛到的人做简单处理"|"请阿禾寻找她姐姐可能留下的骑行标记"]`, `Ahe climbs a shelf to disconnect the high branch while you force down the main breaker with an insulated wooden handle. The fire does not die immediately, but three people can finally lift the shutter.
[skill_check: skill="Disaster Response" dc="11" rolls="11" modifier="2" total="13" result="success"]
[widget: stamina, remove: 6]
[fact: id="market-evacuated" value="true"]
The coughing breakfast-shop owner pushes a dry folding raincoat into your hands. He confirms Lin Lan and Xiaoyu passed twenty minutes ago; Xiaoyu carried a note pointing toward the hospital.
[inventory: action="add" item_id="folding-raincoat" item="Folding Raincoat" count="1" rarity="common" detail="An unopened light raincoat whose seams can survive one long storm crossing" effect="Protects one person from exposure or one unsheltered crossing; useless after tearing" lore="Given by the rescued Old Market breakfast-shop owner" metrics="Coverage: 1 person|Durability: one long route" image_prompt="single folded unbranded emergency raincoat in clear blank wrapping on dark wet cloth, practical contemporary object, no writing, no people, square"]
[fact: id="family-seen-old-market" value="true"]
[state: value="Reach Renhe Hospital and verify whether Lin Lan and Xiaoyu passed through"]
[choices: "Take the dry service alley to the hospital"|"Give first aid to people affected by smoke"|"Help Ahe search for route marks left by her sister"]`),
      },
      ...buildBeforeWeGetHomeCampaign(locale),
    ],
  }
}

export const beforeWeGetHome = build('zh')
export const beforeWeGetHomeEn = build('en')
