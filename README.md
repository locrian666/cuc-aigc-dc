# AIGC DC · 中国传媒大学 AIGC 创意社官网

线上地址：https://cuc-aigc-dc.pages.dev

部署在 Cloudflare Pages，带一个简单的内容管理后台（`/manage`）。

## 目录

| 文件 | 作用 |
|---|---|
| `index.html` | 首页（花谷 3D 场景、探索入口、各内容页），单文件预构建 |
| `cuc-particles.js` | 探索入口卡片上的中传元素粒子图案 |
| `cms-public.js` | 前台从 `/api/content` 读取后台发布的内容并渲染 |
| `cms-admin.html` / `.js` / `.css` | 后台管理页面 |
| `_worker.js` / `_routes.json` | Cloudflare Pages Functions：登录、内容、上传接口 |
| `cms-seed.json` | 初始内容（后台为空时使用） |
| `media/` | 站内图片素材 |

## Cloudflare 配置

- KV 绑定 `CMS`：保存发布的内容与图片
- R2 绑定 `MEDIA`：保存音视频
- Secret `ADMIN_PASSWORD`：后台管理员密码（只在 Cloudflare 里配置，不要写进代码）

## 部署

把本目录所有文件打包成 zip，在 Cloudflare Pages 项目里新建部署并上传。重新部署不会清空后台发布的内容。
