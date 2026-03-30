
import React, { useState, useEffect } from 'react';
import { AppLogo, SunIcon, MoonIcon, SettingsIcon } from './icons';
import { View, Theme } from '../types';

interface HeaderProps {
    onNavigate: (view: View) => void;
    currentView: View;
    theme: Theme;
    toggleTheme: () => void;
}

const NavLink: React.FC<{
    onClick: () => void;
    isActive: boolean;
    children: React.ReactNode;
}> = ({ onClick, isActive, children }) => (
    <button
        onClick={onClick}
        className={`px-2 sm:px-4 py-1.5 sm:py-2 rounded-xl text-xs sm:text-sm font-bold transition-all relative group ${
            isActive
                ? 'text-brand-light-text dark:text-white bg-brand-primary/10'
                : 'text-brand-light-text-muted dark:text-brand-text-muted hover:text-brand-light-text dark:hover:text-white hover:bg-white/5'
        }`}
    >
        {children}
        {isActive && (
            <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 sm:w-1.5 sm:h-1.5 bg-brand-primary rounded-full shadow-[0_0_10px_rgba(0,255,149,0.8)]" />
        )}
    </button>
);

const ThemeToggle: React.FC<{ theme: Theme; toggleTheme: () => void }> = ({ theme, toggleTheme }) => (
    <button 
        onClick={toggleTheme} 
        className="relative w-12 h-6 rounded-full p-1 flex items-center transition-colors bg-brand-light-text/10 dark:bg-white/10 hover:bg-brand-light-text/20 dark:hover:bg-white/20"
        aria-label="Toggle theme"
    >
        <div className={`w-4 h-4 rounded-full flex items-center justify-center transform transition-all duration-300 ease-spring ${theme === 'dark' ? 'translate-x-6 bg-brand-secondary' : 'translate-x-0 bg-yellow-400'}`}>
            {theme === 'dark' ? <MoonIcon className="w-2.5 h-2.5 text-brand-dark" /> : <SunIcon className="w-2.5 h-2.5 text-white" />}
        </div>
    </button>
);

const Header: React.FC<HeaderProps> = ({ onNavigate, currentView, theme, toggleTheme }) => {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-500 px-2 sm:px-4 pt-2 sm:pt-4`}>
        <div className={`max-w-5xl mx-auto glass-v2 rounded-2xl transition-all duration-300 ${isScrolled ? 'py-1.5 px-3 sm:py-2 sm:px-4 shadow-xl translate-y-1 sm:translate-y-2' : 'py-2 px-4 sm:py-3 sm:px-6'}`}>
            <div className="flex items-center justify-between">
                <button onClick={() => onNavigate('home')} className="flex items-center gap-1.5 sm:gap-2 group transition-transform active:scale-95">
                    <div className="p-1 sm:p-1.5 rounded-lg bg-brand-primary/20 group-hover:bg-brand-primary/30 transition-colors">
                        <AppLogo className="w-4 h-4 sm:w-5 sm:h-5 text-brand-primary" />
                    </div>
                    <h1 className="font-display text-lg sm:text-xl font-black text-brand-light-text dark:text-white tracking-tighter">
                        Eco<span className="text-brand-primary">Med</span>
                    </h1>
                </button>

                <nav className="flex items-center gap-0.5 sm:gap-4">
                    <div className="flex items-center gap-0.5 sm:gap-1">
                        <NavLink onClick={() => onNavigate('history')} isActive={currentView === 'history'}>
                            Garden
                        </NavLink>
                        <NavLink onClick={() => onNavigate('feedback')} isActive={currentView === 'feedback'}>
                            Feedback
                        </NavLink>
                        <button 
                            onClick={() => onNavigate('settings')}
                            className={`p-1.5 sm:p-2 rounded-xl transition-all ${currentView === 'settings' ? 'text-brand-primary bg-brand-primary/10' : 'text-brand-light-text-muted dark:text-brand-text-muted hover:text-white'}`}
                        >
                            <SettingsIcon className={`w-4 h-4 sm:w-5 sm:h-5 ${currentView === 'settings' ? 'animate-spin-slow' : ''}`} />
                        </button>
                    </div>
                    <div className="h-3 sm:h-4 w-[1px] bg-brand-light-text/10 dark:bg-white/10 mx-0.5 sm:mx-2" />
                    <ThemeToggle theme={theme} toggleTheme={toggleTheme} />
                </nav>
            </div>
        </div>
    </header>
  );
};

export default Header;
