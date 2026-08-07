import React, { useState } from 'react';
import { Eye, EyeOff, Lock, User, ArrowRight, AlertCircle } from 'lucide-react';
import logo from '../assets/logo.png';

interface LoginViewProps {
  onLogin: (username: string, password: string) => Promise<unknown>;
  onSwitchToRegister: () => void;
}

export const LoginView: React.FC<LoginViewProps> = ({ onLogin, onSwitchToRegister }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!username.trim() || !password) {
      setError('Kullanıcı adı ve şifre gereklidir.');
      return;
    }
    setLoading(true);
    try {
      await onLogin(username.trim(), password);
    } catch (err: any) {
      setError(err.message || 'Giriş başarısız oldu.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden bg-[#0b0b0d] px-4 py-safe">
      {/* Ambient macOS-style blurred background blobs */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-32 -left-24 w-[420px] h-[420px] rounded-full bg-blue-600/30 blur-[120px]" />
        <div className="absolute top-1/3 -right-24 w-[380px] h-[380px] rounded-full bg-emerald-500/20 blur-[120px]" />
        <div className="absolute -bottom-32 left-1/4 w-[360px] h-[360px] rounded-full bg-indigo-600/25 blur-[120px]" />
      </div>

      <form
        onSubmit={handleSubmit}
        className="relative w-full max-w-[380px] rounded-3xl border border-white/10 bg-white/[0.06] backdrop-blur-2xl shadow-2xl p-8 space-y-6"
      >
        <div className="flex flex-col items-center text-center space-y-3">
          <img
            src={logo}
            alt="MüşavirPro"
            className="w-16 h-16 rounded-2xl shadow-lg shadow-black/40 ring-1 ring-white/10"
          />
          <div>
            <h1 className="text-lg font-semibold text-white tracking-tight">MüşavirPro</h1>
            <p className="text-xs text-slate-400 mt-0.5">Devam etmek için giriş yapın</p>
          </div>
        </div>

        {error && (
          <div className="flex items-center gap-2 text-xs text-rose-300 bg-rose-500/10 border border-rose-500/20 rounded-xl px-3 py-2.5">
            <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <div className="space-y-3">
          <div className="relative">
            <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
            <input
              autoFocus
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Kullanıcı adı"
              autoComplete="username"
              className="w-full pl-10 pr-3 py-3 text-sm rounded-2xl bg-white/5 border border-white/10 text-white placeholder:text-slate-500 outline-none focus:border-accent focus:ring-2 focus:ring-accent/30 transition-all"
            />
          </div>

          <div className="relative">
            <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
            <input
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Şifre"
              autoComplete="current-password"
              className="w-full pl-10 pr-10 py-3 text-sm rounded-2xl bg-white/5 border border-white/10 text-white placeholder:text-slate-500 outline-none focus:border-accent focus:ring-2 focus:ring-accent/30 transition-all"
            />
            <button
              type="button"
              onClick={() => setShowPassword((v) => !v)}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors"
              tabIndex={-1}
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full flex items-center justify-center gap-1.5 py-3 rounded-2xl text-sm font-semibold bg-gradient-to-r from-accent to-indigo-600 text-white shadow-lg shadow-blue-600/25 hover:opacity-95 active:scale-[0.98] transition-all disabled:opacity-60"
        >
          {loading ? 'Giriş yapılıyor…' : 'Giriş Yap'}
          {!loading && <ArrowRight className="w-4 h-4" />}
        </button>

        <p className="text-center text-xs text-slate-500">
          Hesabın yok mu?{' '}
          <button
            type="button"
            onClick={onSwitchToRegister}
            className="text-accent font-medium hover:underline"
          >
            Kayıt Ol
          </button>
        </p>
      </form>
    </div>
  );
};
