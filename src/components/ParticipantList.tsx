// src/components/ParticipantList.tsx
import React from 'react';
import { Users, ChevronRight, Mic, MicOff, Globe2 } from 'lucide-react';
import { Participant } from '../types';
import { useMeeting } from '../contexts/MeetingContext';

interface ParticipantListProps {
  participants: Participant[];
}

const formatTime = (date: Date | string): string => {
  if (typeof date === 'string') {
    date = new Date(date);
  }
  return date.toLocaleTimeString('en-US', { 
    hour: 'numeric', 
    minute: '2-digit',
    hour12: true 
  });
};

const ParticipantList: React.FC<ParticipantListProps> = ({ participants }) => {
  const { userId } = useMeeting(); // Add userId to MeetingContext

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const getDisplayName = (participant: Participant) => {
    if (participant.id === userId) {
      return 'Me';
    }
    return participant.name;
  };

  return (
    <div className="rounded-3xl bg-white/5 backdrop-blur-xl border border-white/10 p-4">
      <div className="flex-grow overflow-auto space-y-4 custom-scrollbar">
        <div className="sticky top-0 backdrop-blur-md bg-black/20 py-3 px-4 rounded-xl mb-4 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <Users className="w-4 h-4 text-white/60" />
            <span className="text-sm font-medium text-white/80">Participants</span>
          </div>
          <span className="text-sm text-white/60">{participants.length} connected</span>
        </div>
        
        {participants.map((participant) => (
          <div 
            key={participant.id}
            className="group rounded-xl p-4 transition-all hover:bg-white/5 border border-white/5 hover:border-white/10"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                {/* Avatar */}
                <div className="relative">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500/20 to-blue-500/20 
                                flex items-center justify-center border border-white/10">
                    <span className="text-white/80 text-sm font-medium">
                      {getInitials(getDisplayName(participant))}
                    </span>
                  </div>
                  {/* Status Indicator */}
                  <div className={`absolute -bottom-1 -right-1 w-3 h-3 rounded-full border-2 border-black
                                 ${participant.status === 'active' ? 'bg-green-400' : 'bg-gray-400'}`} />
                </div>

                {/* Participant Info */}
                <div className="flex-1">
                  <div className="font-medium text-white flex items-center space-x-2">
                    <span>{getDisplayName(participant)}</span>
                    {participant.isHost && (
                      <span className="text-xs px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300">
                        Host
                      </span>
                    )}
                  </div>
                  <div className="text-xs text-white/40 flex items-center space-x-2">
                    <span>Joined {formatTime(participant.joinedAt)}</span>
                    {participant.language && (
                      <>
                        <span>•</span>
                        <div className="flex items-center space-x-1">
                          <Globe2 className="w-3 h-3" />
                          <span>{participant.language.toUpperCase()}</span>
                        </div>
                      </>
                    )}
                  </div>
                </div>

                {/* Audio Status */}
                <div className="flex items-center space-x-3">
                  {participant.isHost && (
                    <div className={`p-1.5 rounded-lg ${
                      participant.isMuted 
                        ? 'bg-red-500/20 text-red-500' 
                        : 'bg-green-500/20 text-green-500'
                    }`}>
                      {participant.isMuted ? (
                        <MicOff className="w-4 h-4" />
                      ) : (
                        <Mic className="w-4 h-4" />
                      )}
                    </div>
                  )}
                  <ChevronRight className="w-4 h-4 text-white/20 group-hover:text-white/40 transition-colors" />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ParticipantList;