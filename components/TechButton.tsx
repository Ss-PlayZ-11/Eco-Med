
import React, { useState } from 'react';

interface TechButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'ghost';
    size?: 'sm' | 'md' | 'lg' | 'xl';
    children: React.ReactNode;
}

const TechButton: React.FC<TechButtonProps> = ({ 
    variant = 'primary', 
    size = 'md', 
    children, 
    onClick, 
    className = '', 
    ...props 
}) => {
    const [isAnimating, setIsAnimating] = useState(false);

    const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
        setIsAnimating(false);
        // Force reflow for animation restart
        void (e.currentTarget as any).offsetWidth;
        setIsAnimating(true);
        
        if (onClick) onClick(e);
        
        // Remove animation class after finish
        setTimeout(() => setIsAnimating(false), 500);
    };

    const variants = {
        primary: 'bg-brand-primary text-white shadow-[0_10px_30px_rgba(16,185,129,0.3)] hover:shadow-brand-primary/50',
        secondary: 'glass-v2 text-brand-light-text dark:text-white border-brand-primary/20 hover:border-brand-primary hover:bg-brand-primary/10',
        ghost: 'text-brand-light-text-muted dark:text-brand-text-muted hover:text-brand-primary hover:bg-brand-primary/5'
    };

    const sizes = {
        sm: 'px-4 py-2 text-sm rounded-xl',
        md: 'px-6 py-3 text-base rounded-2xl',
        lg: 'px-8 py-4 text-lg rounded-3xl',
        xl: 'px-10 py-5 text-xl rounded-[2rem]'
    };

    return (
        <button
            onClick={handleClick}
            className={`
                btn-click-effect relative flex items-center justify-center gap-3 font-bold transition-all duration-300
                ${variants[variant]}
                ${sizes[size]}
                ${isAnimating ? 'animate-haptic' : ''}
                ${className}
            `}
            {...props}
        >
            {isAnimating && (
                <span className="absolute inset-0 border-4 border-brand-primary rounded-inherit animate-burst"></span>
            )}
            {children}
        </button>
    );
};

export default TechButton;
