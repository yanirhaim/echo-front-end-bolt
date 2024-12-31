// src/pages/JoinMeetingPage.tsx
import React, { useState } from 'react';
import { KeyRound, User } from 'lucide-react';
import StatusBar from '../components/StatusBar';
import { useMeeting } from '../contexts/MeetingContext';
import { Alert, AlertTitle, AlertDescription } from '../components/ui/alert';

interface JoinMeetingPageProps {
  onJoin: (name: string, code: string) => void;
}

const JoinMeetingPage: React.FC<JoinMeetingPageProps> = ({ onJoin }) => {
  const [name, setName] = useState('');
  const [code, setCode] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isJoining, setIsJoining] = useState(false);
  const { joinRoom } = useMeeting();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !code) return;

    setIsJoining(true);
    setError(null);

    try {
      await joinRoom(name, code.toUpperCase());
      onJoin(name, code.toUpperCase());
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to join meeting');
    } finally {
      setIsJoining(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#000000] bg-opacity-95 p-8 flex items-center justify-center overflow-hidden">
      <div className="relative w-full max-w-7xl">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 via-transparent to-blue-500/10 blur-3xl" />
        <div className="absolute -inset-x-40 -top-40 h-[500px] bg-gradient-to-br from-purple-500/20 via-blue-500/20 to-teal-500/20 blur-3xl opacity-50 animate-pulse" />
        
        <StatusBar />
        
        <div className="relative max-w-md mx-auto">
          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="rounded-3xl p-8 bg-white/5 backdrop-blur-xl border border-white/10">
            <h2 className="text-2xl font-medium text-white mb-6 text-center">Join Meeting</h2>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-white/60 text-sm mb-2">Your Name</label>
                <div className="relative">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2">
                    <User className="w-5 h-5 text-white/40" />
                  </div>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-12 py-3 text-white 
                             placeholder-white/40 focus:outline-none focus:border-white/20"
                    placeholder="Enter your name"
                    required
                    disabled={isJoining}
                  />
                </div>
              </div>

              <div>
                <label className="block text-white/60 text-sm mb-2">Meeting Code</label>
                <div className="relative">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2">
                    <KeyRound className="w-5 h-5 text-white/40" />
                  </div>
                  <input
                    type="text"
                    value={code}
                    onChange={(e) => setCode(e.target.value.toUpperCase())}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-12 py-3 text-white 
                             placeholder-white/40 focus:outline-none focus:border-white/20 uppercase"
                    placeholder="Enter meeting code"
                    maxLength={6}
                    required
                    disabled={isJoining}
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isJoining}
                className={`w-full py-4 rounded-xl bg-gradient-to-r from-purple-500 to-blue-500 
                         text-white text-lg font-medium transition-opacity
                         ${isJoining ? 'opacity-50 cursor-not-allowed' : 'hover:opacity-90'}`}
              >
                {isJoining ? 'Joining...' : 'Join Meeting'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JoinMeetingPage;