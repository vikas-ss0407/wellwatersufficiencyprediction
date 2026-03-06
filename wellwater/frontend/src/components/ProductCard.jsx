import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { 
  Droplets, 
  Ruler, 
  MapPin, 
  Zap, 
  ChevronRight, 
  Database 
} from "lucide-react";

const ProductCard = ({ product }) => {
  const navigate = useNavigate();

  // Robust navigation handlers
  const goToDetails = () => navigate(`/product/${product.id}`);
  const goToAnalysis = (e) => {
    e.stopPropagation(); 
    navigate(`/product/${product.id}/analysis`);
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="group relative flex flex-col overflow-hidden rounded-[2rem] border border-white/10 bg-[#064e3b]/40 backdrop-blur-md transition-all duration-300 hover:border-amber-400/50 hover:shadow-2xl hover:shadow-amber-900/30"
    >
      {/* Decorative Glow - Desktop Only */}
      <div className="absolute -right-10 -top-10 h-32 w-32 bg-amber-400/5 blur-3xl group-hover:bg-amber-400/10 transition-colors" />

      {/* Top Section: Branding & Channel */}
      <div className="p-5 md:p-6 pb-0">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2 bg-emerald-500/10 px-2.5 py-1 rounded-lg border border-emerald-500/20">
            <Database size={12} className="text-emerald-400" />
            <span className="text-[9px] md:text-[10px] font-black uppercase tracking-widest text-emerald-300">
              CH {product.thingSpeakChannelId}
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="text-[9px] font-bold text-emerald-400/60 uppercase tracking-widest hidden md:inline">Live</span>
            <div className="h-2 w-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.6)] animate-pulse" />
          </div>
        </div>

        <h3 className="text-xl md:text-2xl font-black text-white group-hover:text-amber-400 transition-colors line-clamp-1">
          {product.productName}
        </h3>
        <p className="flex items-center gap-1 text-[10px] md:text-xs font-bold text-emerald-100/40 uppercase tracking-tighter mt-1.5">
          <MapPin size={12} className="text-emerald-500/60" /> {product.wellName}
        </p>
      </div>

      {/* Middle Section: Specs Grid */}
      <div className="grid grid-cols-2 gap-px bg-white/5 mt-6 border-y border-white/5">
        <div className="p-4 flex flex-col items-center justify-center border-r border-white/5 bg-[#064e3b]/20">
          <Ruler size={16} className="text-amber-400 mb-1" />
          <span className="text-[9px] md:text-[10px] font-bold text-emerald-100/30 uppercase tracking-widest">Depth</span>
          <p className="text-base md:text-lg font-black text-white">
            {product.wellDepth}
            <span className="text-[10px] font-normal opacity-50 ml-1">FT</span>
          </p>
        </div>
        <div className="p-4 flex flex-col items-center justify-center bg-[#064e3b]/20">
          <Droplets size={16} className="text-cyan-400 mb-1" />
          <span className="text-[9px] md:text-[10px] font-bold text-emerald-100/30 uppercase tracking-widest">Width</span>
          <p className="text-base md:text-lg font-black text-white">
            {product.wellWidth}
            <span className="text-[10px] font-normal opacity-50 ml-1">FT</span>
          </p>
        </div>
      </div>

      {/* Bottom Section: Action Buttons */}
      <div className="flex p-3 gap-2 bg-black/20">
        <button 
          onClick={goToDetails}
          className="flex-1 flex items-center justify-center rounded-xl bg-white/5 py-3 md:py-3.5 text-xs font-bold text-white transition hover:bg-white/10 active:scale-95"
        >
          Details
        </button>
        
        <button 
          onClick={goToAnalysis}
          className="flex-[1.2] flex items-center justify-center gap-2 rounded-xl bg-amber-400 py-3 md:py-3.5 text-xs font-black text-amber-950 transition hover:bg-white hover:scale-[1.02] active:scale-95 shadow-lg shadow-amber-500/10"
        >
          <Zap size={14} className="fill-amber-950" />
          Analyze
          <ChevronRight size={14} />
        </button>
      </div>
    </motion.div>
  );
};

export default ProductCard;