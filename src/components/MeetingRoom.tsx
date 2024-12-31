// src/components/MeetingRoom.tsx
import React, { useState, useEffect } from 'react';
import { Globe2, AlertCircle } from 'lucide-react';
import StatusBar from './StatusBar';
import ParticipantList from './ParticipantList';
import AudioControls from './AudioControls';
import MeetingControls from './MeetingControls';
import { useMeeting } from '../contexts/MeetingContext';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';

interface MeetingRoomProps {
  onLeave: () => void;
}

const LANGUAGES = [
  { code: 'en', name: 'English' },
  { code: 'es', name: 'Spanish' },
  { code: 'fr', name: 'French' },
  { code: 'de', name: 'German' },
  { code: 'it', name: 'Italian' },
  { code: 'pt', name: 'Portuguese' },
  { code: 'nl', name: 'Dutch' },
  { code: 'pl', name: 'Polish' },
  { code: 'ru', name: 'Russian' },
  { code: 'ja', name: 'Japanese' },
  { code: 'ko', name: 'Korean' },
  { code: 'zh', name: 'Chinese' },
];

const MeetingRoom: React.FC<MeetingRoomProps> = ({ onLeave }) => {
  const [selectedLanguage, setSelectedLanguage] = useState('en');
  const [error, setError] = useState<string | null>(null);
  const [notification, setNotification] = useState<{
    title: string;
    message: string;
    type: 'info' | 'warning' | 'error'
  } | null>(null);

  const { 
    isHost,
    leaveRoom,
    closeRoom, 
    participants, 
    connectionStatus, 
    transcripts,
    setLanguagePreference
  } = useMeeting();

  useEffect(() => {
    if (!isHost && selectedLanguage !== 'en') {
      try {
        setLanguagePreference(selectedLanguage);
      } catch (err) {
        setError('Failed to set language preference');
      }
    }
  }, [selectedLanguage, isHost, setLanguagePreference]);

  const handleLanguageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedLanguage(e.target.value);
  };

  const handleLeave = async () => {
    try {
      if (isHost) {
        await closeRoom();
        onLeave();
      } else {
        await leaveRoom();
        onLeave();
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to leave room');
    }
  };

  return (
    <div className="min-h-screen bg-[#000000] bg-opacity-95 p-4 md:p-8 flex items-center justify-center overflow-hidden">
      <div className="relative w-full max-w-7xl">
        {/* Background effects */}
        <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 via-transparent to-blue-500/10 blur-3xl" />
        <div className="absolute -inset-x-40 -top-40 h-[500px] bg-gradient-to-br from-purple-500/20 via-blue-500/20 to-teal-500/20 blur-3xl opacity-50 animate-pulse" />
        
        <StatusBar connectionStatus={connectionStatus} />

        {notification && (
          <Alert 
            variant={notification.type === 'error' ? 'destructive' : 'default'}
            className="mb-4"
          >
            <AlertTitle>{notification.title}</AlertTitle>
            <AlertDescription>{notification.message}</AlertDescription>
          </Alert>
        )}

        {error && (
          <Alert variant="destructive" className="mb-4">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        
        <div className="relative flex flex-col lg:grid lg:grid-cols-[1fr,auto] gap-4 md:gap-8">
          {/* Main Content Area */}
          <div className="rounded-3xl p-4 md:p-8 bg-white/5 backdrop-blur-xl border border-white/10">
            {/* Language Selection for Participants */}
            {!isHost && (
              <div className="mb-4 p-4 rounded-xl bg-white/5 border border-white/10">
                <div className="flex items-center gap-3">
                  <Globe2 className="w-5 h-5 text-white/60" />
                  <select
                    value={selectedLanguage}
                    onChange={handleLanguageChange}
                    className="flex-1 bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white 
                             focus:outline-none focus:border-white/20"
                  >
                    {LANGUAGES.map(lang => (
                      <option key={lang.code} value={lang.code}>
                        {lang.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            )}

            {/* Transcripts Display */}
            <div className="flex-1 mb-4 md:mb-8">
              <div className="h-[60vh] overflow-y-auto custom-scrollbar rounded-xl bg-black/40 p-4">
                <div className="space-y-4">
                  {transcripts.map((transcript, index) => (
                    <div 
                      key={index}
                      className={`p-4 rounded-xl ${
                        transcript.isFinal 
                          ? 'bg-white/10 border border-white/5' 
                          : 'bg-white/5'
                      }`}
                    >
                      <p className="text-white/90">{transcript.text}</p>
                      {transcript.translation && (
                        <p className="mt-2 text-white/60 text-sm border-t border-white/10 pt-2">
                          {transcript.translation}
                        </p>
                      )}
                      <p className="text-white/40 text-xs mt-2">
                        {new Date(transcript.timestamp).toLocaleTimeString()}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Controls */}
            <div className="flex items-center justify-between gap-4">
              {isHost && <AudioControls />}
              <div className="flex-1" />
              <MeetingControls 
                isHost={isHost} 
                onLeave={handleLeave} 
              />
            </div>
          </div>

          {/* Participant Sidebar */}
          <div className="w-full lg:w-80">
            <ParticipantList participants={participants} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default MeetingRoom;