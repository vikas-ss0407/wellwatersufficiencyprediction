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
    e.stopPropagation(); // Prevents triggering the card's main click if you add one later
    navigate(`/product/${product.id}/analysis`);
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="group relative flex flex-col overflow-hidden rounded-[2rem] border border-white/10 bg-[#064e3b]/40 backdrop-blur-md transition-all hover:border-amber-400/50 hover:shadow-2xl hover:shadow-amber-900/20"
    >
      {/* Top Section: Branding & Channel */}
      <div className="p-6 pb-0">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2 bg-emerald-500/20 px-3 py-1 rounded-full border border-emerald-500/30">
            <Database size={12} className="text-emerald-400" />
            <span className="text-[10px] font-black uppercase tracking-widest text-emerald-300">
              CH {product.thingSpeakChannelId}
            </span>
          </div>
          <div className="h-2 w-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.6)]" />
        </div>

        <h3 className="text-2xl font-black text-white group-hover:text-amber-400 transition-colors">
          {product.productName}
        </h3>
        <p className="flex items-center gap-1 text-xs font-bold text-emerald-100/40 uppercase tracking-tighter mt-1">
          <MapPin size={12} /> {product.wellName}
        </p>
      </div>

      {/* Middle Section: Specs Grid */}
      <div className="grid grid-cols-2 gap-px bg-white/5 mt-6 border-y border-white/5">
        <div className="p-4 flex flex-col items-center justify-center border-r border-white/5">
          <Ruler size={16} className="text-amber-400 mb-1" />
          <span className="text-[10px] font-bold text-emerald-100/30 uppercase">Depth</span>
          <p className="text-lg font-black text-white">{product.wellDepth}<span className="text-xs font-normal opacity-50 ml-1">ft</span></p>
        </div>
        <div className="p-4 flex flex-col items-center justify-center">
          <Droplets size={16} className="text-cyan-400 mb-1" />
          <span className="text-[10px] font-bold text-emerald-100/30 uppercase">Width</span>
          <p className="text-lg font-black text-white">{product.wellWidth}<span className="text-xs font-normal opacity-50 ml-1">ft</span></p>
        </div>
      </div>

      {/* Bottom Section: Dual Action Buttons */}
      <div className="flex p-3 gap-2 bg-black/20">
        <button 
          onClick={goToDetails}
          className="flex-1 flex items-center justify-center gap-2 rounded-xl bg-white/5 py-3 text-xs font-bold text-white transition hover:bg-white/10"
        >
          Details
        </button>
        
        <button 
          onClick={goToAnalysis}
          className="flex-1 flex items-center justify-center gap-2 rounded-xl bg-amber-400 py-3 text-xs font-black text-amber-950 transition hover:bg-white hover:scale-[1.02] active:scale-95 shadow-lg shadow-amber-500/10"
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