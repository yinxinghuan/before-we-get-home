# 《回家之前》技术文档

## 1. 技术栈

- React 18 + TypeScript + Less + Vite 5，`base: './'`，可在任意部署子路径运行。
- 叙事核心是结构化 `StoryCartridge`、本地 reducer、Aigram 长对话接口和可恢复的 `StorySave v7`。
- 运行时场景图使用 `useGenImage()` 默认调用独立 AlterU Media Service；目标尺寸 `512×640`，每次成功行动排队一张图。紧急回滚可在游戏 URL 添加 `?media_backend=legacy`，改回 Aigram transit 生图。
- 当前玩家资料通过 `/note/telegram/user/get/info/by/telegram_id` 读取。玩家主导镜头直接使用平台原始 1:1 `head_url` 作为身份参考；`512×640` 仅定义媒体服务的最终场景画布，不再预裁并重复上传头像。NPC 主导、环境和物品镜头不传头像。
- 声音由 Web Audio 合成器实时生成，无外部音频文件。雨夜环境、路线张力、危险提示、人物重逢和结局使用不同节奏与音色层。

## 2. 目录结构

```text
src/story/
  cartridges/beforeWeGetHome.ts          # 世界、角色、数值、结局导演和开场
  cartridges/beforeWeGetHomeCampaign.ts  # 28 决策中英文确定性完整主线
  engine/                                 # 协议、reducer、危险、图片和结局导演
    domainRules.ts                        # 领域意图、前置条件与原子事务裁判
  adapters/                               # demo、Aigram 与远端故事接口
  useStoryEngine.ts                       # 存档、生成队列、头像身份绑定和视频里程碑
  usePlayerProfile.ts                     # 延迟宿主身份同步与真实头像读取
  useAvatarImageReference.ts              # 原始公网头像 URL 校验与直传
  StoryShell.tsx / story.less             # Civic 竖版固定画面界面
  engine/protocol.ts / stageNarrative.ts  # 协议清理与条件情境字幕
src/shared/runtime/media.ts               # 独立媒体服务客户端、尺寸适配与任务轮询
src/shared/runtime/useGenImage.ts          # 新媒体服务默认路由与旧 transit 回滚开关
public/poster.png                         # 1024×1024 正式英文海报
_qa/full-campaign.ts                      # 中英文 28 回合完整路径回归
_qa/domain-rules.ts                       # 越权模型、重复收益与精确数值回归
_qa/character-debut.ts                    # 隐藏未来角色与稳定 ID 登场回归
_qa/opening-contract.ts / opening-sequence.mjs # 六拍开场内容合同与双尺寸浏览器回归
```

永久游戏 UUID 为 `ce2b7231-7996-430d-85f6-8fdf184acf3d`；存档命名空间为 `before-we-get-home`。

## 3. 核心模块

