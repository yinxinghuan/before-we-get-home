# 图像来源与审核记录

## 游戏内世界图

- 生成接口：`POST https://chat.aiwaves.tech/aigram/api/gen-image`
- 请求来源：`Origin: https://aigram.app`
- 最终来源 URL：`https://cdn.aiwaves.tech/prod/telegram/avatar/0/1786303796963718.webp`
- 本地用途：`before-we-get-home.webp`（1:1 世界封面底图）与 `before-we-get-home-entry.png`（4:5 首屏等待图）。
- 审核：无可读文字；不作为正式上架海报。前两次生成因伪文字被拒绝。

## 正式英文海报

- 初始生成与平台参考图编辑均使用同一 Aigram transit 接口。
- 最终来源 URL：`https://cdn.aiwaves.tech/prod/telegram/avatar/0/1786305566275802.webp`
- 本地交付：`public/poster.png`，1024×1024。
- 允许的唯一文字：`BEFORE WE GET HOME`。
- 已拒绝版本：
  - `1786305462927869.webp`：包含伪中文、底部假 UI 与额外副标题。
  - `1786305497938913.webp`：包含小字、尺寸文字和条码。
  - `1786305530738513.webp`：包含额外英文、小字、条码与路牌；仅作为平台 img2img 清理输入。
- 最终审核：1024×1024 原图没有中文、伪中文、额外文字、条码、Logo 或 UI；160×160 缩略图中主标题、主角、学校暖光和家人剪影仍清楚可辨。

## 运行时玩家形象

- 玩家头像不是静态素材。游戏启动后读取当前用户 `head_url`，裁成 512×640 技术参考图，只在玩家执行镜头主要动作时传给 image-to-image。
- 参考脸唯一绑定到 PERSON A。阿禾、林岚、小宇、周岚、救援人员、孩子和动物显式列入排除身份，禁止脸部复制、交换或人兽混合。
- 2026-08-11 起，运行时图片默认通过 `https://game.aiwaves.tech/alteru-media/api/v1/images/generations` 生成；媒体服务再统一适配底层提供商。旧 Aigram transit 仅作为 `?media_backend=legacy` 的紧急回滚路径。
