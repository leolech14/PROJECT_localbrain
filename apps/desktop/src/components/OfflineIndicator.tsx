import React from 'react';
import { WifiOff } from 'lucide-react';

export const OfflineIndicator: React.FC = () => {
  return (
    <div className="fixed top-2 right-4 z-50 flex items-center space-x-2 rounded-md bg-amber-500 px-3 py-1.5 text-sm font-medium text-white shadow-lg animate-pulse-amber">
      <WifiOff className="h-4 w-4" />
      <span>Offline Mode</span>
    </div>
  );
};