import React from 'react';
import { FileText, CheckCircle2, Clock, AlertTriangle, Download } from 'lucide-react';

interface TaxReturnsViewProps {
  darkMode: boolean;
}

export const TaxReturnsView: React.FC<TaxReturnsViewProps> = ({ darkMode }) => {
  const returns = [
    { client: 'Anadolu Lojistik A.Ş.', kdv: 'Onaylandı', muhtasar: 'Onaylandı', gecerVergi: 'Tahakkuk Edildi', babs: 'Tamamlandı' },
    { client: 'Yılmaz Dış Ticaret Ltd. Şti.', kdv: 'Taslak', muhtasar: 'Hazırlanıyor', gecerVergi: 'Onay Bekliyor', babs: 'Tamamlandı' },
    { client: 'Ege Teknoloji Ltd. Şti.', kdv: 'Onaylandı', muhtasar: 'Onaylandı', gecerVergi: 'Tahakkuk Edildi', babs: 'Tamamlandı' },
    { client: 'Boğaziçi İnşaat A.Ş.', kdv: 'Onaylandı', muhtasar: 'Hazırlanıyor', gecerVergi: 'Onay Bekliyor', babs: 'Tamamlandı' },
  ];

  return (
    <div className="space-y-6 pb-12">
      <div>
        <h2 className="text-xl font-bold tracking-tight flex items-center gap-2">
          <FileText className="w-5 h-5 text-blue-500" />
          Mükellef Beyanname Kontrol & Takip Matrisi (GİB)
        </h2>
        <p className="text-xs text-slate-400 mt-1">
          KDV1, Muhtasar ve Prim Hizmet, Geçici Vergi ve Form BA/BS beyanname onay durumları.
        </p>
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
                <th className="pb-3 px-3">Mükellef Firma</th>
                <th className="pb-3 px-3 text-center">KDV1 (07/2026)</th>
                <th className="pb-3 px-3 text-center">MUHSGK (07/2026)</th>
                <th className="pb-3 px-3 text-center">2. Geçici Vergi</th>
                <th className="pb-3 px-3 text-center">BA/BS Formu</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/30 font-medium">
              {returns.map((row, idx) => (
                <tr key={idx} className="hover:bg-slate-500/5">
                  <td className="py-3.5 px-3 font-semibold">{row.client}</td>
                  <td className="py-3.5 px-3 text-center">
                    <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-500 text-[10px] font-bold">
                      {row.kdv}
                    </span>
                  </td>
                  <td className="py-3.5 px-3 text-center">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      row.muhtasar === 'Onaylandı' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-amber-500/10 text-amber-500'
                    }`}>
                      {row.muhtasar}
                    </span>
                  </td>
                  <td className="py-3.5 px-3 text-center">
                    <span className="px-2 py-0.5 rounded bg-blue-500/10 text-blue-500 text-[10px] font-bold">
                      {row.gecerVergi}
                    </span>
                  </td>
                  <td className="py-3.5 px-3 text-center">
                    <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-500 text-[10px] font-bold">
                      {row.babs}
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
