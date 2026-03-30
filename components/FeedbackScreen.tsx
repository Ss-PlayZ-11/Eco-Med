
import React, { useState, useMemo, useEffect } from 'react';
import { BackArrowIcon, StarIcon, CheckIcon, SparklesIcon } from './icons';

interface FeedbackScreenProps {
    onBack: () => void;
    initialComment?: string;
}

const EMOJI_REACTIONS = [
    { name: 'disappointed', emoji: '😞', label: 'Critical' },
    { name: 'neutral', emoji: '😐', label: 'Average' },
    { name: 'satisfied', emoji: '😊', label: 'Good' },
    { name: 'happy', emoji: '😄', label: 'Excellent' },
    { name: 'amazed', emoji: '🤩', label: 'Perfect' },
];

const FeedbackScreen: React.FC<FeedbackScreenProps> = ({ onBack, initialComment = '' }) => {
    const [step, setStep] = useState(1);
    const [rating, setRating] = useState(0);
    const [hoverRating, setHoverRating] = useState(0);
    const [reaction, setReaction] = useState<string | null>(null);
    const [comment, setComment] = useState(initialComment);

    const progress = useMemo(() => {
        const completed = [rating > 0, reaction !== null, comment.trim().length > 5].filter(Boolean).length;
        return (completed / 3) * 100;
    }, [rating, reaction, comment]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setStep(2);
    };

    useEffect(() => {
        if (step === 2) {
            const timer = setTimeout(onBack, 3500);
            return () => clearTimeout(timer);
        }
    }, [step, onBack]);

    return (
        <div className="pt-24 min-h-[80vh] flex items-center justify-center animate-fade-in">
            <button onClick={onBack} className="fixed top-24 left-4 sm:left-8 flex items-center gap-2 text-brand-light-text-muted dark:text-brand-text-muted hover:text-brand-primary transition-all z-20 group">
                <div className="p-2 rounded-full glass group-hover:bg-brand-primary/10 transition-colors">
                    <BackArrowIcon className="w-4 h-4" />
                </div>
                <span className="font-bold text-sm">Back</span>
            </button>

            <div className="relative w-full max-w-xl mx-auto glass rounded-[2.5rem] shadow-2xl overflow-hidden animate-scale-in">
                <div className="absolute top-0 left-0 right-0 h-1.5 bg-black/5 dark:bg-white/5">
                    <div
                        className="h-full bg-gradient-to-r from-brand-secondary via-brand-primary to-brand-secondary bg-[length:200%_100%] animate-[shimmer_3s_linear_infinite] transition-all duration-700 ease-out"
                        style={{ width: `${progress}%` }}
                    ></div>
                </div>

                {step === 1 ? (
                    <form onSubmit={handleSubmit} className="p-10 sm:p-14 space-y-12">
                        <div className="text-center">
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-primary/10 text-brand-primary text-xs font-bold uppercase tracking-widest mb-4">
                               <SparklesIcon className="w-3 h-3" /> Feedback
                            </div>
                            <h2 className="font-display text-4xl font-bold text-brand-light-text dark:text-white tracking-tight">EcoMed Feedback</h2>
                            <p className="text-brand-light-text-muted dark:text-brand-text-muted mt-2 text-lg">Help us improve the app.</p>
                        </div>
                        
                        <div className="space-y-6">
                            <label className="block text-center font-bold text-brand-light-text dark:text-white text-sm uppercase tracking-widest opacity-70">How was your experience?</label>
                            <div className="flex justify-between items-center gap-2">
                                {EMOJI_REACTIONS.map(({name, emoji, label}) => (
                                    <div key={name} className="flex-1 flex flex-col items-center">
                                        <button 
                                            type="button"
                                            onClick={() => setReaction(name)}
                                            className={`w-full py-4 rounded-2xl text-3xl transition-all duration-300 transform ${reaction === name ? 'bg-brand-primary text-white scale-110 shadow-xl shadow-brand-primary/20' : 'glass hover:scale-105 grayscale hover:grayscale-0 opacity-40 hover:opacity-100'}`}
                                            title={label}
                                        >
                                            {emoji}
                                        </button>
                                        <span className={`mt-3 text-xs font-bold uppercase tracking-tight transition-all ${reaction === name ? 'text-brand-primary' : 'text-brand-light-text-muted dark:text-brand-text-muted opacity-30'}`}>{label}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                        
                        <div className="space-y-6">
                             <label className="block text-center font-bold text-brand-light-text dark:text-white text-sm uppercase tracking-widest opacity-70">Rate the App</label>
                             <div className="flex justify-center items-center gap-3" onMouseLeave={() => setHoverRating(0)}>
                                {[1, 2, 3, 4, 5].map((star) => (
                                    <button
                                        key={star}
                                        type="button"
                                        onClick={() => setRating(star)}
                                        onMouseEnter={() => setHoverRating(star)}
                                        className="transition-transform active:scale-90"
                                    >
                                        <StarIcon 
                                            className={`w-10 h-10 transition-all duration-300 ${ (hoverRating || rating) >= star ? 'text-brand-primary fill-brand-primary drop-shadow-[0_0_8px_rgba(0,255,149,0.5)]' : 'text-white/10 fill-transparent' }`}
                                        />
                                    </button>
                                ))}
                             </div>
                        </div>
                        
                        <div className="relative group">
                            <textarea
                                id="comment"
                                value={comment}
                                onChange={(e) => setComment(e.target.value)}
                                className="peer block w-full h-32 px-6 py-4 bg-brand-light-bg dark:bg-brand-surface rounded-[1.5rem] border-2 border-transparent focus:border-brand-primary focus:outline-none transition-all text-brand-light-text dark:text-brand-text resize-none text-lg"
                                placeholder="Tell us more about your experience..."
                            ></textarea>
                            <div className="absolute bottom-4 right-4 text-xs font-bold text-brand-primary/40 uppercase tracking-widest">
                                {comment.length} Chars
                            </div>
                        </div>

                        <button 
                            type="submit" 
                            disabled={progress < 60}
                            className="w-full py-5 rounded-2xl bg-brand-primary text-white font-bold text-xl shadow-xl hover:opacity-90 transition-all disabled:opacity-20 disabled:grayscale btn-glow active:scale-95"
                        >
                            Submit Feedback
                        </button>
                    </form>
                ) : (
                    <div className="p-14 flex flex-col items-center justify-center text-center h-[34rem] animate-fade-in">
                        <div className="relative w-32 h-32 flex items-center justify-center mb-10">
                            <div className="absolute inset-0 bg-brand-primary/20 rounded-full animate-ping"></div>
                            <div className="w-24 h-24 bg-brand-primary text-white rounded-full flex items-center justify-center shadow-[0_0_30px_rgba(52,211,153,0.5)]">
                                <CheckIcon className="w-12 h-12" />
                            </div>
                        </div>
                        <h2 className="font-display text-5xl font-bold text-brand-light-text dark:text-white tracking-tight">Thank You!</h2>
                        <p className="text-brand-light-text-muted dark:text-brand-text-muted mt-4 text-xl leading-relaxed">Your feedback helps us improve EcoMed.</p>
                        <div className="mt-12 flex items-center gap-2 text-brand-primary font-bold uppercase tracking-widest text-xs animate-pulse">
                            Returning to Home
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default FeedbackScreen;
