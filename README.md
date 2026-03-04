# Excel Graph Shower Web App

A full-stack web application designed to demonstrate the capabilities of `mcp-server-chart`. This app allows users to upload various file formats (Excel, PDF, Word, Images), extracts tabular data, and visualizes it using interactive charts.

## Features

- **Multi-format Support**: Upload Excel (.xlsx), PDF, Word (.docx), and Images.
- **Intelligent Parsing**:
  - Excel: Direct data extraction.
  - PDF/Word: Text and table structure extraction.
  - Image: OCR (Optical Character Recognition) using Tesseract.js.
- **Interactive Visualization**:
  - Bar, Line, Pie, Scatter, Radar, Heatmap charts.
  - Zoom, Pan, Tooltips, and Save as Image.
- **User Authentication**: Email/Password login via Supabase.

## Tech Stack

- **Frontend**: Next.js 14 (App Router), React, TypeScript, Tailwind CSS.
- **Visualization**: Apache ECharts (echarts-for-react).
- **Data Processing**: `xlsx`, `mammoth`, `pdfjs-dist`, `tesseract.js`.
- **Backend/Auth**: Supabase.

## Setup & Run Locally

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Configure Environment Variables**
   Create a `.env.local` file in the root directory:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```
   *Note: For testing without Supabase, the auth flow in the code will fail unless valid credentials are provided or the code is modified to bypass auth.*

3. **Run Development Server**
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000).

## Deployment

### Vercel (Recommended)

1. Push code to GitHub.
2. Import project into Vercel.
3. Set Environment Variables (`NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`) in Vercel Dashboard.
4. Deploy.

### Supabase Setup

1. Create a new Supabase project.
2. Enable Email Auth provider.
3. (Optional) Create a Storage bucket named `uploads` if you want to implement server-side file storage (current implementation processes files client-side for privacy and speed).

## Project Structure

```
/src
  /app          # Next.js App Router pages
    /auth       # Login/Register
    /dashboard  # Main application
  /components
    /charts     # ECharts wrappers
    /upload     # File upload logic
    /ui         # Reusable UI components
  /lib
    parsers.ts  # File parsing logic (OCR, Excel, etc.)
    supabase.ts # Supabase client
```

## Note on OCR and PDF Parsing
This demo uses client-side libraries (`tesseract.js`, `pdfjs-dist`) to keep the deployment simple and serverless-friendly. For production use with large files, consider moving parsing logic to a Node.js backend or Edge Functions.
