import React, { useRef, useEffect } from 'react';
import { motion, useDragControls } from 'framer-motion';
import { X, Minimize, Maximize2 } from 'lucide-react';
import { useWindowManagerStore } from '@/stores/windowStore';
import { appRegistry } from '@/components/os/appRegistry';
import { cn } from '@/lib/utils';
import { Resizable } from 're-resizable';
interface WindowProps {
  id: string;
}
const Window: React.FC<WindowProps> = ({ id }) => {
  const win = useWindowManagerStore(state => state.windows[id]);
  const { focusWindow, closeWindow, minimizeWindow, toggleMaximizeWindow, updateWindowBounds } = useWindowManagerStore.getState();
  const activeWindowId = useWindowManagerStore(state => state.activeWindowId);
  const dragControls = useDragControls();
  const constraintsRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (activeWindowId === id) {
        if (e.key === 'Escape') {
          closeWindow(id);
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [id, activeWindowId, closeWindow]);
  if (!win) return null;
  const AppComponent = appRegistry[win.appId]?.component;
  const isActive = activeWindowId === id;
  const handleResizeStop = (e: any, direction: any, ref: HTMLElement, d: { width: number, height: number }) => {
    updateWindowBounds(id, {
      width: win.width + d.width,
      height: win.height + d.height,
    });
  };
  const handleDragEnd = (event: any, info: any) => {
    const snapGrid = 24;
    let newX = Math.round(info.point.x / snapGrid) * snapGrid;
    let newY = Math.round(info.point.y / snapGrid) * snapGrid;
    // Bounds check
    newX = Math.max(0, newX);
    newY = Math.max(0, newY);
    if (constraintsRef.current) {
        newX = Math.min(newX, constraintsRef.current.offsetWidth - win.width);
        newY = Math.min(newY, constraintsRef.current.offsetHeight - win.height);
    }
    updateWindowBounds(id, { x: newX, y: newY });
  };
  return (
    <>
      <div ref={constraintsRef} className="absolute inset-0 w-full h-full pointer-events-none" />
      <motion.div
        role="dialog"
        aria-label={win.title}
        aria-modal="true"
        drag
        dragListener={false}
        dragControls={dragControls}
        dragConstraints={constraintsRef}
        dragMomentum={false}
        onDragEnd={handleDragEnd}
        onPointerDown={() => focusWindow(id)}
        className={cn(
          "absolute pointer-events-auto flex flex-col rounded-lg shadow-2xl touch-manipulation",
          "bg-card/60 backdrop-blur-[20px] border border-white/10 will-change-transform",
          {
            'shadow-[0_0_40px_-10px_hsl(var(--accent))]': isActive,
            'opacity-0 scale-90 pointer-events-none': win.isMinimized,
            'inset-0 !w-full !h-full !transform-none rounded-none': win.isMaximized,
          }
        )}
        style={{
          zIndex: win.zIndex,
          width: win.width,
          height: win.height,
        }}
        animate={{
          opacity: win.isMinimized ? 0 : 1,
          scale: win.isMinimized ? 0.95 : 1,
          x: win.isMaximized ? 0 : win.x,
          y: win.isMaximized ? 0 : win.y,
        }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      >
        <Resizable
          size={{ width: win.width, height: win.height }}
          onResizeStop={handleResizeStop}
          minWidth={300}
          minHeight={200}
          enable={{
            top: !win.isMaximized, right: !win.isMaximized, bottom: !win.isMaximized, left: !win.isMaximized,
            topRight: !win.isMaximized, bottomRight: !win.isMaximized, bottomLeft: !win.isMaximized, topLeft: !win.isMaximized
          }}
          className={cn({ 'transition-all duration-200': win.isMaximized })}
          handleClasses={{
            right: 'absolute right-0 top-0 h-full w-2 cursor-ew-resize',
            left: 'absolute left-0 top-0 h-full w-2 cursor-ew-resize',
            top: 'absolute top-0 left-0 w-full h-2 cursor-ns-resize',
            bottom: 'absolute bottom-0 left-0 w-full h-2 cursor-ns-resize',
            bottomRight: 'absolute bottom-0 right-0 h-4 w-4 cursor-nwse-resize',
            bottomLeft: 'absolute bottom-0 left-0 h-4 w-4 cursor-nesw-resize',
            topRight: 'absolute top-0 right-0 h-4 w-4 cursor-nesw-resize',
            topLeft: 'absolute top-0 left-0 h-4 w-4 cursor-nwse-resize',
          }}
        >
          <div className="flex flex-col h-full w-full">
            <header
              onPointerDown={(e) => {
                focusWindow(id);
                dragControls.start(e);
              }}
              className="flex items-center justify-between px-3 h-10 bg-black/20 cursor-grab active:cursor-grabbing rounded-t-lg flex-shrink-0"
            >
              <div className="flex items-center gap-2">
                <win.icon className="w-4 h-4 text-accent" />
                <span className="text-sm font-medium text-foreground">{win.title}</span>
              </div>
              <div className="flex items-center gap-1">
                <button aria-label="Minimize window" onClick={() => minimizeWindow(id)} className="w-6 h-6 rounded-full center hover:bg-white/20 transition-colors"><Minimize className="w-3 h-3" /></button>
                <button aria-label="Maximize window" onClick={() => toggleMaximizeWindow(id)} className="w-6 h-6 rounded-full center hover:bg-white/20 transition-colors"><Maximize2 className="w-3 h-3" /></button>
                <button aria-label="Close window" onClick={() => closeWindow(id)} className="w-6 h-6 rounded-full center hover:bg-red-500 transition-colors"><X className="w-4 h-4" /></button>
              </div>
            </header>
            <main className="flex-1 bg-card/80 overflow-hidden">
              {AppComponent ? <AppComponent key={id} {...win.props} /> : <div>App not found</div>}
            </main>
          </div>
        </Resizable>
      </motion.div>
    </>
  );
};
export default Window;