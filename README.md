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
- Calendar view：老师按日期分别上传 Notes 和 Homework
- 学生端分为 Download Notes、Download Homework、Upload Homework 三个区块
- 老师可以查看自己上传的笔记/作业文件、学生提交的作业文件
- 老师可以按学生单独修改交作业状态，并写 1v1 private comment
- 学生只能在自己的账号里看到老师给自己的状态和 comment

## 文件结构

- `index.html`
- `style.css`
- `script.js`

## 数据说明

练习记录、作业元数据、状态和 comment 保存在当前浏览器的本地存储中。上传的文件保存在当前浏览器的 IndexedDB 中。教师面板只能看到同一个浏览器中注册、练习和提交过的学生记录。学生界面只显示当前登录学生自己的提交状态和 1v1 comment。

默认教师登录：

- Username: `Elven Zeng`
- Password: `Elven2026!`

## Cloudflare

本项目已补充 Cloudflare Workers 和 Pages 部署配置。详见 `CLOUDFLARE.md`。

你当前的 Cloudflare Worker 名称是 `numbersensepractice2`，推荐设置：

- Build command: `npm run build`
- Deploy command: `npx wrangler deploy`
