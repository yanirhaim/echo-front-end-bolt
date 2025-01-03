import React from 'react';
import { Globe2, Volume2, Settings2 } from 'lucide-react';

interface LanguageSettingsProps {
  currentLanguage: string;
  onLanguageChange: (language: string) => void;
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

const LanguageSettings: React.FC<LanguageSettingsProps> = ({
  currentLanguage,
  onLanguageChange,
}) => {
  return (
    <div className="rounded-xl bg-white/5 backdrop-blur-xl border border-white/10 p-4 space-y-4">
      {/* Language Selection */}
      <div className="space-y-2">
        <div className="flex items-center space-x-2 text-white/60 text-sm">
          <Globe2 className="w-4 h-4" />
          <span>Translation Language</span>
        </div>
        <select
          value={currentLanguage}
          onChange={(e) => onLanguageChange(e.target.value)}
          className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white 
                   focus:outline-none focus:border-white/20"
        >
          {LANGUAGES.map(lang => (
            <option key={lang.code} value={lang.code}>
              {lang.name}
            </option>
          ))}
        </select>
      </div>

      {/* Voice Settings */}
      <div className="space-y-2">
        <div className="flex items-center space-x-2 text-white/60 text-sm">
          <Volume2 className="w-4 h-4" />
          <span>Voice Settings</span>
        </div>
        <div className="space-y-3 p-3 rounded-lg bg-white/5 border border-white/10">
          {/* Voice Selection */}
          <div className="space-y-1">
            <label className="text-sm text-white/40">Voice</label>
            <select className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white text-sm
                           focus:outline-none focus:border-white/20">
              <option value="voice1">Voice 1</option>
              <option value="voice2">Voice 2</option>
            </select>
          </div>

          {/* Auto-play Toggle */}
          <div className="flex items-center justify-between">
            <span className="text-sm text-white/40">Auto-play translations</span>
            <button className="w-12 h-6 rounded-full bg-white/5 border border-white/10 relative">
              <div className="absolute inset-y-1 left-1 w-4 h-4 rounded-full bg-white/40" />
            </button>
          </div>

          {/* Rate Control */}
          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <label className="text-sm text-white/40">Playback Rate</label>
              <span className="text-sm text-white/40">1x</span>
            </div>
            <input
              type="range"
              min="0.5"
              max="2"
              step="0.1"
              defaultValue="1"
              className="w-full accent-purple-500"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default LanguageSettings;