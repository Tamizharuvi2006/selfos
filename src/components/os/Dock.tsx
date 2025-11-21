import React from 'react';
import { motion } from 'framer-motion';
import { useWindowManagerStore } from '@/stores/windowStore';
import { appRegistry } from '@/components/os/appRegistry';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
const DOCK_APPS = ['launcher', 'fileManager', 'photoManager', 'terminal', 'aiHub', 'cybersecuritySuite'];
const Dock: React.FC = () => {
  const openWindow = useWindowManagerStore(s => s.openWindow);
  const windows = useWindowManagerStore(s => s.windows);
  const activeWindowId = useWindowManagerStore(s => s.activeWindowId);
  const restoreWindow = useWindowManagerStore(s => s.restoreWindow);
  const isAppOpen = (appId: string) => Object.values(windows).some(w => w.appId === appId);
  const isAppActive = (appId: string) => {
    const activeWindow = activeWindowId ? windows[activeWindowId] : null;
    return activeWindow?.appId === appId && !activeWindow.isMinimized;
  };
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
            const isOpen = isAppOpen(appId);
            const isActive = isAppActive(appId);
            return (
              <Tooltip key={appId}>
                <TooltipTrigger asChild>
                  <div className="relative flex flex-col items-center">
                    <motion.button
                      onClick={() => handleDockClick(appId)}
                      className="w-14 h-14 rounded-xl focus:outline-none focus:ring-2 focus:ring-accent"
                      whileHover={{ scale: 1.4, y: -10 }}
                      whileTap={{ scale: 0.9 }}
                      transition={{ type: 'spring', stiffness: 300, damping: 15 }}
                    >
                      <app.icon className="w-full h-full rounded-xl p-1" />
                    </motion.button>
                    {isOpen && (
                      <motion.div
                        layoutId={`active-dot-${appId}`}
                        className={`absolute bottom-[-8px] w-1.5 h-1.5 rounded-full ${isActive ? 'bg-accent' : 'bg-muted-foreground'}`}
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