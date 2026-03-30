
import React, { useState } from 'react';
import { AppLogo, SparklesIcon, CameraIcon, CheckIcon } from './icons';

interface OnboardingProps {
    onComplete: () => void;
}

const STEPS = [
    {
        title: "Welcome to EcoMed",
        description: "Your personal AI plant doctor. We help you identify diseases and heal your garden in seconds.",
        icon: <AppLogo className="w-16 h-16 text-brand-primary" />,
        color: "from-brand-primary to-green-500"
    },
    {
        title: "Scan Your Plants",
        description: "Just point your camera or upload a photo. Our AI analyzes leaf patterns to detect even the subtlest issues.",
        icon: <CameraIcon className="w-16 h-16 text-brand-secondary" />,
        color: "from-brand-secondary to-blue-500"
    },
    {
        title: "See the Results",
        description: "Get detailed treatment plans and see a vision of your plant fully recovered.",
        icon: <SparklesIcon className="w-16 h-16 text-brand-accent" />,
        color: "from-brand-accent to-purple-600"
    }
];

const Onboarding: React.FC<OnboardingProps> = ({ onComplete }) => {
    const [currentStep, setCurrentStep] = useState(0);

    const next = () => {
        if (currentStep < STEPS.length - 1) {
            setCurrentStep(currentStep + 1);
        } else {
            onComplete();
        }
    };

    const step = STEPS[currentStep];

    return (
        <div className="fixed inset-0 z-[200] bg-brand-dark flex flex-col items-center justify-center p-6 text-center overflow-hidden">
            {/* Background elements */}
            <div className={`absolute inset-0 bg-gradient-to-br ${step.color} opacity-10 transition-colors duration-700`}></div>
            <div className="absolute top-[-10%] right-[-10%] w-[60%] h-[60%] bg-white/5 rounded-full blur-[120px] animate-pulse-soft"></div>

            <div key={currentStep} className="relative z-10 max-w-md w-full animate-scale-in">
                <div className="mb-12 inline-flex items-center justify-center p-8 rounded-[2.5rem] bg-white/5 border border-white/10 backdrop-blur-xl shadow-2xl animate-float">
                    {step.icon}
                </div>
                
                <h1 className="text-4xl sm:text-5xl font-display font-bold text-white mb-6 tracking-tight">
                    {step.title}
                </h1>
                
                <p className="text-xl text-brand-text-muted leading-relaxed mb-12">
                    {step.description}
                </p>

                <div className="flex flex-col gap-4">
                    <button 
                        onClick={next}
                        className="w-full py-5 px-8 rounded-2xl bg-white text-brand-dark font-bold text-xl hover:scale-105 transition-transform shadow-xl"
                    >
                        {currentStep === STEPS.length - 1 ? "Let's Start" : "Next"}
                    </button>
                    
                    <div className="flex justify-center gap-2 mt-4">
                        {STEPS.map((_, i) => (
                            <div 
                                key={i} 
                                className={`h-1.5 rounded-full transition-all duration-300 ${i === currentStep ? 'w-8 bg-brand-primary' : 'w-2 bg-white/20'}`}
                            ></div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Onboarding;
