# Before We Get Home / 回家之前

一款通俗、完整的双语竖屏叙事角色扮演游戏。地震与暴雨切断城市交通后，玩家必须在河水越过警戒线前穿过城市，寻找母亲与弟弟，并在沿途决定要带谁一起回家。

## 游戏结构

- 28 个连续行动回合，覆盖 8 个章节与完整终章。
- 体力、天亮前剩余时间和手机电量共同影响路线、危险与结局。
- 伙伴、关键物资、检定结果和玩家承诺会持续进入后续场景。
- 8 个作者锚定结局，并允许大语言模型依据真实游戏历史生成更多情绪变体。
- 每一步以竖幅场景图为主，人物对话、行动结果与选择按时间顺序出现。
- 中文 / 英文自动切换；适配移动端、桌面端与 AlterU 平台容器。

## 本地运行

```bash
npm install
npm run dev
```

演示模式：`?story_mode=demo&ui=civic`。

## 构建与测试

```bash
npm run build
npm run test:protocol
npm run test:danger
npm run test:ending
npm run test:campaign
```

构建产物位于 `dist/`，Vite `base` 固定为 `./`，可部署到任意子路径。

## 发布

- AlterU 正式主站：`https://game.aiwaves.tech/ce2b7231-7996-430d-85f6-8fdf184acf3d/`
- GitHub Pages 镜像：`https://yinxinghuan.github.io/before-we-get-home/`

两份前端来自同一个 Git 提交；平台身份、存档和运行时生成仍使用 AlterU 接口。正式海报与制作期图像均通过 Aigram transit 生图接口生成，来源记录在 `doc/image-provenance.md`。

## 文档

- `doc/requirements.md`：玩法与验收需求
- `doc/visual.md`：视觉方向、界面系统与素材规则
- `doc/technical.md`：最终技术结构与扩展点
- `doc/release-handoff.json`：发布锚点与测试清单

第三方许可证说明随源码与构建产物发布于 `public/THIRD_PARTY_NOTICES.txt`。
