# Tasks

- [ ] Project Setup @todo-setup
    - [x] Create Next.js App
    - [x] Install dependencies (`supabase`, `echarts`, `xlsx`, etc.)
    - [ ] Configure `src/lib/supabase.ts` (mock/env setup)
    - [ ] Create basic Layout (Header, Footer, Sidebar)

- [ ] Authentication Module @todo-auth
    - [ ] Create `/auth/login` page
    - [ ] Create `/auth/register` page
    - [ ] Implement Supabase Auth hook/context

- [ ] File Upload & Parsing Module @todo-upload
    - [ ] Create `FileUploader` component (drag-and-drop)
    - [ ] Implement `src/lib/parsers.ts`
        - [ ] Excel Parser (`xlsx`)
        - [ ] Image Parser (`tesseract.js`)
        - [ ] PDF Parser (`pdfjs-dist`)
        - [ ] Word Parser (`mammoth`)
    - [ ] Create `DataPreview` component (table view)

- [ ] Visualization Module @todo-viz
    - [ ] Create generic `ChartRenderer` component (ECharts wrapper)
    - [ ] Implement specific chart type configs (Bar, Line, Pie, etc.)
    - [ ] Add chart controls (Type selector, Axis selector)

- [ ] Dashboard Integration @todo-dashboard
    - [ ] Assemble Upload -> Preview -> Chart flow
    - [ ] Add responsiveness and styling

- [ ] Documentation & Cleanup @todo-docs
    - [ ] Write README.md
    - [ ] Create Vercel deployment guide
