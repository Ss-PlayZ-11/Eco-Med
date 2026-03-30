
import React from 'react';
import { BackArrowIcon, AppLogo, SparklesIcon, DatabaseIcon, ShieldIcon } from './icons';
import TechButton from './TechButton';

interface IntroScreenProps {
    onBack: () => void;
}

const IntroScreen: React.FC<IntroScreenProps> = ({ onBack }) => {
    return (
        <div className="pt-24 animate-fade-in pb-20 max-w-3xl mx-auto">
            <div className="flex justify-between items-center mb-12">
                <h2 className="font-display text-4xl font-bold text-brand-light-text dark:text-white tracking-tight">Introduction</h2>
                <TechButton variant="ghost" size="md" onClick={onBack}>
                    <BackArrowIcon className="w-4 h-4" />
                    <span>Back</span>
                </TechButton>
            </div>

            <div className="space-y-12">
                <div className="flex flex-col items-center text-center space-y-6">
                    <div className="p-6 rounded-[2rem] bg-brand-primary/10 border border-brand-primary/20 shadow-2xl">
                        <AppLogo className="w-20 h-20 text-brand-primary" />
                    </div>
                    <div>
                        <h3 className="text-3xl font-display font-black text-brand-light-text dark:text-white tracking-tighter mb-2">
                            Eco<span className="text-brand-primary">Med</span> AI
                        </h3>
                        <p className="text-brand-light-text-muted dark:text-brand-text-muted font-medium">Your Advanced Plant Health Companion</p>
                    </div>
                </div>

                <div className="grid gap-6">
                    <div className="glass-v2 p-8 rounded-[2.5rem] border-white/5 space-y-4">
                        <div className="flex items-center gap-3 text-brand-primary">
                            <SparklesIcon className="w-6 h-6" />
                            <h4 className="font-bold text-xl">What is EcoMed?</h4>
                        </div>
                        <p className="text-brand-light-text-muted dark:text-brand-text-muted leading-relaxed">
                            EcoMed AI is a cutting-edge plant diagnostic tool that leverages advanced computer vision and artificial intelligence to identify plant diseases from simple photographs. Our mission is to empower gardeners, farmers, and plant enthusiasts with professional-grade botanical expertise in the palm of their hand.
                        </p>
                    </div>

                    <div className="glass-v2 p-8 rounded-[2.5rem] border-white/5 space-y-4">
                        <div className="flex items-center gap-3 text-brand-secondary">
                            <DatabaseIcon className="w-6 h-6" />
                            <h4 className="font-bold text-xl">How it Works</h4>
                        </div>
                        <p className="text-brand-light-text-muted dark:text-brand-text-muted leading-relaxed">
                            When you scan a plant, our AI analyzes thousands of visual patterns to detect anomalies. It doesn't just identify the disease; it provides a comprehensive breakdown of symptoms, organic and chemical treatment options, and long-term prevention strategies to ensure your garden thrives.
                        </p>
                    </div>

                    <div className="glass-v2 p-8 rounded-[2.5rem] border-white/5 space-y-4">
                        <div className="flex items-center gap-3 text-brand-accent">
                            <ShieldIcon className="w-6 h-6" />
                            <h4 className="font-bold text-xl">Our Commitment</h4>
                        </div>
                        <p className="text-brand-light-text-muted dark:text-brand-text-muted leading-relaxed">
                            We are committed to sustainable agriculture and ecological balance. By providing organic treatment alternatives, we help reduce chemical dependency in home gardens, promoting a healthier environment for everyone.
                        </p>
                    </div>
                </div>

                <div className="text-center pt-8">
                    <p className="text-sm text-brand-light-text-muted dark:text-brand-text-muted opacity-40">
                        © 2026 EcoMed AI Technologies. All rights reserved.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default IntroScreen;
