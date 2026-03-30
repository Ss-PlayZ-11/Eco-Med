
import React from 'react';
import { BackArrowIcon, FileTextIcon, ShieldIcon, AlertTriangleIcon, CheckCircleIcon } from './icons';
import TechButton from './TechButton';

interface TermsScreenProps {
    onBack: () => void;
}

const TermsScreen: React.FC<TermsScreenProps> = ({ onBack }) => {
    return (
        <div className="pt-24 animate-fade-in pb-20 max-w-3xl mx-auto">
            <div className="flex justify-between items-center mb-12">
                <h2 className="font-display text-4xl font-bold text-brand-light-text dark:text-white tracking-tight">Terms & Conditions</h2>
                <TechButton variant="ghost" size="md" onClick={onBack}>
                    <BackArrowIcon className="w-4 h-4" />
                    <span>Back</span>
                </TechButton>
            </div>

            <div className="space-y-12">
                <div className="flex flex-col items-center text-center space-y-6">
                    <div className="p-6 rounded-[2rem] bg-brand-secondary/10 border border-brand-secondary/20 shadow-2xl">
                        <FileTextIcon className="w-20 h-20 text-brand-secondary" />
                    </div>
                    <div>
                        <h3 className="text-3xl font-display font-black text-brand-light-text dark:text-white tracking-tighter mb-2">
                            Legal <span className="text-brand-secondary">Agreement</span>
                        </h3>
                        <p className="text-brand-light-text-muted dark:text-brand-text-muted font-medium">Last Updated: March 30, 2026</p>
                    </div>
                </div>

                <div className="grid gap-6">
                    <div className="glass-v2 p-8 rounded-[2.5rem] border-white/5 space-y-4">
                        <div className="flex items-center gap-3 text-brand-secondary">
                            <ShieldIcon className="w-6 h-6" />
                            <h4 className="font-bold text-xl">1. Acceptance of Terms</h4>
                        </div>
                        <p className="text-brand-light-text-muted dark:text-brand-text-muted leading-relaxed">
                            By accessing and using EcoMed AI, you agree to be bound by these Terms and Conditions. If you do not agree with any part of these terms, you must not use the application.
                        </p>
                    </div>

                    <div className="glass-v2 p-8 rounded-[2.5rem] border-white/5 space-y-4">
                        <div className="flex items-center gap-3 text-brand-accent">
                            <AlertTriangleIcon className="w-6 h-6" />
                            <h4 className="font-bold text-xl">2. Medical & Botanical Disclaimer</h4>
                        </div>
                        <p className="text-brand-light-text-muted dark:text-brand-text-muted leading-relaxed">
                            The information provided by EcoMed AI is for educational and informational purposes only. While our AI is highly accurate, it is not a substitute for professional botanical or agricultural advice. We are not responsible for any loss or damage resulting from the use of our recommendations.
                        </p>
                    </div>

                    <div className="glass-v2 p-8 rounded-[2.5rem] border-white/5 space-y-4">
                        <div className="flex items-center gap-3 text-brand-primary">
                            <CheckCircleIcon className="w-6 h-6" />
                            <h4 className="font-bold text-xl">3. User Data & Privacy</h4>
                        </div>
                        <p className="text-brand-light-text-muted dark:text-brand-text-muted leading-relaxed">
                            We respect your privacy. All plant images and diagnostic results are stored locally on your device unless you explicitly opt-in to cloud synchronization. We do not sell your personal information to third parties.
                        </p>
                    </div>

                    <div className="glass-v2 p-8 rounded-[2.5rem] border-white/5 space-y-4">
                        <div className="flex items-center gap-3 text-brand-secondary">
                            <FileTextIcon className="w-6 h-6" />
                            <h4 className="font-bold text-xl">4. Intellectual Property</h4>
                        </div>
                        <p className="text-brand-light-text-muted dark:text-brand-text-muted leading-relaxed">
                            All content, features, and functionality of EcoMed AI, including but not limited to the AI models, design, and code, are the exclusive property of EcoMed AI Technologies and are protected by international copyright and trademark laws.
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

export default TermsScreen;
