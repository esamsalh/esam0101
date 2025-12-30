
export interface TableCell {
  content: string;
  isHeader?: boolean;
  colSpan?: number;
  rowSpan?: number;
}

export interface TableRow {
  cells: TableCell[];
}

export interface ExtractedTable {
  title?: string;
  rows: TableRow[];
}

export interface TextBlock {
  content: string;
  type: 'paragraph' | 'heading' | 'list-item';
  alignment: 'rtl' | 'ltr';
}

export interface OCRResult {
  id: string;
  fileName: string;
  previewUrl: string;
  status: 'pending' | 'processing' | 'completed' | 'error';
  error?: string;
  data?: {
    blocks: (TextBlock | ExtractedTable)[];
    rawText: string;
  };
}

export type Language = 'ar' | 'en';