- `beforeWeGetHome.ts` 定义体力、天亮前时间、手机电量，固定人物林岚、小宇、阿禾与周岚，八章导演、危险节奏以及八类结局锚点。
- 第 0 场由 `stageNarrativeBlocks()` 取出六个作者节拍并单向分页；`openingReady` 在末拍前不渲染 `Composer`，数字键也受同一门禁。末拍出现时页控件退出，选择与自由输入同步进入；重开回第 0 场会重置门禁，已有后续场景的存档不受影响。
- `beforeWeGetHomeCampaign.ts` 把 28 次玩家决定实现为成对中英文分支；每个按钮命中独立结果，不复用与行动不符的通用段落。物品获得和消耗必须同时输出结构化 `inventory` 命令。
- `reducer.ts` 是唯一确定性真源，负责数值、地图、同行者、事实、背包、危险和结局状态；模型不能直接覆盖已有事实或清空同伴。
- `domainRules.ts` 在模型生成前判定被治理行动，返回 accepted/rejected 及完整 effect 集；命中后完全跳过叙事 adapter，由本地 authored text、事务与三选项组成可回放结果。拒绝不改存档，也不推进危险 cadence。Cartridge 当前治理“播放最后语音”、重听线索、阿禾带路、独自离站与分享语音五项开场事务；进入页动作会通过 `enterStory()` 真实推进第 1 幕，而非只是换屏。
- `StoryShell.tsx` 对前 3 幕执行逐页阅读门禁：结果先落地，再进入 decision；该幕叙事未读到最后一页时不挂载 Composer。第 4 幕后恢复普通自由节奏，避免长线游戏被永久做成逐页点击器。
- `hiddenUntilIntroduced` 把未来固定角色排除在初始 `StorySave` 之外；可见正文完成外形/动作、名字来源和意图后，稳定 `character_update` 或领域 party effect 才能创建。`normalizeCharacterState()` 会移除从未真实登场的旧存档错误预载，但保留已经有正文/队伍/关系证据的人物。
- `imageDirector.ts` 拒绝带 CJK 的 renderer prompt，并把 `image_subject` 解释为头像归属：只有玩家执行主要画面动作时为 `player`。`useStoryEngine.ts` 通过普通 image edit 直传同一原始头像。`imageIdentity.ts` 把前置身份合同限制在 `2400` 字符内，将旅行者等玩家别名改写成 `SUBJECT A`，并把头像视为脸、轮廓、形态、身体比例、遮盖、面具、服装、材质、颜色和配件组成的完整视觉身份。原头像未出现的脸、皮肤、手脚不得生成，阿禾、林岚、小宇、周岚、路人和动物也不得继承玩家特征。
- `src/shared/runtime/media.ts` 是独立媒体服务的框架无关客户端：统一请求 UUID、尺寸适配、任务轮询、超时和结构化错误。`useGenImage.ts` 以永久游戏 UUID 作为 `session_id`；网络结果不明确时复用同一 `request_id`，避免重复生成和重复计费。场景重试读取 `retryable` 与 `retry_after_seconds`，永久错误立即停止，限流错误遵守服务等待窗口。视频暂不迁移，因为当前故事画面是 `4:5`，实验视频端点只接受 `9:16`。
- `usePlayerProfile.ts` 为外部宿主注入留出 `10.5s` 窗口；一旦确认处于平台，即使资料桥第一次超时也会继续重试到 `30.5s`，第一张玩家图不能抢先以默认人物生成。前两张身份版本低于 `PLAYER_IMAGE_REFERENCE_VERSION=2` 的旧玩家图会自动重做一次。场景图等待头像时，背包物品图仍可先在串行媒体队列中生成。
- `endingDirector.ts` 在玩家抵达河湾学校、确认家人位置且至少推进 18 场后开放真结局。结局由可用能力、事实、数值、背包、人物关系和最终行动组合，不是固定三选一文案。
- 存档同时覆盖 Aigram 正式存档与浏览器回退；二次进入显示“继续游戏 / 重新开始”，继续后跳到最后锚点。
- 双语由 cartridge 成对导出；界面跟随系统语言或玩家回复语言，海报始终只使用英文。

## 4. 扩展点

