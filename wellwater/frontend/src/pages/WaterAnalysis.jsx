import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Droplets, 
  Trees, 
  Calendar, 
  CloudSun, 
  ArrowRight, 
  AlertTriangle, 
  CheckCircle, 
  Waves, 
  Thermometer, 
  Wind,
  Loader2,
  ChevronLeft
} from "lucide-react";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import { useAuth } from "../context/AuthContext";
import { getHardwareById } from "../api/hardwareApi";
import { getPrediction } from "../api/predictionApi";

const WaterAnalysis = () => {
  const { id } = useParams();
  const { user } = useAuth();

  const [product, setProduct] = useState(null);
  const [form, setForm] = useState({
    irrigationStart: "",
    treeCount: "",
    litersPerTree: ""
  });
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const load = async () => {
      if (!user?.id || !id) return;
      const data = await getHardwareById(id, user.id);
      setProduct(data);
    };
    load();
  }, [id, user?.id]);

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const onAnalyze = async (e) => {
    e.preventDefault();
    if (!product) return;
    setLoading(true);
    setError("");

    try {
      const prediction = await getPrediction({
        ...form,
        treeCount: Number(form.treeCount),
        litersPerTree: Number(form.litersPerTree),
        wellDepth: product.wellDepth,
        wellWidth: product.wellWidth,
        latitude: product.latitude,
        longitude: product.longitude,
        thingSpeakChannelId: product.thingSpeakChannelId,
        thingSpeakField: product.thingSpeakField
      });
      setResult(prediction);
    } catch (apiError) {
      setError(apiError.message || "Prediction engine offline.");
    } finally {
      setLoading(false);
    }
  };

  if (!product) {
    return (
      <div className="min-h-screen bg-[#064e3b] flex items-center justify-center p-6 text-center">
        <div className="bg-white/10 backdrop-blur-xl p-8 rounded-3xl border border-white/10 max-w-sm">
          <p className="text-emerald-100/60 mb-6">Device synchronization failed.</p>
          <Link className="bg-amber-400 text-amber-950 px-6 py-2 rounded-xl font-bold" to="/dashboard">Back to Dashboard</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#064e3b] to-[#0f766e] font-sans text-slate-100">
      <Navbar />

      <div className="mx-auto flex w-full max-w-7xl flex-col gap-6 px-4 py-8 lg:flex-row">
        <div className="lg:w-64">
          <Sidebar />
        </div>

        <main className="flex-1 space-y-6">
          {/* Header */}
          <div className="flex items-center gap-4">
            <Link to={`/product/${id}`} className="p-2 bg-white/5 rounded-xl hover:bg-white/10 transition-colors">
              <ChevronLeft size={20} />
            </Link>
            <div>
              <h1 className="text-3xl font-black text-white leading-tight">Sufficiency Analysis</h1>
              <p className="text-emerald-100/60 text-sm">Hardware Node: <span className="text-amber-400">{product.productName}</span></p>
            </div>
          </div>

          <div className="grid lg:grid-cols-12 gap-6">
            {/* Input Form Card */}
            <div className="lg:col-span-5">
              <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="bg-white/10 backdrop-blur-2xl border border-white/10 rounded-[2.5rem] p-8 shadow-2xl">
                <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
                  <Calendar className="text-amber-400" size={20} /> Irrigation Schedule
                </h3>
                
                <form className="space-y-5" onSubmit={onAnalyze}>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-emerald-300 uppercase tracking-widest ml-1">Planned Start</label>
                    <input className="w-full bg-emerald-950/50 border border-emerald-800 rounded-2xl px-4 py-3.5 text-white outline-none focus:border-amber-400 transition-all" 
                      name="irrigationStart" onChange={onChange} required type="datetime-local" value={form.irrigationStart} />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold text-emerald-300 uppercase tracking-widest ml-1">Tree Count</label>
                      <div className="relative">
                        <Trees className="absolute left-4 top-1/2 -translate-y-1/2 text-emerald-500" size={16} />
                        <input className="w-full bg-emerald-950/50 border border-emerald-800 rounded-2xl pl-11 pr-4 py-3.5 text-white outline-none focus:border-amber-400" 
                          name="treeCount" onChange={onChange} required type="number" placeholder="40" value={form.treeCount} />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold text-emerald-300 uppercase tracking-widest ml-1">Liters / Tree</label>
                      <div className="relative">
                        <Droplets className="absolute left-4 top-1/2 -translate-y-1/2 text-emerald-500" size={16} />
                        <input className="w-full bg-emerald-950/50 border border-emerald-800 rounded-2xl pl-11 pr-4 py-3.5 text-white outline-none focus:border-amber-400" 
                          name="litersPerTree" onChange={onChange} required type="number" placeholder="50" value={form.litersPerTree} />
                      </div>
                    </div>
                  </div>

                  <button className="w-full bg-amber-400 hover:bg-amber-300 text-amber-950 py-4 rounded-2xl font-black transition-all flex items-center justify-center gap-3 shadow-xl shadow-amber-500/20 disabled:opacity-50"
                    disabled={loading} type="submit">
                    {loading ? <Loader2 className="animate-spin" /> : <>Run AI Analysis <ArrowRight size={18} /></>}
                  </button>
                </form>
              </motion.div>
            </div>

            {/* Results Display Area */}
            <div className="lg:col-span-7">
              <AnimatePresence mode="wait">
                {result ? (
                  <motion.div key="result" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="space-y-6">
                    {/* Main Verdict Hero */}
                    <div className={`rounded-[2.5rem] border p-8 relative overflow-hidden ${result.isSufficient ? 'bg-emerald-500 text-white border-emerald-400' : 'bg-rose-500 text-white border-rose-400'}`}>
                      <div className="relative z-10">
                        <div className="flex items-center gap-3 mb-4">
                          {result.isSufficient ? <CheckCircle size={32} /> : <AlertTriangle size={32} />}
                          <span className="text-xs font-black uppercase tracking-[0.2em] opacity-80">AI Verdict</span>
                        </div>
                        <h2 className="text-3xl font-black leading-tight mb-2">{result.message}</h2>
                        <p className="text-sm opacity-90">Based on current storage and predicted environmental losses.</p>
                      </div>
                      <Waves className="absolute -bottom-10 -right-10 w-64 h-64 opacity-20 rotate-12" />
                    </div>

                    {/* Intelligence Grid */}
                    <div className="grid md:grid-cols-2 gap-4">
                      {/* Weather Card */}
                      <div className="bg-sky-500/10 border border-sky-500/20 rounded-3xl p-6">
                        <div className="flex items-center gap-2 text-sky-400 mb-4">
                          <CloudSun size={18} />
                          <h4 className="text-xs font-bold uppercase tracking-widest">Climate Forecast</h4>
                        </div>
                        <div className="flex justify-between items-center">
                          <div>
                            <p className="text-2xl font-black">{result.temperature}°C</p>
                            <p className="text-[10px] text-sky-400/60 uppercase font-bold">Local Temp</p>
                          </div>
                          <div className="text-right">
                            <p className="text-2xl font-black">{result.humidity}%</p>
                            <p className="text-[10px] text-sky-400/60 uppercase font-bold">Air Humidity</p>
                          </div>
                        </div>
                      </div>

                      {/* Loss Factors Card */}
                      <div className="bg-amber-500/10 border border-amber-500/20 rounded-3xl p-6">
                        <div className="flex items-center gap-2 text-amber-400 mb-4">
                          <AlertTriangle size={18} />
                          <h4 className="text-xs font-bold uppercase tracking-widest">Predicted Losses</h4>
                        </div>
                        <div className="space-y-2">
                           <div className="flex justify-between text-sm">
                             <span className="text-amber-100/60">Evaporation</span>
                             <span className="font-bold text-amber-400">{result.evaporationLoss} L</span>
                           </div>
                           <div className="flex justify-between text-sm">
                             <span className="text-amber-100/60">Leakage</span>
                             <span className="font-bold text-amber-400">{result.leakageLoss} L</span>
                           </div>
                        </div>
                      </div>
                    </div>

                    {/* Detailed Data Table */}
                    <div className="bg-white/5 border border-white/10 rounded-3xl p-6 backdrop-blur-md">
                      <h4 className="text-xs font-bold uppercase tracking-[0.2em] text-emerald-300/60 mb-6">Volumetric Inventory</h4>
                      <div className="space-y-4">
                        <div className="flex items-center justify-between p-4 bg-white/5 rounded-2xl">
                          <span className="text-sm font-medium">Available Supply</span>
                          <span className="text-lg font-black text-emerald-400">{result.availableWaterL || Math.round(result.currentStorageLiters || 0)} <span className="text-[10px] font-normal opacity-60">LITERS</span></span>
                        </div>
                        <div className="flex items-center justify-between p-4 bg-white/5 rounded-2xl border-l-4 border-rose-500">
                          <span className="text-sm font-medium text-rose-100">Demand Requirement</span>
                          <span className="text-lg font-black text-rose-400">{result.requiredWaterL || Math.round(result.requiredLiters || 0)} <span className="text-[10px] font-normal opacity-60">LITERS</span></span>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ) : (
                  <motion.div key="empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="h-full flex flex-col items-center justify-center p-12 border-2 border-dashed border-white/10 rounded-[2.5rem] text-center text-emerald-100/30">
                    <Waves size={48} className="mb-4 animate-pulse" />
                    <p className="max-w-xs font-bold uppercase tracking-widest text-[10px]">Enter irrigation parameters to begin AI computation</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default WaterAnalysis;