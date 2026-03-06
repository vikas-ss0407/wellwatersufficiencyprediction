import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { 
  Droplets, 
  CloudSun, 
  Cpu, 
  BarChart3, 
  CheckCircle2, 
  ArrowRight, 
  Mail, 
  Zap,
  Waves,
  Settings,
  Database,
  LineChart,
  Trees,
  Leaf,
  Sprout
} from "lucide-react";
import Navbar from "../components/Navbar";

// Floating Nature Animation Component
const FloatingLeaves = () => (
  <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-30">
    {[...Array(12)].map((_, i) => (
      <motion.div
        key={i}
        className="absolute text-emerald-300"
        initial={{ 
          opacity: 0, 
          y: Math.random() * 800 + 400, 
          x: Math.random() * 1200 - 600, 
          scale: Math.random() * 0.5 + 0.5,
          rotate: Math.random() * 360
        }}
        animate={{ 
          opacity: [0.1, 0.5, 0.1], 
          y: -200, 
          rotate: [0, 180, 360] 
        }}
        transition={{ 
          duration: Math.random() * 10 + 20, 
          repeat: Infinity, 
          ease: "linear",
          delay: Math.random() * 10
        }}
        style={{
          top: `${Math.random() * 100}%`,
          left: `${Math.random() * 100}%`,
        }}
      >
        {i % 3 === 0 ? <Leaf size={40} /> : i % 3 === 1 ? <Trees size={35} /> : <Sprout size={30} />}
      </motion.div>
    ))}
  </div>
);

