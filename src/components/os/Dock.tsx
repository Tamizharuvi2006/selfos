import React from 'react';
import { motion } from 'framer-motion';
import { useWindowManagerStore, appRegistry } from './WindowManager';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
const DOCK_APPS = ['launcher', 'fileManager', 'terminal', 'aiHub'];
const Dock: React.FC = () => {
  const { openWindow, windows, restoreWindow } = useWindowManagerStore.getState();
  const activeWindowId = useWindowManagerStore(state => state.activeWindowId);
  const openWindows = useWindowManagerStore(state => state.windows);
  const isAppOpen = (appId: string) => Object.values(openWindows).some(w => w.appId === appId);
  const isAppActive = (appId: string) => {
    const activeWindow = activeWindowId ? openWindows[activeWindowId] : null;
    return activeWindow?.appId === appId;
  };
  const isAppMinimized = (appId: string) => Object.values(openWindows).some(w => w.appId === appId && w.isMinimized);
  const handleDockClick = (appId: string) => {
    const openWindowForApp = Object.values(windows).find(w => w.appId === appId);
    if (openWindowForApp?.isMinimized) {
      restoreWindow(openWindowForApp.id);
    } else {
      openWindow(appId);
    }
  };
  return (
    <div className="fixed bottom-6 left-0 right-0 flex justify-center pointer-events-none z-50">
      <TooltipProvider>
        <motion.div
          className="flex items-end h-20 p-2 space-x-2 pointer-events-auto bg-card/60 backdrop-blur-[20px] border border-white/10 rounded-2xl shadow-2xl"
        >
          {DOCK_APPS.map((appId) => {
            const app = appRegistry[appId];
            if (!app) return null;
            return (
              <Tooltip key={appId}>
                <TooltipTrigger asChild>
                  <div className="relative">
                    <motion.button
                      onClick={() => handleDockClick(appId)}
                      className="w-14 h-14 rounded-xl focus:outline-none focus:ring-2 focus:ring-accent"
                      whileHover={{ scale: 1.4, y: -10 }}
                      whileTap={{ scale: 0.9 }}
                      transition={{ type: 'spring', stiffness: 300, damping: 15 }}
                    >
                      <app.icon className="w-full h-full rounded-xl" />
                    </motion.button>
                    {(isAppOpen(appId) || isAppMinimized(appId)) && (
                      <motion.div
                        layoutId={`active-dot-${appId}`}
                        className={`absolute bottom-[-8px] left-1/2 -translate-x-1/2 w-2 h-2 rounded-full ${isAppActive(appId) ? 'bg-accent' : 'bg-muted-foreground'}`}
                      />
                    )}
                  </div>
                </TooltipTrigger>
                <TooltipContent>
                  <p>{app.name}</p>
                </TooltipContent>
              </Tooltip>
            );
          })}
        </motion.div>
      </TooltipProvider>
    </div>
  );
};
export default Dock;