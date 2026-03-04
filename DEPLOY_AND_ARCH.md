# 架构说明：MCP 与大模型集成

## 1. 当前实现逻辑 (Web 应用层)
目前的 **Excel Graph Shower** 是一个**功能演示级的前端应用**，它的核心能力（文件解析、图表渲染）是**直接在浏览器端**通过 JavaScript 库（`xlsx`, `echarts`, `tesseract.js`）实现的。

**这意味着：**
- 当前**没有**实时调用远程大模型 API。
- “智能解析”是通过代码规则（如正则匹配、格式识别）模拟的。
- 这样做的好处是：响应极快、无需 API Key、完全免费、隐私安全（数据不离线）。

## 2. MCP (Model Context Protocol) 的角色
在 Trae IDE 的开发过程中，我（AI 助手）作为 Agent，使用了 `mcp-server-chart` 提供的**工具定义（Schema）**来理解如何生成图表代码。

- **开发阶段**：我调用了 MCP 协议定义的知识，为你生成了正确的 ECharts 配置代码。
- **运行阶段**：生成的 Web 应用是独立的，用户在使用时不再依赖 MCP 服务，也不依赖大模型。

## 3. 如果需要“真正的”大模型能力
如果你希望系统能像 ChatGPT 一样**“读懂”**复杂的非结构化数据（例如：“帮我分析这个 Excel 里的销售趋势”），则需要进行以下改造：

1.  **后端服务**：创建一个 Node.js/Python 后端。
2.  **接入模型**：在后端集成 OpenAI (GPT-4) 或 Anthropic (Claude 3) 的 API。
3.  **API Key**：你需要购买相应的 API Key 并配置在后端环境变量中。

**当前演示版不需要你提供任何 API Key。**

---

# 部署指南：发布给领导访问

## 方案 A：使用 Vercel 一键发布（推荐）

这是最快、最稳定的方式，支持全球访问。

### 1. 准备代码
确保你已经把代码推送到 GitHub（如果还没做，请在终端执行以下命令）：
```bash
# 初始化 git
git init
git add .
git commit -m "Ready for deploy"

# 关联你的 GitHub 仓库（先去 GitHub 建一个空仓库）
git remote add origin https://github.com/你的用户名/你的仓库名.git
git branch -M main
git push -u origin main
```

### 2. 在 Vercel 上部署
1.  访问 [Vercel.com](https://vercel.com) 并登录。
2.  点击 **"Add New..."** -> **"Project"**。
3.  导入你刚才的 GitHub 仓库。
4.  **关键步骤：配置环境变量**
    在 "Environment Variables" 区域，填入你的 Supabase 配置：
    - `NEXT_PUBLIC_SUPABASE_URL`: (你的 URL)
    - `NEXT_PUBLIC_SUPABASE_ANON_KEY`: (你的 Anon Key)
5.  点击 **Deploy**。

等待 1 分钟，Vercel 会生成一个类似 `https://excel-graph-shower.vercel.app` 的网址。**把这个网址发给领导即可。**

## 方案 B：本地局域网访问（仅限同一办公室）

如果不想部署到公网，且你和领导在同一个 WiFi 下：

1.  在你的电脑终端运行：
    ```bash
    npm run dev
    ```
2.  查看终端输出的 `Network` 地址，通常是 `http://192.168.x.x:3000`。
3.  把这个 IP 地址发给领导，他可以直接在浏览器访问。
    *注意：你的电脑不能关机，且必须在同一局域网。*
