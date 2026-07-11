# Number Sense Practice

一个面向中学生的数感练习网站。直接打开 `index.html` 即可使用，不需要安装依赖或运行服务器。

## 内容结构

- 8 个分类，每个分类 10 题，共 80 题
- 每次只显示一道题
- 学生输入答案后可检查对错，也可以查看答案和策略解释
- 分类选择页、练习页、得分页、进度条、分数统计
- 随机顺序、暗色模式、计时器、正确动画、完成撒花
- 入口包含注册和密码登录
- 只有用户名 `Elven Zeng` 拥有教师权限
- Calendar view：老师按日期发布作业、上传课件文件；学生按日期查看作业并提交任意文件
- 老师可以查看自己上传的课件、学生提交的作业，并给出文字反馈

## 文件结构

- `index.html`
- `style.css`
- `script.js`

## 数据说明

练习记录、作业元数据和反馈保存在当前浏览器的本地存储中。上传的文件保存在当前浏览器的 IndexedDB 中。教师面板只能看到同一个浏览器中注册、练习和提交过的学生记录。

默认教师登录：

- Username: `Elven Zeng`
- Password: `Elven2026!`

## Cloudflare

本项目已补充 Cloudflare Workers 和 Pages 部署配置。详见 `CLOUDFLARE.md`。

你当前的 Cloudflare Worker 名称是 `numbersensepractice2`，推荐设置：

- Build command: `npm run build`
- Deploy command: `npx wrangler deploy`
