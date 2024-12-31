import { useState, useEffect } from 'react';
import { MeetingState } from '../types';

const REFRESH_INTERVAL = 5000; // 5 seconds
const MAX_PARTICIPANTS = 3;

export const useParticipants = () => {
  const [meetingState, setMeetingState] = useState<MeetingState>({
    isStarted: false,
    code: Math.random().toString(36).substr(2, 6).toUpperCase(),
    participants: [],
  });

  useEffect(() => {
    if (!meetingState.isStarted && meetingState.participants.length < MAX_PARTICIPANTS) {
      const interval = setInterval(() => {
        setMeetingState(prev => ({
          ...prev,
          participants: [
            ...prev.participants,
            {
              id: Math.random().toString(36).substr(2, 9),
              name: `Participant ${prev.participants.length + 1}`,
              status: 'active',
              joinedAt: new Date()
            }
          ]
        }));
      }, REFRESH_INTERVAL);

      return () => clearInterval(interval);
    }
  }, [meetingState.isStarted, meetingState.participants.length]);

  const startMeeting = () => setMeetingState(prev => ({ ...prev, isStarted: true }));

  return { meetingState, startMeeting };
};