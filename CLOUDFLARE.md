# Cloudflare 部署

这个项目是 Number Sense Practice 的纯静态网页，核心文件是 `index.html`、`style.css`、`script.js`。你现在创建的是 Cloudflare Workers 项目 `numbersensepractice2`，优先按 Workers 部署。

## 推荐方式：Cloudflare Workers

进入 Cloudflare Dashboard 里这个项目：

`Workers & Pages > numbersensepractice2 > Settings > Builds`

确认设置：

- Git repository: `seveneleven2247/numbersense_practice`
- Production branch: `main`
- Root directory: 留空
- Build command: `npm run build`
- Deploy command: `npx wrangler deploy`
- Non-production deploy command: `npx wrangler versions upload`

然后重新部署最新的 `main` 分支。

项目里的 `wrangler.jsonc` 已经把 Worker 名称设为 `numbersensepractice2`，并把静态资源目录设为 `public`。

## 方式二：本地直接上传

先登录 Cloudflare Wrangler：

```bash
npx wrangler login
```

然后在项目目录运行：

```bash
npm run cloudflare:deploy
```

部署完成后，Cloudflare 会给出一个 `*.workers.dev` 地址。

## 备用方式：Cloudflare Pages

如果你新建的是 Pages 项目，而不是 Workers 项目，使用这些设置：

- Framework preset: None
- Build command: `npm run build`
- Build output directory: `public`

## 本地预览

```bash
npm run cloudflare:preview
```

## 如果之前部署失败

先确认你打开的是 Workers 还是 Pages：

- 如果 URL 里有 `/workers/services/view/numbersensepractice2`，按上面的 Workers 设置。
- 如果 URL 里是 Pages 项目，按备用的 Pages 设置。

这个项目不再使用 `_redirects` 的 `/* /index.html 200` 规则，因为 Workers 会在静态文件存在时也执行 `_redirects`，会导致 `script.js` 和 `style.css` 被重写成 HTML。SPA fallback 已经由 `wrangler.jsonc` 的 `assets.not_found_handling` 处理。

## 数据提醒

学生答案仍然保存在浏览器本地存储中。教师面板只能看到同一个浏览器中的学生记录。
