import { create } from 'zustand';
import { persist } from 'zustand/middleware';
export type ThemeName = 'Neon Hacker' | 'Cyberpunk' | 'Parrot Green' | 'Kali Dark' | 'Minimal KEI' | 'Vision Glass';
interface ThemeConfig {
  '--background': string;
  '--foreground': string;
  '--primary': string;
  '--primary-foreground': string;
  '--muted': string;
  '--muted-foreground': string;
  '--accent': string;
  '--accent-foreground': string;
  '--border': string;
  '--card': string;
  '--card-foreground': string;
  '--neon-cyan': string;
  '--neon-magenta': string;
}
export const themes: Record<ThemeName, ThemeConfig> = {
  'Neon Hacker': {
    '--background': 'hsl(220 40% 5%)',
    '--foreground': 'hsl(150 100% 70%)',
    '--primary': 'hsl(150 100% 70%)',
    '--primary-foreground': 'hsl(220 40% 5%)',
    '--muted': 'hsl(220 40% 10%)',
    '--muted-foreground': 'hsl(150 100% 50%)',
    '--accent': 'hsl(220 40% 15%)',
    '--accent-foreground': 'hsl(150 100% 70%)',
    '--border': 'hsl(150 100% 20%)',
    '--card': 'hsl(220 40% 8%)',
    '--card-foreground': 'hsl(150 100% 70%)',
    '--neon-cyan': 'hsl(180 100% 50%)',
    '--neon-magenta': 'hsl(150 100% 50%)',
  },
  'Cyberpunk': {
    '--background': 'hsl(240 10% 4%)', // #161717
    '--foreground': 'hsl(0 0% 98%)',
    '--primary': 'hsl(325 100% 58%)', // #FF2D95
    '--primary-foreground': 'hsl(0 0% 100%)',
    '--muted': 'hsl(240 10% 10%)',
    '--muted-foreground': 'hsl(0 0% 60%)',
    '--accent': 'hsl(173 100% 50%)', // #00FFE1
    '--accent-foreground': 'hsl(240 10% 4%)',
    '--border': 'hsl(325 100% 28%)',
    '--card': 'hsl(240 10% 6%)',
    '--card-foreground': 'hsl(0 0% 98%)',
    '--neon-cyan': 'hsl(173 100% 50%)',
    '--neon-magenta': 'hsl(325 100% 58%)',
  },
  'Parrot Green': {
    '--background': 'hsl(0 0% 8%)',
    '--foreground': 'hsl(80 100% 80%)',
    '--primary': 'hsl(80 100% 50%)',
    '--primary-foreground': 'hsl(0 0% 0%)',
    '--muted': 'hsl(0 0% 12%)',
    '--muted-foreground': 'hsl(80 100% 60%)',
    '--accent': 'hsl(180 100% 50%)',
    '--accent-foreground': 'hsl(0 0% 0%)',
    '--border': 'hsl(80 100% 20%)',
    '--card': 'hsl(0 0% 10%)',
    '--card-foreground': 'hsl(80 100% 80%)',
    '--neon-cyan': 'hsl(180 100% 50%)',
    '--neon-magenta': 'hsl(80 100% 50%)',
  },
  'Kali Dark': {
    '--background': 'hsl(220 13% 10%)',
    '--foreground': 'hsl(0 0% 95%)',
    '--primary': 'hsl(205 90% 50%)',
    '--primary-foreground': 'hsl(0 0% 100%)',
    '--muted': 'hsl(220 13% 15%)',
    '--muted-foreground': 'hsl(0 0% 70%)',
    '--accent': 'hsl(205 90% 40%)',
    '--accent-foreground': 'hsl(0 0% 100%)',
    '--border': 'hsl(205 90% 25%)',
    '--card': 'hsl(220 13% 12%)',
    '--card-foreground': 'hsl(0 0% 95%)',
    '--neon-cyan': 'hsl(205 90% 50%)',
    '--neon-magenta': 'hsl(340 90% 50%)',
  },
  'Minimal KEI': {
    '--background': 'hsl(0 0% 98%)',
    '--foreground': 'hsl(0 0% 10%)',
    '--primary': 'hsl(0 0% 10%)',
    '--primary-foreground': 'hsl(0 0% 98%)',
    '--muted': 'hsl(0 0% 94%)',
    '--muted-foreground': 'hsl(0 0% 40%)',
    '--accent': 'hsl(0 0% 90%)',
    '--accent-foreground': 'hsl(0 0% 10%)',
    '--border': 'hsl(0 0% 88%)',
    '--card': 'hsl(0 0% 100%)',
    '--card-foreground': 'hsl(0 0% 10%)',
    '--neon-cyan': 'hsl(200 100% 50%)',
    '--neon-magenta': 'hsl(330 100% 50%)',
  },
  'Vision Glass': {
    '--background': 'hsl(210 20% 95%)',
    '--foreground': 'hsl(210 20% 10%)',
    '--primary': 'hsl(210 100% 50%)',
    '--primary-foreground': 'hsl(0 0% 100%)',
    '--muted': 'hsl(210 20% 98%)',
    '--muted-foreground': 'hsl(210 20% 40%)',
    '--accent': 'hsl(210 20% 90%)',
    '--accent-foreground': 'hsl(210 20% 10%)',
    '--border': 'hsl(210 20% 85%)',
    '--card': 'hsl(210 20% 100%)',
    '--card-foreground': 'hsl(210 20% 10%)',
    '--neon-cyan': 'hsl(210 100% 50%)',
    '--neon-magenta': 'hsl(340 100% 50%)',
  },
};
interface ThemeState {
  theme: ThemeName;
  accentColor: string;
  glowIntensity: number;
  blurDepth: number;
  setTheme: (theme: ThemeName) => void;
  setAccentColor: (color: string) => void;
  setGlowIntensity: (intensity: number) => void;
  setBlurDepth: (depth: number) => void;
  applyTheme: () => void;
}
export const useThemeStore = create<ThemeState>()(
  persist(
    (set, get) => ({
      theme: 'Cyberpunk',
      accentColor: '#00FFE1',
      glowIntensity: 0.7,
      blurDepth: 20,
      setTheme: (theme) => set({ theme }),
      setAccentColor: (color) => set({ accentColor: color }),
      setGlowIntensity: (intensity) => set({ glowIntensity: Math.max(0, Math.min(1, intensity)) }),
      setBlurDepth: (depth) => set({ blurDepth: Math.max(0, depth) }),
      applyTheme: () => {
        const { theme, accentColor, glowIntensity } = get();
        const root = document.documentElement;
        const themeConfig = themes[theme];
        Object.entries(themeConfig).forEach(([key, value]) => {
          root.style.setProperty(key, value);
        });
        root.style.setProperty('--accent', accentColor);
        root.style.setProperty('--glow-intensity', glowIntensity.toString());
      },
    }),
    {
      name: 'selfos-theme-storage',
    }
  )
);
export function applyCurrentTheme() {
  useThemeStore.getState().applyTheme();
}