// MainPage.tsx
import React from 'react';
import { Video, Users } from 'lucide-react';
import StatusBar from '../components/StatusBar';

interface MainPageProps {
  onCreateMeeting: () => void;
  onJoinMeeting: () => void;
}

const MainPage: React.FC<MainPageProps> = ({ onCreateMeeting, onJoinMeeting }) => {
  return (
    <div className="min-h-screen bg-[#000000] bg-opacity-95 overflow-y-auto">
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 via-transparent to-blue-500/10 blur-3xl" />
        <div className="absolute -inset-x-40 -top-40 h-[500px] bg-gradient-to-br from-purple-500/20 via-blue-500/20 to-teal-500/20 blur-3xl opacity-50 animate-pulse" />
      </div>

      <StatusBar />
      
      <div className="relative w-full max-w-7xl mx-auto px-4 md:px-8 pt-20">
        <div className="relative text-center mb-8 md:mb-16 mt-8">
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">Vision Meeting Space</h1>
          <p className="text-white/60 text-base md:text-lg">Connect with others in an immersive virtual environment</p>
        </div>

        <div className="relative grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8 max-w-4xl mx-auto mb-8">
          <button
            onClick={onCreateMeeting}
            className="group relative rounded-3xl p-6 md:p-8 bg-white/5 backdrop-blur-xl border border-white/10 
                     hover:bg-white/10 transition-all duration-300"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-purple-500/20 to-blue-500/20 opacity-0 
                          group-hover:opacity-100 transition-opacity duration-300 rounded-3xl blur-xl" />
            <div className="relative">
              <div className="w-12 md:w-16 h-12 md:h-16 rounded-2xl bg-gradient-to-br from-purple-500 to-blue-500 
                            flex items-center justify-center mx-auto mb-4 md:mb-6">
                <Video className="w-6 md:w-8 h-6 md:h-8 text-white" />
              </div>
              <h2 className="text-xl md:text-2xl font-medium text-white mb-2 md:mb-4">Create Meeting</h2>
              <p className="text-white/60">Start a new meeting and invite others to join</p>
            </div>
          </button>

          <button
            onClick={onJoinMeeting}
            className="group relative rounded-3xl p-6 md:p-8 bg-white/5 backdrop-blur-xl border border-white/10 
                     hover:bg-white/10 transition-all duration-300"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-purple-500/20 to-blue-500/20 opacity-0 
                          group-hover:opacity-100 transition-opacity duration-300 rounded-3xl blur-xl" />
            <div className="relative">
              <div className="w-12 md:w-16 h-12 md:h-16 rounded-2xl bg-gradient-to-br from-purple-500 to-blue-500 
                            flex items-center justify-center mx-auto mb-4 md:mb-6">
                <Users className="w-6 md:w-8 h-6 md:h-8 text-white" />
              </div>
              <h2 className="text-xl md:text-2xl font-medium text-white mb-2 md:mb-4">Join Meeting</h2>
              <p className="text-white/60">Enter a meeting code to connect with others</p>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
};

export default MainPage;