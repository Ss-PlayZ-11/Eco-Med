
import React from 'react';

const BackgroundBlobs: React.FC = () => {
  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
      {/* Liquid Flowing Blobs */}
      <div className="absolute top-[-10%] left-[-5%] w-[60%] h-[60%] bg-brand-primary/10 animate-liquid blur-[120px]" style={{ animationDuration: '18s' }}></div>
      <div className="absolute bottom-[-5%] right-[-5%] w-[50%] h-[50%] bg-brand-secondary/10 animate-liquid blur-[120px]" style={{ animationDuration: '22s', animationDirection: 'reverse' }}></div>
      <div className="absolute top-[30%] right-[-10%] w-[40%] h-[40%] bg-brand-accent/10 animate-liquid blur-[100px]" style={{ animationDuration: '15s' }}></div>

      {/* Shifting Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-tr from-brand-dark/40 via-transparent to-brand-primary/5 opacity-40"></div>

      {/* Bio-Dust Particles */}
      {[...Array(20)].map((_, i) => (
        <div
          key={i}
          className="absolute w-1 h-1 bg-brand-primary rounded-full opacity-10 animate-drift"
          style={{
            top: `${Math.random() * 100}%`,
            left: `${Math.random() * 100}%`,
            animationDelay: `${Math.random() * 10}s`,
            animationDuration: `${20 + Math.random() * 15}s`,
            transform: `scale(${Math.random()})`,
          }}
        ></div>
      ))}

      {/* Grid Scanline (Vertical Movement) */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-brand-primary/5 to-transparent h-32 w-full animate-glitch-scan opacity-20"></div>
    </div>
  );
};

export default BackgroundBlobs;
