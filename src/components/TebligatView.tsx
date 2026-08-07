import React, { useState } from 'react';
import {
  MailWarning,
  Building,
  CheckCircle2,
  Clock,
  FileText,
  Send,
  Download,
  Search,
  Filter,
  Check,
  X,
  Sparkles,
  AlertCircle
} from 'lucide-react';
import { TebligatItem, TebligatSource, TebligatStatus, ClientBalance } from '../types';

interface TebligatViewProps {
  tebligatlar: TebligatItem[];
  setTebligatlar: React.Dispatch<React.SetStateAction<TebligatItem[]>>;
  darkMode: boolean;
  onOpenSendMailModal: (client?: ClientBalance, prefilledSubject?: string, prefilledBody?: string) => void;
}

export const TebligatView: React.FC<TebligatViewProps> = ({
  tebligatlar,
  setTebligatlar,
  darkMode,
  onOpenSendMailModal,
}) => {
  const [selectedSource, setSelectedSource] = useState<TebligatSource | 'HEPSİ'>('HEPSİ');
  const [selectedStatus, setSelectedStatus] = useState<TebligatStatus | 'HEPSİ'>('HEPSİ');
  const [searchTerm, setSearchTerm] = useState('');
  const [activePdfModal, setActivePdfModal] = useState<TebligatItem | null>(null);

  // Filter Tebligatlar
  const filtered = tebligatlar.filter((item) => {
    const matchesSource = selectedSource === 'HEPSİ' || item.source === selectedSource;
    const matchesStatus = selectedStatus === 'HEPSİ' || item.status === selectedStatus;
    const matchesSearch =
      item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.documentNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.clientVkn.includes(searchTerm);
    return matchesSource && matchesStatus && matchesSearch;
  });

  const toggleStatus = (id: string) => {
    setTebligatlar((prev) =>
      prev.map((t) =>
        t.id === id ? { ...t, status: t.status === 'completed' ? 'pending' : 'completed' } : t
      )
    );
  };

  const getSourceBadge = (source: TebligatSource) => {
    switch (source) {
      case 'GİB':
        return 'bg-blue-500/10 text-blue-500 border-blue-500/20';
      case 'SGK':
        return 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20';
      default:
        return 'bg-amber-500/10 text-amber-500 border-amber-500/20';
    }
  };

  const getStatusBadge = (status: TebligatStatus, daysLeft: number) => {
    if (status === 'completed') {
      return (
        <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 flex items-center gap-1">
          <CheckCircle2 className="w-3 h-3" /> Tamamlandı
        </span>
      );
    }
    if (daysLeft <= 5) {
      return (
        <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-rose-500/10 text-rose-500 border border-rose-500/20 flex items-center gap-1 animate-pulse">
          <AlertCircle className="w-3 h-3" /> Süresi Yaklaşıyor ({daysLeft} gün)
        </span>
      );
    }
    return (
      <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-500/10 text-amber-500 border border-amber-500/20 flex items-center gap-1">
        <Clock className="w-3 h-3" /> İşlem Bekliyor ({daysLeft} gün)
      </span>
    );
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Title & Stats Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold tracking-tight flex items-center gap-2">
            <MailWarning className="w-5 h-5 text-blue-500" />
            Gelen Tebligatlar Yönetim Merkezi
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Gelir İdaresi Başkanlığı (GİB), Sosyal Güvenlik Kurumu (SGK) ve Belediyelerden gelen resmi tebligatlar.
          </p>
        </div>

        {/* Source Categories Tabs */}
        <div className={`p-1 rounded-2xl border flex items-center gap-1 self-start ${
          darkMode ? 'bg-white/5 border-white/10' : 'bg-slate-100 border-slate-200'
        }`}>
          {(['HEPSİ', 'GİB', 'SGK', 'DİĞER'] as const).map((src) => (
            <button
              key={src}
              onClick={() => setSelectedSource(src as any)}
              className={`px-4 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                selectedSource === src
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {src}
            </button>
          ))}
        </div>
      </div>

      {/* Filters Bar */}
      <div className={`p-4 rounded-3xl border flex flex-col sm:flex-row items-center justify-between gap-4 ${
        darkMode ? 'bg-white/5 border-white/10' : 'bg-white border-slate-200 shadow-sm'
      }`}>
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3.5 top-2.5 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Tebligat başlığı, belge no veya mükellef ara..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={`w-full pl-10 pr-4 py-2 text-xs rounded-xl border outline-none ${
              darkMode ? 'bg-white/5 border-white/10 text-white' : 'bg-slate-50 border-slate-200'
            }`}
          />
        </div>

        <div className="flex items-center space-x-2 w-full sm:w-auto">
          <Filter className="w-4 h-4 text-slate-400" />
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value as any)}
            className={`px-3 py-2 text-xs font-semibold rounded-xl border outline-none ${
              darkMode ? 'bg-[#1C1C1E] border-white/10 text-white' : 'bg-slate-50 border-slate-200'
            }`}
          >
            <option value="HEPSİ">Tüm Durumlar</option>
            <option value="unread">Okunmayanlar</option>
            <option value="urgent">Süresi Yaklaşanlar</option>
            <option value="completed">Tamamlananlar</option>
          </select>
        </div>
      </div>

      {/* Tebligatlar Cards List */}
      <div className="space-y-4">
        {filtered.length === 0 ? (
          <div className="text-center py-12 text-slate-400 text-xs">
            Aranan kriterlere uygun tebligat bulunamadı.
          </div>
        ) : (
          filtered.map((item) => (
            <div
              key={item.id}
              className={`p-5 rounded-3xl border transition-all hover:border-blue-500/40 relative group ${
                item.status === 'completed'
                  ? darkMode
                    ? 'bg-white/5 border-white/5 opacity-75'
                    : 'bg-slate-50 border-slate-200 opacity-80'
                  : darkMode
                  ? 'bg-white/5 border-white/10'
                  : 'bg-white border-slate-200 shadow-sm'
              }`}
            >
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                <div className="space-y-2 max-w-3xl">
                  <div className="flex items-center space-x-2">
                    <span className={`px-2.5 py-0.5 rounded-md text-[10px] font-bold border uppercase tracking-wider ${getSourceBadge(item.source)}`}>
                      {item.source}
                    </span>
                    <span className="text-xs font-mono text-slate-400">
                      {item.documentNo}
                    </span>
                    <span className="text-[10px] text-slate-500">• Tebliğ: {item.date}</span>
                  </div>

                  <h3 className="text-base font-bold text-slate-100 tracking-tight leading-snug">
                    {item.title}
                  </h3>

                  <div className="flex items-center space-x-3 text-xs">
                    <span className="font-semibold text-blue-400 flex items-center gap-1">
                      <Building className="w-3.5 h-3.5" />
                      Mükellef: {item.clientName} (VKN: {item.clientVkn})
                    </span>
                  </div>

                  <p className="text-xs text-slate-400 line-clamp-2 bg-slate-500/5 p-3 rounded-2xl border border-slate-500/10">
                    {item.summary}
                  </p>
                </div>

                <div className="flex flex-col items-end justify-between space-y-3 flex-shrink-0">
                  {getStatusBadge(item.status, item.daysLeft)}

                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => setActivePdfModal(item)}
                      className={`px-3 py-1.5 rounded-xl border text-xs font-semibold flex items-center space-x-1.5 transition-all ${
                        darkMode ? 'bg-slate-800 border-slate-700 text-slate-200 hover:bg-slate-700' : 'bg-slate-100 border-slate-200 text-slate-700'
                      }`}
                    >
                      <FileText className="w-3.5 h-3.5 text-blue-400" />
                      <span>Görüntüle</span>
                    </button>

                    <button
                      onClick={() =>
                        onOpenSendMailModal(
                          {
                            id: 'c1',
                            name: item.clientName,
                            vkn: item.clientVkn,
                            email: 'muhasebe@firma.com',
                            taxOffice: '',
                            totalBalance: 0,
                            overdueBalance: 0,
                            lastTransactionDate: '',
                            phone: '',
                            contactPerson: '',
                            riskStatus: 'normal'
                          },
                          `TEBLİGAT BİLGİLENDİRMESİ: ${item.title}`,
                          `Sayın Yetkili,\n\nFirmanıza ait ${item.source} kurumundan tarafımıza ulaşan tebligat özeti aşağıdadır:\n\nBelge No: ${item.documentNo}\nSon İşlem Tarihi: ${item.deadlineDate}\nÖzet: ${item.summary}\n\nGereği için bilgilerinize sunarız.\n\nSaygılarımızla,\nMüşavirPro Mali Müşavirlik Büro Yöneticiliği`
                        )
                      }
                      className="px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold flex items-center space-x-1.5 transition-all shadow-sm"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>Müşteriye İlet</span>
                    </button>

                    <button
                      onClick={() => toggleStatus(item.id)}
                      className={`p-1.5 rounded-xl border transition-all ${
                        item.status === 'completed'
                          ? 'bg-emerald-500 text-white border-emerald-500'
                          : darkMode
                          ? 'bg-slate-800 border-slate-700 text-slate-400 hover:text-emerald-400'
                          : 'bg-slate-100 border-slate-200 text-slate-500 hover:text-emerald-600'
                      }`}
                      title={item.status === 'completed' ? 'Tamamlanmadı yap' : 'Tamamlandı işaretle'}
                    >
                      <Check className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* PDF Document Preview Modal */}
      {activePdfModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className={`w-full max-w-2xl p-6 rounded-3xl border shadow-2xl space-y-4 ${
            darkMode ? 'bg-slate-900 border-slate-800 text-white' : 'bg-white border-slate-200 text-slate-900'
          }`}>
            <div className="flex items-center justify-between border-b pb-3 border-slate-700/30">
              <div className="flex items-center space-x-2">
                <FileText className="w-5 h-5 text-blue-500" />
                <h3 className="font-bold text-sm">Resmi Tebligat Önizlemesi</h3>
              </div>
              <button
                onClick={() => setActivePdfModal(null)}
                className="p-1 rounded-full hover:bg-slate-800 text-slate-400"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 rounded-2xl bg-slate-950 text-slate-200 border border-slate-800 font-mono text-xs space-y-4 leading-relaxed">
              <div className="text-center border-b border-slate-800 pb-3">
                <h4 className="font-bold text-sm text-amber-400 uppercase">T.C. {activePdfModal.source} BAŞKANLIĞI</h4>
                <p className="text-[10px] text-slate-500">Elektronik Tebligat Sistemi (E-Tebligat Portal)</p>
              </div>

              <div className="grid grid-cols-2 gap-2 text-[11px] bg-slate-900 p-3 rounded-xl border border-slate-800">
                <div>Belge No: <span className="text-white font-bold">{activePdfModal.documentNo}</span></div>
                <div>Tebliğ Tarihi: <span className="text-white">{activePdfModal.date}</span></div>
                <div>Mükellef: <span className="text-white font-bold">{activePdfModal.clientName}</span></div>
                <div>VKN/TCKN: <span className="text-white">{activePdfModal.clientVkn}</span></div>
              </div>

              <div>
                <p className="font-bold text-blue-400 mb-1">KONU & İÇERİK:</p>
                <p>{activePdfModal.title}</p>
              </div>

              <div className="p-3 bg-amber-500/10 border border-amber-500/20 text-amber-300 rounded-xl">
                <p className="font-bold mb-1">AÇIKLAMA / YASAL SÜRE:</p>
                <p>{activePdfModal.summary}</p>
                <p className="mt-2 font-bold text-rose-400">Son Cevap / İtiraz Tarihi: {activePdfModal.deadlineDate}</p>
              </div>
            </div>

            <div className="flex items-center justify-end space-x-3 pt-2">
              <button
                onClick={() => setActivePdfModal(null)}
                className="px-4 py-2 rounded-xl text-xs font-semibold bg-slate-800 text-slate-300 hover:bg-slate-700"
              >
                Kapat
              </button>
              <button
                onClick={() => {
                  alert("İlgili tebligat PDF belgesi indiriliyor...");
                }}
                className="px-4 py-2 rounded-xl text-xs font-semibold bg-blue-600 text-white hover:bg-blue-700 flex items-center space-x-1.5"
              >
                <Download className="w-4 h-4" />
                <span>PDF İndir</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
