# Cloudflare Pages 部署

这个项目是加拿大 Grade 10 数感训练的纯静态网页，适合部署到 Cloudflare Pages。

## 方式一：连接 GitHub 仓库

1. 打开 Cloudflare Dashboard。
2. 进入 Workers & Pages。
3. 选择 Create application > Pages > Connect to Git。
4. 选择仓库 `seveneleven2247/numbersense_practice`。
5. 构建设置：
   - Framework preset: None
   - Build command: `npm run build`
   - Build output directory: `dist`
6. 保存并部署。

以后推送到 GitHub 的 `main` 分支后，Cloudflare Pages 会自动重新部署。

## 方式二：本地直接上传

先登录 Cloudflare Wrangler：

```bash
npx wrangler login
```

然后在项目目录运行：

```bash
npm run cloudflare:deploy
```

部署完成后，Cloudflare 会给出一个 `*.pages.dev` 地址。

## 本地预览

```bash
npm run cloudflare:preview
```

## 数据提醒

学生答案仍然保存在浏览器本地存储中。换设备或换浏览器后，需要使用教师端的“导出记录 / 导入记录”同步。
