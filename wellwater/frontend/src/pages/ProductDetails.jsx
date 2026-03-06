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
          <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} className="bg-white/10 backdrop-blur-xl p-12 rounded-[3rem] border border-white/10">
            <h2 className="text-3xl font-black text-white mb-4">Node Not Found</h2>
            <p className="text-emerald-100/60 mb-8">This hardware may have been decommissioned or moved.</p>
            <Link className="inline-flex items-center gap-2 bg-amber-400 text-amber-950 px-8 py-3 rounded-2xl font-bold" to="/dashboard">
              <ArrowLeft size={18} /> Return to Dashboard
            </Link>
          </motion.div>
        </div>
      </div>
    );
  }

  const specCards = [
    { label: "ThingSpeak ID", value: product.thingSpeakChannelId, icon: <Database />, color: "text-blue-400" },
    { label: "Data Field", value: `Field ${product.thingSpeakField}`, icon: <Cpu />, color: "text-purple-400" },
    { label: "Well Depth", value: `${product.wellDepth} ft`, icon: <Ruler />, color: "text-amber-400" },
    { label: "Well Width", value: `${product.wellWidth} ft`, icon: <Maximize />, color: "text-emerald-400" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#064e3b] to-[#0f766e] font-sans text-slate-100">
      <Navbar />

      <div className="mx-auto flex w-full max-w-7xl flex-col gap-6 px-4 py-8 lg:flex-row lg:items-start">
        <div className="lg:w-64">
          <Sidebar />
        </div>

        <main className="flex-1">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-emerald-300/60 mb-6">
            <Link to="/dashboard" className="hover:text-amber-400 transition-colors">Dashboard</Link>
            <ChevronRight size={12} />
            <span className="text-white">Product Specs</span>
          </div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }}
            className="bg-white/10 backdrop-blur-2xl border border-white/10 rounded-[2.5rem] p-8 md:p-12 shadow-2xl overflow-hidden relative"
          >
            {/* Background Decorative Element */}
            <Waves className="absolute -bottom-20 -right-20 text-white/5 w-80 h-80" />

            <div className="relative z-10">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
                <div>
                  <h1 className="text-4xl md:text-5xl font-black text-white tracking-tight">{product.productName}</h1>
                  <div className="flex items-center gap-2 mt-2 text-emerald-200">
                    <MapPin size={16} />
                    <span className="text-sm font-medium">{product.wellName}</span>
                  </div>
                </div>
                {product.latitude && (
                  <div className="bg-black/20 px-4 py-2 rounded-xl border border-white/5 font-mono text-xs text-amber-400">
                    GPS: {Number(product.latitude).toFixed(4)}, {Number(product.longitude).toFixed(4)}
                  </div>
                )}
              </div>

              {/* Specs Grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
                {specCards.map((card, i) => (
                  <div key={i} className="bg-emerald-950/40 border border-emerald-800 p-5 rounded-3xl hover:border-white/20 transition-colors">
                    <div className={`${card.color} mb-3`}>{card.icon}</div>
                    <p className="text-[10px] uppercase font-bold text-emerald-100/40 tracking-widest">{card.label}</p>
                    <p className="text-lg font-bold text-white mt-1">{card.value}</p>
                  </div>
                ))}
              </div>

              {/* AI Analysis CTA */}
              <div className="bg-gradient-to-r from-emerald-600/40 to-teal-600/40 border border-emerald-400/30 rounded-[2rem] p-8 md:p-10 flex flex-col md:flex-row items-center gap-8">
                <div className="bg-amber-400 p-4 rounded-2xl text-amber-950 shadow-xl shadow-amber-500/20">
                  <Zap size={32} className="fill-amber-950" />
                </div>
                <div className="flex-1 text-center md:text-left">
                  <h3 className="text-xl font-bold text-white mb-2">Predictive Water Intelligence</h3>
                  <p className="text-emerald-100/70 text-sm leading-relaxed max-w-xl">
                    Our AI models are synced with your real-time depth sensors and local weather data. 
                    Check if your current water reserves can sustain your next irrigation cycle.
                  </p>
                </div>
                <button
                  onClick={() => navigate(`/product/${product.id}/analysis`)}
                  className="w-full md:w-auto bg-white hover:bg-emerald-50 text-emerald-950 px-8 py-4 rounded-2xl font-black transition-all flex items-center justify-center gap-2 whitespace-nowrap shadow-xl"
                >
                  Analyze Sufficiency <ChevronRight size={18} />
                </button>
              </div>
            </div>
          </motion.div>

          <div className="mt-8 flex justify-center">
             <p className="text-[10px] text-emerald-100/20 font-bold uppercase tracking-[0.3em]">
               Hardware Link Verified • End-to-End Encrypted
             </p>
          </div>
        </main>
      </div>
    </div>
  );
};

export default ProductDetails;