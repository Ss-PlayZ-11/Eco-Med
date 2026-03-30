
import React, { useState, useEffect, useCallback } from 'react';
import { Diagnosis } from '../types';
import { SparklesIcon, ChevronDownIcon, ShareIcon, RefreshCwIcon, CheckIcon, AlertTriangleIcon, XIcon, DnaIcon, CheckCircleIcon, AppLogo } from './icons';
import { generateCuredVision } from '../services/geminiService';

interface DiagnosisResultScreenProps {
  diagnosis: Diagnosis;
  imageSrc: string | null;
  onSave: () => void;
  onDiscard: () => void;
  onReportIncorrect: () => void;
  isSaved?: boolean;
}

const ScanningImage: React.FC<{ src: string; alt: string; onClick?: () => void }> = ({ src, alt, onClick }) => (
    <div className="relative group cursor-zoom-in overflow-hidden rounded-[3rem] border border-brand-primary/20 bg-brand-dark" onClick={onClick}>
        <img src={src} alt={alt} className="w-full h-full object-cover aspect-square sm:aspect-video transition-transform duration-700 group-hover:scale-110" />
        <div className="absolute inset-0 bg-brand-primary/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
        {/* HUD Overlay */}
        <div className="absolute inset-6 border border-brand-primary/40 rounded-3xl pointer-events-none group-hover:border-brand-primary transition-colors">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 px-3 py-1 bg-brand-primary/20 text-brand-primary text-[8px] font-bold tracking-widest uppercase rounded-b">Image Analysis</div>
            <div className="hud-line animate-scan opacity-40"></div>
        </div>
    </div>
);

const TechGauge: React.FC<{ progress: number; color: string }> = ({ progress, color }) => {
    const [displayProgress, setDisplayProgress] = useState(0);
    const strokeWidth = 8;
    const size = 160;
    const radius = (size - strokeWidth) / 2;
    const circumference = Math.PI * radius;

    useEffect(() => {
        const timer = setTimeout(() => setDisplayProgress(progress), 300);
        return () => clearTimeout(timer);
    }, [progress]);
    
    const offset = circumference - (displayProgress / 100) * circumference;

    return (
        <div className="relative flex flex-col items-center" style={{ width: size, height: size / 1.8 }}>
            <svg width={size} height={size/2 + strokeWidth} viewBox={`0 0 ${size} ${size/2 + strokeWidth}`} className="overflow-visible">
                <path d={`M ${strokeWidth/2},${size/2} a ${radius},${radius} 0 0,1 ${radius*2},0`}
                    className="stroke-brand-primary/10" fill="none" strokeWidth={strokeWidth} strokeLinecap="round" />
                <path d={`M ${strokeWidth/2},${size/2} a ${radius},${radius} 0 0,1 ${radius*2},0`}
                    stroke={color} fill="none" strokeWidth={strokeWidth} strokeLinecap="round"
                    strokeDasharray={circumference} strokeDashoffset={offset}
                    className="transition-all duration-[2s] cubic-bezier(0.16, 1, 0.3, 1)" />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-end">
                <span className="text-5xl font-display font-bold tracking-tight" style={{ color, textShadow: `0 0 10px ${color}80` }}>{Math.round(displayProgress)}%</span>
                <span className="text-[10px] text-brand-text-muted uppercase tracking-widest font-bold opacity-50">CONFIDENCE</span>
            </div>
        </div>
    );
};

