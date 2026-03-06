import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { 
  Droplets, 
  LayoutDashboard, 
  LogOut, 
  User, 
  LogIn, 
  UserPlus 
} from "lucide-react";
import { useAuth } from "../context/AuthContext";

const Navbar = () => {
  const navigate = useNavigate();
  const { isAuthenticated, user, logoutUser } = useAuth();

  const onLogout = () => {
    logoutUser();
    navigate("/login");
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-white/10 bg-[#064e3b]/80 backdrop-blur-xl transition-all">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6">
        
        {/* LOGO SECTION */}
        <Link 
          to="/" 
          className="flex items-center gap-2 group"
        >
          <div className="bg-amber-400 p-1.5 rounded-lg group-hover:rotate-12 transition-transform shadow-lg shadow-amber-500/20">
            <Droplets size={22} className="text-amber-950 fill-amber-950" />
          </div>
          <span className="text-xl font-black tracking-tighter text-white">
            WellWater<span className="text-amber-400">AI</span>
          </span>
        </Link>

        {/* NAVIGATION LINKS */}
        <nav className="flex items-center gap-2 sm:gap-4">
          {!isAuthenticated ? (
            <>
              <Link
                className="flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-bold text-emerald-100 transition hover:bg-white/10"
                to="/login"
              >
                <LogIn size={16} />
                <span className="hidden sm:inline">Login</span>
              </Link>
              <Link
                className="flex items-center gap-2 rounded-xl bg-white px-5 py-2 text-sm font-black text-emerald-950 shadow-xl shadow-black/10 transition hover:bg-emerald-50 active:scale-95"
                to="/signup"
              >
                <UserPlus size={16} />
                Signup
              </Link>
            </>
          ) : (
            <div className="flex items-center gap-3">
              {/* User Identity Pill */}
              <div className="hidden items-center gap-2 rounded-2xl bg-white/5 border border-white/10 px-3 py-1.5 text-sm font-medium text-emerald-100 md:flex">
                <div className="bg-emerald-500/20 p-1 rounded-full text-emerald-400">
                  <User size={14} />
                </div>
                <span className="max-w-[120px] truncate">{user?.fullName}</span>
              </div>

              {/* Dashboard Link */}
              <Link
                className="flex items-center gap-2 rounded-xl bg-emerald-500/20 border border-emerald-500/30 px-4 py-2 text-sm font-bold text-emerald-400 transition hover:bg-emerald-500/30"
                to="/dashboard"
              >
                <LayoutDashboard size={16} />
                <span className="hidden sm:inline">Dashboard</span>
              </Link>

              {/* Logout Button */}
              <button
                className="group flex h-10 w-10 items-center justify-center rounded-xl bg-white/5 border border-white/10 text-emerald-100 transition hover:bg-rose-500/20 hover:text-rose-400 hover:border-rose-500/30"
                onClick={onLogout}
                title="Logout"
                type="button"
              >
                <LogOut size={18} />
              </button>
            </div>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Navbar;