const LandingPage = () => {
  const fadeInUp = {
    initial: { opacity: 0, y: 30 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true },
    transition: { duration: 0.6 }
  };

  const steps = [
    { 
      s: "01", 
      t: "Install", 
      d: "Mount the Ultrasonic sensor at the well head to track depth in real-time.",
      icon: <Settings className="text-amber-400" /> 
    },
    { 
      s: "02", 
      t: "Sync", 
      d: "Link your ThingSpeak API keys to stream live data to our AI engine.",
      icon: <Database className="text-white" /> 
    },
    { 
      s: "03", 
      t: "Analyze", 
      d: "Input tree count and variety to calculate specific irrigation needs.",
      icon: <Trees className="text-amber-400" /> 
    },
    { 
      s: "04", 
      t: "Predict", 
      d: "Receive water sufficiency ROI and automated irrigation schedules.",
      icon: <LineChart className="text-white" /> 
    }
  ];

  return (
    // THE ENTIRE PAGE IS NOW GREEN
    <div className="min-h-screen bg-gradient-to-b from-[#064e3b] to-[#0f766e] text-slate-100 font-sans selection:bg-amber-400/30">
      <Navbar />

      {/* 1. HERO SECTION - SUN-DRENCHED FOREST */}
      <header className="relative overflow-hidden pt-28 pb-32 lg:pt-44">
        
        {/* Animated Nature Background */}
        <FloatingLeaves />

        {/* Dynamic Light Rays */}
        <div className="absolute top-0 left-0 w-[400px] h-[400px] bg-amber-400/20 rounded-full blur-[100px] animate-pulse" />
        
        <main className="relative mx-auto max-w-7xl px-6 lg:grid lg:grid-cols-2 lg:gap-16 items-center">
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 mb-8 text-sm font-bold text-amber-900 bg-amber-400 border border-amber-300 rounded-full shadow-lg">
              <Sprout size={16} className="fill-amber-900" />
              <span className="tracking-wide uppercase">Cultivating with AI</span>
            </div>
            
            <h1 className="text-6xl lg:text-8xl font-black tracking-tighter leading-none mb-8 text-white">
              Sustaining <br />
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-amber-400 via-amber-200 to-emerald-200">
                Growth
              </span>
            </h1>

            <p className="text-xl text-emerald-100 leading-relaxed max-w-xl mb-10">
              Transform guesswork into growth. We merge Ultrasonic well data with predictive AI 
              to ensure your trees always have the optimal water they need.
            </p>

            <div className="flex flex-wrap gap-5">
              <Link to="/signup" className="group px-10 py-5 bg-amber-400 hover:bg-amber-300 text-amber-950 rounded-2xl font-black shadow-xl shadow-amber-500/30 transition-all duration-300 flex items-center gap-3">
                Optimize Your Farm <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="mt-20 lg:mt-0"
          >
            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-amber-400 to-emerald-400 rounded-[3rem] blur opacity-30 group-hover:opacity-60 transition duration-1000"></div>
              
              {/* Card is White/Glass against the Green */}
              <div className="relative bg-white/10 backdrop-blur-xl border border-white/10 rounded-[3rem] p-10 overflow-hidden shadow-2xl">
                <div className="flex justify-between items-start mb-12">
                  <div>
                    <p className="text-amber-400 font-bold uppercase tracking-widest text-xs">Live Analytics</p>
                    <h3 className="text-3xl font-bold mt-1 text-white">Sensor Node A-1</h3>
                  </div>
                  <div className="h-14 w-14 bg-amber-400 rounded-2xl flex items-center justify-center border-4 border-amber-300 shadow-inner">
                    <Droplets className="text-amber-950" size={30} />
                  </div>
                </div>
                
                <div className="space-y-8">
                  <div>
                    <div className="flex justify-between mb-3 text-sm">
                      <span className="text-emerald-100">Well Water Level</span>
                      <span className="text-amber-400 font-mono">14.2m / 84% Available</span>
                    </div>
                    <div className="h-3 w-full bg-emerald-950 rounded-full overflow-hidden p-0.5">
                      <motion.div 
                        initial={{ width: 0 }} 
                        animate={{ width: "84%" }} 
                        transition={{ duration: 2 }}
                        className="h-full bg-gradient-to-r from-amber-400 to-cyan-300 rounded-full shadow-[0_0_15px_rgba(251,191,36,0.6)]" 
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                     <div className="bg-emerald-900 p-5 rounded-2xl border border-emerald-800">
                        <p className="text-[10px] text-emerald-400 uppercase font-bold">Tree Limit</p>
                        <p className="text-2xl font-bold text-white">1,240</p>
                     </div>
                     <div className="bg-emerald-900 p-5 rounded-2xl border border-emerald-800">
                        <p className="text-[10px] text-emerald-400 uppercase font-bold">Sustainability</p>
                        <p className="text-2xl font-bold text-amber-400">High</p>
                     </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </main>
      </header>

      {/* 2. HOW IT WORKS - UPDATED TIMELINE */}
      <section className="py-32 relative">
        <div className="mx-auto max-w-7xl px-6">
          <div className="text-center mb-24 max-w-2xl mx-auto">
            <h2 className="text-4xl lg:text-6xl font-black mb-6 text-white leading-tight">Your Four Steps <br /> to <span className="text-amber-400">Certainty</span></h2>
            <p className="text-emerald-100 text-lg">Seamlessly connecting your field infrastructure to our predictive intelligence.</p>
          </div>
          
          <div className="grid lg:grid-cols-4 gap-8 relative">
            {/* Connecting Line */}
            <div className="hidden lg:block absolute top-1/2 left-0 w-full h-[2px] bg-gradient-to-r from-amber-400/0 via-amber-400/50 to-amber-400/0 -translate-y-1/2" />
            
            {steps.map((step, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.2 }}
                className="relative group bg-emerald-950/70 border border-emerald-800 p-8 rounded-[2.5rem] hover:border-amber-400 transition-all duration-500 shadow-lg"
              >
                <div className="absolute -top-6 left-1/2 -translate-x-1/2 w-12 h-12 bg-amber-400 text-amber-950 rounded-full flex items-center justify-center font-black z-20 group-hover:scale-110 group-hover:bg-amber-300 transition-all duration-300">
                  {step.s}
                </div>
                
                <div className="mt-4 mb-6 w-16 h-16 bg-emerald-900 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-500 shadow-inner">
                  {React.cloneElement(step.icon, { size: 30 })}
                </div>
                
                <h4 className="text-2xl font-bold mb-4 text-white">{step.t}</h4>
                <p className="text-emerald-200 text-sm leading-relaxed">
                  {step.d}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. DESIGN & TECHNOLOGY */}
      <section className="py-32 bg-emerald-950/30">
        <div className="mx-auto max-w-7xl px-6">
          <div className="grid md:grid-cols-3 gap-10">
            {[
              { icon: <Cpu />, title: "IoT Precision", d: "ESP32 nodes stream depth data with ±1cm accuracy." },
              { icon: <CloudSun />, title: "AI Forecasting", d: "Merges hyper-local weather with ETo evapotranspiration rates." },
              { icon: <Leaf />, title: "Nature Analysis", d: "Logic per tree age/variety to determine minimal necessary volume." }
            ].map((item, i) => (
              <motion.div key={i} {...fadeInUp} className="p-10 rounded-[2.5rem] bg-gradient-to-b from-emerald-900 to-transparent border border-emerald-800">
                <div className="text-amber-400 mb-6">{React.cloneElement(item.icon, { size: 32 })}</div>
                <h3 className="text-xl font-bold mb-4 text-white">{item.title}</h3>
                <p className="text-emerald-200 text-sm leading-relaxed">{item.d}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. ADVANTAGES - ACCENT COLOR POP */}
      <section className="py-32 relative">
        <FloatingLeaves />
        <div className="mx-auto max-w-7xl px-6 relative z-10">
          <div className="bg-amber-400 rounded-[3rem] p-12 lg:p-20 lg:flex items-center gap-16 overflow-hidden relative shadow-2xl">
            <div className="absolute top-0 right-0 opacity-10 text-amber-950"><Waves size={500} /></div>
            
            <div className="lg:w-1/2 relative z-10 text-amber-950">
              <h2 className="text-4xl lg:text-5xl font-black mb-8 leading-tight">Cultivating a Smarter Future.</h2>
              <div className="space-y-4 font-bold">
                {["Increase yield by optimizing water.", "Protect water table health.", "Save hours of monitoring labor."].map((text, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <CheckCircle2 size={24} className="text-green-800" />
                    <span>{text}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="lg:w-1/2 mt-12 lg:mt-0 relative z-10 flex flex-col gap-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-green-950 p-8 rounded-3xl border-4 border-green-900 text-white shadow-xl">
                  <p className="text-4xl font-black text-amber-400">100%</p>
                  <p className="text-xs uppercase font-bold tracking-widest mt-2">Data Integrity</p>
                </div>
                <div className="bg-green-800 p-8 rounded-3xl border border-green-700 text-amber-950 flex flex-col items-center justify-center text-center">
                  <Droplets size={32} className="mb-2" />
                  <p className="text-sm font-bold leading-tight">Zero Waste Irrigation</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. CONTACT - White Form against Green */}
      <section className="py-32 border-t border-emerald-800">
        <div className="mx-auto max-w-7xl px-6 relative">
          <div className="grid lg:grid-cols-2 gap-20 items-center relative z-10">
            <div>
              <h2 className="text-5xl font-black mb-8 text-white">Let's Connect your <br /> <span className="text-amber-400">Infrastructure</span></h2>
              <p className="text-emerald-100 text-lg mb-10">Contact our agritech specialists to map out your digital transformation or custom hardware needs.</p>
              <div className="flex items-center gap-4 text-amber-400 font-bold bg-emerald-950 p-4 rounded-full w-fit">
                <Mail />
                <span>support@agriwell-ai.com</span>
              </div>
            </div>
            
            <form className="bg-white p-12 rounded-[3rem] border border-slate-100 space-y-4 shadow-2xl">
              <p className="text-sm font-bold text-amber-900 uppercase tracking-widest mb-2">Request technical support</p>
              <input type="text" placeholder="Name" className="w-full p-5 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:border-amber-400 text-amber-950" />
              <input type="email" placeholder="Email" className="w-full p-5 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:border-amber-400 text-amber-950" />
              <textarea placeholder="Your requirements or sensor model..." rows="4" className="w-full p-5 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:border-amber-400 text-amber-950"></textarea>
              <button className="w-full py-5 bg-amber-400 hover:bg-amber-300 text-amber-950 font-black rounded-2xl transition-all shadow-lg shadow-amber-500/20">
                Send Inquiry
              </button>
            </form>
          </div>
        </div>
      </section>

      <footer className="py-12 text-center text-emerald-400 border-t border-emerald-800 font-medium">
        <p>© 2026 SmartWell AI Irrigation Planner. Roots in Data.</p>
      </footer>
    </div>
  );
};

export default LandingPage;