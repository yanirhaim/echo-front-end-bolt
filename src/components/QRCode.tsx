import React from 'react';
import { QrCode } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';

interface QRCodeProps {
  code: string;
  isStarted: boolean;
}

const QRCode: React.FC<QRCodeProps> = ({ code, isStarted }) => {
  // Get the current origin (protocol + host)
  const origin = window.location.origin;
  // Create the join URL
  const joinUrl = `${origin}/join/${code}`;

  return (
    <div className="rounded-3xl p-8 bg-white/5 backdrop-blur-xl border border-white/10 flex flex-col">
      <div className="flex items-center space-x-3 mb-8">
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center">
          <QrCode className="w-6 h-6 text-white" />
        </div>
        <div>
          <h2 className="text-2xl font-medium text-white">Quick Join</h2>
          <p className="text-white/60">Scan to Connect</p>
        </div>
      </div>
      
      <div className="flex-grow flex flex-col items-center justify-center">
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-br from-purple-500/20 to-blue-500/20 blur-xl" />
          <div className="relative backdrop-blur-xl bg-white/5 rounded-3xl p-8 border border-white/10">
            <div className="w-72 h-72 bg-white rounded-2xl p-4 flex items-center justify-center">
              <QRCodeSVG
                value={joinUrl}
                size={256}
                level="H"
                includeMargin={true}
                className="w-full h-full"
              />
            </div>
          </div>
        </div>

        <div className="mt-8 text-center">
          <p className="text-white/60 mb-2">Scan with your device camera</p>
          <p className="text-sm text-white/40">or share code: <span className="text-white/80">{code}</span></p>
          <p className="text-sm text-white/40 mt-2">
            <a href={joinUrl} className="text-blue-400 hover:text-blue-300 transition-colors" target="_blank" rel="noopener noreferrer">
              Open join link
            </a>
          </p>
        </div>
      </div>

      <div className="mt-8 rounded-xl p-4 bg-white/5 border border-white/10">
        <div className="flex items-center justify-center space-x-2">
          <div className={`w-2 h-2 rounded-full ${isStarted ? 'bg-green-400' : 'bg-white/40'} animate-pulse`} />
          <p className="text-white/60">
            {isStarted ? 'Meeting in progress' : 'Waiting for host to start'}
          </p>
        </div>
      </div>
    </div>
  );
};

export default QRCode;