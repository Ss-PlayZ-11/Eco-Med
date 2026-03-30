
import React, { useState, useEffect, useCallback, useTransition } from 'react';
import Header from './components/Header';
import HomeScreen from './components/HomeScreen';
import ScanScreen from './components/ScanScreen';
import DiagnosisResultScreen from './components/DiagnosisResultScreen';
import HistoryScreen from './components/HistoryScreen';
import FeedbackScreen from './components/FeedbackScreen';
import SettingsScreen from './components/SettingsScreen';
import IntroScreen from './components/IntroScreen';
import TermsScreen from './components/TermsScreen';
import Onboarding from './components/Onboarding';
import { auth, db, googleProvider, signInWithPopup, signOut, onAuthStateChanged, collection, query, orderBy, onSnapshot, setDoc, doc, deleteDoc, getDocs, User } from './firebase';
import { Diagnosis, HistoryItem, View, Theme } from './types';

enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId: string | undefined;
    email: string | null | undefined;
    emailVerified: boolean | undefined;
    isAnonymous: boolean | undefined;
    tenantId: string | null | undefined;
    providerInfo: {
      providerId: string;
      displayName: string | null;
      email: string | null;
      photoUrl: string | null;
    }[];
  }
}

function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
      tenantId: auth.currentUser?.tenantId,
      providerInfo: auth.currentUser?.providerData.map(provider => ({
        providerId: provider.providerId,
        displayName: provider.displayName,
        email: provider.email,
        photoUrl: provider.photoURL
      })) || []
    },
    operationType,
    path
  }
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

