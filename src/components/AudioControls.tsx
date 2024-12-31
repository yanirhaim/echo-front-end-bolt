// src/components/AudioControls.tsx
import React, { useEffect, useState, useRef } from 'react';
import { Mic, MicOff, AlertCircle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AudioService } from '@/services/audio'; // Make sure this path matches your project structure
import { useMeeting } from '@/contexts/MeetingContext';

const AudioControls: React.FC = () => {
  const [error, setError] = useState<string | null>(null);
  const [hasPermission, setHasPermission] = useState(false);
  const { isMuted, toggleMute } = useMeeting();

  useEffect(() => {
    const checkPermissions = async () => {
      try {
        const service = new AudioService();
        const permitted = await service.checkPermissions();
        setHasPermission(permitted);
        if (!permitted) {
          setError('Microphone access denied. Please enable microphone access to continue.');
        }
      } catch (err) {
        setError('Failed to check microphone permissions');
      }
    };

    checkPermissions();
  }, []);

  const handleToggleMute = async () => {
    try {
      if (!hasPermission) {
        setError('Please enable microphone access to continue.');
        return;
      }

      await toggleMute();
      setError(null);
    } catch (err) {
      setError('Failed to toggle microphone');
      console.error('Microphone toggle error:', err);
    }
  };

  return (
    <div className="flex items-center space-x-4">
      {error && (
        <Alert variant="destructive" className="p-2">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      
      <button
        onClick={handleToggleMute}
        disabled={!hasPermission}
        className={`p-4 rounded-full transition-all ${
          !hasPermission 
            ? 'bg-gray-500/20 text-gray-500 cursor-not-allowed' 
            : !isMuted 
              ? 'bg-red-500/20 text-red-500 hover:bg-red-500/30' 
              : 'bg-green-500/20 text-green-500 hover:bg-green-500/30'
        }`}
      >
        {!isMuted ? (
          <MicOff className="w-6 h-6" />
        ) : (
          <Mic className="w-6 h-6" />
        )}
      </button>
    </div>
  );
};

export default AudioControls;