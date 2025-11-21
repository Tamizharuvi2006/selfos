import React from 'react';
import { Grid, Folder, TerminalSquare, Bot, Image as ImageIcon, ShieldCheck } from 'lucide-react';
import LauncherGrid from './LauncherGrid';
import FileManager from '../apps/FileManager';
import PhotoManager from '../apps/PhotoManager';
import Terminal from '../apps/Terminal';
import AIHub from '../apps/AIHub';
import CybersecuritySuite from '../apps/CybersecuritySuite';
export interface AppRegistration {
  name: string;
  icon: React.FC<{ className?: string }>;
  component: React.FC<any>;
  defaultSize: { width: number; height: number };
  category: 'Utilities' | 'Security' | 'Media' | 'AI';
}
export const appRegistry: Record<string, AppRegistration> = {
  launcher: { name: 'App Launcher', icon: Grid, component: LauncherGrid, defaultSize: { width: 800, height: 600 }, category: 'Utilities' },
  fileManager: { name: 'File Manager', icon: Folder, component: FileManager, defaultSize: { width: 800, height: 600 }, category: 'Utilities' },
  photoManager: { name: 'Photo Manager', icon: ImageIcon, component: PhotoManager, defaultSize: { width: 900, height: 650 }, category: 'Media' },
  terminal: { name: 'Terminal', icon: TerminalSquare, component: Terminal, defaultSize: { width: 700, height: 450 }, category: 'Security' },
  aiHub: { name: 'AI Hub', icon: Bot, component: AIHub, defaultSize: { width: 500, height: 700 }, category: 'AI' },
  cybersecuritySuite: { name: 'Cybersecurity Suite', icon: ShieldCheck, component: CybersecuritySuite, defaultSize: { width: 1000, height: 700 }, category: 'Security' },
};