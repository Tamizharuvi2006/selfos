import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { useWindowManagerStore, appRegistry } from './WindowManager';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
const categories = ['All', 'Utilities', 'Security', 'Media', 'AI'];
const LauncherGrid: React.FC = () => {
  const openWindow = useWindowManagerStore(s => s.openWindow);
  const [search, setSearch] = useState('');
  const [activeTab, setActiveTab] = useState('All');
  const filteredApps = useMemo(() => {
    return Object.entries(appRegistry)
      .filter(([appId]) => appId !== 'launcher') // Exclude the launcher itself
      .filter(([_, app]) => {
        const matchesCategory = activeTab === 'All' || app.category === activeTab;
        const matchesSearch = app.name.toLowerCase().includes(search.toLowerCase());
        return matchesCategory && matchesSearch;
      });
  }, [search, activeTab]);
  return (
    <div className="w-full h-full p-8 flex flex-col bg-transparent">
      <header className="mb-8">
        <h1 className="text-4xl font-bold text-foreground mb-4">Applications</h1>
        <Input
          placeholder="Search apps..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="max-w-sm"
        />
      </header>
      <Tabs value={activeTab} onValueChange={setActiveTab} className="flex flex-col flex-1">
        <TabsList>
          {categories.map(category => (
            <TabsTrigger key={category} value={category}>{category}</TabsTrigger>
          ))}
        </TabsList>
        <ScrollArea className="flex-1 mt-6">
          {filteredApps.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-8">
              {filteredApps.map(([appId, app]) => (
                <motion.div
                  key={appId}
                  onClick={() => openWindow(appId)}
                  className="flex flex-col items-center gap-3 cursor-pointer group"
                  whileHover={{ scale: 1.05, y: -5 }}
                  whileTap={{ scale: 0.95 }}
                  layout
                >
                  <div className="w-24 h-24 rounded-3xl shadow-lg group-hover:shadow-accent transition-shadow duration-200 p-2 bg-card/50">
                    <app.icon className="w-full h-full text-accent" />
                  </div>
                  <span className="text-sm font-medium text-foreground">{app.name}</span>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="flex items-center justify-center h-full text-muted-foreground">
              <p>No applications found.</p>
            </div>
          )}
        </ScrollArea>
      </Tabs>
    </div>
  );
};
export default LauncherGrid;