import React, { useRef } from 'react';
import { motion, useDragControls } from 'framer-motion';
import { X, Minimize, Maximize2 } from 'lucide-react';
import { useWindowManagerStore, appRegistry, WindowState } from './WindowManager';
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
  if (!win) return null;
  const AppComponent = appRegistry[win.appId]?.component;
  const isActive = activeWindowId === id;
  const handleResizeStop = (e: any, direction: any, ref: any, d: any) => {
    updateWindowBounds(id, {
      width: win.width + d.width,
      height: win.height + d.height,
    });
  };
  const handleDragEnd = (event: any, info: any) => {
    const snapGrid = 24;
    updateWindowBounds(id, {
      x: Math.round(info.point.x / snapGrid) * snapGrid,
      y: Math.round(info.point.y / snapGrid) * snapGrid,
    });
  };
  return (
    <>
      <div ref={constraintsRef} className="absolute inset-0 w-full h-full pointer-events-none" />
      <motion.div
        drag
        dragListener={false}
        dragControls={dragControls}
        dragConstraints={constraintsRef}
        dragMomentum={false}
        onDragEnd={handleDragEnd}
        onPointerDown={() => focusWindow(id)}
        className={cn(
          "absolute pointer-events-auto flex flex-col rounded-lg shadow-2xl transition-all duration-200",
          "bg-card/60 backdrop-blur-[20px] border border-white/10",
          {
            'shadow-[0_0_40px_-10px_hsl(var(--accent))]': isActive,
            'opacity-0 scale-90 pointer-events-none': win.isMinimized,
            'inset-0 !w-full !h-full !transform-none rounded-none': win.isMaximized,
          }
        )}
        style={{
          zIndex: win.zIndex,
          x: win.x,
          y: win.y,
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
        >
          <div className="flex flex-col h-full w-full">
            <header
              onPointerDown={(e) => {
                focusWindow(id);
                dragControls.start(e);
              }}
              className="flex items-center justify-between px-3 h-10 bg-black/20 cursor-grab active:cursor-grabbing rounded-t-lg"
            >
              <div className="flex items-center gap-2">
                <win.icon className="w-4 h-4" />
                <span className="text-sm font-medium text-foreground">{win.title}</span>
              </div>
              <div className="flex items-center gap-1">
                <button onClick={() => minimizeWindow(id)} className="w-6 h-6 rounded-full center hover:bg-white/20"><Minimize className="w-3 h-3" /></button>
                <button onClick={() => toggleMaximizeWindow(id)} className="w-6 h-6 rounded-full center hover:bg-white/20"><Maximize2 className="w-3 h-3" /></button>
                <button onClick={() => closeWindow(id)} className="w-6 h-6 rounded-full center hover:bg-red-500"><X className="w-4 h-4" /></button>
              </div>
            </header>
            <main className="flex-1 bg-card/80 overflow-hidden">
              {AppComponent ? <AppComponent {...win.props} /> : <div>App not found</div>}
            </main>
          </div>
        </Resizable>
      </motion.div>
    </>
  );
};
export default Window;