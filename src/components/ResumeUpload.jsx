import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, FileText, Sparkles, AlertCircle, Play, Send, ChevronRight } from 'lucide-react';
import { analyzeResume, isGeminiConfigured } from '../utils/gemini';

export default function ResumeUpload({ onAnalysisComplete }) {
  const [resumeImage, setResumeImage] = useState(null);
  const [targetRole, setTargetRole] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef(null);

  const [logs, setLogs] = useState([]);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileInput = (e) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const handleFile = (file) => {
    if (!file.type.startsWith('image/')) {
      setError('Please upload a valid image file (PNG, JPG).');
      return;
    }
    const reader = new FileReader();
    reader.onload = (e) => {
      setResumeImage(e.target.result);
      setError(null);
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!resumeImage) return;

    setIsLoading(true);
    setError(null);
    setLogs([
      "[Agent Core] Initializing profiling engine...", 
      "[Agent Core] Reading raw context strings..."
    ]);

    setTimeout(() => setLogs(prev => [...prev, "[Agent Matcher] Classifying skills against active market demand metrics..."]), 1500);
    setTimeout(() => setLogs(prev => [...prev, "[Agent Reviewer] Extracting gap vectors and generating interview context..."]), 3500);

    try {
      const data = await analyzeResume(resumeImage, targetRole.trim() || 'Frontend Developer');
      setLogs(prev => [...prev, "[Agent Core] Dynamic mapping completed successfully!"]);
      setTimeout(() => {
        onAnalysisComplete(data);
      }, 500);
    } catch (err) {
      console.error(err);
      setLogs(prev => [...prev, "[CRITICAL ERROR] Context parsing failed."]);
      setError(err.message || 'Failed to analyze resume. Please try again.');
    } finally {
      setTimeout(() => setIsLoading(false), 500);
    }
  };

  return (
    <div className="max-w-3xl mx-auto py-8">
      <motion.div 
        className="glass-panel p-8 rounded-3xl relative overflow-hidden"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="absolute top-0 right-0 w-64 h-64 rounded-full bg-indigo-500/5 blur-[80px] pointer-events-none" />
        
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 rounded-xl bg-gradient-to-tr from-indigo-500 to-purple-500">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">AI Resume Review & Alignment</h2>
            <p className="text-slate-400 text-xs mt-0.5">Parse, evaluate, and check market alignment with live market intelligence.</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          {/* Target Role Input */}
          <div>
            <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-2">Target Career Role</label>
            <input
              type="text"
              value={targetRole}
              onChange={(e) => setTargetRole(e.target.value)}
              placeholder="e.g. Frontend Developer, ML Engineer, DevOps Lead..."
              className="w-full bg-slate-950 border border-white/10 rounded-xl px-4 py-3 text-sm text-slate-300 placeholder-slate-600 focus:outline-none focus:border-indigo-500/50 transition-colors"
            />
            <p className="text-[10px] text-slate-600 mt-1.5">Type any role — Gemini will analyze your resume against current market demand for it.</p>
          </div>

          {/* Paste or Drop Zone */}
          <div className="flex flex-col gap-2">
            <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Upload Resume Image</label>
            
            <div 
              onDragEnter={handleDrag}
              onDragOver={handleDrag}
              onDragLeave={handleDrag}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`border-2 border-dashed rounded-2xl p-8 flex flex-col items-center justify-center gap-3 cursor-pointer transition-all ${
                dragActive 
                  ? 'border-indigo-500 bg-indigo-500/5' 
                  : 'border-white/10 hover:border-indigo-500/30 hover:bg-white/2'
              }`}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept="image/png, image/jpeg"
                onChange={handleFileInput}
                className="hidden"
              />
              <div className="p-3 rounded-xl bg-white/5 border border-white/10 text-indigo-400">
                <Upload className="w-6 h-6" />
              </div>
              <span className="text-sm font-semibold text-white">Drag & drop your resume image (PNG, JPG) here</span>
              <span className="text-xs text-slate-500">Or click to browse files</span>
            </div>
          </div>

          {/* Image Preview */}
          {resumeImage && (
            <div className="relative rounded-2xl overflow-hidden border border-white/10 bg-slate-950/60 p-2">
              <img src={resumeImage} alt="Resume Preview" className="w-full h-auto max-h-64 object-contain rounded-xl" />
              <button
                type="button"
                onClick={() => setResumeImage(null)}
                className="absolute top-4 right-4 p-1.5 bg-rose-500/80 hover:bg-rose-500 text-white rounded-lg backdrop-blur-md transition-colors"
              >
                <AlertCircle className="w-4 h-4" /> {/* Or an X icon, using AlertCircle temporarily or X if imported */}
              </button>
            </div>
          )}

          {error && (
            <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/25 text-rose-400 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Submit */}
          <button
            type="submit"
            disabled={isLoading || !resumeImage}
            className="w-full py-4 rounded-2xl bg-gradient-to-r from-indigo-500 via-purple-500 to-cyan-500 text-white font-bold tracking-wide shadow-lg shadow-indigo-500/20 disabled:opacity-50 disabled:cursor-not-allowed hover:opacity-95 transition-opacity"
          >
            {isLoading ? 'Processing Resume via Gemini...' : 'Analyze Market Alignment'}
          </button>
        </form>

        {/* Glassmorphic Loader overlay */}
        <AnimatePresence>
          {isLoading && (
            <motion.div 
              className="absolute inset-0 bg-[#030014]/80 backdrop-blur-md flex flex-col items-center justify-center gap-4 z-50"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <div className="relative w-16 h-16">
                <span className="absolute inset-0 rounded-full border-4 border-indigo-500/20" />
                <span className="absolute inset-0 rounded-full border-4 border-t-indigo-500 animate-spin" />
              </div>
              <div className="text-center">
                <span className="font-bold text-white text-base">Running Neural Evaluation</span>
                <p className="text-xs text-slate-400 mt-1">Gemini is comparing your profile against 2026 tech stack trends...</p>
              </div>
              <div className="text-[10px] font-mono text-slate-500 space-y-0.5 mt-4 text-left bg-slate-900/50 p-4 rounded-xl border border-slate-800 w-full max-w-md h-32 overflow-y-auto">
                {logs.map((log, i) => <div key={i}>{log}</div>)}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
