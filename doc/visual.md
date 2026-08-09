# 《回家之前》视觉圣经

## 1. Visual thesis

- Game and audience：面向普通玩家的现代灾难归家 RPG；无需类型知识，第一眼就能理解“城市出事、家人失联、天亮前去找他们”。
- Emotional promise：紧张但不猎奇；城市很危险，人仍然值得相信。
- One-sentence visual thesis：**雨夜应急纪录片，被一束来自家的暖光贯穿。**
- Signature visual moment：洪水逼近的蓝黑城市中，玩家手机屏幕熄灭前闪出家人的最后语音波形，远处体育馆应急灯形成唯一温暖方向。
- Three required qualities：生活化、方向清楚、人物有情绪。
- Three directions to avoid：末日废土、军事英雄海报、霓虹赛博朋克。

## 2. Composition and camera

- Orientation and aspect ratios：场景母版 4:5 竖幅 `512×640`；海报 1:1；桌面端允许左右延展环境。
- Camera and perspective：35mm–50mm 纪录片式中近景与环境中景，轻微手持感但地平线稳定；危险时可用低机位或俯视路线，不使用夸张鱼眼。
- Playfield focal area：人物脸、手机、关键物品和危险交界放在中央 58% 安全列；底部 28% 预留结果与选项覆盖的容错区。
- Foreground, midground, background：前景用雨、栏杆或车门形成进入感；中景承担人物动作；背景只保留一个能说明路线或危险的地标。
- HUD safe areas：三项状态常驻顶部，画面可下穿 HUD 后方但 HUD 永远在最上层；外部访客栏不是平台安全区。
- Attention path：地点签 → 当前行动/人物对白 → 画面主体 → 结果或选择。

## 3. Color

- Background：夜雨蓝黑 `#101820`；深湿路面 `#17232A`；结果浅灰 `#EEF1EF`；正文深墨 `#101820`；次级字 `#667179`。
- Action：应急反光黄 `#F3B61F`；phone/signal `#39A9C8`；safe/reward `#2A8C6F`；danger `#D84A3A`；warm shelter `#E98A3A`。
- Usage ratios：环境蓝黑 62%，灰白信息 22%，行动黄 10%，红/青/绿共 6%。
- Forbidden combinations：不使用紫粉霓虹、彩虹渐变、蓝光玻璃卡；行动黄与危险红不能同时填满同一按钮。

## 4. Typography

- Display：`Inter Tight, Arial Narrow, sans-serif`，中文 `PingFang SC, Noto Sans CJK SC, sans-serif`。
- UI/body：`Inter, system-ui` 与同一中文回退；正文 16–20 px、1.5 行高。
- Numeric/HUD：tabular nums，22–30 px，700–800；单位 11–13 px。
- 标题可使用窄体全大写英文；游戏内中文不做手写或灾难模板的破损字体。所有可读文字属于 DOM UI，不进入生成图片。

## 5. Shape, material, and lighting

- Dominant shapes：交通导向牌式直角/轻切角；小圆角仅用于手机、电池和人物头像，不能把所有内容做成胶囊卡。
- Border and shadow：1–2 px 深墨边；主要行动使用 4 px 实色硬阴影；危险用双线边与红色侧签；无玻璃模糊。
- Materials：湿沥青、混凝土、反光雨衣、磨砂塑料手机、应急胶带与路障涂层。
- Lighting：主光来自钠灯和应急灯，冷雨环境做轮廓；安全空间温暖但不变成金色滤镜。

## 6. Characters, environments, and assets

- 玩家为真实普通成年人，用户头像只负责稳定面部身份；服装随剧情固定为深色防水外套、小背包和实用鞋。
- 阿禾以橙色旧骑行雨衣和反光条形成稳定轮廓；林岚、小宇、周岚各有稳定年龄、衣着和随身物。
- 表情范围包括压住恐惧、犹豫、疲惫、松一口气和克制的团聚，不让所有人物面向镜头摆姿势。
- 环境保持现代普通城市尺度：车站、市场、医院、隧道、高架、山坡社区、体育馆、学校屋顶。
- 生成图 4:5、无 UI、无可读字、无水印；画面提示全英文。每个当前事件重新建镜，不继承封面或中央车站构图。

## 7. UI and icons

- 使用统一 24×24 线性 SVG：历史、字号、声音、世界、手机、地图、背包、人物、伤势、返回和发送；禁止 Emoji 功能图标。
- 状态 HUD 是三格应急仪表，安静显示；值跨警戒线时才出现文字警告与形状变化。
- 可选行动默认浅灰底、应急黄边/序号和同色硬阴影；按下后填充黄、深墨字。禁用态取消阴影并显示锁定原因。
- 人物对白带方形身份牌或头像、姓名和分页；旁白不用虚构头像。
- 默认、pressed、focus、disabled、loading、warning、success 均保持布局稳定；loading 不清空上一张图或最后可用选择。

## 8. Motion and VFX

- Routine `90–140 ms`；panel `180–240 ms`；scene crossfade `320 ms`；danger pulse `2×140 ms`。
- 行动先同帧压下并记录，网络/生图完成不阻塞第一层反馈。
- 雨只做低密度纵向纹理和轻微前景速度差；余震最多 `4 px / 180 ms`，不持续摇晃。
- 线索确认以一条青色信号线从物品连到目标；团聚与安全节点用暖光扩张，不撒通用彩纸。
- reduced-motion：直接切换画面、取消震动和雨视差，保留边框、标签、文字和声音关闭状态。

## 9. References translated into principles

- Reference：《时间管理局审核员》——借用单一主画面、硬边信息牌和按阶段出现的交互，不复制机关题材或蓝色主题。
- Reference：现代灾难电影的城市夜景——借用普通人的尺度、湿表面与实用照明，不复制具体镜头或明星形象。
- Reference：公共交通应急导视——借用方向明确的颜色、编号和粗窄体，不把界面做成真实政府 App。

## 10. Anti-patterns

- 禁止核爆、僵尸、荒漠废土、全副武装佣兵、科幻无人机和超级英雄姿势。
- 禁止 AI 常见的电影海报构图反复进入每一回合，禁止每张图都有车站/体育馆/手机特写。
- 禁止画面出现中文、英文、数字、伪路牌、伪字幕、可读手机消息或地图标签。
- 禁止通用玻璃卡、霓虹渐变、模糊背景、过度圆角、Emoji 图标和同时堆叠字幕/结果/选择。

## 11. Vertical-slice acceptance

- Entry/start：第一眼看见停电车站、雨夜道路、玩家与手机；10 秒内理解目标和期限。
- Gameplay：结果与下一决策严格两拍；三项数值、人物对白、背包线索和三种选择可读。
- High-feedback moment：旧市场火灾对峙能清楚显示危险、检定、代价和路线改变。
- Completion/end：抵达第一章安全点后是可继续节点，不误报真结局；完整压缩战役可走到河湾学校屋顶与动态尾声。
- Narrow mobile：`320×568` 不裁掉字幕、结果、选项和自由输入；桌面端不拉伸成宽人物。
- Visual QA findings and decision：首轮实现后记录于 `_qa/visual-report.md`，P0/P1 修复后才扩展完整内容。