const DiagnosisResultScreen: React.FC<DiagnosisResultScreenProps> = ({ diagnosis, imageSrc, onSave, onDiscard, onReportIncorrect, isSaved }) => {
    const [curedImage, setCuredImage] = useState<string | null>(null);
    const [isGenerating, setIsGenerating] = useState(false);
    const [fullscreenImage, setFullscreenImage] = useState<string | null>(null);

    const confidenceValue = Math.round(diagnosis.confidence * 100);
    const confidenceColor = confidenceValue > 85 ? '#00FF95' : confidenceValue > 65 ? '#00F0FF' : '#FF3366';

    const handleGenerateCured = async () => {
        setIsGenerating(true);
        try {
            const url = await generateCuredVision(diagnosis.plantName, diagnosis.disease);
            setCuredImage(url);
        } catch (err) {
            console.error(err);
        } finally {
            setIsGenerating(false);
        }
    };

    return (
        <div className="space-y-10 pb-48 max-w-5xl mx-auto animate-fade-in">
            {fullscreenImage && (
                <div 
                    className="fixed inset-0 z-[200] bg-brand-dark/95 backdrop-blur-2xl flex items-center justify-center p-6"
                    onClick={() => setFullscreenImage(null)}
                >
                    <button className="absolute top-10 right-10 w-16 h-16 glass-v2 rounded-full flex items-center justify-center text-white hover:scale-110 transition-all border-white/20">
                        <XIcon className="w-8 h-8" />
                    </button>
                    <img src={fullscreenImage} alt="Fullscreen" className="max-w-full max-h-full object-contain rounded-3xl shadow-2xl animate-scale-in" />
                </div>
            )}

            {/* Diagnosis Identity Section */}
            <div className="glass-v2 p-12 rounded-[3.5rem] relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-80 h-80 bg-brand-primary/10 blur-[120px] rounded-full"></div>
                
                <div className="flex flex-col lg:flex-row gap-16 items-center lg:items-end">
                    <div className="w-full lg:w-3/5 space-y-8">
                        <div className="flex items-center gap-4">
                            <div className="p-4 bg-brand-primary/20 text-brand-primary rounded-3xl animate-pulse">
                                <DnaIcon className="w-8 h-8" />
                            </div>
                            <span className="text-xs font-bold uppercase tracking-widest text-brand-primary/60">Diagnosis Report</span>
                        </div>
                        
                        <h2 className="font-display text-5xl sm:text-7xl font-bold text-white leading-tight tracking-tight">
                            {diagnosis.plantName}
                        </h2>

                        <div className="flex flex-wrap gap-4">
                            <div className={`inline-flex items-center gap-3 px-8 py-3 rounded-full font-bold text-sm uppercase tracking-wider ${diagnosis.isHealthy ? 'bg-brand-primary text-white' : 'bg-red-500 text-white animate-pulse'}`}>
                                {diagnosis.isHealthy ? <CheckIcon className="w-5 h-5"/> : <AlertTriangleIcon className="w-5 h-5"/>}
                                {diagnosis.isHealthy ? 'HEALTHY' : 'ISSUE DETECTED'}
                            </div>
                            {!diagnosis.isHealthy && (
                                <div className="px-8 py-3 rounded-full glass-v2 border-brand-secondary/20 text-brand-secondary font-bold text-sm tracking-wide">
                                    {diagnosis.disease}
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="w-full lg:w-2/5 flex flex-col items-center lg:items-end gap-8">
                        <TechGauge progress={confidenceValue} color={confidenceColor} />
                        <div className="flex gap-4 w-full">
                            <div className="flex-1 glass-v2 p-5 rounded-3xl border-l-4 border-brand-primary">
                                <p className="text-[10px] font-bold text-brand-primary/60 uppercase tracking-widest mb-1">Species</p>
                                <p className="text-xl font-display font-bold text-white tracking-tight">{diagnosis.plantName.split(' ')[0]}</p>
                            </div>
                            <div className="flex-1 glass-v2 p-5 rounded-3xl border-l-4 border-brand-secondary">
                                <p className="text-[10px] font-bold text-brand-secondary/60 uppercase tracking-widest mb-1">Status</p>
                                <p className="text-xl font-display font-bold text-white tracking-tight">{diagnosis.isHealthy ? 'HEALTHY' : 'NEEDS ATTENTION'}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Evidence Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                <div className="space-y-4">
                    <p className="px-6 text-[10px] font-bold uppercase tracking-widest text-brand-text-muted opacity-50">Your Photo</p>
                    {imageSrc && <ScanningImage src={imageSrc} alt="Sample" onClick={() => setFullscreenImage(imageSrc)} />}
                </div>

                <div className="glass-v2 p-12 rounded-[3.5rem] flex flex-col justify-center relative border-brand-primary/10">
                    <div className="absolute top-10 right-10 p-4 rounded-full bg-white/5 text-brand-primary/40">
                        <SparklesIcon className="w-10 h-10" />
                    </div>
                    <h3 className="text-xs font-bold uppercase tracking-widest text-brand-primary mb-10">AI Analysis</h3>
                    <p className="text-2xl sm:text-3xl font-display font-medium text-white leading-snug tracking-tight mb-12">
                        "{diagnosis.description}"
                    </p>
                    <div className="flex flex-wrap gap-3">
                        {diagnosis.symptoms.slice(0, 4).map((symp, i) => (
                            <span key={i} className="px-5 py-2 glass-v2 border-white/5 text-brand-text-muted text-[11px] font-bold uppercase rounded-xl">
                                • {symp}
                            </span>
                        ))}
                    </div>
                </div>
            </div>

            {/* Treatment & Prevention Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                <div className="glass-v2 p-10 rounded-[3.5rem] border-brand-secondary/20 space-y-8">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-brand-secondary/20 text-brand-secondary rounded-2xl">
                            <AppLogo className="w-6 h-6" />
                        </div>
                        <h3 className="text-xl font-display font-bold text-white tracking-tight uppercase">Treatment Plan</h3>
                    </div>
                    
                    <div className="space-y-6">
                        <div>
                            <p className="text-[10px] font-bold text-brand-secondary/60 uppercase tracking-widest mb-3">Immediate Actions (Organic)</p>
                            <ul className="space-y-3">
                                {diagnosis.treatments.organic.map((item, i) => (
                                    <li key={i} className="flex items-start gap-3 text-brand-text-muted text-sm leading-relaxed">
                                        <span className="w-1.5 h-1.5 bg-brand-secondary rounded-full mt-2 flex-shrink-0" />
                                        {item}
                                    </li>
                                ))}
                            </ul>
                        </div>
                        
                        {diagnosis.treatments.chemical.length > 0 && (
                            <div>
                                <p className="text-[10px] font-bold text-red-400/60 uppercase tracking-widest mb-3">Chemical Solutions</p>
                                <ul className="space-y-3">
                                    {diagnosis.treatments.chemical.map((item, i) => (
                                        <li key={i} className="flex items-start gap-3 text-brand-text-muted text-sm leading-relaxed">
                                            <span className="w-1.5 h-1.5 bg-red-400 rounded-full mt-2 flex-shrink-0" />
                                            {item}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}
                    </div>
                </div>

                <div className="glass-v2 p-10 rounded-[3.5rem] border-brand-primary/20 space-y-8">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-brand-primary/20 text-brand-primary rounded-2xl">
                            <AppLogo className="w-6 h-6" />
                        </div>
                        <h3 className="text-xl font-display font-bold text-white tracking-tight uppercase">Prevention Strategy</h3>
                    </div>
                    
                    <div className="space-y-4">
                        <p className="text-[10px] font-bold text-brand-primary/60 uppercase tracking-widest mb-3">Long-term Precautions</p>
                        <ul className="space-y-3">
                            {diagnosis.prevention.map((item, i) => (
                                <li key={i} className="flex items-start gap-3 text-brand-text-muted text-sm leading-relaxed">
                                    <span className="w-1.5 h-1.5 bg-brand-primary rounded-full mt-2 flex-shrink-0" />
                                    {item}
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>

            {/* Predictive Visual Section */}
            <div className="glass-v2 p-12 rounded-[4rem] border-brand-primary/20">
                <div className="flex flex-col md:flex-row gap-16 items-center">
                    <div className="flex-1 space-y-6">
                        <div className="inline-flex items-center gap-3 text-brand-primary text-xs font-bold uppercase tracking-widest animate-pulse">
                           <SparklesIcon className="w-5 h-5" /> AI Visualization
                        </div>
                        <h3 className="text-4xl sm:text-5xl font-display font-bold text-white tracking-tight leading-none">SEE IT HEALTHY</h3>
                        <p className="text-brand-text-muted text-lg sm:text-xl leading-relaxed">
                            See what your plant could look like after treatment and recovery.
                        </p>
                        {!curedImage && (
                            <button 
                                onClick={handleGenerateCured}
                                disabled={isGenerating}
                                className="mt-6 px-10 py-5 bg-brand-primary text-white font-bold text-lg rounded-3xl flex items-center gap-4 transition-all hover:scale-105 active:scale-95 shadow-xl shadow-brand-primary/20"
                            >
                                {isGenerating ? <RefreshCwIcon className="w-6 h-6 animate-spin" /> : <SparklesIcon className="w-6 h-6" />}
                                GENERATE IMAGE
                            </button>
                        )}
                    </div>
                    <div className="w-full md:w-96 h-96 flex-shrink-0">
                        {curedImage ? (
                            <ScanningImage src={curedImage} alt="Future" onClick={() => setFullscreenImage(curedImage)} />
                        ) : (
                            <div className="w-full h-full glass-v2 rounded-[3.5rem] border-dashed border-2 border-white/10 flex flex-col items-center justify-center text-white/10 relative overflow-hidden">
                                {isGenerating ? (
                                    <div className="flex flex-col items-center gap-6">
                                        <div className="w-20 h-20 border-4 border-brand-primary/20 border-t-brand-primary rounded-full animate-spin"></div>
                                        <p className="text-xs font-bold tracking-widest uppercase animate-pulse">Generating...</p>
                                    </div>
                                ) : (
                                    <SparklesIcon className="w-24 h-24 opacity-10" />
                                )}
                                <div className="hud-line animate-scan opacity-20"></div>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Bottom Controls */}
            <div className="fixed bottom-12 left-1/2 -translate-x-1/2 w-[90%] max-w-2xl glass-v2 p-4 rounded-[3rem] shadow-[0_40px_80px_-20px_rgba(0,0,0,0.9)] z-[100] flex gap-4 border-white/10 animate-fade-in-up">
                <button onClick={onDiscard} className="p-6 rounded-3xl glass-v2 text-white/60 hover:text-white transition-all active:scale-90">
                    <RefreshCwIcon className="w-8 h-8" />
                </button>
                <button onClick={() => {}} className="p-6 rounded-3xl glass-v2 text-white/60 hover:text-white transition-all active:scale-90">
                    <ShareIcon className="w-8 h-8" />
                </button>
                <button onClick={onSave} className="flex-grow py-6 rounded-3xl bg-brand-primary text-white font-bold text-xl flex items-center justify-center gap-4 hover:shadow-2xl active:scale-95 transition-all">
                    <CheckIcon className="w-8 h-8" />
                    {isSaved ? 'BACK TO GARDEN' : 'SAVE TO GARDEN'}
                </button>
            </div>
        </div>
    );
};

export default DiagnosisResultScreen;
