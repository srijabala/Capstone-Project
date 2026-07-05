import React from 'react';
import { Compass, Menu, X, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Navbar({ activePage, setActivePage }) {
  const [isOpen, setIsOpen] = React.useState(false);

  const navLinks = [
    { label: 'Home', value: 'home', type: 'page', pageValue: 'landing' },
    { label: 'Features', value: 'features', type: 'scroll' },
    { label: 'How It Works', value: 'how-it-works', type: 'scroll' },
    { label: 'AI Assessment', value: 'assessment', type: 'page', pageValue: 'dashboard' },
    { label: 'Dashboard', value: 'dashboard', type: 'page', pageValue: 'dashboard' },
    { label: 'FAQ', value: 'faq', type: 'scroll' }
  ];

  const handleNavClick = (link, e) => {
    if (link.type === 'page') {
      e.preventDefault();
      setActivePage(link.pageValue);
      setIsOpen(false);
    } else if (link.type === 'scroll') {
      if (activePage !== 'landing') {
        e.preventDefault();
        setActivePage('landing');
        setTimeout(() => {
          const el = document.getElementById(link.value);
          if (el) el.scrollIntoView({ behavior: 'smooth' });
        }, 100);
      }
      setIsOpen(false);
    }
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 px-6 py-4">
      <div className="max-w-7xl mx-auto glass-panel rounded-2xl px-6 py-3 flex items-center justify-between">
        {/* Logo */}
        <div 
          className="flex items-center gap-2 cursor-pointer"
          onClick={() => setActivePage('landing')}
        >
          <div className="p-2 rounded-xl bg-gradient-to-tr from-indigo-500 via-purple-500 to-cyan-500 shadow-lg shadow-indigo-500/25">
            <Compass className="w-5 h-5 text-white animate-spin-slow" />
          </div>
          <span className="font-bold text-lg tracking-wider bg-clip-text text-transparent bg-gradient-to-r from-white via-indigo-200 to-indigo-400">
            CareerCompass <span className="text-cyan-400">AI</span>
          </span>
        </div>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-6">
          {navLinks.map((link) => (
            <a
              key={link.value}
              href={`#${link.value}`}
              onClick={(e) => handleNavClick(link, e)}
              className="text-slate-300 hover:text-white transition-colors text-sm font-medium"
            >
              {link.label}
            </a>
          ))}
        </div>

        {/* Action Button */}
        <div className="hidden md:flex items-center gap-4">
          <button 
            onClick={() => setActivePage(activePage === 'dashboard' ? 'landing' : 'dashboard')}
            className="relative group overflow-hidden rounded-xl p-[1px] focus:outline-none"
          >
            <span className="absolute inset-0 bg-gradient-to-r from-indigo-500 via-purple-500 to-cyan-500 rounded-xl" />
            <span className="relative block px-5 py-2 rounded-xl bg-[#0b081e] text-sm text-white font-semibold transition-all duration-300 group-hover:bg-transparent">
              {activePage === 'dashboard' ? 'Back to Home' : 'Launch App'}
              <ArrowRight className="w-4 h-4 inline-block ml-1.5 transition-transform duration-300 group-hover:translate-x-1" />
            </span>
          </button>
        </div>

        {/* Mobile menu button */}
        <div className="md:hidden">
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="text-slate-300 hover:text-white p-1"
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute top-20 left-6 right-6 glass-panel rounded-2xl p-6 md:hidden flex flex-col gap-4"
          >
            {navLinks.map((link) => (
              <a
                key={link.value}
                href={`#${link.value}`}
                onClick={(e) => handleNavClick(link, e)}
                className="text-slate-300 hover:text-white transition-colors text-base font-medium py-2 border-b border-white/5"
              >
                {link.label}
              </a>
            ))}
            <button
              onClick={() => {
                setActivePage(activePage === 'dashboard' ? 'landing' : 'dashboard');
                setIsOpen(false);
              }}
              className="w-full mt-2 py-3 rounded-xl bg-gradient-to-r from-indigo-500 via-purple-500 to-cyan-500 text-white font-semibold flex items-center justify-center gap-2 hover:opacity-90 transition-opacity"
            >
              {activePage === 'dashboard' ? 'Back to Home' : 'Launch App'}
              <ArrowRight className="w-4 h-4" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
