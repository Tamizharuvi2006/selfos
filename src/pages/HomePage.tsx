import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Wifi, Battery, Volume2, Settings } from 'lucide-react';
import ParticleBackground from '@/lib/particles';
import WindowManager from '@/components/os/WindowManager';
import Dock from '@/components/os/Dock';
import BootScreen from '@/components/BootScreen';
import { applyCurrentTheme, useThemeStore, ThemeName, themes } from '@/lib/themeEngine';
import { useWindowManagerStore } from '@/stores/windowStore';
import { Toaster } from '@/components/ui/sonner';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
const NeonClock = () => {
  const [time, setTime] = useState(new Date());
  useEffect(() => {
    const timerId = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timerId);
  }, []);
  return (
    <div className="text-center font-mono text-foreground">
      <div className="text-5xl sm:text-7xl md:text-9xl font-bold" style={{ textShadow: '0 0 10px hsl(var(--accent)), 0 0 20px hsl(var(--accent))' }}>
        {time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
      </div>
      <div className="text-lg md:text-2xl mt-2 tracking-widest">
        {time.toLocaleDateString([], { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
      </div>
    </div>
  );
};
const ThemeCustomizer = () => {
  const { theme, accentColor, glowIntensity, blurDepth, setTheme, setAccentColor, setGlowIntensity, setBlurDepth } = useThemeStore();
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="text-foreground/80 hover:text-foreground">
          <Settings size={18} />
        </Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Theme Settings</SheetTitle>
        </SheetHeader>
        <div className="space-y-6 py-6">
          <div className="space-y-2">
            <Label>Theme Preset</Label>
            <Select value={theme} onValueChange={(value: ThemeName) => setTheme(value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select a theme" />
              </SelectTrigger>
              <SelectContent>
                {Object.keys(themes).map(name => (
                  <SelectItem key={name} value={name}>{name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Accent Color</Label>
            <Input type="color" value={accentColor} onChange={(e) => setAccentColor(e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label>Glow Intensity: {Math.round(glowIntensity * 100)}%</Label>
            <Slider value={[glowIntensity]} onValueChange={([v]) => setGlowIntensity(v)} max={1} step={0.05} />
          </div>
          <div className="space-y-2">
            <Label>Blur Depth: {blurDepth}px</Label>
            <Slider value={[blurDepth]} onValueChange={([v]) => setBlurDepth(v)} max={40} step={1} />
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};
const SystemTray = () => (
  <div className="absolute top-4 right-4 flex items-center gap-4 text-foreground/80 text-sm z-50">
    <Volume2 size={18} />
    <Wifi size={18} />
    <div className="flex items-center gap-1">
      <Battery size={18} />
      <span>98%</span>
    </div>
    <ThemeCustomizer />
  </div>
);
const MoodChips = () => (
  <div className="flex justify-center gap-4 mt-8">
    <motion.div whileHover={{ scale: 1.1 }} className="px-4 py-2 border border-accent rounded-full text-accent text-sm cursor-pointer">
      Focused
    </motion.div>
    <motion.div whileHover={{ scale: 1.1 }} className="px-4 py-2 border border-foreground/30 rounded-full text-foreground/60 text-sm cursor-pointer">
      Creative
    </motion.div>
    <motion.div whileHover={{ scale: 1.1 }} className="px-4 py-2 border border-foreground/30 rounded-full text-foreground/60 text-sm cursor-pointer">
      Relaxed
    </motion.div>
  </div>
);
export function HomePage() {
  const themeState = useThemeStore();
  const [isBooting, setIsBooting] = useState(true);
  const openWindow = useWindowManagerStore(s => s.openWindow);
  useEffect(() => {
    applyCurrentTheme();
  }, [themeState]);
  useEffect(() => {
    const bootTimer = setTimeout(() => {
      setIsBooting(false);
      toast.success('System Initialized', { description: 'Welcome to SelfOS.' });
    }, 3000);
    return () => clearTimeout(bootTimer);
  }, []);
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.code === 'Space') {
        e.preventDefault();
        openWindow('launcher');
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [openWindow]);
  return (
    <div className="h-screen w-screen overflow-hidden bg-background text-foreground font-sans transition-all duration-500">
      <AnimatePresence>
        {isBooting && <BootScreen onComplete={() => setIsBooting(false)} />}
      </AnimatePresence>
      <ParticleBackground />
      <SystemTray />
      <main className="h-full w-full flex items-center justify-center">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-8 md:py-10 lg:py-12 text-center">
            <NeonClock />
            <MoodChips />
          </div>
        </div>
      </main>
      <WindowManager />
      <Dock />
      <footer className="absolute bottom-2 left-0 right-0 text-center text-xs text-muted-foreground/50">
        <p>AI usage: requests to Cloudflare AI Gateway are rate-limited; usage across all apps may be capped.</p>
        <p>Built with ❤️ at Cloudflare</p>
      </footer>
      <Toaster richColors closeButton theme={useThemeStore.getState().theme.includes('Minimal') ? 'light' : 'dark'} />
    </div>
  );
}