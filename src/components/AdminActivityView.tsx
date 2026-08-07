import React, { useEffect, useState, useCallback } from 'react';
import { ShieldCheck, RefreshCw, UserCircle2, Crown } from 'lucide-react';
import { ActivityEntry } from '../types';

interface AdminActivityViewProps {
  token: string | null;
  darkMode: boolean;
}

export const AdminActivityView: React.FC<AdminActivityViewProps> = ({ token, darkMode }) => {
  const [entries, setEntries] = useState<ActivityEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(() => {
    if (!token) return;
    setLoading(true);
    setError(null);
    fetch('/api/activity', { headers: { Authorization: `Bearer ${token}` } })
      .then((res) => {
        if (!res.ok) throw new Error('Aktiviteler yüklenemedi.');
        return res.json();
      })
      .then((data) => setEntries(data.entries || []))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [token]);

  useEffect(() => {
    load();
  }, [load]);

  const formatTime = (iso: string) => {
    const d = new Date(iso);
    return d.toLocaleString('tr-TR', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="space-y-6 pb-12">
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-accent uppercase tracking-wider mb-1">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Yönetici Paneli</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight">Üye Aktiviteleri</h2>
          <p className="text-xs text-slate-400 mt-1">Tüm üyelerin sistemde yaptığı işlemler burada listelenir.</p>
        </div>
        <button
          onClick={load}
          className={`flex items-center gap-1.5 px-3 py-2 text-xs font-medium rounded-xl border transition-all active:scale-95 ${
            darkMode ? 'bg-slate-800/60 border-slate-700/60 hover:bg-slate-800 text-slate-300' : 'bg-white border-slate-200 hover:bg-slate-50 text-slate-700'
          }`}
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          Yenile
        </button>
      </div>

      {error && (
        <div className="text-sm text-rose-500 bg-rose-500/10 border border-rose-500/20 rounded-xl px-4 py-3">{error}</div>
      )}

      {!error && entries.length === 0 && !loading && (
        <div className={`text-sm text-center py-16 rounded-3xl border ${darkMode ? 'border-white/10 text-slate-400' : 'border-slate-200 text-slate-500'}`}>
          Henüz kayıtlı bir aktivite yok.
        </div>
      )}

      <div className={`rounded-3xl border overflow-hidden ${darkMode ? 'border-white/10' : 'border-slate-200'}`}>
        <div className="overflow-x-auto scroll-touch">
          <table className="w-full text-sm">
            <thead>
              <tr className={`text-left text-[11px] uppercase tracking-wider ${darkMode ? 'bg-white/5 text-slate-400' : 'bg-slate-50 text-slate-500'}`}>
                <th className="px-4 py-3 font-semibold">Kullanıcı</th>
                <th className="px-4 py-3 font-semibold">İşlem</th>
                <th className="px-4 py-3 font-semibold hidden sm:table-cell">Detay</th>
                <th className="px-4 py-3 font-semibold whitespace-nowrap">Zaman</th>
              </tr>
            </thead>
            <tbody className={darkMode ? 'divide-y divide-white/5' : 'divide-y divide-slate-100'}>
              {entries.map((entry) => (
                <tr key={entry.id} className={darkMode ? 'hover:bg-white/5' : 'hover:bg-slate-50'}>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      {entry.role === 'admin' ? (
                        <Crown className="w-3.5 h-3.5 text-amber-500 flex-shrink-0" />
                      ) : (
                        <UserCircle2 className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                      )}
                      <span className="font-medium whitespace-nowrap">{entry.username}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">{entry.action}</td>
                  <td className={`px-4 py-3 hidden sm:table-cell max-w-xs truncate ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                    {entry.details || '—'}
                  </td>
                  <td className={`px-4 py-3 whitespace-nowrap text-xs ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                    {formatTime(entry.timestamp)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
