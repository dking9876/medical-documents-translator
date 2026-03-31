export type TranslationStatus = 'pending' | 'processing' | 'completed' | 'error';

export interface TranslationSection {
  heading: string;
  original_text: string;
  simplified_text: string;
  confidence: 'high' | 'medium' | 'low';
}

export interface SimplifiedContent {
  document_type: string;
  summary: string;
  sections: TranslationSection[];
  disclaimer: string;
}

export interface Translation {
  id: string;
  original_file_path: string;
  original_filename: string;
  page_count: number | null;
  status: TranslationStatus;
  simplified_content: SimplifiedContent | null;
  error_message: string | null;
  processing_time_ms: number | null;
  created_at: string;
  updated_at: string;
}
