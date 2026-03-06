# Vercel 部署指南 (零基础版)

本指南将教你如何将 **Excel Graph Shower** 免费发布到互联网上，让你的领导可以通过网址直接访问。

## 准备工作

1.  **GitHub 账号**：如果没有，请先去 [github.com](https://github.com/) 注册一个。
2.  **Vercel 账号**：去 [vercel.com](https://vercel.com/)，建议直接选择 **"Continue with GitHub"** 登录。

---

## 第一步：将代码推送到 GitHub

1.  **登录 GitHub**，点击右上角的 **+** 号 -> **New repository**。
2.  **Repository name**：填写 `excel-graph-shower` (或者你喜欢的名字)。
3.  **Privacy**：选择 **Public** (公开) 或 **Private** (私有) 都可以（Private 更安全，Vercel 也支持）。
4.  点击 **Create repository**。
5.  你会看到一个页面，上面有一些命令。请复制 **"…or push an existing repository from the command line"** 下面的那两行命令，通常长这样：
    ```bash
    git remote add origin https://github.com/你的用户名/excel-graph-shower.git
    git branch -M main
    git push -u origin main
    ```
6.  **回到 Trae 的终端**，粘贴并运行这三行命令。
    *   *注意：如果是第一次使用，可能会弹出窗口让你登录 GitHub，按提示操作即可。*

---

## 第二步：在 Vercel 上导入项目

1.  登录 **Vercel Dashboard**。
2.  点击 **"Add New..."** -> **"Project"**。
3.  在左侧列表中找到你刚才创建的 GitHub 仓库 (`excel-graph-shower`)，点击 **Import**。

---

## 第三步：配置环境变量 (关键！)

在 **Configure Project** 页面，往下滚动找到 **Environment Variables** 部分。你需要把本地 `.env.local` 里的三个值填进去：

| Key (键) | Value (值) |
| :--- | :--- |
| `NEXT_PUBLIC_SUPABASE_URL` | `https://vfyptmyzolgbvvzeohwy.supabase.co` |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | `sb_publishable_...` (填你文件里那一长串) |
| `GLM_API_KEY` | `6e8dae87...` (填你的智谱 Key) |

*操作提示：填好一组 Key 和 Value 后，点击 **Add**，然后再填下一组，直到三个都填完。*

---

## 第四步：开始部署

1.  环境变量填完后，点击底部的 **Deploy** 按钮。
2.  等待约 1-2 分钟，你会看到满屏的彩带 🎉。
3.  点击 **"Continue to Dashboard"**，然后点击 **"Visit"**。

**恭喜！你获得了一个永久的网址（例如 `https://excel-graph-shower.vercel.app`），现在可以把这个链接发给领导了！**
