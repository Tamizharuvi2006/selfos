import React, { ReactNode } from 'react';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { produce } from 'immer';
import Window from './Window';
import FileManager from '../apps/FileManager';
import Terminal from '../apps/Terminal';
import AIHub from '../apps/AIHub';
import LauncherGrid from './LauncherGrid';
export interface WindowState {
  id: string;
  appId: string;
  title: string;
  icon: React.FC<{ className?: string }>;
  x: number;
  y: number;
  width: number;
  height: number;
  isMinimized: boolean;
  isMaximized: boolean;
  zIndex: number;
  props?: Record<string, any>;
}
interface WindowManagerStore {
  windows: Record<string, WindowState>;
  activeWindowId: string | null;
  openWindow: (appId: string, props?: Record<string, any>) => void;
  closeWindow: (id: string) => void;
  focusWindow: (id: string) => void;
  minimizeWindow: (id: string) => void;
  toggleMaximizeWindow: (id: string) => void;
  updateWindowBounds: (id: string, bounds: Partial<{ x: number; y: number; width: number; height: number }>) => void;
  restoreWindow: (id: string) => void;
}
const getNextZIndex = (windows: Record<string, WindowState>) => {
  const zIndexes = Object.values(windows).map(w => w.zIndex);
  return zIndexes.length > 0 ? Math.max(...zIndexes) + 1 : 10;
};
export const useWindowManagerStore = create<WindowManagerStore>()(
  persist(
    (set, get) => ({
      windows: {},
      activeWindowId: null,
      openWindow: (appId, props = {}) => {
        const app = appRegistry[appId];
        if (!app) return;
        const existingWindow = Object.values(get().windows).find(w => w.appId === appId);
        if (existingWindow) {
          get().focusWindow(existingWindow.id);
          return;
        }
        const id = `win_${appId}_${Date.now()}`;
        const { windows } = get();
        const newWindow: WindowState = {
          id,
          appId,
          title: app.name,
          icon: app.icon,
          x: 100 + Object.keys(windows).length * 30,
          y: 100 + Object.keys(windows).length * 30,
          width: app.defaultSize.width,
          height: app.defaultSize.height,
          isMinimized: false,
          isMaximized: false,
          zIndex: getNextZIndex(windows),
          props,
        };
        set(produce((draft: WindowManagerStore) => {
          draft.windows[id] = newWindow;
          draft.activeWindowId = id;
        }));
      },
      closeWindow: (id) => set(produce((draft: WindowManagerStore) => {
        delete draft.windows[id];
        if (draft.activeWindowId === id) {
          const remainingWindows = Object.values(draft.windows).sort((a, b) => b.zIndex - a.zIndex);
          draft.activeWindowId = remainingWindows.length > 0 ? remainingWindows[0].id : null;
        }
      })),
      focusWindow: (id) => set(produce((draft: WindowManagerStore) => {
        if (draft.activeWindowId === id) return;
        const windowToFocus = draft.windows[id];
        if (windowToFocus) {
          windowToFocus.zIndex = getNextZIndex(draft.windows);
          draft.activeWindowId = id;
        }
      })),
      minimizeWindow: (id) => set(produce((draft: WindowManagerStore) => {
        const windowToMinimize = draft.windows[id];
        if (windowToMinimize) {
          windowToMinimize.isMinimized = true;
          if (draft.activeWindowId === id) {
            const otherWindows = Object.values(draft.windows)
              .filter(w => !w.isMinimized)
              .sort((a, b) => b.zIndex - a.zIndex);
            draft.activeWindowId = otherWindows.length > 0 ? otherWindows[0].id : null;
          }
        }
      })),
      toggleMaximizeWindow: (id) => set(produce((draft: WindowManagerStore) => {
        const win = draft.windows[id];
        if (win) {
          win.isMaximized = !win.isMaximized;
          if (win.isMaximized) {
            get().focusWindow(id);
          }
        }
      })),
      updateWindowBounds: (id, bounds) => set(produce((draft: WindowManagerStore) => {
        const win = draft.windows[id];
        if (win) {
          Object.assign(win, bounds);
        }
      })),
      restoreWindow: (id) => set(produce((draft: WindowManagerStore) => {
        const win = draft.windows[id];
        if (win) {
          win.isMinimized = false;
          get().focusWindow(id);
        }
      })),
    }),
    {
      name: 'selfos-window-manager-storage',
    }
  )
);
export const appRegistry: Record<string, {
  name: string;
  icon: React.FC<{ className?: string }>;
  component: React.FC<any>;
  defaultSize: { width: number; height: number };
}> = {
  launcher: { name: 'App Launcher', icon: ({ className }) => <div className={`w-full h-full bg-gradient-to-br from-blue-500 to-purple-600 ${className}`} />, component: LauncherGrid, defaultSize: { width: 800, height: 600 } },
  fileManager: { name: 'File Manager', icon: ({ className }) => <div className={`w-full h-full bg-sky-500 ${className}`} />, component: FileManager, defaultSize: { width: 800, height: 600 } },
  terminal: { name: 'Terminal', icon: ({ className }) => <div className={`w-full h-full bg-gray-800 ${className}`} />, component: Terminal, defaultSize: { width: 700, height: 450 } },
  aiHub: { name: 'AI Hub', icon: ({ className }) => <div className={`w-full h-full bg-gradient-to-br from-pink-500 to-yellow-500 ${className}`} />, component: AIHub, defaultSize: { width: 500, height: 700 } },
};
const WindowManager: React.FC = () => {
  const windowIds = useWindowManagerStore(state => Object.keys(state.windows));
  return (
    <div className="absolute inset-0 w-full h-full pointer-events-none">
      {windowIds.map((id) => (
        <Window key={id} id={id} />
      ))}
    </div>
  );
};
export default WindowManager;