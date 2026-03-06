import { Link, useLocation } from "react-router-dom";
import { 
  LayoutDashboard, 
  PlusCircle, 
  Settings, 
  HelpCircle,
  Leaf
} from "lucide-react";

const navItems = [
  { label: "Dashboard", to: "/dashboard", icon: <LayoutDashboard size={18} /> },
  { label: "Add Hardware", to: "/add-hardware", icon: <PlusCircle size={18} /> }
];

const Sidebar = () => {
  const location = useLocation();

  return (
    <aside className="w-full lg:w-64 lg:sticky lg:top-24 lg:self-start">
      {/* Header - Desktop Only */}
      <div className="hidden lg:flex items-center gap-2 mb-6 px-2">
        <Leaf className="text-amber-400" size={18} />
        <h2 className="text-[10px] font-black uppercase tracking-[0.2em] text-emerald-100/40">
          Farmer Management
        </h2>
      </div>

      <nav>
        <ul className="flex gap-2 overflow-x-auto pb-4 lg:pb-0 lg:flex-col lg:space-y-2 lg:overflow-visible no-scrollbar">
          {navItems.map((item) => {
            const active = location.pathname === item.to;
            
            return (
              <li key={item.to} className="flex-shrink-0 lg:flex-shrink">
                <Link
                  className={`flex items-center gap-3 whitespace-nowrap rounded-2xl px-5 py-3.5 text-sm font-bold transition-all duration-200 ${
                    active
                      ? "bg-amber-400 text-amber-950 shadow-lg shadow-amber-500/20 scale-[1.02]"
                      : "bg-white/5 text-emerald-100/60 hover:bg-white/10 hover:text-white border border-white/5"
                  }`}
                  to={item.to}
                >
                  <span className={active ? "text-amber-950" : "text-emerald-400"}>
                    {item.icon}
                  </span>
                  {item.label}
                </Link>
              </li>
            );
          })}
        </ul>

        {/* Support Section - Desktop Only */}
        <div className="hidden lg:block mt-10 pt-10 border-t border-white/5 space-y-2">
           <Link 
            to="/settings" 
            className="flex items-center gap-3 px-5 py-3 text-xs font-bold text-emerald-100/40 hover:text-white transition-colors"
           >
             <Settings size={16} /> Account Settings
           </Link>
           <Link 
            to="/help" 
            className="flex items-center gap-3 px-5 py-3 text-xs font-bold text-emerald-100/40 hover:text-white transition-colors"
           >
             <HelpCircle size={16} /> Get Support
           </Link>
        </div>
      </nav>

      {/* Decorative Branding */}
      <div className="hidden lg:block mt-12 px-5">
        <div className="rounded-3xl bg-gradient-to-br from-emerald-500/10 to-teal-500/10 p-6 border border-white/5">
          <p className="text-[10px] font-black text-emerald-400 uppercase tracking-widest mb-2">System Health</p>
          <div className="flex items-center gap-2">
            <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-[11px] font-bold text-white/60">Cloud Sync Active</span>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;