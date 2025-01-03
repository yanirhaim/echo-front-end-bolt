import React, { useState } from 'react';
import { Globe2, AlertCircle } from 'lucide-react';
import StatusBar from './StatusBar';
import ParticipantList from './ParticipantList';
import AudioControls from './AudioControls';
import MeetingControls from './MeetingControls';
import TranscriptPanel from './TranscriptPanel';
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

  const { 
    isHost,
    leaveRoom,
    closeRoom, 
    participants, 
    connectionStatus, 
    transcripts,
    setLanguagePreference
  } = useMeeting();

  const handleLanguageChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newLanguage = e.target.value;
    setSelectedLanguage(newLanguage);
    try {
      await setLanguagePreference(newLanguage);
    } catch (err) {
      setError('Failed to set language preference');
    }
  };

  const handleLeave = async () => {
    try {
      if (isHost) {
        await closeRoom();
      } else {
        await leaveRoom();
      }
      onLeave();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to leave room');
    }
  };

  return (
    <div className="min-h-screen bg-[#000000] bg-opacity-95 p-4 md:p-8">
      <StatusBar connectionStatus={connectionStatus} />

      <div className="relative w-full max-w-7xl pt-20">
        {error && (
          <Alert variant="destructive" className="mb-4">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        
        <div className="relative flex flex-col lg:grid lg:grid-cols-[1fr,auto] gap-4 md:gap-8">
          <div className="rounded-3xl p-4 md:p-8 bg-white/5 backdrop-blur-xl border border-white/10">
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

            <TranscriptPanel transcripts={transcripts} />

            <div className="flex items-center justify-between mt-4">
              {isHost && <AudioControls />}
              <MeetingControls 
                isHost={isHost} 
                onLeave={handleLeave} 
              />
            </div>
          </div>

          <div className="w-full lg:w-80 space-y-4">
            <ParticipantList participants={participants} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default MeetingRoom;