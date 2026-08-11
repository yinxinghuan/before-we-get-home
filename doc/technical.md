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
  adapters/                               # demo、Aigram 与远端故事接口
  useStoryEngine.ts                       # 存档、生成队列、头像身份绑定和视频里程碑
  usePlayerProfile.ts                     # 延迟宿主身份同步与真实头像读取
  useAvatarImageReference.ts              # 原始公网头像 URL 校验与直传
  StoryShell.tsx / story.less             # Civic 竖版固定画面界面
src/shared/runtime/media.ts               # 独立媒体服务客户端、尺寸适配与任务轮询
src/shared/runtime/useGenImage.ts          # 新媒体服务默认路由与旧 transit 回滚开关
public/poster.png                         # 1024×1024 正式英文海报
_qa/full-campaign.ts                      # 中英文 28 回合完整路径回归
```

永久游戏 UUID 为 `ce2b7231-7996-430d-85f6-8fdf184acf3d`；存档命名空间为 `before-we-get-home`。

## 3. 核心模块

- `beforeWeGetHome.ts` 定义体力、天亮前时间、手机电量，固定人物林岚、小宇、阿禾与周岚，八章导演、危险节奏以及八类结局锚点。
- `beforeWeGetHomeCampaign.ts` 把 28 次玩家决定实现为成对中英文分支；每个按钮命中独立结果，不复用与行动不符的通用段落。物品获得和消耗必须同时输出结构化 `inventory` 命令。
- `reducer.ts` 是唯一确定性真源，负责数值、地图、同行者、事实、背包、危险和结局状态；模型不能直接覆盖已有事实或清空同伴。
- `imageDirector.ts` 拒绝带 CJK 的 renderer prompt，并把 `image_subject` 解释为头像归属：只有玩家执行主要画面动作时为 `player`。`useStoryEngine.ts` 通过普通 image edit 直传同一原始头像，并追加 PERSON A 演员表约束，明确阿禾、林岚、小宇、周岚、路人和动物均不能继承用户参考脸。`imageIdentity.ts` 把场景与身份合同限制在媒体服务的 `4000` 字符上限内。
- `src/shared/runtime/media.ts` 是独立媒体服务的框架无关客户端：统一请求 UUID、尺寸适配、任务轮询、超时和结构化错误。`useGenImage.ts` 以永久游戏 UUID 作为 `session_id`；网络结果不明确时复用同一 `request_id`，避免重复生成和重复计费。场景重试读取 `retryable` 与 `retry_after_seconds`，永久错误立即停止，限流错误遵守服务等待窗口。视频暂不迁移，因为当前故事画面是 `4:5`，实验视频端点只接受 `9:16`。
- `usePlayerProfile.ts` 为宿主 bridge 留出完整 `10.5s` 启动窗口，并在初始十秒、宿主消息、页面聚焦和恢复可见时实时重读 Aigram 身份。玩家主导的开场图在身份窗口结束或真实头像到达后才生成；前两张缺少 `PLAYER_IMAGE_REFERENCE_VERSION` 的旧玩家图会自动重做一次。场景图等待头像时，背包物品图仍可先在串行媒体队列中生成。
- `endingDirector.ts` 在玩家抵达河湾学校、确认家人位置且至少推进 18 场后开放真结局。结局由可用能力、事实、数值、背包、人物关系和最终行动组合，不是固定三选一文案。
- 存档同时覆盖 Aigram 正式存档与浏览器回退；二次进入显示“继续游戏 / 重新开始”，继续后跳到最后锚点。
- 双语由 cartridge 成对导出；界面跟随系统语言或玩家回复语言，海报始终只使用英文。

## 4. 扩展点

- 改故事章节、角色和结局：编辑 `src/story/cartridges/beforeWeGetHome.ts`。
- 改 demo 全流程分支和具体数值：编辑 `beforeWeGetHomeCampaign.ts` 并运行 `npm run test:campaign`。
- 换世界或题材：复制 cartridge，保留 engine、adapters、Civic UI 和结构化协议；必须分配新 UUID 与新存档命名空间。
- 改界面表现：主要修改 `StoryShell.tsx` 与 `story.less`；不得改变“结果阶段隐藏旧选项、下一步再显示新前提和新选项”的两拍节奏。
- 改生图内容：修改 cartridge 的 `sceneImageDirection`、`sceneImageAvoid`、`playerImageRole` 与 `playerImageExclusions`；不可把中文可见故事正文拼入 renderer prompt。改媒体服务合同：修改 `src/shared/runtime/media.ts`；临时回滚旧生图链路：在 URL 增加 `media_backend=legacy`。
- 接后端或正式发布：通过 `@shared/runtime` 和独立 `game-publish` 流程处理；源码项目本身不编辑平台迁移工具生成的 `games.json`。
