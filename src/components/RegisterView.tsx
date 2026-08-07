import React, { useState } from 'react';
import { Eye, EyeOff, Lock, User, AlertCircle, CheckCircle2, Sparkles, ShieldCheck, Wallet, MailWarning } from 'lucide-react';
import logo from '../assets/logo.png';

interface RegisterViewProps {
  onRegister: (username: string, password: string) => Promise<unknown>;
  onSwitchToLogin: () => void;
}

const FEATURES = [
  { icon: MailWarning, text: 'Gelen tebligatları tek ekrandan takip edin' },
  { icon: Wallet, text: 'Nakit akışı ve banka bakiyelerini anlık izleyin' },
  { icon: Sparkles, text: 'Yapay zeka destekli mali müşavir asistanı' },
];

export const RegisterView: React.FC<RegisterViewProps> = ({ onRegister, onSwitchToLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (username.trim().length < 3) {
      setError('Kullanıcı adı en az 3 karakter olmalıdır.');
      return;
    }
    if (password.length < 4) {
      setError('Şifre en az 4 karakter olmalıdır.');
      return;
    }
    if (password !== confirmPassword) {
      setError('Şifreler eşleşmiyor.');
      return;
    }

    setLoading(true);
    try {
      await onRegister(username.trim(), password);
    } catch (err: any) {
      setError(err.message || 'Kayıt başarısız oldu.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-white">
      {/* Left: colorful hero / brand panel */}
      <div className="relative lg:w-[45%] flex-shrink-0 overflow-hidden bg-gradient-to-br from-accent via-indigo-600 to-emerald-500 text-white px-8 py-10 sm:px-12 sm:py-14 flex flex-col justify-between">
        <div className="pointer-events-none absolute inset-0 opacity-40">
          <div className="absolute -top-16 -right-16 w-72 h-72 rounded-full bg-white/20 blur-3xl" />
          <div className="absolute bottom-0 left-0 w-64 h-64 rounded-full bg-black/20 blur-3xl" />
        </div>

        <div className="relative flex items-center gap-3">
          <img src={logo} alt="MüşavirPro" className="w-11 h-11 rounded-xl shadow-lg ring-1 ring-white/30" />
          <span className="text-lg font-semibold tracking-tight">MüşavirPro</span>
        </div>

        <div className="relative space-y-6 my-10 lg:my-0">
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight leading-tight">
            Mali müşavirlik işlerinizi tek yerden yönetin.
          </h1>
          <ul className="space-y-3.5">
            {FEATURES.map((f, i) => (
              <li key={i} className="flex items-center gap-3 text-sm text-white/90">
                <span className="w-8 h-8 rounded-full bg-white/15 flex items-center justify-center flex-shrink-0">
                  <f.icon className="w-4 h-4" />
                </span>
                {f.text}
              </li>
            ))}
          </ul>
        </div>

        <div className="relative flex items-center gap-2 text-xs text-white/70">
          <ShieldCheck className="w-4 h-4" />
          <span>Verileriniz güvenle saklanır.</span>
        </div>
      </div>

      {/* Right: registration form */}
      <div className="flex-1 flex items-center justify-center px-6 py-12 sm:px-10">
        <form onSubmit={handleSubmit} className="w-full max-w-sm space-y-6">
          <div>
            <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Hesap Oluştur</h2>
            <p className="text-sm text-slate-500 mt-1">Üye olarak MüşavirPro'yu kullanmaya başlayın.</p>
          </div>

          {error && (
            <div className="flex items-center gap-2 text-xs text-rose-700 bg-rose-50 border border-rose-200 rounded-xl px-3 py-2.5">
              <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <div className="space-y-3.5">
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1.5">Kullanıcı Adı</label>
              <div className="relative">
                <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  autoFocus
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="ör. ayse.smmm"
                  autoComplete="username"
                  className="w-full pl-10 pr-3 py-3 text-sm rounded-xl bg-slate-50 border border-slate-200 text-slate-900 placeholder:text-slate-400 outline-none focus:border-accent focus:ring-2 focus:ring-accent/20 transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1.5">Şifre</label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="En az 4 karakter"
                  autoComplete="new-password"
                  className="w-full pl-10 pr-10 py-3 text-sm rounded-xl bg-slate-50 border border-slate-200 text-slate-900 placeholder:text-slate-400 outline-none focus:border-accent focus:ring-2 focus:ring-accent/20 transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1.5">Şifre (Tekrar)</label>
              <div className="relative">
                {confirmPassword && confirmPassword === password ? (
                  <CheckCircle2 className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-emerald-500" />
                ) : (
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                )}
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Şifrenizi tekrar girin"
                  autoComplete="new-password"
                  className="w-full pl-10 pr-3 py-3 text-sm rounded-xl bg-slate-50 border border-slate-200 text-slate-900 placeholder:text-slate-400 outline-none focus:border-accent focus:ring-2 focus:ring-accent/20 transition-all"
                />
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl text-sm font-semibold bg-slate-900 text-white shadow-lg shadow-slate-900/10 hover:bg-slate-800 active:scale-[0.98] transition-all disabled:opacity-60"
          >
            {loading ? 'Kayıt oluşturuluyor…' : 'Kayıt Ol'}
          </button>

          <p className="text-center text-xs text-slate-500">
            Zaten hesabın var mı?{' '}
            <button type="button" onClick={onSwitchToLogin} className="text-accent font-medium hover:underline">
              Giriş Yap
            </button>
          </p>
        </form>
      </div>
    </div>
  );
};
