
import React from 'react';
import { View } from '../types';
import { CameraIcon, UploadIcon, AppLogo, SparklesIcon } from './icons';
import TechButton from './TechButton';

interface HomeScreenProps {
  onNavigate: (view: View, options?: { autoUpload?: boolean }) => void;
}

const HomeScreen: React.FC<HomeScreenProps> = ({ onNavigate }) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] text-center relative pt-0">
      {/* Hero Visual Unit */}
      <div className="relative mb-6 sm:mb-16 group perspective-1000">
        <div className="relative z-10 p-10 rounded-3xl bg-white/10 backdrop-blur-lg border border-white/20 shadow-xl group-hover:scale-105 transition-transform duration-500">
            <AppLogo className="w-32 h-32 text-brand-primary" />
            <div className="absolute -top-2 -right-2 p-3 bg-brand-secondary rounded-xl text-white shadow-lg">
                <SparklesIcon className="w-6 h-6" />
            </div>
        </div>
      </div>

      <div className="animate-fade-in-up space-y-2 sm:space-y-8">
        <div className="inline-flex items-center gap-3 px-8 py-2.5 rounded-full glass-v2 border-brand-primary/30 text-brand-primary text-xs font-bold uppercase tracking-widest">
           <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-primary opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-brand-primary"></span>
           </span>
           READY TO HELP
        </div>
        
        <h1 className="font-display text-5xl sm:text-7xl md:text-8xl font-black text-brand-light-text dark:text-white tracking-tight leading-[1.1] overflow-hidden">
          <span className="block animate-reveal [animation-delay:100ms]">Eco<span className="text-brand-primary">Med</span></span>
          <span className="block text-2xl sm:text-4xl text-brand-accent animate-reveal [animation-delay:300ms] mt-2 font-medium">Your Plant Doctor</span>
        </h1>
        
        <p className="max-w-2xl mx-auto text-lg sm:text-xl text-brand-light-text-muted dark:text-brand-text-muted leading-relaxed font-medium opacity-0 animate-reveal [animation-delay:500ms]">
          Your friendly AI assistant for plant care. Snap a photo to identify diseases and get easy-to-follow treatment advice.
        </p>
      </div>

      <div className="mt-1 sm:mt-16 flex flex-col sm:flex-row gap-4 sm:gap-6 animate-fade-in-up [animation-delay:700ms]">
        <TechButton
          size="xl"
          variant="primary"
          onClick={() => onNavigate('scan')}
          className="w-full sm:w-72 group"
        >
          <CameraIcon className="w-8 h-8 group-hover:scale-110 transition-transform" />
          TAKE A PHOTO
        </TechButton>
        
        <TechButton
          size="xl"
          variant="secondary"
          onClick={() => onNavigate('scan', { autoUpload: true })}
          className="w-full sm:w-72"
        >
          <UploadIcon className="w-6 h-6" />
          UPLOAD PHOTO
        </TechButton>
      </div>

      <div className="mt-12 sm:mt-24 w-full max-w-3xl flex items-center justify-between opacity-50 px-6">
          <div className="h-px w-1/4 bg-gradient-to-r from-transparent to-brand-primary"></div>
          <div className="flex gap-8">
              <div className="flex flex-col items-center">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-brand-primary">Powered by AI</span>
              </div>
              <div className="flex flex-col items-center">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-brand-secondary">Expert Advice</span>
              </div>
          </div>
          <div className="h-px w-1/4 bg-gradient-to-l from-transparent to-brand-primary"></div>
      </div>
    </div>
  );
};

export default HomeScreen;
