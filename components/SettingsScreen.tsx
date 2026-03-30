
import React, { useState, useEffect } from 'react';
import { AppSettings } from '../types';
import { BackArrowIcon, RefreshCwIcon, DatabaseIcon, SparklesIcon, TrashIcon, InfoIcon, FileTextIcon, LogOutIcon, LogInIcon } from './icons';
import TechButton from './TechButton';
import { User } from '../firebase';

interface SettingsScreenProps {
    onBack: () => void;
    onNavigate: (view: any) => void;
    user: User | null;
    onLogin: () => void;
    onLogout: () => void;
}

const SettingsOption: React.FC<{
    label: string;
    description: string;
    enabled: boolean;
    onToggle: () => void;
}> = ({ label, description, enabled, onToggle }) => (
    <div className="flex items-center justify-between p-6 glass-v2 rounded-3xl border-white/5 hover:border-brand-primary/20 transition-all group">
        <div className="space-y-1">
            <h4 className="text-lg font-bold text-brand-light-text dark:text-white tracking-tight">{label}</h4>
            <p className="text-sm text-brand-light-text-muted dark:text-brand-text-muted leading-relaxed opacity-60">{description}</p>
        </div>
        <button 
            onClick={onToggle}
            className={`relative w-14 h-8 rounded-full transition-all duration-300 ${enabled ? 'bg-brand-primary' : 'bg-brand-light-text/10 dark:bg-white/10'}`}
        >
            <div className={`absolute top-1 left-1 w-6 h-6 rounded-full bg-white transition-transform duration-300 ${enabled ? 'translate-x-6' : 'translate-x-0'}`}></div>
        </button>
    </div>
);