- 改故事章节、角色和结局：编辑 `src/story/cartridges/beforeWeGetHome.ts`。
- 新增一次性奖励、消耗、路线或入队门槛：在同一 cartridge 的 `domainRules` 中声明 stable id、要求、完整 effects 和成功/拒绝选项，并同步 `npm run test:domain`；不要把数值裁定只写进 prompt。
- 改 demo 全流程分支和具体数值：编辑 `beforeWeGetHomeCampaign.ts` 并运行 `npm run test:campaign`。
- 换世界或题材：复制 cartridge，保留 engine、adapters、Civic UI 和结构化协议；必须分配新 UUID 与新存档命名空间。
- 改界面表现：主要修改 `StoryShell.tsx` 与 `story.less`；改字幕价值判断编辑 `engine/stageNarrative.ts` 并运行 `npm run test:stage-narrative`；改开场必须同步 `npm run test:opening` 与 `_qa/opening-sequence.mjs`。不得改变“末拍前无选择”或“结果阶段隐藏旧选项、下一步再显示新前提和新选项”的节奏。
- 改生图内容：修改 cartridge 的 `sceneImageDirection`、`sceneImageAvoid`、`playerImageRole` 与 `playerImageExclusions`；不可把中文可见故事正文拼入 renderer prompt。改媒体服务合同：修改 `src/shared/runtime/media.ts`；临时回滚旧生图链路：在 URL 增加 `media_backend=legacy`。
- 接后端或正式发布：通过 `@shared/runtime` 和独立 `game-publish` 流程处理；源码项目本身不编辑平台迁移工具生成的 `games.json`。

## 连续性守门（2026-08-13）

- Cartridge 通过 `transitionAnchor` 声明“手机离线地图与母亲最后一条语音”；`src/story/engine/continuity.ts` 生成地点桥接、压缩 `decisionContext` 并核验选项名词是否已有可见依据。
- `reducer.ts` 在 `map_update` 与受管辖地图事务提交前插入桥接，并在选择落入 UI 前执行 grounded-choice 检查；旧存档升级到 StorySave v8 时从现有目标补齐 `decisionContext`。
- `filterGroundedChoices()` 逐条保留合法选项；一条成立也直接展示。平静态零条成立时快捷选项保持为空，由自由输入继续，不再生成会反复出现的通用兜底；危险态才恢复绑定同一威胁的确定性应对。`_qa/continuity-gate.ts` 同时覆盖全坏与部分合法两组输入。
- `protocol.ts` 先按 `|` 分段再剥每段首尾成对引号，`Mira's recording` 一类单词内部撇号不会再破坏英文选项协议；`_qa/protocol.ts` 固定回归该输入。

## 镜头导演与迁移（2026-08-17）

- StoryImageDirector.perspective 分别配置普通镜头、重要对话和新地点；当前产品使用 balanced / first-person / observer。
- engine/imageDirector.ts 在每次图片决策中写入 perspective，第一人称自动取消 playerVisible 与头像参考；玩家主导动作强制 observer。SCENE_IMAGE_PROMPT_VERSION=11 只重写尚未完成的旧图片任务，不批量重画历史成图。
- _qa/perspective-director.ts 对中英文各运行 20 张普通镜头，并覆盖重要对话、新地点和玩家主导动作。运行 npm run test:perspective 后再构建。

## 行动权威影子审计（2026-08-20）

- `engine/authorityShadow.ts` 只读取当前 cinematic 阶段已经显示的选择，以原有 `domainRules` 分类 `accepted / rejected / open` 并报告真正进入游戏后的非终局空 tray。
- 审计不补选项、不改阶段、不写存档或上传数据；页面内存最多 100 条，`?authority_shadow=0` 可关闭，`npm run test:authority-shadow` 固定验证零改写。
## 2026-08-23 混合音频升级

`src/story/audio/` 新增本作专属的雨城归途主题与室内雨声环境层，精确反馈继续由 Web Audio 负责。播放器遵循用户手势、静音和页面可见性，长音频不伪装无缝循环；失败时保持故事可玩并使用合成回退或静音。

普通选择只有一次轻确认；普通正文、常规数值和图片完成静音，检定、稀有物、关系、危险、抵达与章节节点才追加结果提示。Cartridge 合成反馈上限为 `0.045`，引擎再乘 `0.52`；`180 ms` 内合并，合成/录制短音效并发上限为 6/2。

## 2026-08-23 阅读优先 A/B 配乐

日常行程使用稀疏雨城底乐 A；关键发现、关系转折和阶段总结才使用 B。B 开始时暂停 A、结束后恢复 A，并执行 180 秒同源冷却；页面隐藏会取消 B，重新可见不会补播。
