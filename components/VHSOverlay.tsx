import React from 'react';
import { VHS_NOISE_SVG } from '../constants';

const VHSOverlay: React.FC = () => {
  return (
    <div className="fixed inset-0 pointer-events-none z-40 w-full h-full mix-blend-overlay opacity-30">
      {/* Scanlines */}
      <div 
        className="absolute inset-0 w-full h-full"
        style={{
          background: 'linear-gradient(rgba(18, 16, 16, 0) 50%, rgba(0, 0, 0, 0.25) 50%), linear-gradient(90deg, rgba(255, 0, 0, 0.06), rgba(0, 255, 0, 0.02), rgba(0, 0, 255, 0.06))',
          backgroundSize: '100% 2px, 3px 100%',
        }}
      />
      {/* Noise */}
      <div 
        className="absolute inset-0 w-full h-full opacity-20"
        style={{
          backgroundImage: `url("${VHS_NOISE_SVG}")`,
        }}
      />
      {/* Vignette */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_50%,rgba(0,0,0,0.8)_100%)]" />
    </div>
  );
};

export default VHSOverlay;