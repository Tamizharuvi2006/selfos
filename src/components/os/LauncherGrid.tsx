import React from 'react';
import { motion } from 'framer-motion';
import { useWindowManagerStore, appRegistry } from './WindowManager';
const LauncherGrid: React.FC = () => {
  const openWindow = useWindowManagerStore(s => s.openWindow);
  return (
    <div className="w-full h-full p-8 overflow-y-auto bg-transparent">
      <h1 className="text-4xl font-bold text-foreground mb-8">Applications</h1>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-8">
        {Object.entries(appRegistry).map(([appId, app]) => (
          <motion.div
            key={appId}
            onClick={() => openWindow(appId)}
            className="flex flex-col items-center gap-3 cursor-pointer group"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <div className="w-24 h-24 rounded-3xl shadow-lg group-hover:shadow-accent transition-shadow duration-200">
              <app.icon className="w-full h-full rounded-3xl" />
            </div>
            <span className="text-sm font-medium text-foreground">{app.name}</span>
          </motion.div>
        ))}
      </div>
    </div>
  );
};
export default LauncherGrid;