const App: React.FC = () => {
  const [theme, setTheme] = useState<Theme>('dark');
  const [currentView, setCurrentView] = useState<View>('home');
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [diagnosisResult, setDiagnosisResult] = useState<Diagnosis | null>(null);
  const [diagnosisImage, setDiagnosisImage] = useState<string | null>(null);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [scanOptions, setScanOptions] = useState<{ autoUpload?: boolean }>({});
  const [prefilledFeedback, setPrefilledFeedback] = useState<string>('');
  const [isNavigating, startNavigation] = useTransition();
  const [animationClass, setAnimationClass] = useState('animate-fade-in');
  const [user, setUser] = useState<User | null>(null);
  const [isAuthReady, setIsAuthReady] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setIsAuthReady(true);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (!user || !isAuthReady) {
      setHistory([]);
      return;
    }

    const path = `users/${user.uid}/history`;
    const q = query(collection(db, path), orderBy('timestamp', 'desc'));
    
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const items = snapshot.docs.map(doc => doc.data() as HistoryItem);
      setHistory(items);
    }, (error) => {
      handleFirestoreError(error, OperationType.GET, path);
    });

    return () => unsubscribe();
  }, [user, isAuthReady]);

  useEffect(() => {
    try {
      const savedTheme = localStorage.getItem('theme') as Theme;
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      const initialTheme = savedTheme || (prefersDark ? 'dark' : 'light');
      setTheme(initialTheme);

      const hasOnboarded = localStorage.getItem('hasOnboarded');
      if (!hasOnboarded) setShowOnboarding(true);

    } catch (error) {
      console.error("Failed to parse storage", error);
    }
  }, []);

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prevTheme => prevTheme === 'dark' ? 'light' : 'dark');
  };

  const handleNavigate = useCallback((view: View, options: { autoUpload?: boolean, feedbackText?: string } = {}) => {
    setAnimationClass('opacity-0 scale-95 transition-all duration-300');
    setTimeout(() => {
      startNavigation(() => {
        if (view !== 'scan') setScanOptions({});
        else setScanOptions({ autoUpload: options.autoUpload });
        
        if (view === 'feedback' && options.feedbackText) setPrefilledFeedback(options.feedbackText);
        else if (view !== 'feedback') setPrefilledFeedback('');
        
        setCurrentView(view);
        window.scrollTo({ top: 0, behavior: 'smooth' });
        setAnimationClass('animate-scale-in');
      });
    }, 300);
  }, []);

  const handleDiagnosisComplete = useCallback((result: Diagnosis, imageSrc: string) => {
    setDiagnosisResult(result);
    setDiagnosisImage(imageSrc);
    handleNavigate('result');
  }, [handleNavigate]);

  const handleSaveDiagnosis = useCallback(async () => {
    if (diagnosisResult && diagnosisImage && user) {
      const isAlreadySaved = history.some(item => item.id === (diagnosisResult as HistoryItem).id);
      
      if (isAlreadySaved) {
        handleNavigate('history');
        return;
      }

      const id = new Date().toISOString();
      const newHistoryItem: HistoryItem = {
        ...diagnosisResult,
        id,
        timestamp: id,
        image: diagnosisImage,
      };
      
      const path = `users/${user.uid}/history/${id}`;
      try {
        await setDoc(doc(db, `users/${user.uid}/history`, id), newHistoryItem);
        setDiagnosisResult(null);
        setDiagnosisImage(null);
        handleNavigate('history');
      } catch (error) {
        handleFirestoreError(error, OperationType.WRITE, path);
      }
    } else if (!user) {
      alert("Please log in to save your diagnosis to the garden.");
      handleLogin();
    }
  }, [diagnosisResult, diagnosisImage, history, handleNavigate, user]);

  const handleDiscardDiagnosis = useCallback(() => {
    setDiagnosisResult(null);
    setDiagnosisImage(null);
    handleNavigate('scan');
  }, [handleNavigate]);
  
  const handleClearHistory = useCallback(async () => {
    if (!user) return;
    const path = `users/${user.uid}/history`;
    try {
      const q = query(collection(db, path));
      const snapshot = await getDocs(q);
      const deletePromises = snapshot.docs.map(d => deleteDoc(doc(db, path, d.id)));
      await Promise.all(deletePromises);
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, path);
    }
  }, [user]);

  const handleLogin = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (error) {
      console.error("Login failed", error);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      handleNavigate('home');
    } catch (error) {
      console.error("Logout failed", error);
    }
  };

  const finishOnboarding = () => {
    setShowOnboarding(false);
    localStorage.setItem('hasOnboarded', 'true');
  };

  if (showOnboarding) {
    return <Onboarding onComplete={finishOnboarding} />;
  }

  const renderContent = () => {
    switch (currentView) {
      case 'home':
        return <HomeScreen onNavigate={handleNavigate} />;
      case 'scan':
        return <ScanScreen onDiagnosisComplete={handleDiagnosisComplete} onNavigate={handleNavigate} autoUpload={scanOptions.autoUpload} />;
      case 'result':
        return diagnosisResult ? (
          <DiagnosisResultScreen 
            diagnosis={diagnosisResult} 
            imageSrc={diagnosisImage} 
            onSave={handleSaveDiagnosis} 
            onDiscard={handleDiscardDiagnosis}
            isSaved={history.some(item => item.id === (diagnosisResult as HistoryItem).id)}
            onReportIncorrect={() => handleNavigate('feedback', { 
              feedbackText: `Incorrect Diagnosis Report:\nPlant: ${diagnosisResult.plantName}\nDetected Issue: ${diagnosisResult.isHealthy ? 'Healthy' : diagnosisResult.disease}\n\nReason for reporting: `
            })}
          />
        ) : <ScanScreen onDiagnosisComplete={handleDiagnosisComplete} onNavigate={handleNavigate} />;
      case 'history':
        return (
          <HistoryScreen 
            history={history} 
            onBack={() => handleNavigate('home')} 
            onClearHistory={handleClearHistory} 
            user={user}
            onLogin={handleLogin}
            onSelectItem={(item) => {
              setDiagnosisResult(item);
              setDiagnosisImage(item.image);
              handleNavigate('result');
            }}
          />
        );
      case 'feedback':
        return <FeedbackScreen onBack={() => handleNavigate('home')} initialComment={prefilledFeedback} />;
      case 'settings':
        return <SettingsScreen onBack={() => handleNavigate('home')} onNavigate={handleNavigate} user={user} onLogin={handleLogin} onLogout={handleLogout} />;
      case 'intro':
        return <IntroScreen onBack={() => handleNavigate('settings')} />;
      case 'terms':
        return <TermsScreen onBack={() => handleNavigate('settings')} />;
      default:
        return <HomeScreen onNavigate={handleNavigate} />;
    }
  };

  return (
    <div className="min-h-screen w-full bg-transparent text-brand-light-text dark:text-brand-text font-sans selection:bg-brand-primary/30 transition-colors duration-300">
      <Header onNavigate={handleNavigate} currentView={currentView} theme={theme} toggleTheme={toggleTheme} />
      <main className={`relative z-10 pt-24 pb-12 px-4 sm:px-6 md:px-8 max-w-5xl mx-auto ${animationClass}`}>
        {renderContent()}
      </main>
    </div>
  );
};

export default App;
