export enum AppMode {
  GENERATE = 'GENERATE',
  EDIT = 'EDIT',
  ANALYZE = 'ANALYZE',
}

export enum GenerationSize {
  OneK = '1K',
  TwoK = '2K',
  FourK = '4K',
}

export interface GeneratedContent {
  imageUrl?: string;
  text?: string;
}

export interface AppState {
  mode: AppMode;
  status: 'idle' | 'uploading' | 'processing' | 'success' | 'error';
  originalImage: string | null; // base64
  result: GeneratedContent | null;
  error: string | null;
  editPrompt: string;
  generationSize: GenerationSize;
}