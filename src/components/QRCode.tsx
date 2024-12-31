import React from 'react';
import { QrCode } from 'lucide-react';

interface QRCodeProps {
  code: string;
  isStarted: boolean;
}

const QRCode: React.FC<QRCodeProps> = ({ code, isStarted }) => (
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
          <div className="w-72 h-72 bg-white rounded-2xl p-4">
            <svg viewBox="0 0 100 100" className="w-full h-full">
              <defs>
                <linearGradient id="qr-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" style={{ stopColor: '#8B5CF6' }} />
                  <stop offset="100%" style={{ stopColor: '#3B82F6' }} />
                </linearGradient>
              </defs>
              <rect x="10" y="10" width="80" height="80" fill="none" stroke="url(#qr-gradient)" strokeWidth="2" />
              <rect x="20" y="20" width="20" height="20" fill="url(#qr-gradient)" />
              <rect x="60" y="20" width="20" height="20" fill="url(#qr-gradient)" />
              <rect x="20" y="60" width="20" height="20" fill="url(#qr-gradient)" />
              <pattern id="dots" width="5" height="5" patternUnits="userSpaceOnUse">
                <circle cx="2.5" cy="2.5" r="1" fill="url(#qr-gradient)" />
              </pattern>
              <rect x="50" y="50" width="30" height="30" fill="url(#dots)" />
            </svg>
          </div>
        </div>
      </div>

      <div className="mt-8 text-center">
        <p className="text-white/60 mb-2">Scan with your device camera</p>
        <p className="text-sm text-white/40">or share code: <span className="text-white/80">{code}</span></p>
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
)

export default QRCode;