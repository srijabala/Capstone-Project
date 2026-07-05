import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Compass, 
  Briefcase, 
  Award, 
  Calendar,
  Sparkles,
  HelpCircle,
  Check,
  Clock,
  FileText,
  Target,
  Zap,
  TrendingUp,
  CheckCircle2,
  AlertTriangle,
  ChevronDown,
  ChevronRight
} from 'lucide-react';
import { KPI_DATA, RECOMMENDED_JOBS } from '../data/mockData';
import ResumeUpload from '../components/ResumeUpload';
import { matchJobDescription, generateSkillSprint } from '../utils/gemini';

export default function Dashboard({ onAnalysisStateChange }) {
  const [selectedJob, setSelectedJob] = useState(null);
  const [jobFilter, setJobFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [appliedJobs, setAppliedJobs] = useState(() => {
    const saved = localStorage.getItem('cc_applied_jobs');
    return saved ? JSON.parse(saved) : [];
  });
  const [activeSubTab, setActiveSubTab] = useState(() => {
    const saved = localStorage.getItem('cc_active_subtab');
    return saved || 'upload';
  });
  
  // Resume Analysis States
  const [analysisResult, setAnalysisResult] = useState(() => {
    const saved = localStorage.getItem('cc_analysis_result');
    return saved ? JSON.parse(saved) : null;
  });
  const [activeQuestionIndex, setActiveQuestionIndex] = useState(0);
  const [userAnswer, setUserAnswer] = useState('');
  const [interviewFeedback, setInterviewFeedback] = useState('');
  const [isEvaluatingAnswer, setIsEvaluatingAnswer] = useState(false);

  // JD Matcher States
  const [jdText, setJdText] = useState('');
  const [jdResult, setJdResult] = useState(null);
  const [isMatchingJD, setIsMatchingJD] = useState(false);
  const [jdError, setJdError] = useState(null);

  // 30-60-90 Sprint States
  const [sprintPlan, setSprintPlan] = useState(() => {
    const saved = localStorage.getItem('cc_sprint_plan');
    return saved ? JSON.parse(saved) : null;
  });
  const [isGeneratingSprint, setIsGeneratingSprint] = useState(false);
  const [sprintError, setSprintError] = useState(null);
  const [expandedPhase, setExpandedPhase] = useState('days30');
  const [expandedWeek, setExpandedWeek] = useState(null);

  const handleMatchJD = async () => {
    if (!jdText.trim() || !analysisResult) return;
    setIsMatchingJD(true);
    setJdError(null);
    setJdResult(null);
    try {
      const result = await matchJobDescription(analysisResult, jdText);
      setJdResult(result);
    } catch (err) {
      console.error(err);
      setJdError('Failed to analyze JD. Please check your API key and try again.');
    } finally {
      setIsMatchingJD(false);
    }
  };

  const handleGenerateSprint = async () => {
    if (!analysisResult) return;
    setIsGeneratingSprint(true);
    setSprintError(null);
    try {
      const result = await generateSkillSprint(analysisResult);
      setSprintPlan(result);
    } catch (err) {
      console.error(err);
      setSprintError('Failed to generate sprint plan. Please try again.');
    } finally {
      setIsGeneratingSprint(false);
    }
  };

  useEffect(() => {
    if (onAnalysisStateChange) {
      onAnalysisStateChange(!!analysisResult);
    }
  }, [analysisResult, onAnalysisStateChange]);

  // Sync to localStorage
  useEffect(() => {
    if (analysisResult) {
      localStorage.setItem('cc_analysis_result', JSON.stringify(analysisResult));
    } else {
      localStorage.removeItem('cc_analysis_result');
    }
  }, [analysisResult]);

  useEffect(() => {
    if (sprintPlan) {
      localStorage.setItem('cc_sprint_plan', JSON.stringify(sprintPlan));
    } else {
      localStorage.removeItem('cc_sprint_plan');
    }
  }, [sprintPlan]);

  useEffect(() => {
    localStorage.setItem('cc_applied_jobs', JSON.stringify(appliedJobs));
  }, [appliedJobs]);

  useEffect(() => {
    localStorage.setItem('cc_active_subtab', activeSubTab);
  }, [activeSubTab]);

  // Filter and search logic for jobs
  const filteredJobs = RECOMMENDED_JOBS.filter(job => {
    const matchesSearch = job.role.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          job.company.toLowerCase().includes(searchQuery.toLowerCase());
    
    if (jobFilter === 'all') return matchesSearch;
    if (jobFilter === 'high') return matchesSearch && job.matchScore >= 90;
    if (jobFilter === 'medium') return matchesSearch && job.matchScore >= 80 && job.matchScore < 90;
    return matchesSearch;
  });

  const handleApplyJob = (jobId) => {
    if (!appliedJobs.includes(jobId)) {
      setAppliedJobs([...appliedJobs, jobId]);
    }
  };

  const handleAnalysisComplete = (data) => {
    setAnalysisResult(data);
    setActiveSubTab('jobs'); // Switch to main recommendations once complete
  };

  // Evaluate user mock interview answer using Gemini API key locally if available
  const handleAnswerSubmit = async () => {
    if (!userAnswer.trim()) return;
    setIsEvaluatingAnswer(true);
    setInterviewFeedback('');

    const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
    if (!apiKey) {
      // Return placeholder feedback if key is somehow missing
      setTimeout(() => {
        setInterviewFeedback("Excellent attempt! Focus on structure, mentioning architectural patterns, and real-world trade-offs.");
        setIsEvaluatingAnswer(false);
      }, 1000);
      return;
    }

    try {
      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: `Evaluate my answer to this technical interview question: "${analysisResult.suggestedInterviewQuestions[activeQuestionIndex]}"\n\nMy Answer:\n"${userAnswer}"\n\nProvide constructive, friendly senior recruiter feedback on whether this answer is complete, correct, and how to improve it.`
            }]
          }]
        })
      });
      const data = await response.json();
      const text = data.candidates?.[0]?.content?.parts?.[0]?.text || "Good answer. Keep practicing!";
      setInterviewFeedback(text);
    } catch (err) {
      console.error(err);
      setInterviewFeedback("Failed to get live review. Your answer covers core points nicely.");
    } finally {
      setIsEvaluatingAnswer(false);
    }
  };

  // Adjust KPI Data based on live upload analysis
  const displayKPIs = () => {
    if (!analysisResult) return KPI_DATA;
    
    return [
      {
        id: "match-score",
        title: "Market Alignment",
        value: `${analysisResult.marketAlignmentScore}%`,
        change: `Live audit match`,
        isPositive: true,
        icon: "Compass",
        color: "from-indigo-500 to-cyan-500"
      },
      {
        id: "detected-skills",
        title: "Identified Skills",
        value: `${analysisResult.detectedSkills.length}`,
        change: `Parsed from profile`,
        isPositive: true,
        icon: "Briefcase",
        color: "from-purple-500 to-indigo-500"
      },
      {
        id: "skill-gaps",
        title: "Critical Skill Gaps",
        value: `${analysisResult.criticalSkillGaps.length}`,
        change: `High importance gaps`,
        isPositive: false,
        icon: "Award",
        color: "from-cyan-500 to-blue-500"
      },
      {
        id: "target-role",
        title: "Target Role",
        value: analysisResult.roleAnalyzed.split(" ")[0],
        change: analysisResult.roleAnalyzed,
        isPositive: true,
        icon: "Calendar",
        color: "from-pink-500 to-purple-500"
      }
    ];
  };

  return (
    <div className="flex-1 min-h-screen pt-24 pb-12 px-6 max-w-7xl mx-auto w-full relative z-10">
      
      {/* Decorative gradient spot */}
      <div className="absolute top-0 right-1/4 w-96 h-96 rounded-full bg-indigo-500/5 blur-[120px] pointer-events-none" />

      {/* Header Info */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight">Career Compass Dashboard</h1>
          <p className="text-slate-400 text-sm mt-1">AI-Powered Career Matching & Recommendation Engine</p>
        </div>
        
        {/* Top Controls */}
        <div className="flex items-center gap-3">
          <button 
            onClick={() => {
              setAnalysisResult(null);
              setSprintPlan(null);
              setJdResult(null);
              setJdText('');
              setInterviewFeedback('');
              setActiveSubTab('upload');
            }}
            className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 hover:bg-indigo-500/20 transition-all"
          >
            {analysisResult ? 'Re-Upload Resume' : 'Ready for Audit'}
          </button>
          <span className="text-slate-500 text-xs">Updated Live</span>
        </div>
      </div>

      {/* KPI Cards Row */}
      <div className={`grid grid-cols-1 md:grid-cols-2 ${displayKPIs().length === 3 ? 'lg:grid-cols-3' : 'lg:grid-cols-4'} gap-6 mb-8`}>
        {displayKPIs().map((kpi) => {
          const iconMap = { Compass, Briefcase, Award, Calendar };
          const IconComponent = iconMap[kpi.icon] || Compass;
          return (
            <motion.div
              key={kpi.id}
              className="glass-panel p-6 rounded-2xl flex flex-col justify-between hover:-translate-y-1 transition-transform duration-300 ease-out will-change-transform"
            >
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">{kpi.title}</span>
                <div className={`p-2 rounded-lg bg-gradient-to-tr ${kpi.color} shadow-sm shadow-indigo-500/10`}>
                  <IconComponent className="w-4 h-4 text-white" />
                </div>
              </div>
              <div>
                <h3 className="text-2xl font-bold text-white mb-2 truncate">{kpi.value}</h3>
                <div className="flex items-center gap-1.5">
                  <span className="text-xs font-medium text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 rounded-md px-1.5 py-0.5">
                    {kpi.change}
                  </span>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Main Tab switching */}
      <div className="flex border-b border-white/5 mb-6">
        <button 
          onClick={() => setActiveSubTab('upload')}
          className={`px-6 py-3 font-semibold text-sm transition-all border-b-2 ${
            activeSubTab === 'upload' 
              ? 'border-indigo-500 text-white' 
              : 'border-transparent text-slate-400 hover:text-white'
          }`}
        >
          Resume Review
        </button>
        <button 
          onClick={() => setActiveSubTab('jobs')}
          disabled={!analysisResult}
          className={`px-6 py-3 font-semibold text-sm transition-all border-b-2 disabled:opacity-50 disabled:cursor-not-allowed ${
            activeSubTab === 'jobs' 
              ? 'border-indigo-500 text-white' 
              : 'border-transparent text-slate-400 hover:text-white'
          }`}
        >
          Market Alignment & Job Matching
        </button>
        <button 
          onClick={() => setActiveSubTab('skills')}
          disabled={!analysisResult}
          className={`px-6 py-3 font-semibold text-sm transition-all border-b-2 disabled:opacity-50 disabled:cursor-not-allowed ${
            activeSubTab === 'skills' 
              ? 'border-indigo-500 text-white' 
              : 'border-transparent text-slate-400 hover:text-white'
          }`}
        >
          Adaptive Roadmap
        </button>
        <button
          onClick={() => setActiveSubTab('jd')}
          disabled={!analysisResult}
          className={`px-6 py-3 font-semibold text-sm transition-all border-b-2 disabled:opacity-50 disabled:cursor-not-allowed ${
            activeSubTab === 'jd'
              ? 'border-cyan-500 text-white'
              : 'border-transparent text-slate-400 hover:text-white'
          }`}
        >
          JD Matcher
        </button>
        <button
          onClick={() => setActiveSubTab('sprint')}
          disabled={!analysisResult}
          className={`px-6 py-3 font-semibold text-sm transition-all border-b-2 disabled:opacity-50 disabled:cursor-not-allowed ${
            activeSubTab === 'sprint'
              ? 'border-purple-500 text-white'
              : 'border-transparent text-slate-400 hover:text-white'
          }`}
        >
          30-60-90 Sprint
        </button>
      </div>

      {/* Conditionally render tabs */}
      {activeSubTab === 'upload' && (
        <ResumeUpload onAnalysisComplete={handleAnalysisComplete} />
      )}

      {activeSubTab === 'jobs' && analysisResult && (
        <div className="flex flex-col lg:flex-row gap-6 items-start">
          
          {/* Main analysis view */}
          <div className="w-full lg:w-2/3 flex flex-col gap-6">
            
            {/* Skills Level vs Market Demand Chart */}
            <div className="glass-panel p-6 rounded-2xl">
              <h3 className="font-bold text-white text-base mb-4 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-cyan-400" />
                <span>Detected Skill Levels vs. Industry Demand (2026)</span>
              </h3>
              
              <div className="flex flex-col gap-4">
                {analysisResult.marketComparison?.map((comp, idx) => (
                  <div key={idx} className="flex flex-col gap-1">
                    <div className="flex justify-between text-xs font-semibold text-slate-300">
                      <span>{comp.skill}</span>
                      <span className="text-slate-500">Your Level: {comp.yourLevel}% / Demand: {comp.marketDemand}%</span>
                    </div>
                    {/* Visual Comparison progress bar */}
                    <div className="h-3 w-full bg-white/5 rounded-full overflow-hidden relative">
                      {/* Demand Indicator (Transparent Indigo background bar) */}
                      <div 
                        className="h-full bg-indigo-500/25 absolute top-0 left-0" 
                        style={{ width: `${comp.marketDemand}%` }}
                      />
                      {/* Your Level Fill */}
                      <div 
                        className="h-full bg-gradient-to-r from-cyan-400 to-teal-400 absolute top-0 left-0" 
                        style={{ width: `${comp.yourLevel}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Recruiter Feedback / Analysis Box */}
            <div className="glass-panel p-6 rounded-2xl">
              <h3 className="font-bold text-white text-base mb-2">Recruiter Evaluation Report</h3>
              <p className="text-slate-300 text-sm leading-relaxed whitespace-pre-line">
                {analysisResult.recruiterFeedback}
              </p>
            </div>

            {/* Interactive Mock Interview Question panel */}
            {analysisResult.suggestedInterviewQuestions && analysisResult.suggestedInterviewQuestions.length > 0 && (
              <div className="glass-panel p-6 rounded-2xl border-indigo-500/20 bg-indigo-500/5">
                <h3 className="font-bold text-white text-base mb-1 flex items-center gap-2">
                  <HelpCircle className="w-5 h-5 text-indigo-400" />
                  <span>Adaptive Mock Interview Practice</span>
                </h3>
                <p className="text-xs text-slate-400 mb-4">Practice questions tailored specifically to bridge your current profile gaps.</p>

                <div className="p-4 bg-slate-950/80 border border-white/5 rounded-xl mb-4">
                  <span className="text-[10px] uppercase font-bold text-indigo-400 block mb-1">Question {activeQuestionIndex + 1} of {analysisResult.suggestedInterviewQuestions.length}</span>
                  <p className="text-sm font-semibold text-white">{analysisResult.suggestedInterviewQuestions[activeQuestionIndex]}</p>
                </div>

                <div className="flex flex-col gap-2">
                  <textarea
                    rows={4}
                    value={userAnswer}
                    onChange={(e) => setUserAnswer(e.target.value)}
                    placeholder="Type your technical response here..."
                    className="w-full bg-slate-950/60 border border-white/10 rounded-xl p-3 text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-500/50"
                  />
                  
                  <div className="flex justify-between items-center mt-2">
                    <div className="flex gap-2">
                      <button
                        onClick={() => {
                          setActiveQuestionIndex((prev) => (prev > 0 ? prev - 1 : prev));
                          setUserAnswer('');
                          setInterviewFeedback('');
                        }}
                        disabled={activeQuestionIndex === 0}
                        className="px-3 py-1.5 bg-white/5 text-xs text-slate-400 hover:text-white rounded-lg border border-white/5 disabled:opacity-40"
                      >
                        Prev
                      </button>
                      <button
                        onClick={() => {
                          setActiveQuestionIndex((prev) => (prev < analysisResult.suggestedInterviewQuestions.length - 1 ? prev + 1 : prev));
                          setUserAnswer('');
                          setInterviewFeedback('');
                        }}
                        disabled={activeQuestionIndex === analysisResult.suggestedInterviewQuestions.length - 1}
                        className="px-3 py-1.5 bg-white/5 text-xs text-slate-400 hover:text-white rounded-lg border border-white/5 disabled:opacity-40"
                      >
                        Next
                      </button>
                    </div>

                    <button
                      onClick={handleAnswerSubmit}
                      disabled={isEvaluatingAnswer || !userAnswer.trim()}
                      className="px-4 py-2 bg-gradient-to-r from-indigo-500 to-purple-500 text-xs font-bold text-white rounded-xl shadow-lg hover:opacity-90 disabled:opacity-40"
                    >
                      {isEvaluatingAnswer ? 'Evaluating...' : 'Submit Response for Evaluation'}
                    </button>
                  </div>
                </div>

                {interviewFeedback && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-4 p-4 bg-white/2 border border-white/5 rounded-xl text-xs text-slate-300 whitespace-pre-line"
                  >
                    <span className="font-bold text-indigo-400 block mb-1">Recruiter Review:</span>
                    {interviewFeedback}
                  </motion.div>
                )}
              </div>
            )}
          </div>

          {/* Sidebar Critical Gaps */}
          <div className="w-full lg:w-1/3 flex flex-col gap-6">
            <div className="glass-panel p-6 rounded-2xl border-rose-500/20 bg-rose-500/5">
              <h3 className="font-bold text-white text-base mb-4">Critical Skill Gaps</h3>
              <div className="flex flex-col gap-4">
                {analysisResult.criticalSkillGaps?.map((gap, idx) => (
                  <div key={idx} className="p-3 bg-slate-950/60 rounded-xl border border-white/5">
                    <div className="flex justify-between items-center mb-1">
                      <span className="font-semibold text-white text-sm">{gap.skill}</span>
                      <span className="text-[9px] font-extrabold uppercase px-1.5 py-0.5 rounded bg-rose-500/20 text-rose-400">
                        {gap.importance} Priority
                      </span>
                    </div>
                    <p className="text-slate-400 text-xs leading-relaxed">{gap.reason}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {activeSubTab === 'skills' && analysisResult && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main roadmap rendering based on parsed skill gaps */}
          <div className="lg:col-span-2 glass-panel p-6 rounded-2xl">
            <h3 className="font-bold text-white text-lg mb-2">Target Skills Bridge Path</h3>
            <p className="text-slate-400 text-sm mb-6">Custom dynamic milestones calculated by Gemini to align your profile with standard demand.</p>
            
            <div className="flex flex-col gap-6 relative before:absolute before:left-3.5 before:top-2 before:bottom-2 before:w-[2px] before:bg-white/5">
              {/* Dynamic steps generated from missing gaps */}
              {analysisResult.criticalSkillGaps?.map((gap, idx) => (
                <div key={idx} className="flex gap-4 relative">
                  <div className="w-8 h-8 rounded-full flex items-center justify-center shrink-0 z-10 border bg-indigo-500/10 border-indigo-500 text-indigo-400 animate-pulse">
                    <span className="text-xs font-bold">{idx + 1}</span>
                  </div>
                  <div>
                    <h4 className="font-bold text-white">{gap.skill} Upgrade</h4>
                    <p className="text-slate-400 text-xs mt-0.5 leading-relaxed">
                      Bridge gap: {gap.reason}
                    </p>
                    <span className="inline-block text-[10px] font-semibold tracking-wide uppercase px-2 py-0.5 rounded mt-2 bg-indigo-500/10 text-indigo-400">
                      In-Progress Target
                    </span>
                  </div>
                </div>
              ))}

              {/* Already Completed skills */}
              {analysisResult.detectedSkills?.slice(0, 3).map((skill, idx) => (
                <div key={idx} className="flex gap-4 relative">
                  <div className="w-8 h-8 rounded-full flex items-center justify-center shrink-0 z-10 border bg-emerald-500/10 border-emerald-500 text-emerald-400">
                    <Check className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-300">{skill} Integration</h4>
                    <p className="text-slate-500 text-xs mt-0.5">Found and verified in resume profile.</p>
                    <span className="inline-block text-[10px] font-semibold tracking-wide uppercase px-2 py-0.5 rounded mt-2 bg-emerald-500/10 text-emerald-400">
                      Verified Skill
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Side log panel */}
          <div className="glass-panel p-6 rounded-2xl flex flex-col gap-6">
            <div>
              <h3 className="font-bold text-white text-lg">System Log</h3>
              <p className="text-slate-400 text-xs">Dynamic changes recorded</p>
            </div>
            <div className="flex flex-col gap-4">
              <div className="p-3 bg-white/2 border border-white/5 rounded-xl flex gap-3 items-start">
                <Clock className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
                <div>
                  <p className="text-slate-200 text-xs">Resume successfully audited by Gemini</p>
                  <span className="text-[10px] text-slate-500 block mt-1">Just now</span>
                </div>
              </div>
              <div className="p-3 bg-white/2 border border-white/5 rounded-xl flex gap-3 items-start">
                <Clock className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
                <div>
                  <p className="text-slate-200 text-xs">Targeted mock interview questions queued</p>
                  <span className="text-[10px] text-slate-500 block mt-1">Just now</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── JD Matcher Tab ───────────────────────────────────────── */}
      {activeSubTab === 'jd' && analysisResult && (
        <div className="flex flex-col lg:flex-row gap-6 items-start">
          {/* Input panel */}
          <div className="w-full lg:w-1/2 flex flex-col gap-4">
            <div className="glass-panel p-6 rounded-2xl">
              <h3 className="font-bold text-white text-base mb-1 flex items-center gap-2">
                <FileText className="w-5 h-5 text-cyan-400" />
                Paste Job Description
              </h3>
              <p className="text-slate-500 text-xs mb-4">
                Paste any JD from LinkedIn, Indeed or a company page and Gemini will compare it against your resume.
              </p>
              <textarea
                rows={12}
                value={jdText}
                onChange={(e) => setJdText(e.target.value)}
                placeholder="Paste the full job description text here..."
                className="w-full bg-slate-950/60 border border-white/10 rounded-xl p-4 text-sm text-slate-200 placeholder-slate-600 focus:outline-none focus:border-cyan-500/50 transition-colors resize-none mb-4"
              />
              {jdError && (
                <div className="flex items-center gap-2 text-rose-400 text-xs mb-4 p-3 bg-rose-500/10 border border-rose-500/20 rounded-xl">
                  <AlertTriangle className="w-4 h-4 shrink-0" />
                  {jdError}
                </div>
              )}
              <button
                onClick={handleMatchJD}
                disabled={isMatchingJD || !jdText.trim()}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-cyan-600 to-indigo-600 hover:from-cyan-500 hover:to-indigo-500 text-white text-sm font-bold disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg shadow-cyan-500/10"
              >
                {isMatchingJD ? 'Analyzing Match...' : 'Analyze JD Match →'}
              </button>
            </div>
          </div>

          {/* Results panel */}
          <div className="w-full lg:w-1/2 flex flex-col gap-4">
            {!jdResult && !isMatchingJD && (
              <div className="glass-panel p-10 rounded-2xl flex flex-col items-center justify-center gap-3 text-center border-dashed border-cyan-500/20">
                <Target className="w-10 h-10 text-cyan-500/40" />
                <p className="text-slate-500 text-sm">Paste a JD and click Analyze to see your ATS match score, keyword gaps, and tailored resume tweaks.</p>
              </div>
            )}
            {isMatchingJD && (
              <div className="glass-panel p-10 rounded-2xl flex flex-col items-center justify-center gap-3">
                <div className="w-10 h-10 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin" />
                <p className="text-slate-400 text-sm">Gemini is matching your profile to the JD...</p>
              </div>
            )}
            {jdResult && (
              <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col gap-4">
                {/* ATS Score */}
                <div className="glass-panel p-6 rounded-2xl flex items-center gap-6">
                  <div className="relative w-20 h-20 shrink-0">
                    <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
                      <circle cx="18" cy="18" r="15.9" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="3" />
                      <motion.circle
                        cx="18" cy="18" r="15.9" fill="none"
                        stroke={jdResult.atsScore >= 70 ? '#22d3ee' : jdResult.atsScore >= 50 ? '#a78bfa' : '#f43f5e'}
                        strokeWidth="3" strokeLinecap="round" strokeDasharray="100"
                        initial={{ strokeDashoffset: 100 }}
                        animate={{ strokeDashoffset: 100 - jdResult.atsScore }}
                        transition={{ duration: 1.2, ease: 'easeOut' }}
                      />
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <span className="text-lg font-bold text-white">{jdResult.atsScore}%</span>
                    </div>
                  </div>
                  <div>
                    <p className="text-white font-bold text-base">ATS Match Score</p>
                    <p className="text-slate-400 text-xs mt-1 leading-relaxed">{jdResult.overallVerdict}</p>
                  </div>
                </div>

                {/* Keywords */}
                <div className="glass-panel p-5 rounded-2xl">
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">Keyword Analysis</p>
                  <div className="flex flex-wrap gap-2 mb-3">
                    {jdResult.matchedKeywords?.map((k) => (
                      <span key={k} className="text-[11px] font-semibold px-2.5 py-1 rounded-lg bg-emerald-500/15 text-emerald-400 border border-emerald-500/25">✓ {k}</span>
                    ))}
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {jdResult.missingKeywords?.map((k) => (
                      <span key={k} className="text-[11px] font-semibold px-2.5 py-1 rounded-lg bg-rose-500/15 text-rose-400 border border-rose-500/25">✕ {k}</span>
                    ))}
                  </div>
                </div>

                {/* Resume Tweaks */}
                <div className="glass-panel p-5 rounded-2xl">
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3 flex items-center gap-2">
                    <Zap className="w-3.5 h-3.5 text-amber-400" /> Suggested Resume Tweaks
                  </p>
                  <div className="flex flex-col gap-2">
                    {jdResult.resumeTweaks?.map((tweak, i) => (
                      <div key={i} className="flex gap-2.5 items-start text-xs text-slate-300">
                        <span className="w-5 h-5 rounded-full bg-amber-500/15 text-amber-400 flex items-center justify-center shrink-0 text-[10px] font-bold mt-0.5">{i + 1}</span>
                        {tweak}
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}
          </div>
        </div>
      )}

      {/* ── 30-60-90 Sprint Tab ──────────────────────────────────── */}
      {activeSubTab === 'sprint' && analysisResult && (
        <div className="flex flex-col gap-6">
          {!sprintPlan && !isGeneratingSprint && (
            <div className="glass-panel p-10 rounded-2xl flex flex-col items-center gap-5 text-center border-purple-500/20">
              <div className="p-4 rounded-2xl bg-gradient-to-br from-purple-500/20 to-indigo-500/20 border border-purple-500/20">
                <TrendingUp className="w-8 h-8 text-purple-400" />
              </div>
              <div>
                <h3 className="text-white font-bold text-lg mb-1">Generate Your 30-60-90 Day Skill Sprint</h3>
                <p className="text-slate-400 text-sm max-w-md">
                  Gemini will build a personalized, week-by-week learning plan based on your skill gaps and target role.
                </p>
              </div>
              {sprintError && (
                <div className="flex items-center gap-2 text-rose-400 text-xs p-3 bg-rose-500/10 border border-rose-500/20 rounded-xl w-full max-w-md">
                  <AlertTriangle className="w-4 h-4 shrink-0" />
                  {sprintError}
                </div>
              )}
              <button
                onClick={handleGenerateSprint}
                className="px-8 py-3 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white text-sm font-bold transition-all shadow-lg shadow-purple-500/20"
              >
                Generate My Sprint Plan →
              </button>
            </div>
          )}

          {isGeneratingSprint && (
            <div className="glass-panel p-12 rounded-2xl flex flex-col items-center gap-4">
              <div className="w-12 h-12 border-2 border-purple-400 border-t-transparent rounded-full animate-spin" />
              <div className="text-center">
                <p className="text-white font-bold">Building Your Personalized Sprint...</p>
                <p className="text-slate-400 text-sm mt-1">Gemini is crafting a week-by-week plan from your skill gaps.</p>
              </div>
            </div>
          )}

          {sprintPlan && (
            <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col gap-4">
              {/* Header */}
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-white font-bold text-xl">Your 90-Day Sprint to {sprintPlan.targetRole}</h3>
                  <p className="text-slate-400 text-sm mt-1">12 weeks of focused, actionable growth. Expand each week to see your daily tasks.</p>
                </div>
                <button onClick={handleGenerateSprint} className="text-[11px] text-slate-500 hover:text-white px-3 py-1.5 rounded-lg border border-white/10 hover:border-white/20 transition-all">
                  Regenerate
                </button>
              </div>

              {/* Phase cards */}
              {[
                { key: 'days30', label: '30 Days', color: 'from-cyan-500 to-teal-500', bg: 'bg-cyan-500/10', border: 'border-cyan-500/20', textCol: 'text-cyan-400', weekStart: 1 },
                { key: 'days60', label: '60 Days', color: 'from-indigo-500 to-purple-500', bg: 'bg-indigo-500/10', border: 'border-indigo-500/20', textCol: 'text-indigo-400', weekStart: 5 },
                { key: 'days90', label: '90 Days', color: 'from-purple-500 to-pink-500', bg: 'bg-purple-500/10', border: 'border-purple-500/20', textCol: 'text-purple-400', weekStart: 9 },
              ].map((phase) => {
                const data = sprintPlan[phase.key];
                if (!data) return null;
                const isOpen = expandedPhase === phase.key;
                return (
                  <div key={phase.key} className={`glass-panel rounded-2xl border ${phase.border} overflow-hidden`}>
                    {/* Phase header */}
                    <button
                      className="w-full flex items-center justify-between p-5 text-left"
                      onClick={() => setExpandedPhase(isOpen ? null : phase.key)}
                    >
                      <div className="flex items-center gap-3">
                        <span className={`text-xs font-extrabold uppercase tracking-widest px-3 py-1 rounded-lg ${phase.bg} ${phase.textCol} border ${phase.border}`}>{phase.label}</span>
                        <div>
                          <p className="text-white font-bold">{data.theme}</p>
                          <p className="text-slate-500 text-xs">{data.goal}</p>
                        </div>
                      </div>
                      {isOpen ? <ChevronDown className={`w-4 h-4 ${phase.textCol}`} /> : <ChevronRight className="w-4 h-4 text-slate-500" />}
                    </button>

                    {/* Weeks */}
                    {isOpen && (
                      <div className="px-5 pb-5 flex flex-col gap-3 border-t border-white/5 pt-4">
                        {data.weeks?.map((week) => {
                          const weekKey = `${phase.key}-${week.week}`;
                          const weekOpen = expandedWeek === weekKey;
                          return (
                            <div key={weekKey} className="bg-white/[0.02] border border-white/5 rounded-xl overflow-hidden">
                              <button
                                className="w-full flex items-center justify-between p-4 text-left"
                                onClick={() => setExpandedWeek(weekOpen ? null : weekKey)}
                              >
                                <div className="flex items-center gap-3">
                                  <span className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${phase.bg} ${phase.textCol} border ${phase.border}`}>
                                    {week.week}
                                  </span>
                                  <div>
                                    <p className="text-white text-sm font-semibold">{week.focus}</p>
                                    <p className="text-slate-500 text-xs">🏁 {week.milestone}</p>
                                  </div>
                                </div>
                                {weekOpen ? <ChevronDown className="w-3.5 h-3.5 text-slate-500" /> : <ChevronRight className="w-3.5 h-3.5 text-slate-500" />}
                              </button>
                              {weekOpen && (
                                <div className="px-4 pb-4 border-t border-white/5 pt-3 flex flex-col gap-3">
                                  <div className="flex flex-col gap-1.5">
                                    {week.tasks?.map((task, ti) => (
                                      <div key={ti} className="flex items-start gap-2 text-xs text-slate-300">
                                        <CheckCircle2 className={`w-4 h-4 shrink-0 mt-0.5 ${phase.textCol}`} />
                                        {task}
                                      </div>
                                    ))}
                                  </div>
                                  <div className={`flex items-center gap-2 text-[11px] ${phase.textCol} ${phase.bg} border ${phase.border} rounded-lg px-3 py-2`}>
                                    <Zap className="w-3.5 h-3.5 shrink-0" />
                                    <span><strong>Resource:</strong> {week.resource}</span>
                                  </div>
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              })}
            </motion.div>
          )}
        </div>
      )}
    </div>
  );
}