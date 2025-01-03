import React from 'react';
import { Wifi, AlertCircle } from 'lucide-react';

interface ConnectionStatusProps {
  status: 'connected' | 'disconnected' | 'reconnecting';
}

const ConnectionStatus: React.FC<ConnectionStatusProps> = ({ status }) => {
  const getConnectionColor = () => {
    switch (status) {
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
    switch (status) {
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
    <div className="flex items-center space-x-2">
      {status === 'reconnecting' ? (
        <AlertCircle className={`w-4 h-4 ${getConnectionColor()} animate-pulse`} />
      ) : (
        <Wifi className={`w-4 h-4 ${getConnectionColor()} ${
          status === 'connected' ? '' : 'opacity-50'
        }`} />
      )}
      <span className={`text-sm ${getConnectionColor()}`}>
        {getConnectionText()}
      </span>
    </div>
  );
};

export default ConnectionStatus;