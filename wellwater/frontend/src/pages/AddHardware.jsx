import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Cpu, 
  MapPin, 
  Maximize2, 
  Ruler, 
  Database, 
  Activity, 
  ArrowRight, 
  Loader2, 
  CheckCircle2,
  AlertCircle,
  Globe
} from "lucide-react";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import { useAuth } from "../context/AuthContext";
import { addHardware } from "../api/hardwareApi";
import { getLocationDetailsByCoords } from "../api/weatherApi";

const initialForm = {
  productName: "",
  wellName: "",
  thingSpeakChannelId: "",
  thingSpeakField: "1",
  wellDepth: "",
  wellWidth: "",
  latitude: "",
  longitude: ""
};

const AddHardware = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState(initialForm);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [locationStatus, setLocationStatus] = useState("idle"); // 'idle' | 'detecting' | 'success' | 'error'
  const [locationDetails, setLocationDetails] = useState(null);

  useEffect(() => {
    setLocationStatus("detecting");
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const latitude = position.coords.latitude.toFixed(6);
          const longitude = position.coords.longitude.toFixed(6);

          setForm((prev) => ({ ...prev, latitude, longitude }));
          const details = await getLocationDetailsByCoords(latitude, longitude);
          setLocationDetails(details);
          setLocationStatus("success");
        },
        () => setLocationStatus("error")
      );
    } else {
      setLocationStatus("error");
    }
  }, []);

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const created = await addHardware(form, user.id);
      navigate(`/product/${created.id}`);
    } catch (apiError) {
      setError(apiError.message || "Unable to add hardware.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#064e3b] to-[#0f766e] font-sans text-slate-100">
      <Navbar />

      <div className="mx-auto flex w-full max-w-7xl flex-col gap-6 px-4 py-8 lg:flex-row">
        <div className="lg:w-64">
          <Sidebar />
        </div>

        <main className="flex-1">
          <motion.div 
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }}
            className="bg-white/10 backdrop-blur-xl border border-white/10 rounded-[2.5rem] p-8 shadow-2xl"
          >
            <div className="mb-10">
              <h1 className="text-3xl font-black text-white flex items-center gap-3">
                <Cpu className="text-amber-400" size={32} />
                Link New Hardware
              </h1>
              <p className="text-emerald-100/70 mt-2">Connect your IoT node and well dimensions to the AI network.</p>
            </div>

            <form onSubmit={onSubmit} className="space-y-8">
              {/* SECTION 1: IDENTITY */}
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-emerald-300 uppercase tracking-widest ml-1">Device Label</label>
                  <div className="relative group">
                    <Activity className="absolute left-4 top-1/2 -translate-y-1/2 text-emerald-500 group-focus-within:text-amber-400" size={18} />
                    <input name="productName" value={form.productName} onChange={onChange} required placeholder="e.g., North Sector Node"
                      className="w-full bg-emerald-950/50 border border-emerald-800 rounded-2xl pl-12 pr-4 py-4 text-white focus:border-amber-400 outline-none transition-all" />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-emerald-300 uppercase tracking-widest ml-1">Well Identity</label>
                  <div className="relative group">
                    <Globe className="absolute left-4 top-1/2 -translate-y-1/2 text-emerald-500 group-focus-within:text-amber-400" size={18} />
                    <input name="wellName" value={form.wellName} onChange={onChange} required placeholder="e.g., Main Borewell"
                      className="w-full bg-emerald-950/50 border border-emerald-800 rounded-2xl pl-12 pr-4 py-4 text-white focus:border-amber-400 outline-none transition-all" />
                  </div>
                </div>
              </div>

              {/* SECTION 2: THINGSPEAK CONFIG */}
              <div className="p-6 rounded-3xl bg-emerald-950/40 border border-emerald-800/50">
                <h3 className="text-amber-400 font-bold mb-4 flex items-center gap-2">
                  <Database size={18} /> IoT Cloud Configuration
                </h3>
                <div className="grid md:grid-cols-2 gap-6">
                  <input name="thingSpeakChannelId" value={form.thingSpeakChannelId} onChange={onChange} required placeholder="Channel ID (e.g. 159230)"
                    className="w-full bg-emerald-900/30 border border-emerald-700/50 rounded-xl px-4 py-3 text-white focus:border-amber-400 outline-none" />
                  <input name="thingSpeakField" value={form.thingSpeakField} onChange={onChange} required placeholder="Field (1-8)"
                    className="w-full bg-emerald-900/30 border border-emerald-700/50 rounded-xl px-4 py-3 text-white focus:border-amber-400 outline-none" />
                </div>
              </div>

              {/* SECTION 3: PHYSICAL SPECS */}
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-emerald-300 uppercase tracking-widest ml-1">Depth (ft)</label>
                  <div className="relative">
                    <Ruler className="absolute left-4 top-1/2 -translate-y-1/2 text-emerald-500" size={18} />
                    <input name="wellDepth" type="number" value={form.wellDepth} onChange={onChange} required placeholder="30"
                      className="w-full bg-emerald-950/50 border border-emerald-800 rounded-2xl pl-12 pr-4 py-4 text-white focus:border-amber-400 outline-none transition-all" />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-emerald-300 uppercase tracking-widest ml-1">Width (ft)</label>
                  <div className="relative">
                    <Maximize2 className="absolute left-4 top-1/2 -translate-y-1/2 text-emerald-500" size={18} />
                    <input name="wellWidth" type="number" value={form.wellWidth} onChange={onChange} required placeholder="10"
                      className="w-full bg-emerald-950/50 border border-emerald-800 rounded-2xl pl-12 pr-4 py-4 text-white focus:border-amber-400 outline-none transition-all" />
                  </div>
                </div>
              </div>

              {/* SECTION 4: GEOLOCATION CARD */}
              <div className="rounded-3xl bg-white/5 border border-white/10 overflow-hidden">
                <div className="p-6 flex items-center justify-between bg-white/5">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg ${locationStatus === 'success' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-amber-500/20 text-amber-400'}`}>
                      <MapPin size={20} className={locationStatus === 'detecting' ? 'animate-bounce' : ''} />
                    </div>
                    <div>
                      <h4 className="font-bold">Farm Geolocation</h4>
                      <p className="text-xs text-emerald-100/50">Used for local weather forecasting AI</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-950 text-[10px] font-bold uppercase tracking-tighter">
                    {locationStatus === 'detecting' && <Loader2 className="animate-spin" size={12} />}
                    {locationStatus === 'success' && <CheckCircle2 className="text-emerald-400" size={12} />}
                    {locationStatus === 'error' && <AlertCircle className="text-rose-400" size={12} />}
                    {locationStatus}
                  </div>
                </div>
                
                {form.latitude && (
                  <div className="p-6 grid md:grid-cols-2 gap-6 border-t border-white/5">
                    <div className="space-y-3">
                      <div className="flex justify-between text-sm border-b border-white/5 pb-2">
                        <span className="text-emerald-100/50">Detected Lat:</span>
                        <span className="font-mono text-amber-400">{form.latitude}</span>
                      </div>
                      <div className="flex justify-between text-sm border-b border-white/5 pb-2">
                        <span className="text-emerald-100/50">Detected Lng:</span>
                        <span className="font-mono text-amber-400">{form.longitude}</span>
                      </div>
                      {locationDetails && (
                        <div className="mt-4 p-4 rounded-2xl bg-emerald-900/40 text-xs leading-relaxed">
                          <span className="text-amber-400 font-bold">Region:</span> {locationDetails.village}, {locationDetails.district}, {locationDetails.state}
                        </div>
                      )}
                    </div>
                    <div className="h-40 rounded-2xl overflow-hidden border border-emerald-800 shadow-inner">
                      <iframe className="w-full h-full grayscale invert opacity-70" frameBorder="0"
                        src={`https://www.openstreetmap.org/export/embed.html?bbox=${Number(form.longitude)-0.005},${Number(form.latitude)-0.005},${Number(form.longitude)+0.005},${Number(form.latitude)+0.005}&layer=mapnik&marker=${form.latitude},${form.longitude}`} />
                    </div>
                  </div>
                )}
              </div>

              {error && <div className="text-rose-400 text-sm flex items-center gap-2 bg-rose-500/10 p-4 rounded-2xl border border-rose-500/20"><AlertCircle size={16}/> {error}</div>}

              <button disabled={loading} type="submit"
                className="group w-full bg-amber-400 hover:bg-amber-300 disabled:bg-emerald-800 text-amber-950 py-5 rounded-3xl font-black transition-all flex items-center justify-center gap-3 shadow-xl shadow-amber-500/20">
                {loading ? <Loader2 className="animate-spin" /> : <>Deploy Node to Network <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform"/></>}
              </button>
            </form>
          </motion.div>
        </main>
      </div>
    </div>
  );
};

export default AddHardware;