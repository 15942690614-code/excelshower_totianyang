# Excel Graph Shower 📊

一个基于 Next.js 的智能数据可视化平台，支持 Excel、PDF、图片等多模态文件解析，并集成 GLM-4 大模型进行智能数据提取。

## ✨ 核心功能

*   **多格式支持**：直接上传 `.xlsx`, `.csv`, `.pdf`, `.png`, `.jpg` 文件。
*   **智能解析**：
    *   Excel/CSV：基于规则的自动解析。
    *   PDF/图片：集成 **GLM-4 (智谱AI)** 多模态模型，自动提取非结构化表格数据。
*   **交互式图表**：
    *   支持 柱状图、折线图、饼图、散点图、雷达图、热力图。
    *   **自定义维度/指标**：自由选择 X 轴和 Y 轴字段。
    *   **智能聚合**：自动对相同维度的数据进行求和汇总。
*   **安全认证**：集成 Supabase Auth，支持邮箱注册/登录。

## 🛠️ 技术栈

*   **前端框架**: Next.js 14 (App Router) + React
*   **UI 组件**: Tailwind CSS + Lucide Icons
*   **图表库**: ECharts (echarts-for-react)
*   **后端服务**: Next.js API Routes
*   **数据库/认证**: Supabase
*   **大模型**: ZhipuAI (GLM-4)

## 🚀 本地运行指南

1.  **克隆项目**
    ```bash
    git clone <your-repo-url>
    cd chart-web-app
    ```

2.  **安装依赖**
    ```bash
    npm install
    ```

3.  **配置环境变量**
    复制 `.env.local` 并填入你的 Key：
    ```env
    NEXT_PUBLIC_SUPABASE_URL=你的_Supabase_URL
    NEXT_PUBLIC_SUPABASE_ANON_KEY=你的_Supabase_Anon_Key
    GLM_API_KEY=你的_智谱AI_Key
    ```

4.  **启动开发服务器**
    ```bash
    npm run dev
    ```
    访问 http://localhost:3000

## 📦 部署 (Vercel)

本项目完美适配 Vercel 部署。详细步骤请参考 [DEPLOY_GUIDE.md](./DEPLOY_GUIDE.md)。
