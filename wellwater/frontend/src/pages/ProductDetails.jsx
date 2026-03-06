import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { 
  ArrowLeft, 
  Database, 
  Ruler, 
  Maximize, 
  MapPin, 
  Zap, 
  Waves, 
  Cpu, 
  ChevronRight,
  Loader2
} from "lucide-react";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import { useAuth } from "../context/AuthContext";
import { getHardwareById } from "../api/hardwareApi";

const ProductDetails = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { user } = useAuth();
  const [product, setProduct] = useState(null);
  const [fetching, setFetching] = useState(true);

  useEffect(() => {
    const loadProduct = async () => {
      if (!user?.id || !id) return;
      setFetching(true);
      try {
        const data = await getHardwareById(id, user.id);
        setProduct(data);
      } catch (err) {
        console.error(err);
      } finally {
        setFetching(false);
      }
    };
    loadProduct();
  }, [id, user?.id]);

  if (fetching) {
    return (
      <div className="min-h-screen bg-[#064e3b] flex items-center justify-center">
        <Loader2 className="text-amber-400 animate-spin" size={40} />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#064e3b] to-[#0f766e] font-sans">
        <Navbar />
        <div className="mx-auto max-w-3xl px-4 py-20 text-center">
          <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} className="bg-white/10 backdrop-blur-xl p-8 md:p-12 rounded-[2.5rem] md:rounded-[3rem] border border-white/10">
            <h2 className="text-2xl md:text-3xl font-black text-white mb-4">Node Not Found</h2>
            <p className="text-emerald-100/60 mb-8">This hardware may have been decommissioned or moved.</p>
            <Link className="inline-flex items-center gap-2 bg-amber-400 text-amber-950 px-8 py-3 rounded-2xl font-bold transition-transform active:scale-95" to="/dashboard">
              <ArrowLeft size={18} /> Return to Dashboard
            </Link>
          </motion.div>
        </div>
      </div>
    );
  }

  const specCards = [
    { label: "ThingSpeak ID", value: product.thingSpeakChannelId, icon: <Database size={20} />, color: "text-blue-400" },
    { label: "Data Field", value: `Field ${product.thingSpeakField}`, icon: <Cpu size={20} />, color: "text-purple-400" },
    { label: "Well Depth", value: `${product.wellDepth} ft`, icon: <Ruler size={20} />, color: "text-amber-400" },
    { label: "Well Width", value: `${product.wellWidth} ft`, icon: <Maximize size={20} />, color: "text-emerald-400" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#064e3b] to-[#0f766e] font-sans text-slate-100 overflow-x-hidden">
      <Navbar />

      <div className="mx-auto flex w-full max-w-7xl flex-col gap-6 px-4 py-6 lg:flex-row lg:items-start lg:py-12">
        <div className="w-full lg:w-64">
          <Sidebar />
        </div>

        <main className="flex-1">
          {/* Breadcrumb - Hidden on very small screens or made scrollable */}
          <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-emerald-300/60 mb-6 overflow-x-auto whitespace-nowrap pb-2 md:pb-0">
            <Link to="/dashboard" className="hover:text-amber-400 transition-colors">Dashboard</Link>
            <ChevronRight size={10} className="shrink-0" />
            <span className="text-white">Product Specs</span>
          </div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }}
            className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-white/10 p-6 shadow-2xl backdrop-blur-2xl sm:rounded-[2.5rem] md:p-12"
          >
            {/* Background Decorative Element - Scaled down for mobile */}
            <Waves className="absolute -bottom-20 -right-20 text-white/5 w-40 h-40 md:w-80 md:h-80 pointer-events-none" />

            <div className="relative z-10">
              <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10 md:mb-12">
                <div>
                  <h1 className="text-3xl font-black tracking-tight text-white sm:text-4xl md:text-5xl lg:text-6xl break-words">{product.productName}</h1>
                  <div className="flex items-center gap-2 mt-3 text-emerald-200">
                    <MapPin size={18} className="text-amber-400" />
                    <span className="text-base font-medium">{product.wellName}</span>
                  </div>
                </div>
                {product.latitude && (
                  <div className="inline-flex w-fit bg-black/20 px-4 py-2 rounded-xl border border-white/5 font-mono text-[10px] md:text-xs text-amber-400">
                    GPS: {Number(product.latitude).toFixed(4)}, {Number(product.longitude).toFixed(4)}
                  </div>
                )}
              </div>

              {/* Specs Grid: 2 columns on mobile, 4 on desktop */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4 mb-10">
                {specCards.map((card, i) => (
                  <div key={i} className="rounded-2xl md:rounded-3xl border border-emerald-800/50 bg-emerald-950/40 p-4 transition-all hover:border-emerald-400/30 hover:bg-emerald-950/60">
                    <div className={`${card.color} mb-3`}>{card.icon}</div>
                    <p className="text-[9px] md:text-[10px] uppercase font-bold text-emerald-100/40 tracking-widest">{card.label}</p>
                    <p className="mt-1 text-base font-bold text-white md:text-xl">{card.value}</p>
                  </div>
                ))}
              </div>

              {/* AI Analysis CTA - Reorganized for vertical stacking on mobile */}
              <div className="bg-gradient-to-br from-emerald-600/40 to-teal-600/40 border border-emerald-400/30 rounded-[2rem] p-6 md:p-10 flex flex-col lg:flex-row items-center gap-6 md:gap-8">
                <div className="bg-amber-400 p-4 rounded-2xl text-amber-950 shadow-xl shadow-amber-500/20 shrink-0">
                  <Zap size={32} className="fill-amber-950" />
                </div>
                <div className="flex-1 text-center lg:text-left">
                  <h3 className="text-lg md:text-xl font-bold text-white mb-2">Predictive Water Intelligence</h3>
                  <p className="text-emerald-100/70 text-xs md:text-sm leading-relaxed max-w-xl">
                    Our AI models are synced with your real-time depth sensors and local weather data. 
                    Check if your current water reserves can sustain your next irrigation cycle.
                  </p>
                </div>
                <button
                  onClick={() => navigate(`/product/${product.id}/analysis`)}
                  className="w-full lg:w-auto bg-white hover:bg-emerald-50 text-emerald-950 px-8 py-4 rounded-2xl font-black transition-all flex items-center justify-center gap-2 whitespace-nowrap shadow-xl active:scale-95"
                >
                  Analyze Sufficiency <ChevronRight size={18} />
                </button>
              </div>
            </div>
          </motion.div>

          <div className="mt-8 flex justify-center px-4 text-center">
             <p className="text-[9px] md:text-[10px] text-emerald-100/20 font-bold uppercase tracking-[0.2em] md:tracking-[0.3em]">
               Hardware Link Verified • End-to-End Encrypted Node: {product.id}
             </p>
          </div>
        </main>
      </div>
    </div>
  );
};

export default ProductDetails;