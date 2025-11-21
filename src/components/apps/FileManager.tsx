import React, { useState } from 'react';
import { Folder, File, Image as ImageIcon, Music, LayoutGrid, List } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import filesData from '@/mock-data/files.json';
import { cn } from '@/lib/utils';
const getFileIcon = (type: string) => {
  switch (type) {
    case 'folder': return <Folder className="w-full h-full text-sky-400" fill="currentColor" fillOpacity="0.2" />;
    case 'image': return <ImageIcon className="w-full h-full text-purple-400" />;
    case 'audio': return <Music className="w-full h-full text-pink-400" />;
    default: return <File className="w-full h-full text-gray-400" />;
  }
};
const FileManager: React.FC = () => {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  return (
    <div className="flex flex-col h-full bg-card text-card-foreground">
      <header className="flex items-center justify-between p-2 border-b">
        <div className="text-sm text-muted-foreground">/Users/SelfOS/Desktop</div>
        <div>
          <Button variant="ghost" size="icon" onClick={() => setViewMode('grid')} className={cn({ 'bg-accent': viewMode === 'grid' })}>
            <LayoutGrid className="w-4 h-4" />
          </Button>
          <Button variant="ghost" size="icon" onClick={() => setViewMode('list')} className={cn({ 'bg-accent': viewMode === 'list' })}>
            <List className="w-4 h-4" />
          </Button>
        </div>
      </header>
      <ScrollArea className="flex-1">
        {viewMode === 'grid' ? (
          <div className="p-4 grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-4">
            {filesData.map(file => (
              <div key={file.id} className="flex flex-col items-center gap-2 p-2 rounded-md hover:bg-accent cursor-pointer">
                <div className="w-16 h-16">{getFileIcon(file.type)}</div>
                <p className="text-xs text-center truncate w-full">{file.name}</p>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-2">
            <div className="grid grid-cols-[1fr_100px_150px] gap-2 text-xs text-muted-foreground px-2 py-1 border-b">
              <span>Name</span>
              <span>Size</span>
              <span>Last Modified</span>
            </div>
            {filesData.map(file => (
              <div key={file.id} className="grid grid-cols-[24px_1fr_100px_150px] items-center gap-2 px-2 py-2 rounded-md hover:bg-accent cursor-pointer">
                <div className="w-4 h-4">{getFileIcon(file.type)}</div>
                <span className="truncate">{file.name}</span>
                <span className="text-xs text-muted-foreground">{file.size || '��'}</span>
                <span className="text-xs text-muted-foreground">{new Date(file.modified).toLocaleString()}</span>
              </div>
            ))}
          </div>
        )}
      </ScrollArea>
    </div>
  );
};
export default FileManager;