const SettingsScreen: React.FC<SettingsScreenProps> = ({ onBack, onNavigate, user, onLogin, onLogout }) => {
    const [settings, setSettings] = useState<AppSettings>({
        soundEffects: true,
        autoSave: true,
    });
    const [showResetConfirm, setShowResetConfirm] = useState(false);

    useEffect(() => {
        const savedSettings = localStorage.getItem('appSettings');
        if (savedSettings) {
            setSettings(JSON.parse(savedSettings));
        }
    }, []);

    const toggleSetting = (key: keyof AppSettings) => {
        const newSettings = { ...settings, [key]: !settings[key] };
        setSettings(newSettings);
        localStorage.setItem('appSettings', JSON.stringify(newSettings));
    };

    const handleResetData = () => {
        localStorage.clear();
        window.location.reload();
    };

    return (
        <div className="pt-24 animate-fade-in pb-20">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-12">
                <div>
                    <div className="flex items-center gap-2 mb-2">
                        <div className="w-2 h-2 rounded-full bg-brand-secondary animate-pulse shadow-[0_0_8px_rgba(52,211,153,1)]"></div>
                        <span className="text-xs uppercase tracking-widest font-bold opacity-50">App Preferences</span>
                    </div>
                    <h2 className="font-display text-4xl sm:text-5xl font-bold text-brand-light-text dark:text-white tracking-tight">Settings</h2>
                </div>

                <TechButton variant="ghost" size="md" onClick={onBack} className="group">
                    <BackArrowIcon className="w-4 h-4" />
                    <span>Back</span>
                </TechButton>
            </div>

            {/* User Profile Section */}
            <div className="mb-12 glass-v2 p-8 rounded-[2.5rem] border-white/5 flex flex-col md:flex-row items-center justify-between gap-6">
                <div className="flex items-center gap-6">
                    <div className="w-20 h-20 rounded-full bg-brand-primary/10 border-2 border-brand-primary/20 flex items-center justify-center overflow-hidden">
                        {user?.photoURL ? (
                            <img src={user.photoURL} alt={user.displayName || 'User'} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                        ) : (
                            <div className="text-3xl font-bold text-brand-primary">
                                {user?.displayName?.[0] || user?.email?.[0] || '?'}
                            </div>
                        )}
                    </div>
                    <div className="space-y-1">
                        <h3 className="text-2xl font-bold text-brand-light-text dark:text-white tracking-tight">
                            {user ? (user.displayName || 'EcoMed User') : 'Guest Mode'}
                        </h3>
                        <p className="text-sm text-brand-light-text-muted dark:text-brand-text-muted opacity-60">
                            {user ? user.email : 'Log in to sync your garden across devices.'}
                        </p>
                    </div>
                </div>

                {user ? (
                    <TechButton variant="ghost" size="md" onClick={onLogout} className="text-red-500 hover:bg-red-500/10">
                        <LogOutIcon className="w-5 h-5" />
                        <span>Log Out</span>
                    </TechButton>
                ) : (
                    <TechButton variant="primary" size="md" onClick={onLogin}>
                        <LogInIcon className="w-5 h-5" />
                        <span>Log In with Google</span>
                    </TechButton>
                )}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Audio/Visual Section */}
                <div className="space-y-6">
                    <div className="flex items-center gap-3 px-6 py-2">
                        <SparklesIcon className="w-5 h-5 text-brand-primary" />
                        <h3 className="text-xs font-bold uppercase tracking-widest text-brand-primary opacity-60">Visual & Interaction</h3>
                    </div>
                    <SettingsOption 
                        label="Sound & Vibration" 
                        description="Enable sound and vibration feedback."
                        enabled={settings.soundEffects}
                        onToggle={() => toggleSetting('soundEffects')}
                    />
                </div>

                {/* Engine Section */}
                <div className="space-y-6">
                    <div className="flex items-center gap-3 px-6 py-2">
                        <DatabaseIcon className="w-5 h-5 text-brand-secondary" />
                        <h3 className="text-xs font-bold uppercase tracking-widest text-brand-secondary opacity-60">Data & Privacy</h3>
                    </div>
                    <SettingsOption 
                        label="Auto-Save Plants" 
                        description="Automatically save all scanned plants to your garden."
                        enabled={settings.autoSave}
                        onToggle={() => toggleSetting('autoSave')}
                    />
                </div>
            </div>

            {/* Legal & Info Section */}
            <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-6">
                <button 
                    onClick={() => onNavigate('intro')}
                    className="flex items-center gap-4 p-6 glass-v2 rounded-3xl border-white/5 hover:border-brand-primary/20 transition-all text-left group"
                >
                    <div className="p-3 rounded-2xl bg-brand-primary/10 text-brand-primary group-hover:scale-110 transition-transform">
                        <InfoIcon className="w-6 h-6" />
                    </div>
                    <div>
                        <h4 className="text-lg font-bold text-brand-light-text dark:text-white">Introduction</h4>
                        <p className="text-sm text-brand-light-text-muted dark:text-brand-text-muted opacity-60">Learn more about EcoMed AI.</p>
                    </div>
                </button>

                <button 
                    onClick={() => onNavigate('terms')}
                    className="flex items-center gap-4 p-6 glass-v2 rounded-3xl border-white/5 hover:border-brand-primary/20 transition-all text-left group"
                >
                    <div className="p-3 rounded-2xl bg-brand-secondary/10 text-brand-secondary group-hover:scale-110 transition-transform">
                        <FileTextIcon className="w-6 h-6" />
                    </div>
                    <div>
                        <h4 className="text-lg font-bold text-brand-light-text dark:text-white">Terms & Conditions</h4>
                        <p className="text-sm text-brand-light-text-muted dark:text-brand-text-muted opacity-60">Legal information and usage terms.</p>
                    </div>
                </button>
            </div>

            {/* System Info */}
            <div className="mt-12 glass-v2 p-10 rounded-[3rem] border-white/5 flex flex-col md:flex-row items-center justify-between gap-8">
                <div className="flex gap-8">
                    <div>
                        <p className="text-[10px] font-bold uppercase tracking-widest text-brand-text-muted opacity-40 mb-1">App Version</p>
                        <p className="text-xl font-display font-bold text-brand-light-text dark:text-white tracking-tight">1.0.0</p>
                    </div>
                    <div>
                        <p className="text-[10px] font-bold uppercase tracking-widest text-brand-text-muted opacity-40 mb-1">Status</p>
                        <p className="text-xl font-display font-bold text-brand-light-text dark:text-white tracking-tight">Online</p>
                    </div>
                </div>

                <div className="flex gap-4">
                     <TechButton 
                        variant="secondary" 
                        size="md" 
                        onClick={() => window.location.reload()}
                    >
                        <RefreshCwIcon className="w-5 h-5" />
                        <span>Refresh App</span>
                    </TechButton>
                    
                    {showResetConfirm ? (
                        <div className="flex gap-2 animate-scale-in">
                            <TechButton variant="primary" size="md" onClick={handleResetData}>Confirm</TechButton>
                            <TechButton variant="ghost" size="md" onClick={() => setShowResetConfirm(false)}>Cancel</TechButton>
                        </div>
                    ) : (
                        <TechButton 
                            variant="ghost" 
                            size="md" 
                            className="text-red-500 hover:bg-red-500/10"
                            onClick={() => setShowResetConfirm(true)}
                        >
                            <TrashIcon className="w-5 h-5" />
                            <span>Reset All Data</span>
                        </TechButton>
                    )}
                </div>
            </div>

            {/* Network Visualization (HUD Decoration) */}
            <div className="mt-20 flex justify-center opacity-10 pointer-events-none">
                <div className="relative w-64 h-64 border-4 border-brand-primary rounded-full animate-spin-slow">
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-4 h-4 bg-brand-primary rounded-full"></div>
                    <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-4 h-4 bg-brand-secondary rounded-full"></div>
                    <div className="absolute left-0 top-1/2 -translate-y-1/2 w-4 h-4 bg-brand-accent rounded-full"></div>
                </div>
            </div>
        </div>
    );
};

export default SettingsScreen;
