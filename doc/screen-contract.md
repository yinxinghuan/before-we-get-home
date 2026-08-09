# 《回家之前》屏幕状态合同

## Global environment

- Playfield type：hybrid；主场景为响应式全画幅图，HUD 与覆盖层为响应式 DOM。
- Target viewports：320×568、390×844、1024×768、1440×900；竖屏优先。
- Input methods：touch、pointer、keyboard。
- Platform overlays：平台内不预留 guest banner；外部仅保证可关闭和基本可用。
- Persistent navigation：三项状态、四格工具栏；品牌由远程扩展管理，不在主画面重复堆叠。

## Screen/state inventory

| State | Player question | Primary focus | Primary action | Temporary feedback / recovery |
|---|---|---|---|---|
| Entry | 发生了什么、我要去哪？ | 停电车站与最后语音 | 进入故事 | 图片加载失败显示专属底图与重试，不跳空锚点 |
| Decision | 现在该怎么做？ | 当前人物/危险与决策前提 | 三个具体选项 | 禁用显示原因；自由行动单独展开 |
| Submitting | 我的选择收到没有？ | 玩家刚选的行动 | 无重复提交 | 按钮立即压下、选择离场、场景保持 |
| Result | 刚才发生了什么？ | 行动结果、检定与状态变化 | 查看下一步 | 长结果分页/内部自适应，不出现下一组选项 |
| Danger | 危险是什么？ | warning/confrontation/resolution | 三种应对 | 红色来源签、固定 d20、失败后恢复选择 |
| World | 我现在拥有什么、谁和我一起？ | 人物/地图/背包/线索/日志 | 查看详情 | 空态解释；列表使用 onClick，可滚动 |
| Return | 继续还是重来？ | 上次地点和最新目标 | 继续游戏 | 继续后跳到最新锚点；重开二次确认 |
| Chapter | 这一段完成了什么？ | 地区结果和未完成目标 | 继续旅程 | 不是结局，不锁输入 |
| Ending | 我最终保住了什么？ | 团聚/代价/人物去向 | 继续尾声或重开 | 生成失败回退兼容锚点，同快照不重抽 |

## Component state matrix

| Component | Default | Pressed | Focus | Disabled | Loading | Success/error |
|---|---|---|---|---|---|---|
| Action button | 灰白 + 黄边/阴影 | 黄底深字、下移 3 px | 2 px 青色外框 | 灰边无阴影 + 原因 | 保留已选文本 | 由结果层承接 |
| Tool icon | 深底线性 SVG | 黄/青实色块 | 可见外框 | 降对比仍可辨 | 局部旋转仅用于生成 | 红色点/绿色点 + 文本 |
| Stat cell | 安静数值/细条 | 可打开状态页 | 可见外框 | 不适用 | 不抖动 | 阈值形状 + 标签，不只靠色 |
| Scene media | 当前完成图 | 不交互 | 不适用 | 不适用 | 保留上一图 + 小型生成态 | 失败显示重试，不清叙事 |

## HUD contract

- Protected gameplay/finger area：底部 116 px 行动码头；主要人物脸避开顶部 HUD 和底部覆盖。
- Stable HUD regions：顶部三项状态；右上四格工具栏可按短屏收为一行。
- Quiet persistent information：地点、体力、时间、电量。
- High-emphasis warnings/rewards：余震/洪峰/低电量、家人信号、关键线索、团聚。
- Maximum copy：中文按钮 18 字、英文 46 字；超过则两行但保持 44 px 以上目标。

## Onboarding contract

- First action：播放/检查最后一条语音，或立即选择离开车站的方法。
- Demonstration：首屏用一段字幕解释语音目标，手机电量条短促闪一次。
- Practice response：第一次使用手机功能明确显示电量消耗与所得线索。
- Dismissal：玩家完成一次行动后不再显示教学提示。
- Fallback：历史与世界面板中的“规则”页可重新查看三项数值和手机用途。
