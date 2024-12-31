import React from 'react';
import { Activity } from 'lucide-react';

const SystemStatus: React.FC = () => (
  <div className="flex items-center justify-center space-x-2 py-2">
    <Activity className="w-4 h-4 text-green-400" />
    <span className="text-white/80 text-sm">System Status: Optimal</span>
  </div>
);

export default SystemStatus;