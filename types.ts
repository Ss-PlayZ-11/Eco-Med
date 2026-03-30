
export interface Diagnosis {
  plantName: string;
  isHealthy: boolean;
  disease: string | null;
  confidence: number;
  description: string;
  symptoms: string[];
  treatments: {
    organic: string[];
    chemical: string[];
  };
  prevention: string[];
}

export interface HistoryItem extends Diagnosis {
  id: string;
  timestamp: string;
  image: string; // base64 string of the image
}

export type View = 'home' | 'scan' | 'result' | 'history' | 'feedback' | 'settings' | 'terms' | 'intro';
export type Theme = 'light' | 'dark';

export interface AppSettings {
  soundEffects: boolean;
  autoSave: boolean;
}
