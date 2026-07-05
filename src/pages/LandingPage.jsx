import React from 'react';
import { motion } from 'framer-motion';
import { 
  Compass, 
  ArrowRight, 
  Target, 
  TrendingUp, 
  Cpu, 
  Shield, 
  Sparkles, 
  CheckCircle2 
} from 'lucide-react';

export default function LandingPage({ onLaunchDashboard }) {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: 'tween',
        ease: 'easeOut',
        duration: 0.5
      }
    }
  };

  const features = [
    {
      icon: Cpu,
      title: "Real-time AI Analysis",
      desc: "Our neural engine scans your resume and matches it to 10,000+ live jobs instantly.",
      gradient: "from-indigo-500 to-purple-500"
    },
    {
      icon: Target,
      title: "Interactive Skill Map",
      desc: "Discover missing tech stack skills and unlock learning resources targeted for your target jobs.",
      gradient: "from-purple-500 to-pink-500"
    },
    {
      icon: TrendingUp,
      title: "Market Demand Forecasts",
      desc: "Predict tech hiring trends, average base salaries, and talent competition levels.",
      gradient: "from-cyan-500 to-blue-500"
    }
  ];

  return (
    <div id="home" className="relative min-h-screen pt-24 pb-20 overflow-hidden bg-[#030014]">
      {/* Decorative Gradient Background Orbs */}
      <div className="absolute top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full bg-indigo-500/10 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 translate-x-1/2 translate-y-1/2 w-[450px] h-[450px] rounded-full bg-purple-500/10 blur-[160px] pointer-events-none" />
      <div className="absolute top-10 right-10 w-80 h-80 rounded-full bg-cyan-500/5 blur-[100px] pointer-events-none" />

      {/* Grid Pattern overlay */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-950/20 via-transparent to-transparent pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        {/* Hero Section */}
        <motion.div 
          className="text-center max-w-4xl mx-auto mt-16 md:mt-24"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Badge */}
          <motion.div 
            variants={itemVariants}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-indigo-500/20 bg-indigo-500/5 text-indigo-300 text-xs font-semibold tracking-wider uppercase mb-8"
          >
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
            <span>Next-Gen Career Intelligence</span>
          </motion.div>

          {/* Heading */}
          <motion.h1 
            variants={itemVariants}
            className="text-5xl md:text-7xl font-extrabold tracking-tight mb-8 leading-[1.1]"
          >
            Navigate Your Tech Career With{" "}
            <span className="text-gradient">
              Absolute Precision
            </span>
          </motion.h1>

          {/* Subheading */}
          <motion.p 
            variants={itemVariants}
            className="text-slate-400 text-lg md:text-xl leading-relaxed mb-10 max-w-2xl mx-auto"
          >
            CareerCompass AI scans live market demand, maps out personalized skill roadmaps, and guides you to perfect job matches.
          </motion.p>

          {/* Actions */}
          <motion.div 
            variants={itemVariants}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-20"
          >
            <button
              onClick={onLaunchDashboard}
              className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-gradient-to-r from-indigo-500 via-purple-500 to-cyan-500 text-white font-bold tracking-wide shadow-lg shadow-indigo-500/25 hover:opacity-95 hover:shadow-indigo-500/35 transition-all duration-300 flex items-center justify-center gap-2 group cursor-pointer"
            >
              <span>Launch Career Dashboard</span>
              <ArrowRight className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1" />
            </button>

            <a
              href="#features"
              className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 text-white font-semibold transition-all duration-300 flex items-center justify-center gap-2"
            >
              Learn How It Works
            </a>
          </motion.div>
          {/* ✨ 2026 Tech Skills Market Pulse */}
          <motion.div
            variants={itemVariants}
            className="relative rounded-2xl border border-white/10 bg-[#0d0a24]/50 backdrop-blur-md shadow-2xl shadow-black/80 max-w-5xl mx-auto overflow-hidden"
          >
            {/* Window chrome */}
            <div className="flex items-center justify-between border-b border-white/5 px-4 py-3">
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-full bg-rose-500/80" />
                <span className="w-3 h-3 rounded-full bg-amber-500/80" />
                <span className="w-3 h-3 rounded-full bg-emerald-500/80" />
              </div>
              <div className="flex items-center gap-2 text-[10px] text-slate-400 font-mono tracking-wider bg-white/5 px-3 py-1 rounded-md">
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse inline-block" />
                2026 Tech Skills · Live Market Intelligence
              </div>
              <div className="flex items-center gap-1.5">
                <span className="text-[10px] text-slate-500 font-mono">Powered by</span>
                <span className="text-[10px] text-indigo-400 font-mono font-bold">Gemini AI</span>
              </div>
            </div>

            <div className="p-5">
              {/* Section header */}
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="text-white font-bold text-sm">Real-Time Skill Demand Heatmap</p>
                  <p className="text-slate-500 text-[11px] mt-0.5">Badge brightness = current market demand intensity. Updated continuously.</p>
                </div>
                <span className="text-[10px] font-mono font-bold px-2 py-1 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  ▲ Q3 2026 Data
                </span>
              </div>

              {/* Skill heatmap grid */}
              {[
                {
                  category: '🤖 AI / ML',
                  skills: [
                    { name: 'LLM Engineering', level: 'blazing', demand: 98 },
                    { name: 'PyTorch', level: 'hot', demand: 91 },
                    { name: 'RAG Pipelines', level: 'blazing', demand: 96 },
                    { name: 'Fine-tuning', level: 'hot', demand: 87 },
                    { name: 'MLOps', level: 'rising', demand: 74 },
                  ]
                },
                {
                  category: '⚙️ Backend',
                  skills: [
                    { name: 'Go', level: 'hot', demand: 88 },
                    { name: 'Rust', level: 'rising', demand: 79 },
                    { name: 'Node.js', level: 'steady', demand: 82 },
                    { name: 'GraphQL', level: 'steady', demand: 70 },
                    { name: 'gRPC', level: 'rising', demand: 73 },
                  ]
                },
                {
                  category: '🌐 Frontend',
                  skills: [
                    { name: 'TypeScript', level: 'hot', demand: 92 },
                    { name: 'Next.js', level: 'hot', demand: 89 },
                    { name: 'React', level: 'steady', demand: 85 },
                    { name: 'Tailwind CSS', level: 'steady', demand: 76 },
                    { name: 'Web3 / WASM', level: 'rising', demand: 61 },
                  ]
                },
                {
                  category: '☁️ Cloud / DevOps',
                  skills: [
                    { name: 'Kubernetes', level: 'hot', demand: 90 },
                    { name: 'Terraform', level: 'hot', demand: 86 },
                    { name: 'AWS', level: 'steady', demand: 88 },
                    { name: 'eBPF', level: 'rising', demand: 65 },
                    { name: 'Wasm Edge', level: 'rising', demand: 58 },
                  ]
                },
              ].map((group, gi) => (
                <div key={gi} className="mb-4">
                  <p className="text-[10px] text-slate-600 uppercase tracking-widest font-mono mb-2">{group.category}</p>
                  <div className="flex flex-wrap gap-2">
                    {group.skills.map((skill, si) => {
                      const styles = {
                        blazing: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40 shadow-[0_0_12px_rgba(34,211,238,0.25)]',
                        hot:     'bg-indigo-500/20 text-indigo-300 border-indigo-500/40 shadow-[0_0_10px_rgba(99,102,241,0.2)]',
                        rising:  'bg-purple-500/15 text-purple-300 border-purple-500/30',
                        steady:  'bg-white/5 text-slate-400 border-white/10',
                      };
                      const pulse = skill.level === 'blazing' || skill.level === 'hot';
                      return (
                        <motion.span
                          key={si}
                          initial={{ opacity: 0, scale: 0.85 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: 0.1 + gi * 0.12 + si * 0.06, duration: 0.3, ease: 'easeOut' }}
                          className={`inline-flex items-center gap-1.5 text-[11px] font-semibold px-2.5 py-1 rounded-lg border transition-all ${styles[skill.level]}`}
                        >
                          {pulse && (
                            <span className={`w-1.5 h-1.5 rounded-full animate-pulse shrink-0 ${skill.level === 'blazing' ? 'bg-cyan-400' : 'bg-indigo-400'}`} />
                          )}
                          {skill.name}
                          <span className="text-[9px] font-bold opacity-60">{skill.demand}%</span>
                        </motion.span>
                      );
                    })}
                  </div>
                </div>
              ))}

              {/* Scrolling ticker */}
              <div className="mt-4 border-t border-white/5 pt-3 overflow-hidden">
                <div className="flex gap-1.5 items-center mb-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="text-[9px] text-slate-600 uppercase tracking-widest font-mono">Live Demand Feed</span>
                </div>
                <div className="overflow-hidden whitespace-nowrap">
                  <motion.div
                    className="inline-flex gap-8 text-[10px] font-mono text-slate-500"
                    animate={{ x: [0, -1200] }}
                    transition={{ duration: 22, repeat: Infinity, ease: 'linear', repeatType: 'loop' }}
                  >
                    {[
                      '🔥 LLM Engineering +212% YoY',
                      '📈 Rust demand up 34% this quarter',
                      '⚡ TypeScript now required in 78% of frontend roles',
                      '🤖 AI Engineers: 847% demand surge since 2024',
                      '☁️ Kubernetes certifications → +$22k salary bump',
                      '📊 Data Engineers: most in-demand role Q3 2026',
                      '🌐 Next.js surpassed Vue.js in job postings',
                      '🔐 Security Engineers: 3x more openings than candidates',
                      '🦀 Rust adopted by 40% of systems teams at FAANG',
                      '💡 RAG pipeline skills: highest salary multiplier of 2026',
                      '🔥 LLM Engineering +212% YoY',
                      '📈 Rust demand up 34% this quarter',
                      '⚡ TypeScript now required in 78% of frontend roles',
                    ].map((item, i) => (
                      <span key={i} className="shrink-0">{item}</span>
                    ))}
                  </motion.div>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>

        {/* Features Section */}
        <section id="features" className="mt-40">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight text-white mb-4">
              Engineered For High-Growth Careers
            </h2>
            <p className="text-slate-400">
              Stop guessing your skill gaps. Make data-backed moves to secure premium roles.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {features.map((feat, idx) => {
              const Icon = feat.icon;
              return (
                <div 
                  key={idx}
                  className="glass-panel glass-panel-hover p-8 rounded-2xl relative overflow-hidden flex flex-col gap-4 text-left"
                >
                  <div className={`p-3 rounded-xl bg-gradient-to-tr ${feat.gradient} w-fit shadow-md`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-white">{feat.title}</h3>
                  <p className="text-slate-400 text-sm leading-relaxed">{feat.desc}</p>
                </div>
              );
            })}
          </div>
        </section>

        {/* How It Works Section */}
        <section id="how-it-works" className="mt-40">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight text-white mb-4">
              How It Works
            </h2>
            <p className="text-slate-400">
              Four steps to analyze, bridge, and simulate your path to the perfect engineering role.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[
              { step: "01", title: "Upload Resume Image", desc: "Drop a snapshot or screenshot of your resume to initiate OCR scan." },
              { step: "02", title: "Target Any Role", desc: "Type your target title. The system crawls current 2026 tech trends." },
              { step: "03", title: "Fill Confidence Gaps", desc: "For low-confidence details, complete an adaptive dynamic assessment." },
              { step: "04", title: "Unlock Intel & Practice", desc: "Get real hiring readiness metrics, recruiter insights, and practice interviews." }
            ].map((stepObj, idx) => (
              <div key={idx} className="glass-panel p-6 rounded-2xl flex flex-col gap-3 text-left relative overflow-hidden">
                <span className="text-4xl font-extrabold text-indigo-500/25 absolute right-4 top-4 font-mono">{stepObj.step}</span>
                <h3 className="text-lg font-bold text-white mt-4">{stepObj.title}</h3>
                <p className="text-slate-400 text-xs leading-relaxed">{stepObj.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* FAQ Section */}
        <section id="faq" className="mt-40 mb-20">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight text-white mb-4">
              Frequently Asked Questions
            </h2>
            <p className="text-slate-400">
              Clear answers to common questions about the platform.
            </p>
          </div>

          <div className="max-w-3xl mx-auto flex flex-col gap-4">
            {[
              { q: "How does the image-based resume analysis work?", a: "We utilize Gemini 2.5 Flash's multimodal vision capabilities to extract structured text directly from PNG/JPG resume screenshots or photos, running OCR and alignment checks without intermediate text conversion." },
              { q: "What happens if my resume has low details?", a: "The AI agent dynamically spins up an interactive Assessment Q&A (3-5 questions) specifically targetted to verify your tech stack. This updates the Agent Confidence Meter before completing the alignment report." },
              { q: "Is my personal data kept secure?", a: "Absolutely. Your uploaded images are processed entirely client-side via Google Generative AI browser execution, using your private environment API key." }
            ].map((item, idx) => (
              <div key={idx} className="glass-panel p-6 rounded-2xl text-left">
                <h4 className="text-base font-bold text-white mb-2">❓ {item.q}</h4>
                <p className="text-slate-400 text-xs leading-relaxed">{item.a}</p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
