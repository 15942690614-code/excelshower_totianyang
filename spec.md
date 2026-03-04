# Project Spec: Excel Graph Shower Web App

## 1. Overview
A full-stack web application for file upload, data extraction, and interactive chart visualization, based on `mcp-server-chart` capabilities. The app supports Excel, PDF, Word, and Image formats, extracts tabular data, and visualizes it using interactive charts. It includes user authentication via Supabase.

## 2. Tech Stack
- **Frontend**: Next.js 14+ (App Router), React, TypeScript, Tailwind CSS, Framer Motion (animations), Lucide React (icons).
- **Visualization**: Apache ECharts (via `echarts-for-react`) for interactive charts (bar, line, pie, scatter, radar, heatmap).
- **Data Processing**:
  - `xlsx` (SheetJS): Excel parsing.
  - `mammoth`: Word document parsing.
  - `pdfjs-dist`: PDF parsing.
  - `tesseract.js`: OCR for images.
- **Backend/Auth/Storage**: Supabase (PostgreSQL, Auth, Storage).
- **Deployment target**: Vercel.

## 3. Core Features & Requirements

### 3.1 File Upload
- Drag-and-drop interface.
- Supported formats: `.xls`, `.xlsx`, `.jpg`, `.png`, `.pdf`, `.docx`.
- Client-side validation (size < 50MB, max 10 files).
- Progress bar UI.

### 3.2 Data Extraction (Client-side/Server-side hybrid)
- **Excel**: Parse rows/cols directly.
- **Image**: OCR scan for table-like structures (simplified for demo: extract text blocks).
- **PDF**: Text extraction (simplified table detection).
- **Word**: Text/Table extraction.
- **Data Cleaning**: Remove empty rows, detect header row, infer column types (number/string/date).

### 3.3 Visualization Dashboard
- **Chart Types**: Bar, Line, Pie, Scatter, Radar, Heatmap.
- **Interactivity**: Zoom, tooltip, legend toggle.
- **Customization**: Title, axis labels, color theme.
- **Export**: Save as PNG/SVG (built-in ECharts feature).

### 3.4 User System
- Login/Register with Email (Supabase Auth).
- Protected routes (Dashboard requires login).

## 4. File Structure
```
/src
  /app
    /auth          # Login/Register pages
    /dashboard     # Main app interface
    /api           # API routes (if needed for proxying)
    page.tsx       # Landing page
    layout.tsx     # Root layout with providers
  /components
    /ui            # Reusable UI components (Button, Input, Card)
    /charts        # ECharts wrapper components
    /upload        # File upload area
    /preview       # Data table preview
  /lib
    supabase.ts    # Supabase client
    parsers.ts     # File parsing logic (Excel, PDF, OCR)
    utils.ts       # Helper functions
  /types           # TypeScript interfaces
```

## 5. Implementation Steps
1. **Setup**: Initialize Next.js, install deps. (Done)
2. **UI Foundation**: Create layout, navbar, and basic UI components.
3. **Auth**: Implement Supabase Auth (Login/Register).
4. **File Parsing**: Implement `parsers.ts` for different file types.
5. **Upload & Preview**: Build the upload component and data grid.
6. **Visualization**: Integrate ECharts and connect to parsed data.
7. **Refinement**: Add styling, animations, and error handling.
