import React from 'react';
import { Clock } from 'lucide-react';

interface TimeDisplayProps {
  time: Date;
}

const TimeDisplay: React.FC<TimeDisplayProps> = ({ time }) => {
  return (
    <div className="flex items-center space-x-2">
      <Clock className="w-4 h-4 text-white/80" />
      <span className="text-white/80 text-sm">
        {time.toLocaleTimeString([], { 
          hour: '2-digit', 
          minute: '2-digit',
          hour12: true 
        })}
      </span>
    </div>
  );
};

export default TimeDisplay;