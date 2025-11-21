import React from 'react';

import { useWindowManagerStore } from '@/stores/windowStore';
import Window from './Window';
const WindowManager: React.FC = () => {
  // FIX: Use a stable selector with explicit typing to prevent re-renders and fix TS errors.
  const windows = useWindowManagerStore((state) => state.windows);
  const windowIds: string[] = React.useMemo(() => Object.keys(windows), [windows]);
  return (
    <div className="absolute inset-0 w-full h-full pointer-events-none">
      {windowIds.map((id) => (
        <Window key={id} id={id} />
      ))}
    </div>
  );
};
export default WindowManager;