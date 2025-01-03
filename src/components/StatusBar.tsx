import React, { useEffect, useState } from 'react';
import { Activity } from 'lucide-react';
import ConnectionStatus from './status/ConnectionStatus';
import TimeDisplay from './status/TimeDisplay';

interface StatusBarProps {
  connectionStatus?: 'connected' | 'disconnected' | 'reconnecting';
}

const StatusBar: React.FC<StatusBarProps> = ({ connectionStatus = 'disconnected' }) => {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="fixed top-0 left-0 right-0 z-50 px-8 py-3 bg-black/40 backdrop-blur-xl border-b border-white/10">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        {/* System Status */}
        <div className="flex items-center space-x-4">
          <Activity className="w-4 h-4 text-green-400" />
          <span className="text-white/80 text-sm">System Status: Optimal</span>
        </div>

        {/* Connection and Time */}
        <div className="flex items-center space-x-6">
          <ConnectionStatus status={connectionStatus} />
          <TimeDisplay time={currentTime} />
        </div>
      </div>
    </div>
  );
};

export default StatusBar;