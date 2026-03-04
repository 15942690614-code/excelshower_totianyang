export interface ParsedData {
  fileName: string;
  fileType: 'excel' | 'pdf' | 'word' | 'image';
  headers: string[];
  rows: any[];
  fullText?: string; // Optional field for raw text content
}

export interface ChartConfig {
  type: 'bar' | 'line' | 'pie' | 'scatter' | 'radar' | 'heatmap';
  xAxisField?: string;
  yAxisField?: string;
  title: string;
}
