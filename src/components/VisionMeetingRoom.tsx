// VisionMeetingRoom.tsx
import React, { useState, useEffect, useRef } from 'react';
import { Users } from 'lucide-react';
import StatusBar from './StatusBar';
import ParticipantList from './ParticipantList';
import QRCode from './QRCode';
import { useMeeting } from '../contexts/MeetingContext';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { AudioService } from '@/services/audio';

interface VisionMeetingRoomProps {
  onStart: () => void;
}

function VisionMeetingRoom({ onStart }: VisionMeetingRoomProps) {
  const { 
    createRoom, 
    participants, 
    roomCode, 
    connectionStatus,
    isCreatingRoom,
    initializeAudio 
  } = useMeeting();
  const [error, setError] = useState<string | null>(null);
  const initializeStarted = useRef(false);

  useEffect(() => {
    if (initializeStarted.current || roomCode) return;
    
    initializeStarted.current = true;
    const initializeRoom = async () => {
      try {
        await createRoom('Host');
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to create room');
      }
    };

    initializeRoom();

    return () => {
      initializeStarted.current = false;
    };
  }, [createRoom, roomCode]);

  const handleStartMeeting = async () => {
    if (connectionStatus !== 'connected') {
      setError('Please wait for connection to establish');
      return;
    }
    
    try {
      await initializeAudio();
      const audioService = new AudioService();
      await audioService.initialize();
      audioService.stopRecording();
      onStart();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to initialize audio');
      console.error('Start meeting error:', err);
    }
  };

  return (
    <div className="min-h-screen bg-[#000000] bg-opacity-95 overflow-hidden">
      <StatusBar connectionStatus={connectionStatus} />

      <div className="relative w-full max-w-7xl mx-auto px-4 md:px-8 pt-20">
        <div className="relative w-full max-w-7xl mx-auto">
          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="relative flex flex-col md:grid md:grid-cols-2 gap-8">
            {roomCode && (
              <div className="order-1 md:order-2">
                <QRCode code={roomCode} isStarted={false} />
              </div>
            )}

            <div className="order-2 md:order-1 rounded-3xl p-8 bg-white/5 backdrop-blur-xl border border-white/10 flex flex-col">
              <div className="flex items-center space-x-3 mb-8">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center">
                  <Users className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-medium text-white">Meeting Space</h2>
                  <p className="text-white/60">Virtual Conference Room</p>
                </div>
              </div>
              
              {roomCode && (
                <div className="mb-8 rounded-2xl p-6 bg-white/5 border border-white/10">
                  <div className="text-sm text-white/60 mb-2">Room Access Code</div>
                  <div className="font-mono text-3xl tracking-wider text-white bg-gradient-to-r from-purple-500 to-blue-500 bg-clip-text text-transparent">
                    {roomCode}
                  </div>
                </div>
              )}

              <ParticipantList participants={participants} />

              <div className="mt-8"></div>

              <button
                onClick={handleStartMeeting}
                disabled={connectionStatus !== 'connected'}
                className={`w-full py-4 rounded-xl transition-all text-lg font-medium mt-auto
                  ${connectionStatus !== 'connected'
                    ? 'bg-white/5 text-white/40 cursor-not-allowed' 
                    : 'bg-gradient-to-r from-purple-500 to-blue-500 text-white hover:opacity-90'}`}
              >
                {isCreatingRoom ? 'Creating Room...' : 
                 connectionStatus !== 'connected' ? 'Connecting...' : 
                 'Start Meeting'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default VisionMeetingRoom;