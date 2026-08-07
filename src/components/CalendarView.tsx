import React, { useState } from 'react';
import {
  CalendarDays,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Send,
  Users,
  Filter,
  Info,
  Calendar as CalendarIcon
} from 'lucide-react';
import { CalendarEvent, CalendarCategory, ClientBalance } from '../types';

interface CalendarViewProps {
  calendarEvents: CalendarEvent[];
  setCalendarEvents: React.Dispatch<React.SetStateAction<CalendarEvent[]>>;
  darkMode: boolean;
  onOpenSendMailModal: (client?: ClientBalance, prefilledSubject?: string, prefilledBody?: string) => void;
}

export const CalendarView: React.FC<CalendarViewProps> = ({
  calendarEvents,
  setCalendarEvents,
  darkMode,
  onOpenSendMailModal,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<CalendarCategory | 'HEPSİ'>('HEPSİ');
  const [selectedStatus, setSelectedStatus] = useState<'HEPSİ' | 'pending' | 'urgent' | 'completed'>('HEPSİ');

  const categories: (CalendarCategory | 'HEPSİ')[] = [
    'HEPSİ',
    'KDV',
    'Muhtasar',
    'SGK',
    'Geçici Vergi',
    'Damga',
    'Diğer'
  ];

  const filtered = calendarEvents.filter((ev) => {
    const matchesCategory = selectedCategory === 'HEPSİ' || ev.category === selectedCategory;
    const matchesStatus = selectedStatus === 'HEPSİ' || ev.status === selectedStatus;
    return matchesCategory && matchesStatus;
  });

  const toggleEventComplete = (id: string) => {
    setCalendarEvents((prev) =>
      prev.map((e) =>
        e.id === id ? { ...e, status: e.status === 'completed' ? 'pending' : 'completed' } : e
      )
    );
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Title & Broadcaster Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold tracking-tight flex items-center gap-2">
            <CalendarDays className="w-5 h-5 text-amber-500" />
            Mali Takvim & Vergi Beyanname Süreleri
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            2026 Yılı Resmi Vergi, SGK ve Beyanname Verilme/Ödeme Takvimi.
          </p>
        </div>

        <button
          onClick={() =>
            onOpenSendMailModal(
              undefined,
              'AĞUSTOS 2026 VERGİ VE SGK BEYANNAME TAKVİMİ HATIRLATMASI',
              'Sayın Mükellefimiz,\n\nAğustos 2026 döneminde gerçekleşecek kritik vergi ve SGK son ödeme tarihleri aşağıda yer almaktadır:\n\n• 17 Ağustos: 2. Dönem Geçici Vergi Beyannamesi\n• 26 Ağustos: KDV1 Beyannamesi\n• 27 Ağustos: Muhtasar ve Prim Hizmet Beyannamesi\n• 31 Ağustos: SGK Prim Ödemeleri ve Form BA/BS\n\nFaturalarınızı ve evraklarınızı zamanında iletmenizi rica ederiz.\n\nSaygılarımızla,\nMüşavirPro Mali Müşavirlik'
            )
          }
          className="flex items-center space-x-2 px-4 py-2.5 rounded-2xl bg-amber-600 hover:bg-amber-700 text-white font-medium text-xs shadow-lg shadow-amber-500/20 active:scale-95 transition-all self-start"
        >
          <Send className="w-4 h-4" />
          <span>Tüm Mükelleflere Takvim Maili Gönder</span>
        </button>
      </div>

      {/* Category Tabs */}
      <div className="flex items-center space-x-2 overflow-x-auto pb-2 scrollbar-none">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-4 py-2 rounded-2xl text-xs font-semibold whitespace-nowrap transition-all border ${
              selectedCategory === cat
                ? 'bg-amber-500 text-white border-amber-500 shadow-md shadow-amber-500/20'
                : darkMode
                ? 'bg-white/5 border-white/10 text-slate-400 hover:text-slate-200'
                : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Calendar Grid & Timeline */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Events List */}
        <div className="lg:col-span-2 space-y-4">
          {filtered.map((event) => (
            <div
              key={event.id}
              className={`p-5 rounded-3xl border transition-all ${
                event.status === 'completed'
                  ? darkMode
                    ? 'bg-white/5 border-white/5 opacity-70'
                    : 'bg-slate-50 border-slate-200 opacity-80'
                  : darkMode
                  ? 'bg-white/5 border-white/10 hover:border-amber-500/40'
                  : 'bg-white border-slate-200 shadow-sm hover:border-amber-300'
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <span className="px-2.5 py-0.5 rounded-md text-[10px] font-bold bg-amber-500/10 text-amber-500 border border-amber-500/20">
                      {event.code}
                    </span>
                    <span className="text-xs font-semibold text-slate-400">
                      Kategori: {event.category}
                    </span>
                  </div>

                  <h3 className="text-base font-bold tracking-tight">
                    {event.title}
                  </h3>

                  <p className="text-xs text-slate-400 max-w-xl">
                    {event.description}
                  </p>

                  <div className="flex items-center space-x-3 text-xs text-slate-500 pt-1">
                    <span className="flex items-center gap-1">
                      <Users className="w-3.5 h-3.5 text-blue-400" />
                      {event.affectedClientsCount} Mükellef İlgilendiriyor
                    </span>
                  </div>
                </div>

                <div className="flex flex-col items-end justify-between space-y-3 flex-shrink-0">
                  <div className="text-right">
                    <span className="text-[10px] text-slate-400 block">Son Verilme Tarihi</span>
                    <span className="text-sm font-bold font-mono text-amber-500">
                      {event.dueDate}
                    </span>
                  </div>

                  <div className="flex items-center space-x-2">
                    <span className={`px-2.5 py-1 rounded-xl text-xs font-bold font-mono ${
                      event.daysLeft <= 10
                        ? 'bg-rose-500/10 text-rose-500 border border-rose-500/20 animate-pulse'
                        : 'bg-amber-500/10 text-amber-500 border border-amber-500/20'
                    }`}>
                      {event.daysLeft} gün kaldı
                    </span>

                    <button
                      onClick={() => toggleEventComplete(event.id)}
                      className={`p-2 rounded-xl border transition-all ${
                        event.status === 'completed'
                          ? 'bg-emerald-500 text-white border-emerald-500'
                          : darkMode
                          ? 'bg-slate-800 border-slate-700 text-slate-400 hover:text-emerald-400'
                          : 'bg-slate-100 border-slate-200 text-slate-500 hover:text-emerald-600'
                      }`}
                      title={event.status === 'completed' ? 'Tamamlanmadı İşaretle' : 'Tamamlandı İşaretle'}
                    >
                      <CheckCircle2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Right 1 Col: August 2026 Interactive Mini Calendar Widget */}
        <div className="space-y-6">
          <div className={`p-6 rounded-3xl border ${
            darkMode ? 'bg-white/5 border-white/10' : 'bg-white border-slate-200 shadow-sm'
          }`}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-bold tracking-tight flex items-center gap-2">
                <CalendarIcon className="w-4 h-4 text-amber-500" />
                Ağustos 2026
              </h3>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-blue-500/10 text-blue-400">
                Cari Dönem
              </span>
            </div>

            {/* Days Grid */}
            <div className="grid grid-cols-7 gap-1 text-center text-xs font-semibold text-slate-400 mb-2">
              <span>Pz</span>
              <span>Pt</span>
              <span>Sa</span>
              <span>Ça</span>
              <span>Pe</span>
              <span>Cu</span>
              <span>Ct</span>
            </div>

            <div className="grid grid-cols-7 gap-1.5 text-center text-xs font-mono">
              {Array.from({ length: 31 }).map((_, i) => {
                const day = i + 1;
                const isDeadlineDay = [17, 20, 26, 27, 31].includes(day);
                const isToday = day === 7;

                return (
                  <div
                    key={day}
                    className={`h-9 rounded-xl flex flex-col items-center justify-center relative font-medium transition-all ${
                      isToday
                        ? 'bg-blue-600 text-white font-bold ring-2 ring-blue-400'
                        : isDeadlineDay
                        ? 'bg-amber-500/20 text-amber-400 font-bold border border-amber-500/40'
                        : darkMode
                        ? 'bg-slate-800/40 text-slate-300'
                        : 'bg-slate-100 text-slate-700'
                    }`}
                  >
                    <span>{day}</span>
                    {isDeadlineDay && (
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-400 absolute bottom-1"></span>
                    )}
                  </div>
                );
              })}
            </div>

            <div className="mt-4 pt-4 border-t border-slate-700/20 text-[11px] text-slate-400 space-y-2">
              <div className="flex items-center space-x-2">
                <span className="w-2.5 h-2.5 rounded-full bg-blue-600"></span>
                <span>Bugün (07 Ağustos)</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-400"></span>
                <span>Kritik Vergi / SGK Ödeme Günü</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
