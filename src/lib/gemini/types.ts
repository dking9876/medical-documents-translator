export interface GeminiSection {
  heading: string;
  original_text: string;
  simplified_text: string;
  confidence: 'high' | 'medium' | 'low';
}

export interface GeminiResponse {
  document_type: string;
  summary: string;
  sections: GeminiSection[];
  disclaimer: string;
}
