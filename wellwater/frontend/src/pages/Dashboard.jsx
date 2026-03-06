import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { 
  Plus, 
  LayoutDashboard, 
  Activity, 
  Trees, 
  AlertCircle, 
  Loader2, 
  Waves,
  ShieldCheck
} from "lucide-react";
import Navbar from "../components/Navbar";
import ProductCard from "../components/ProductCard";
import Sidebar from "../components/Sidebar";
import { useAuth } from "../context/AuthContext";
import { getHardware } from "../api/hardwareApi";

const Dashboard = () => {
  const { user } = useAuth();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadProducts = async () => {
      if (!user?.id) return;
      setLoading(true);
      try {
        const data = await getHardware(user.id);
        setProducts(data);
      } catch (err) {
        console.error("Dashboard Load Error:", err);
      } finally {
        setLoading(false);
      }
    };
    loadProducts();
  }, [user?.id]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#064e3b] to-[#0f766e] font-sans text-slate-100">
      <Navbar />

      <div className="mx-auto flex w-full max-w-7xl flex-col gap-6 px-4 py-8 lg:flex-row lg:items-start">
        <div className="lg:w-64">
          <Sidebar />
        </div>

        <main className="flex-1">
          {/* 1. TOP STATS BAR */}
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8 grid grid-cols-1 md:grid-cols-3 gap-4"
          >
            <div className="bg-white/10 backdrop-blur-md border border-white/10 p-5 rounded-3xl flex items-center gap-4">
              <div className="bg-amber-400 p-3 rounded-2xl text-amber-950 shadow-lg shadow-amber-500/20">
                <LayoutDashboard size={24} />
              </div>
              <div>
                <p className="text-xs font-bold text-emerald-300 uppercase tracking-widest">Active Nodes</p>
                <p className="text-2xl font-black text-white">{products.length}</p>
              </div>
            </div>
            
            <div className="bg-white/10 backdrop-blur-md border border-white/10 p-5 rounded-3xl flex items-center gap-4">
              <div className="bg-emerald-500 p-3 rounded-2xl text-white">
                <ShieldCheck size={24} />
              </div>
              <div>
                <p className="text-xs font-bold text-emerald-300 uppercase tracking-widest">System Status</p>
                <p className="text-2xl font-black text-white">Secure</p>
              </div>
            </div>

            <div className="bg-white/10 backdrop-blur-md border border-white/10 p-5 rounded-3xl flex items-center gap-4">
              <div className="bg-cyan-500 p-3 rounded-2xl text-white">
                <Waves size={24} />
              </div>
              <div>
                <p className="text-xs font-bold text-emerald-300 uppercase tracking-widest">AI Engine</p>
                <p className="text-2xl font-black text-white">Operational</p>
              </div>
            </div>
          </motion.div>

          {/* 2. MAIN HEADER */}
          <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-4xl font-black text-white tracking-tight">Your Farm</h1>
              <p className="text-emerald-100/60 mt-1">Real-time water level data and predictive analysis.</p>
            </div>

            <Link
              className="group flex items-center gap-2 rounded-2xl bg-amber-400 px-6 py-3.5 text-sm font-black text-amber-950 shadow-xl shadow-amber-500/20 transition hover:bg-amber-300 active:scale-95"
              to="/add-hardware"
            >
              <Plus size={18} className="group-hover:rotate-90 transition-transform" />
              Add New Product
            </Link>
          </div>

          {/* 3. CONTENT AREA */}
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20 text-emerald-300 gap-4">
              <Loader2 className="animate-spin" size={48} />
              <p className="font-bold tracking-widest uppercase text-xs">Syncing with ThingSpeak...</p>
            </div>
          ) : products.length === 0 ? (
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="rounded-[3rem] border border-dashed border-emerald-400/30 bg-emerald-950/20 p-16 text-center"
            >
              <div className="mx-auto w-24 h-24 bg-emerald-900/50 rounded-full flex items-center justify-center mb-6 border border-emerald-700">
                <Trees className="text-emerald-400" size={40} />
              </div>
              <h3 className="text-2xl font-bold text-white">No active sensors detected</h3>
              <p className="mt-2 text-emerald-100/50 max-w-sm mx-auto">
                Begin your journey by linking an ultrasonic sensor node to your dashboard.
              </p>
              <Link
                className="mt-8 inline-flex items-center gap-2 rounded-2xl bg-white px-8 py-4 text-sm font-black text-emerald-950 shadow-xl transition hover:bg-emerald-50"
                to="/add-hardware"
              >
                Connect Your First Well <Plus size={18} />
              </Link>
            </motion.div>
          ) : (
            <section className="grid gap-6 sm:grid-cols-2 xl:grid-cols-2">
              {products.map((product, idx) => (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.1 }}
                >
                  <ProductCard product={product} />
                </motion.div>
              ))}
            </section>
          )}

          {/* 4. SYSTEM LOG (Optional Footer) */}
          <div className="mt-12 p-4 bg-black/20 rounded-2xl border border-white/5 flex items-center gap-3">
             <Activity className="text-emerald-500 animate-pulse" size={16} />
             <p className="text-[10px] uppercase font-bold tracking-[0.2em] text-emerald-100/40">
               ThingSpeak API Latency: 42ms • AI Model Version 3.4
             </p>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;