import React from 'react';
import { Receipt, CheckCircle2, AlertCircle, Clock, Search, RefreshCw, Send } from 'lucide-react';

interface EFaturaViewProps {
  darkMode: boolean;
}

export const EFaturaView: React.FC<EFaturaViewProps> = ({ darkMode }) => {
  const invoices = [
    { id: 'GIB202600000189', client: 'Yılmaz Dış Ticaret Ltd. Şti.', date: '07.08.2026', type: 'E-Fatura (Gelen)', amount: 48500.00, status: 'Onay Bekliyor' },
    { id: 'EAR202600000492', client: 'Anadolu Lojistik A.Ş.', date: '06.08.2026', type: 'E-Arşiv (Giden)', amount: 18000.00, status: 'GİB Onaylandı' },
    { id: 'GIB202600000188', client: 'Ege Teknoloji Ltd. Şti.', date: '05.08.2026', type: 'E-Fatura (Gelen)', amount: 24000.00, status: 'Onaylandı' },
    { id: 'EAR202600000491', client: 'TeknoAvrasya Ar-Ge A.Ş.', date: '02.08.2026', type: 'E-SMM (Serbest Meslek)', amount: 14000.00, status: 'GİB Onaylandı' },
  ];

  return (
    <div className="space-y-6 pb-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold tracking-tight flex items-center gap-2">
            <Receipt className="w-5 h-5 text-blue-500" />
            E-Dönüşüm Portal Entegrasyonu (E-Fatura / E-Arşiv / E-SMM)
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            GİB Özel Entegratör canlı portal senkronizasyonu ve fatura onay takip ekranı.
          </p>
        </div>

        <button
          onClick={() => alert('GİB Portal ile faturalar başarıyla senkronize edildi.')}
          className="flex items-center space-x-2 px-4 py-2.5 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-medium text-xs shadow-lg shadow-blue-500/20 active:scale-95 transition-all self-start"
        >
          <RefreshCw className="w-4 h-4" />
          <span>Faturaları Senkronize Et</span>
        </button>
      </div>

      <div className={`p-6 rounded-3xl border ${
        darkMode ? 'bg-white/5 border-white/10' : 'bg-white border-slate-200 shadow-sm'
      }`}>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className={`font-bold border-b ${
                darkMode ? 'border-slate-800 text-slate-400' : 'border-slate-200 text-slate-500'
              }`}>
                <th className="pb-3 px-3">Fatura No</th>
                <th className="pb-3 px-3">Mükellef / Firma</th>
                <th className="pb-3 px-3">Tür</th>
                <th className="pb-3 px-3">Tarih</th>
                <th className="pb-3 px-3 text-right">Tutar (KDV Dahil)</th>
                <th className="pb-3 px-3 text-right">Durum</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/30">
              {invoices.map((inv) => (
                <tr key={inv.id} className="hover:bg-slate-500/5">
                  <td className="py-3.5 px-3 font-mono font-bold text-blue-400">{inv.id}</td>
                  <td className="py-3.5 px-3 font-semibold">{inv.client}</td>
                  <td className="py-3.5 px-3">
                    <span className="px-2 py-0.5 rounded bg-blue-500/10 text-blue-400 text-[10px] font-bold">
                      {inv.type}
                    </span>
                  </td>
                  <td className="py-3.5 px-3 font-mono text-slate-400">{inv.date}</td>
                  <td className="py-3.5 px-3 font-mono font-bold text-right text-sm">
                    ₺{inv.amount.toLocaleString('tr-TR', { minimumFractionDigits: 2 })}
                  </td>
                  <td className="py-3.5 px-3 text-right">
                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                      inv.status === 'Onay Bekliyor'
                        ? 'bg-amber-500/10 text-amber-500 animate-pulse'
                        : 'bg-emerald-500/10 text-emerald-500'
                    }`}>
                      {inv.status}
                    </span>
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
