
import React, { useState, useRef, useEffect, useCallback } from 'react';
import { diagnosePlant } from '../services/geminiService';
import { Diagnosis, View } from '../types';
import { CameraIcon, UploadIcon, SparklesIcon, RefreshCwIcon, BackArrowIcon } from './icons';
import TechButton from './TechButton';

interface ScanScreenProps {
  onDiagnosisComplete: (result: Diagnosis, imageSrc: string) => void;
  onNavigate: (view: View, options?: { autoUpload?: boolean }) => void;
  autoUpload?: boolean;
}

const ScanScreen: React.FC<ScanScreenProps> = ({ onDiagnosisComplete, onNavigate, autoUpload }) => {
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isCapturing, setIsCapturing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const startCamera = useCallback(async () => {
    try {
        if (streamRef.current) {
            streamRef.current.getTracks().forEach(track => track.stop());
        }
        const stream = await navigator.mediaDevices.getUserMedia({ 
            video: { facingMode: 'environment', width: { ideal: 1920 }, height: { ideal: 1080 } } 
        });
        streamRef.current = stream;
        if (videoRef.current) {
            videoRef.current.srcObject = stream;
        }
    } catch (err) {
        console.error("Error accessing camera:", err);
        setError("Camera not found. Please check your permissions.");
    }
  }, []);

  useEffect(() => {
    if (!imageSrc) {
        startCamera();
    }
    if (autoUpload && fileInputRef.current) {
      fileInputRef.current.click();
    }
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
    };
  }, [autoUpload, startCamera, imageSrc]);
  
  const handleCapture = () => {
    setIsCapturing(true);
    setTimeout(() => {
      if (videoRef.current) {
        const canvas = document.createElement('canvas');
        canvas.width = videoRef.current.videoWidth;
        canvas.height = videoRef.current.videoHeight;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
          const dataUrl = canvas.toDataURL('image/jpeg', 0.95);
          setImageSrc(dataUrl);
          if (streamRef.current) {
              streamRef.current.getTracks().forEach(track => track.stop());
          }
        }
      }
      setIsCapturing(false);
    }, 400);
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setImageSrc(e.target?.result as string);
        if (streamRef.current) {
            streamRef.current.getTracks().forEach(track => track.stop());
        }
      };
      reader.readAsDataURL(file);
    } else if (autoUpload) {
        onNavigate('home');
    }
  };

  const handleDiagnose = async () => {
    if (!imageSrc) return;
    setIsLoading(true);
    setError(null);
    try {
      const base64Data = imageSrc.split(',')[1];
      const mimeType = imageSrc.match(/data:([a-zA-Z0-9]+\/[a-zA-Z0-9-.+]+).*,.*/)?.[1] || 'image/jpeg';
      const result = await diagnosePlant(base64Data, mimeType);
      onDiagnosisComplete(result, imageSrc);
    } catch (err: any) {
      setError(err.message || 'Processing error. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleRetake = () => {
      setImageSrc(null);
      setError(null);
  };

  return (
    <div className="flex flex-col items-center justify-start min-h-[85vh] pt-12 animate-fade-in">
      <div className="w-full max-w-3xl mx-auto glass-v2 p-4 rounded-[3.5rem] shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 left-0 w-20 h-20 border-t-4 border-l-4 border-brand-primary opacity-50 rounded-tl-[3.5rem]"></div>
        <div className="absolute bottom-0 right-0 w-20 h-20 border-b-4 border-r-4 border-brand-secondary opacity-50 rounded-br-[3.5rem]"></div>

        <button 
            onClick={() => onNavigate('home')} 
            className="absolute -top-14 left-4 flex items-center gap-3 text-brand-light-text-muted dark:text-brand-text-muted hover:text-brand-primary transition-all font-bold uppercase tracking-wider text-sm group"
        >
            <div className="p-2 rounded-full glass-v2 group-hover:bg-brand-primary/20 transition-colors">
              <BackArrowIcon className="w-4 h-4" />
            </div>
            BACK
        </button>

        {isLoading ? (
          <div className="flex flex-col items-center justify-center h-[70vh] relative overflow-hidden rounded-[2.5rem] bg-brand-dark">
            <div className="absolute inset-0 bg-gradient-to-b from-brand-primary/40 to-transparent animate-glitch-scan h-full z-10"></div>
            {imageSrc && <img src={imageSrc} alt="Analyzing" className="absolute inset-0 w-full h-full object-cover opacity-20 scale-110 blur-sm" />}
            
            <div className="relative z-20 flex flex-col items-center">
                <div className="relative w-40 h-40 mb-12">
                   <div className="absolute inset-0 border-4 border-brand-primary/20 border-t-brand-primary rounded-full animate-spin"></div>
                   <div className="absolute inset-4 border-2 border-brand-secondary/20 border-b-brand-secondary rounded-full animate-spin-slow"></div>
                   <div className="absolute inset-0 flex items-center justify-center">
                      <SparklesIcon className="w-12 h-12 text-brand-primary animate-pulse" />
                   </div>
                </div>
                <h2 className="text-3xl font-display font-bold text-white text-glow-green tracking-tight">ANALYZING...</h2>
                <div className="flex gap-2 mt-4">
                   {[1,2,3].map(i => <div key={i} className="w-3 h-3 bg-brand-primary rounded-full animate-bounce" style={{ animationDelay: `${i*0.1}s` }}></div>)}
                </div>
            </div>
          </div>
        ) : (
          <>
            <div className="relative w-full aspect-[4/5] sm:aspect-video bg-brand-dark rounded-[2.5rem] overflow-hidden group shadow-inner">
              <div className={`absolute inset-0 bg-white z-[60] transition-opacity duration-300 pointer-events-none ${isCapturing ? 'opacity-100' : 'opacity-0'}`}></div>

              {imageSrc ? (
                <img src={imageSrc} alt="Your Photo" className="w-full h-full object-cover animate-reveal" />
              ) : (
                <>
                    <video ref={videoRef} autoPlay playsInline muted className="w-full h-full object-cover transition-all duration-700"></video>
                    
                    <div className="absolute inset-12 border border-white/10 rounded-3xl pointer-events-none flex items-center justify-center">
                        <div className="w-full h-[1px] bg-white/5 absolute"></div>
                        <div className="h-full w-[1px] bg-white/5 absolute"></div>
                    </div>

                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center gap-6">
                        <div className="w-24 h-24 border-2 border-brand-primary rounded-full animate-ping opacity-30"></div>
                        <p className="text-white/60 text-xs font-bold tracking-widest uppercase">Center Plant Here</p>
                    </div>
                </>
              )}
            </div>
            
            {error && <div className="bg-red-500/10 border-l-4 border-red-500 text-red-400 px-8 py-5 rounded-2xl my-6 text-center font-bold uppercase tracking-wider text-sm">{error}</div>}

            <div className="p-10">
            {imageSrc ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <TechButton 
                    variant="secondary"
                    size="lg"
                    onClick={handleRetake} 
                    className="w-full"
                >
                    <RefreshCwIcon className="w-6 h-6" />
                    RETAKE PHOTO
                </TechButton>
                <TechButton 
                    variant="primary"
                    size="lg"
                    onClick={handleDiagnose} 
                    className="w-full"
                >
                  <SparklesIcon className="w-8 h-8"/>
                  GET DIAGNOSIS
                </TechButton>
              </div>
            ) : (
              <div className="flex flex-col gap-6">
                 <TechButton 
                    variant="primary"
                    size="xl"
                    onClick={handleCapture} 
                    className="w-full group"
                 >
                    <div className="w-16 h-16 bg-brand-dark rounded-full flex items-center justify-center group-active:scale-90 transition-transform">
                       <CameraIcon className="w-8 h-8 text-white" />
                    </div>
                    <span className="text-2xl tracking-tight">TAKE PHOTO</span>
                </TechButton>
                <TechButton 
                    variant="secondary"
                    size="md"
                    onClick={() => fileInputRef.current?.click()} 
                    className="w-full"
                >
                  <UploadIcon className="w-6 h-6"/>
                  UPLOAD PHOTO
                </TechButton>
                <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="image/*" className="hidden" />
              </div>
            )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default ScanScreen;
