import React from 'react';
import { Transcript } from '../types';

interface TranscriptPanelProps {
  transcripts: Transcript[];
}

const TranscriptPanel: React.FC<TranscriptPanelProps> = ({ transcripts }) => {
  return (
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
              <div className="mt-2 border-t border-white/10 pt-2">
                <p className="text-white/60 text-sm">{transcript.translation}</p>
              </div>
            )}
            <p className="text-white/40 text-xs mt-2">
              {new Date(transcript.timestamp).toLocaleTimeString()}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TranscriptPanel;