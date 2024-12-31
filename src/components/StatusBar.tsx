// src/components/StatusBar.tsx
import React, { useEffect, useState } from 'react';
import { Activity, Wifi, Clock, AlertCircle } from 'lucide-react';

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

  const getConnectionColor = () => {
    switch (connectionStatus) {
      case 'connected':
        return 'text-green-400';
      case 'reconnecting':
        return 'text-yellow-400';
      case 'disconnected':
        return 'text-red-400';
      default:
        return 'text-white/40';
    }
  };

  const getConnectionText = () => {
    switch (connectionStatus) {
      case 'connected':
        return 'Connected';
      case 'reconnecting':
        return 'Reconnecting...';
      case 'disconnected':
        return 'Disconnected';
      default:
        return 'No Connection';
    }
  };

  return (
    <div className="relative mb-8 flex justify-between items-center px-6 py-3 rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10">
      {/* System Status */}
      <div className="flex items-center space-x-4">
        <Activity className="w-4 h-4 text-green-400" />
        <span className="text-white/80 text-sm">System Status: Optimal</span>
      </div>

      {/* Connection and Time */}
      <div className="flex items-center space-x-6">
        {/* Connection Status */}
        <div className="flex items-center space-x-2">
          {connectionStatus === 'reconnecting' ? (
            <AlertCircle className={`w-4 h-4 ${getConnectionColor()} animate-pulse`} />
          ) : (
            <Wifi className={`w-4 h-4 ${getConnectionColor()} ${
              connectionStatus === 'connected' ? '' : 'opacity-50'
            }`} />
          )}
          <span className={`text-sm ${getConnectionColor()}`}>
            {getConnectionText()}
          </span>
        </div>

        {/* Time */}
        <div className="flex items-center space-x-2">
          <Clock className="w-4 h-4 text-white/80" />
          <span className="text-white/80 text-sm">
            {currentTime.toLocaleTimeString([], { 
              hour: '2-digit', 
              minute: '2-digit',
              hour12: true 
            })}
          </span>
        </div>
      </div>
    </div>
  );
};

export default StatusBar;