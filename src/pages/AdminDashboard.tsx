import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { ProjectsManager } from '../components/admin/ProjectsManager';
import { ContentManager } from '../components/admin/ContentManager';
import { LogOut, LogIn } from 'lucide-react';

// Prevent search engines from indexing the admin dashboard
const useNoIndex = () => {
  useEffect(() => {
    const meta = document.createElement('meta');
    meta.name = 'robots';
    meta.content = 'noindex, nofollow';
    document.head.appendChild(meta);
    document.title = 'Admin Dashboard';
    return () => { document.head.removeChild(meta); document.title = 'Mohamed Ghanem - AI Engineer'; };
  }, []);
};


export const AdminDashboard = () => {
  useNoIndex();
  const [session, setSession] = useState<import('@supabase/supabase-js').Session | null>(null);
  const [authChecked, setAuthChecked] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setAuthChecked(true);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    setLoading(true);
    setErrorMsg('');

    const trimmedEmail = email.trim();
    const { error } = await supabase.auth.signInWithPassword({ email: trimmedEmail, password });

    if (error) {
      console.error('Login error:', error);
      setErrorMsg(error.message || 'Invalid credentials or too many attempts. Please try again.');
    }

    setLoading(false);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  // Show nothing until we know auth status (prevents flash of login form)
  if (!authChecked) {
    return (
      <div className="min-h-screen bg-[#0C0C0C] flex items-center justify-center">
        <div className="text-[#A0AAB2] text-lg font-bold uppercase tracking-widest animate-pulse">Loading...</div>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="min-h-screen bg-[#0C0C0C] flex items-center justify-center p-4">
        <div className="w-full max-w-md bg-[#111] border border-white/10 rounded-3xl p-8 shadow-2xl">
          <div className="flex flex-col items-center mb-8">
            <div className="w-16 h-16 bg-[#E60000]/10 rounded-2xl flex items-center justify-center mb-4 border border-[#E60000]/20">
              <LogIn className="w-8 h-8 text-[#E60000]" />
            </div>
            <h1 className="text-3xl font-black text-white uppercase tracking-wider">Admin Login</h1>
            <p className="text-[#A0AAB2] mt-2 text-sm text-center">Secure access to your portfolio dashboard</p>
          </div>
          
          <form onSubmit={handleLogin} className="flex flex-col gap-5">
            <div className="flex flex-col gap-2">
              <label className="text-xs text-[#A0AAB2] uppercase tracking-widest font-bold ml-1">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-black/40 border border-white/10 rounded-xl px-5 py-4 text-white focus:outline-none focus:border-[#E60000] focus:ring-1 focus:ring-[#E60000]/50"
                required
                autoComplete="email"
              />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-xs text-[#A0AAB2] uppercase tracking-widest font-bold ml-1">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="bg-black/40 border border-white/10 rounded-xl px-5 py-4 text-white focus:outline-none focus:border-[#E60000] focus:ring-1 focus:ring-[#E60000]/50"
                required
                autoComplete="current-password"
              />
            </div>
            {errorMsg && <p className="text-[#E60000] text-sm font-medium text-center">{errorMsg}</p>}
            <button
              type="submit"
              disabled={loading}
              className="mt-4 bg-[#E60000] text-white font-black uppercase tracking-widest py-4 rounded-xl hover:bg-[#E60000]/80 transition-all disabled:opacity-50"
            >
              {loading ? 'Authenticating...' : 'Sign In'}
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0C0C0C] text-white p-6 md:p-10">
      <div className="max-w-7xl mx-auto">
        <header className="flex justify-between items-center mb-12 pb-6 border-b border-white/10">
          <div>
            <h1 className="text-3xl md:text-4xl font-black uppercase tracking-wider text-[#E60000]">Dashboard</h1>
            <p className="text-[#A0AAB2] mt-1">Manage your projects and website content.</p>
          </div>
          <button 
            onClick={handleLogout}
            className="flex items-center gap-2 bg-white/5 hover:bg-white/10 px-4 py-2 rounded-lg border border-white/10 transition-colors"
          >
            <LogOut className="w-4 h-4" />
            <span className="text-sm font-bold uppercase tracking-wider">Logout</span>
          </button>
        </header>

        {/* Dynamic Managers */}
        <div className="flex flex-col gap-8">
          <ProjectsManager />
          <ContentManager />
        </div>
      </div>
    </div>
  );
};
