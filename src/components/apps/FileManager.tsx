import React, { useState } from 'react';
import { Folder, File, Image as ImageIcon, Music, LayoutGrid, List, MoreVertical, Edit, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { ContextMenu, ContextMenuContent, ContextMenuItem, ContextMenuTrigger } from '@/components/ui/context-menu';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import filesData from '@/mock-data/files.json';
import { cn } from '@/lib/utils';
const getFileIcon = (type: string, size: 'sm' | 'lg' = 'lg') => {
  const classNames = size === 'lg' ? "w-16 h-16" : "w-4 h-4";
  switch (type) {
    case 'folder': return <Folder className={`${classNames} text-sky-400`} fill="currentColor" fillOpacity="0.2" />;
    case 'image': return <ImageIcon className={`${classNames} text-purple-400`} />;
    case 'audio': return <Music className={`${classNames} text-pink-400`} />;
    default: return <File className={`${classNames} text-gray-400`} />;
  }
};
const FileManager: React.FC = () => {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [files, setFiles] = useState(filesData);
  const [selectedFile, setSelectedFile] = useState<typeof filesData[0] | null>(null);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [isAlertOpen, setIsAlertOpen] = useState(false);
  const handleDelete = () => {
    if (!selectedFile) return;
    setFiles(files.filter(f => f.id !== selectedFile.id));
    setIsAlertOpen(false);
    setSelectedFile(null);
  };
  const openPreview = (file: typeof filesData[0]) => {
    if (file.type === 'image') {
      setSelectedFile(file);
      setIsPreviewOpen(true);
    }
  };
  const FileItem = ({ file }: { file: typeof filesData[0] }) => (
    <ContextMenu>
      <ContextMenuTrigger>
        <div
          className={cn(
            "cursor-pointer rounded-md p-2 hover:bg-accent",
            viewMode === 'grid' ? "flex flex-col items-center gap-2" : "grid grid-cols-[24px_1fr_100px_150px] items-center gap-2"
          )}
          onDoubleClick={() => openPreview(file)}
        >
          {viewMode === 'grid' ? (
            <>
              <div>{getFileIcon(file.type, 'lg')}</div>
              <p className="text-xs text-center truncate w-full">{file.name}</p>
            </>
          ) : (
            <>
              <div>{getFileIcon(file.type, 'sm')}</div>
              <span className="truncate">{file.name}</span>
              <span className="text-xs text-muted-foreground">{file.size || '—'}</span>
              <span className="text-xs text-muted-foreground">{new Date(file.modified).toLocaleDateString()}</span>
            </>
          )}
        </div>
      </ContextMenuTrigger>
      <ContextMenuContent>
        <ContextMenuItem onSelect={() => openPreview(file)} disabled={file.type !== 'image'}>Preview</ContextMenuItem>
        <ContextMenuItem>Rename</ContextMenuItem>
        <ContextMenuItem onSelect={() => { setSelectedFile(file); setIsAlertOpen(true); }} className="text-red-500">
          Delete
        </ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  );
  return (
    <div className="flex flex-col h-full bg-card text-card-foreground">
      <header className="flex items-center justify-between p-2 border-b flex-shrink-0">
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
        {files.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
                <Folder size={48} className="mb-4" />
                <p>This folder is empty.</p>
            </div>
        ) : viewMode === 'grid' ? (
          <div className="p-4 grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-4">
            {files.map(file => <FileItem key={file.id} file={file} />)}
          </div>
        ) : (
          <div className="p-2">
            <div className="grid grid-cols-[24px_1fr_100px_150px] gap-2 text-xs text-muted-foreground px-2 py-1 border-b">
              <div/>
              <span>Name</span>
              <span>Size</span>
              <span>Modified</span>
            </div>
            {files.map(file => <FileItem key={file.id} file={file} />)}
          </div>
        )}
      </ScrollArea>
      <Dialog open={isPreviewOpen} onOpenChange={setIsPreviewOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{selectedFile?.name}</DialogTitle>
          </DialogHeader>
          {selectedFile?.url && <img src={selectedFile.url} alt={selectedFile.name} className="max-w-full max-h-[70vh] object-contain mx-auto" />}
        </DialogContent>
      </Dialog>
      <AlertDialog open={isAlertOpen} onOpenChange={setIsAlertOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete "{selectedFile?.name}".
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive hover:bg-destructive/90">Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};
export default FileManager;