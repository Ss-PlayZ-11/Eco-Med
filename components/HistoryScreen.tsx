
import React, { useState } from 'react';
import { HistoryItem } from '../types';
import { BackArrowIcon, AppLogo, TrashIcon, AlertTriangleIcon, LogInIcon } from './icons';
import { User } from '../firebase';
import TechButton from './TechButton';

interface HistoryScreenProps {
  history: HistoryItem[];
  onBack: () => void;
  onClearHistory: () => void;
  onSelectItem: (item: HistoryItem) => void;
  user: User | null;
  onLogin: () => void;
}

const HistoryScreen: React.FC<HistoryScreenProps> = ({ history, onBack, onClearHistory, onSelectItem, user, onLogin }) => {
  const [showConfirm, setShowConfirm] = useState(false);

  const handleClear = () => {
    onClearHistory();
    setShowConfirm(false);
  }

  if (!user) {
    return (
      <div className="pt-24 animate-fade-in pb-20">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-12">
            <div>
                <div className="flex items-center gap-2 mb-2">
                   <div className="w-2 h-2 rounded-full bg-brand-primary animate-pulse shadow-[0_0_8px_rgba(16,185,129,1)]"></div>
                   <span className="text-xs uppercase tracking-widest font-bold opacity-50">Your Saved Plants</span>
                </div>
                <h2 className="font-display text-4xl sm:text-5xl font-bold text-brand-light-text dark:text-white tracking-tight">My Garden</h2>
            </div>
            
            <TechButton variant="ghost" size="md" onClick={onBack} className="group">
                <BackArrowIcon className="w-4 h-4" />
                <span>Back</span>
            </TechButton>
        </div>

        <div className="text-center py-24 px-6 glass rounded-[2.5rem] border-dashed border-2 border-brand-primary/20">
          <div className="w-24 h-24 rounded-full bg-brand-primary/10 flex items-center justify-center mx-auto mb-8 animate-float">
             <AppLogo className="w-12 h-12 text-brand-primary/40" />
          </div>
          <h3 className="text-3xl font-display font-bold text-brand-light-text dark:text-white">Cloud Sync Required</h3>
          <p className="mt-3 text-brand-light-text-muted dark:text-brand-text-muted max-w-sm mx-auto text-lg leading-relaxed">
            Log in with your Google account to save your plant history and access it from any device.
          </p>
          <button onClick={onLogin} className="mt-10 py-4 px-8 bg-brand-primary text-white font-bold text-lg rounded-2xl hover:opacity-90 transition-all btn-glow flex items-center gap-3 mx-auto active:scale-95">
            <LogInIcon className="w-6 h-6" />
            <span>Log In with Google</span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-24 animate-fade-in pb-20">
      {showConfirm && (
        <div className="fixed inset-0 z-[200] bg-brand-dark/90 backdrop-blur-xl flex items-center justify-center p-4">
          <div className="glass p-8 rounded-[2rem] max-w-sm w-full text-center animate-scale-in">
            <div className="w-16 h-16 bg-red-500/10 text-red-500 rounded-full flex items-center justify-center mx-auto mb-6">
                <TrashIcon className="w-8 h-8" />
            </div>
            <h3 className="text-2xl font-display font-bold text-brand-light-text dark:text-white">Clear Garden History?</h3>
            <p className="text-brand-light-text-muted dark:text-brand-text-muted mt-2 mb-8 leading-relaxed">This action will permanently erase your plant history from the cloud.</p>
            <div className="grid grid-cols-2 gap-4">
              <button onClick={() => setShowConfirm(false)} className="py-4 px-4 rounded-xl glass font-bold text-brand-light-text dark:text-white hover:bg-black/5 dark:hover:bg-white/5 transition-all">
                Cancel
              </button>
              <button onClick={handleClear} className="py-4 px-4 rounded-xl bg-red-500 text-white font-bold hover:bg-red-600 transition-all shadow-lg shadow-red-500/20">
                Clear All
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-12">
          <div>
              <div className="flex items-center gap-2 mb-2">
                 <div className="w-2 h-2 rounded-full bg-brand-primary animate-pulse shadow-[0_0_8px_rgba(16,185,129,1)]"></div>
                 <span className="text-xs uppercase tracking-widest font-bold opacity-50">Your Saved Plants</span>
              </div>
              <h2 className="font-display text-4xl sm:text-5xl font-bold text-brand-light-text dark:text-white tracking-tight">My Garden</h2>
          </div>
          
          <div className="flex items-center gap-3">
              <button
                  onClick={() => setShowConfirm(true)}
                  disabled={history.length === 0}
                  className="flex items-center gap-2 py-3 px-6 rounded-xl glass text-red-500 font-bold hover:bg-red-500/10 disabled:opacity-30 transition-all active:scale-95"
              >
                  <TrashIcon className="w-4 h-4" />
                  <span>Clear History</span>
              </button>
              <TechButton variant="ghost" size="md" onClick={onBack} className="group">
                  <BackArrowIcon className="w-4 h-4" />
                  <span>Back</span>
              </TechButton>
          </div>
      </div>

      {history.length === 0 ? (
        <div className="text-center py-24 px-6 glass rounded-[2.5rem] border-dashed border-2 border-brand-primary/20">
          <div className="w-24 h-24 rounded-full bg-brand-primary/10 flex items-center justify-center mx-auto mb-8 animate-float">
             <AppLogo className="w-12 h-12 text-brand-primary/40" />
          </div>
          <h3 className="text-3xl font-display font-bold text-brand-light-text dark:text-white">Your Garden is Empty</h3>
          <p className="mt-3 text-brand-light-text-muted dark:text-brand-text-muted max-w-sm mx-auto text-lg leading-relaxed">
            You haven't saved any plants yet. Snap a photo to get started.
          </p>
          <button onClick={onBack} className="mt-10 py-4 px-8 bg-brand-primary text-white font-bold text-lg rounded-2xl hover:opacity-90 transition-all btn-glow active:scale-95">
            Take Your First Photo
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {history.map((item, index) => (
            <HistoryItemCard key={item.id} item={item} index={index} onClick={() => onSelectItem(item)} />
          ))}
        </div>
      )}
    </div>
  );
};

const HistoryItemCard: React.FC<{ item: HistoryItem, index: number, onClick: () => void }> = ({ item, index, onClick }) => {
  const diagnosisDate = new Date(item.timestamp).toLocaleDateString(undefined, {
    month: 'short', day: 'numeric', year: 'numeric'
  });

  return (
    <div 
        onClick={onClick}
        className="group glass rounded-[2rem] overflow-hidden shadow-sm hover:shadow-2xl hover:shadow-brand-primary/10 transition-all duration-500 hover:-translate-y-2 animate-fade-in-up border border-white/10 cursor-pointer"
         style={{ animationDelay: `${index * 100}ms` }}>
        <div className="relative aspect-[4/3] overflow-hidden">
            <img src={item.image} alt={item.plantName} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 group-hover:rotate-1" />
            <div className="absolute inset-0 bg-gradient-to-t from-brand-dark via-brand-dark/20 to-transparent opacity-80"></div>
            
            <div className="absolute top-4 right-4 glass py-1.5 px-3 rounded-full flex items-center gap-2">
                <div className={`w-2 h-2 rounded-full ${item.isHealthy ? 'bg-brand-primary' : 'bg-orange-500'}`}></div>
                <span className="text-[10px] font-bold uppercase tracking-widest text-brand-light-text dark:text-white">
                    {Math.round(item.confidence * 100)}% Match
                </span>
            </div>

            <div className="absolute bottom-6 left-6 right-6">
                <h4 className="font-display font-bold text-2xl text-white tracking-tight leading-tight">{item.plantName}</h4>
                <div className="flex items-center justify-between mt-2">
                    <p className="text-[10px] uppercase font-bold text-brand-text-muted tracking-wider">{diagnosisDate}</p>
                    <div className="p-1 rounded bg-white/10 text-white hover:bg-brand-primary hover:text-white transition-colors">
                        <AppLogo className="w-4 h-4" />
                    </div>
                </div>
            </div>
        </div>
        <div className="p-6 bg-white/5 backdrop-blur-md">
          <div className={`flex items-center gap-3 p-3 rounded-2xl ${item.isHealthy ? 'bg-brand-primary/10 border border-brand-primary/20' : 'bg-orange-500/10 border border-orange-500/20'}`}>
            {item.isHealthy ? (
                <AppLogo className="w-5 h-5 text-brand-primary" />
            ) : (
                <AlertTriangleIcon className="w-5 h-5 text-orange-400" />
            )}
            <p className={`font-bold text-sm uppercase tracking-wider ${item.isHealthy ? 'text-brand-primary' : 'text-orange-400'}`}>
              {item.isHealthy ? 'Healthy' : item.disease}
            </p>
          </div>
          <p className="mt-4 text-xs text-brand-light-text-muted dark:text-brand-text-muted line-clamp-2 leading-relaxed">
              {item.description}
          </p>
        </div>
    </div>
  );
};


export default HistoryScreen;
