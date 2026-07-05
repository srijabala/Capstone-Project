import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, Home, ChevronRight, X } from 'lucide-react';
import Navbar from './components/Navbar';
import LandingPage from './pages/LandingPage';
import Dashboard from './pages/Dashboard';

function App() {
  const [activePage, setActivePage] = useState('landing');
  const [hasAnalysis, setHasAnalysis] = useState(false);
  const [pendingPage, setPendingPage] = useState(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  // Warn on refresh/close if analysis is active
  useEffect(() => {
    const handleBeforeUnload = (e) => {
      if (activePage === 'dashboard' && hasAnalysis) {
        e.preventDefault();
        e.returnValue = ''; // Standard browser prompt trigger
      }
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [activePage, hasAnalysis]);

  // Handle navigation attempts
  const tryNavigateTo = (targetPage) => {
    if (activePage === 'dashboard' && hasAnalysis && targetPage === 'landing') {
      setPendingPage(targetPage);
      setShowConfirmModal(true);
    } else {
      setActivePage(targetPage);
    }
  };

  const handleConfirmLeave = () => {
    if (pendingPage) {
      setActivePage(pendingPage);
      setHasAnalysis(false);
      setPendingPage(null);
    }
    setShowConfirmModal(false);
  };

  const handleCancelLeave = () => {
    setPendingPage(null);
    setShowConfirmModal(false);
  };

  return (
    <div className="min-h-screen bg-[#030014] text-slate-100 flex flex-col relative overflow-hidden">
      {/* Global Navbar */}
      <Navbar activePage={activePage} setActivePage={tryNavigateTo} />

      {/* Main Content Router */}
      <main className="flex-1 flex flex-col">
        {activePage === 'landing' ? (
          <LandingPage onLaunchDashboard={() => tryNavigateTo('dashboard')} />
        ) : (
          <Dashboard onAnalysisStateChange={setHasAnalysis} />
        )}
      </main>

      {/* Cute Confirmation Modal */}
      <AnimatePresence>
        {showConfirmModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={handleCancelLeave}
              className="absolute inset-0 bg-slate-950/80 backdrop-blur-md"
            />
            
            {/* Modal Box */}
            <motion.div 
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              transition={{ type: "spring", duration: 0.5 }}
              className="relative w-full max-w-md glass-panel p-8 rounded-3xl border border-white/10 text-center overflow-hidden flex flex-col items-center gap-5 shadow-2xl"
            >
              {/* Decorative accent spots */}
              <div className="absolute -top-10 -right-10 w-24 h-24 rounded-full bg-rose-500/10 blur-xl pointer-events-none" />
              <div className="absolute -bottom-10 -left-10 w-24 h-24 rounded-full bg-indigo-500/10 blur-xl pointer-events-none" />

              {/* Cute Icon Header */}
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-rose-500 to-pink-500 flex items-center justify-center shadow-lg shadow-rose-500/20 text-white animate-pulse">
                <AlertTriangle className="w-8 h-8" />
              </div>

              <div>
                <h3 className="text-xl font-bold text-white tracking-tight">Wait! Don't leave yet 🥺</h3>
                <p className="text-slate-400 text-sm mt-2 leading-relaxed">
                  Leaving now will clear your active career analysis, ATS score, and tailored skill roadmap. Are you sure you want to go back?
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 w-full mt-2">
                <button
                  onClick={handleCancelLeave}
                  className="flex-1 py-3 px-4 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-sm font-semibold text-slate-200 transition-all hover:scale-[1.02] active:scale-[0.98]"
                >
                  No, stay and review ✨
                </button>
                <button
                  onClick={handleConfirmLeave}
                  className="flex-1 py-3 px-4 rounded-xl bg-gradient-to-r from-rose-500 to-pink-500 text-sm font-semibold text-white transition-all shadow-md shadow-rose-500/20 hover:opacity-95 hover:scale-[1.02] active:scale-[0.98]"
                >
                  Yes, leave
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default App;
