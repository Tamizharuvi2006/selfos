import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { produce } from 'immer';
import { appRegistry } from '@/components/os/appRegistry';
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
        if (!app) {
          console.warn(`[WindowManager] App with id "${appId}" not found in registry.`);
          return;
        }
        const existingWindow = Object.values(get().windows).find(w => w.appId === appId && !w.isMinimized);
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
          const remainingWindows = Object.values(draft.windows).filter(w => !w.isMinimized).sort((a, b) => b.zIndex - a.zIndex);
          draft.activeWindowId = remainingWindows.length > 0 ? remainingWindows[0].id : null;
        }
      })),
      focusWindow: (id) => set(produce((draft: WindowManagerStore) => {
        if (draft.activeWindowId === id) return;
        const windowToFocus = draft.windows[id];
        if (windowToFocus) {
          windowToFocus.zIndex = getNextZIndex(get().windows);
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
            win.zIndex = getNextZIndex(get().windows);
            draft.activeWindowId = id;
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
          win.zIndex = getNextZIndex(get().windows);
          draft.activeWindowId = id;
        }
      })),
    }),
    {
      name: 'selfos-window-manager-storage',
    }
  )
);