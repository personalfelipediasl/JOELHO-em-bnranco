import { LucideIcon } from 'lucide-react';

export type Language = 'pt' | 'en';

export interface LocalizedString {
  pt: string;
  en: string;
}

export interface LocalizedArray {
  pt: string[];
  en: string[];
}

export interface Exercise {
  id: string;
  name: LocalizedString;
  iconName: string; 
  shortDescription: LocalizedString;
  objective: LocalizedString;
  steps: LocalizedArray;
  quickFix: LocalizedString;
  compareTip: LocalizedString;
  videoUrl?: string;
  category: 'basic' | 'stabilization';
}

export interface UserData {
  favorites: string[]; 
  notes: Record<string, string>; 
  customPlans: Record<string, string>; 
  activeWorkout: string[]; 
}

export interface ReadyWorkout {
  id: string;
  title: LocalizedString;
  frequency: '2x' | '3x';
  sets: number;
  exercises: string[]; // IDs
}