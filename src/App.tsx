// src/App.tsx
import React, { useState } from 'react';
import MainPage from './pages/MainPage';
import JoinMeetingPage from './pages/JoinMeetingPage';
import VisionMeetingRoom from './components/VisionMeetingRoom';
import MeetingRoom from './components/MeetingRoom';
import { MeetingProvider } from './contexts/MeetingContext';

function App() {
  const [currentView, setCurrentView] = useState<'main' | 'create' | 'join' | 'room'>('main');
  const [joinDetails, setJoinDetails] = useState<{ name: string; code: string } | null>(null);

  const handleCreateMeeting = () => {
    setCurrentView('create');
  };

  const handleJoinMeeting = () => {
    setCurrentView('join');
  };

  const handleJoinSubmit = (name: string, code: string) => {
    setJoinDetails({ name, code });
    setCurrentView('room');
  };

  const handleLeaveMeeting = () => {
    setCurrentView('main');
    setJoinDetails(null);
  };

  const handleMeetingEnd = () => {
    setCurrentView('main');
    setJoinDetails(null);
  };

  return (
    <MeetingProvider>
      <div className="min-h-screen bg-[#000000] bg-opacity-95 overflow-y-auto">
        <div className="fixed inset-0 pointer-events-none">
          <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 via-transparent to-blue-500/10 blur-3xl" />
          <div className="absolute -inset-x-40 -top-40 h-[500px] bg-gradient-to-br from-purple-500/20 via-blue-500/20 to-teal-500/20 blur-3xl opacity-50 animate-pulse" />
        </div>

        {currentView === 'main' && (
          <MainPage
            onCreateMeeting={() => setCurrentView('create')}
            onJoinMeeting={() => setCurrentView('join')}
          />
        )}
        {currentView === 'create' && (
          <VisionMeetingRoom onStart={() => setCurrentView('room')} />
        )}
        {currentView === 'join' && (
          <JoinMeetingPage onJoin={handleJoinSubmit} />
        )}
        {currentView === 'room' && (
          <MeetingRoom onLeave={handleMeetingEnd} />
        )}
      </div>
    </MeetingProvider>
  );
}

export default App;