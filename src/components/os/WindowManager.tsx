import React from 'react';
import { useShallow } from 'zustand/react/shallow';
import { useWindowManagerStore } from '@/stores/windowStore';
import Window from './Window';
const WindowManager: React.FC = () => {
  // FIX: Use a stable selector with explicit typing to prevent re-renders and fix TS errors.
  const windowIds = useWindowManagerStore(
    (state) => Object.keys(state.windows),
    useShallow
  );
  return (
    <div className="absolute inset-0 w-full h-full pointer-events-none">
      {windowIds.map((id) => (
        <Window key={id} id={id} />
      ))}
    </div>
  );
};
export default WindowManager;