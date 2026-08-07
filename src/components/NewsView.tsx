import React, { useState } from 'react';
import {
  Newspaper,
  BookOpen,
  ExternalLink,
  Search,
  CheckCircle,
  Sparkles,
  Filter,
  X,
  Share2
} from 'lucide-react';
import { OfficialGazetteNews } from '../types';

interface NewsViewProps {
  newsList: OfficialGazetteNews[];
  setNewsList: React.Dispatch<React.SetStateAction<OfficialGazetteNews[]>>;
  darkMode: boolean;
  onAskAi: (prompt: string) => void;
}

export const NewsView: React.FC<NewsViewProps> = ({
  newsList,
  setNewsList,
  darkMode,
  onAskAi,
}) => {
  const [selectedSource, setSelectedSource] = useState<string>('HEPSİ');
  const [searchTerm, setSearchTerm] = useState('');
  const [activeNews, setActiveNews] = useState<OfficialGazetteNews | null>(null);

  const sources = ['HEPSİ', 'Resmi Gazete', 'GİB Sirküler', 'SGK Duyuru', 'TÜRMOB'];

  const filtered = newsList.filter((n) => {
    const matchesSource = selectedSource === 'HEPSİ' || n.source === selectedSource;
    const matchesSearch =
      n.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      n.summary.toLowerCase().includes(searchTerm.toLowerCase()) ||
      n.category.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSource && matchesSearch;
  });

  const markAsRead = (id: string) => {
    setNewsList((prev) =>
      prev.map((item) => (item.id === id ? { ...item, isRead: true } : item))
    );
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Title */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold tracking-tight flex items-center gap-2">
            <Newspaper className="w-5 h-5 text-blue-500" />
            Resmi Gazete & Muhasebe Mevzuat Haber Akışı
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Son 3-4 aya ait Resmi Gazete kararları, GİB sirkülerleri, SGK genelgeleri ve mesleki duyurular.
          </p>
        </div>

        <div className={`p-1 rounded-2xl border flex items-center gap-1 self-start ${
          darkMode ? 'bg-white/5 border-white/10' : 'bg-slate-100 border-slate-200'
        }`}>
          {sources.map((src) => (
            <button
              key={src}
              onClick={() => setSelectedSource(src)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                selectedSource === src
                  ? 'bg-blue-600 text-white shadow'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {src}
            </button>
          ))}
        </div>
      </div>

      {/* Search Bar */}
      <div className={`p-4 rounded-3xl border ${
        darkMode ? 'bg-white/5 border-white/10' : 'bg-white border-slate-200 shadow-sm'
      }`}>
        <div className="relative w-full max-w-md">
          <Search className="absolute left-3.5 top-2.5 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Enflasyon düzeltmesi, KDV, tebliğ veya kanun maddesi ara..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={`w-full pl-10 pr-4 py-2 text-xs rounded-xl border outline-none ${
              darkMode ? 'bg-white/5 border-white/10 text-white' : 'bg-slate-50 border-slate-200'
            }`}
          />
        </div>
      </div>

      {/* News Stream List */}
      <div className="space-y-4">
        {filtered.map((item) => (
          <div
            key={item.id}
            className={`p-6 rounded-3xl border transition-all relative group ${
              item.isRead
                ? darkMode
                  ? 'bg-white/5 border-white/5'
                  : 'bg-slate-50 border-slate-200'
                : darkMode
                ? 'bg-white/5 border-white/10 ring-1 ring-blue-500/30'
                : 'bg-white border-slate-200 shadow-sm ring-1 ring-blue-300'
            }`}
          >
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
              <div className="space-y-2 max-w-3xl">
                <div className="flex items-center space-x-2">
                  <span className="px-2.5 py-0.5 rounded-md text-[10px] font-bold bg-blue-500/10 text-blue-400 border border-blue-500/20">
                    {item.source}
                  </span>
                  {item.publishNo && (
                    <span className="text-xs font-mono text-slate-400">{item.publishNo}</span>
                  )}
                  <span className="text-[10px] text-slate-500">• {item.date}</span>
                </div>

                <h3 className="text-base font-bold tracking-tight text-slate-100">
                  {item.title}
                </h3>

                <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                  {item.summary}
                </p>
              </div>

              <div className="flex items-center space-x-2 flex-shrink-0 self-end lg:self-center">
                <button
                  onClick={() => {
                    markAsRead(item.id);
                    onAskAi(`Şu Resmi Gazete / Mevzuat haberini detaylıca özetle ve mükelleflerime etkisini anlat: "${item.title}"`);
                  }}
                  className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-xs font-semibold flex items-center space-x-1.5 shadow-md shadow-blue-500/20 active:scale-95 transition-all"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>AI ile Özetle</span>
                </button>

                <button
                  onClick={() => {
                    markAsRead(item.id);
                    setActiveNews(item);
                  }}
                  className={`px-3 py-1.5 rounded-xl border text-xs font-semibold flex items-center space-x-1.5 ${
                    darkMode ? 'bg-slate-800 border-slate-700 text-slate-200 hover:bg-slate-700' : 'bg-slate-100 border-slate-200 text-slate-700'
                  }`}
                >
                  <BookOpen className="w-3.5 h-3.5 text-blue-400" />
                  <span>Devamını Oku</span>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* News Detail Modal */}
      {activeNews && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className={`w-full max-w-2xl p-6 rounded-3xl border shadow-2xl space-y-4 ${
            darkMode ? 'bg-slate-900 border-slate-800 text-white' : 'bg-white border-slate-200 text-slate-900'
          }`}>
            <div className="flex items-center justify-between border-b pb-3 border-slate-700/30">
              <div className="flex items-center space-x-2">
                <span className="px-2.5 py-0.5 rounded text-[10px] font-bold bg-blue-500/10 text-blue-400">
                  {activeNews.source}
                </span>
                <span className="text-xs text-slate-400">{activeNews.date}</span>
              </div>
              <button onClick={() => setActiveNews(null)} className="p-1 rounded-full hover:bg-slate-800 text-slate-400">
                <X className="w-5 h-5" />
              </button>
            </div>

            <h3 className="font-bold text-base leading-snug">{activeNews.title}</h3>

            <div className="p-4 rounded-2xl bg-slate-500/5 border border-slate-500/10 text-xs space-y-3 leading-relaxed text-slate-300">
              <p className="font-bold text-blue-400">ÖZET VE MEVZUAT METNİ:</p>
              <p>{activeNews.content}</p>
            </div>

            <div className="flex items-center justify-end space-x-3 pt-2">
              <button
                onClick={() => {
                  onAskAi(`Bu mevzuat değişikliğini müşterilerime duyurmam için örnek duyuru metni taslağı yazar mısın? Konu: ${activeNews.title}`);
                  setActiveNews(null);
                }}
                className="px-4 py-2 rounded-xl bg-blue-600 text-white text-xs font-semibold flex items-center space-x-1.5"
              >
                <Sparkles className="w-4 h-4" />
                <span>Müşterilere Duyuru Taslağı Yaz</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
