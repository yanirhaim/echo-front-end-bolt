import React from 'react';
import { LogOut, X } from 'lucide-react';

interface MeetingControlsProps {
  isHost: boolean;
  onLeave: () => void;
}

const MeetingControls: React.FC<MeetingControlsProps> = ({ isHost, onLeave }) => {
  return (
    <button
      onClick={onLeave}  // Remove the confirmation here, just call onLeave
      className="flex items-center justify-center space-x-2 px-6 py-3 rounded-xl 
                bg-red-500/20 hover:bg-red-500/30 text-red-500 transition-colors"
    >
      {isHost ? (
        <>
          <X className="w-5 h-5" />
          <span>End Meeting</span>
        </>
      ) : (
        <>
          <LogOut className="w-5 h-5" />
          <span>Leave Meeting</span>
        </>
      )}
    </button>
  );
};

export default MeetingControls;