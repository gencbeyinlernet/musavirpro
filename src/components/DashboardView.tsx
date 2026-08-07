import React, { useState } from 'react';
import {
  Wallet,
  ArrowUpRight,
  ArrowDownRight,
  Building,
  MailWarning,
  Calendar,
  Send,
  PlusCircle,
  TrendingUp,
  FileText,
  Calculator,
  ChevronRight,
  ExternalLink,
  CheckCircle2,
  AlertTriangle
} from 'lucide-react';
import {
  BankAccount,
  CashFlowTransaction,
  TebligatItem,
  CalendarEvent,
  ExchangeRate,
  ClientBalance
} from '../types';

interface DashboardViewProps {
  bankAccounts: BankAccount[];
  transactions: CashFlowTransaction[];
  tebligatlar: TebligatItem[];
  calendarEvents: CalendarEvent[];
  exchangeRates: ExchangeRate[];
  clients: ClientBalance[];
  darkMode: boolean;
  userName: string;
  onNavigateTab: (tab: any) => void;
  onOpenSendMailModal: (client?: ClientBalance) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  bankAccounts,
  transactions,
  tebligatlar,
  calendarEvents,
  exchangeRates,
  clients,
  darkMode,
  userName,
  onNavigateTab,
  onOpenSendMailModal,
}) => {
  const [converterAmount, setConverterAmount] = useState<number>(1000);
  const [selectedCurrency, setSelectedCurrency] = useState<'USD' | 'EUR'>('USD');

  // Total Bank Balances
  const totalBankBalance = bankAccounts.reduce((acc, b) => acc + b.balance, 0);

  // Today's Payments & Collections
  const todayInflows = transactions
    .filter((t) => t.type === 'inflow' && t.date === '2026-08-07')
    .reduce((acc, t) => acc + t.amount, 0);

  const todayOutflows = transactions
    .filter((t) => t.type === 'outflow' && t.date === '2026-08-07')
    .reduce((acc, t) => acc + t.amount, 0);

  const urgentTebligatCount = tebligatlar.filter((t) => t.status === 'urgent' || t.status === 'unread').length;
  const urgentCalendar = calendarEvents.filter((c) => c.status === 'urgent');

  // Convert Currency
  const activeFx = exchangeRates.find((f) => f.code === selectedCurrency);
  const convertedTry = activeFx ? (converterAmount * activeFx.selling).toFixed(2) : '0';

  return (
    <div className="space-y-6 pb-12">
      {/* Top Banner & Quick Actions */}
      <div className={`p-6 rounded-3xl border relative overflow-hidden transition-all ${
        darkMode
          ? 'bg-gradient-to-r from-blue-900/30 via-slate-900/60 to-[#1C1C1E] border-white/10'
          : 'bg-gradient-to-r from-blue-50 via-indigo-50/60 to-white border-blue-100'
      }`}>
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
          <div>
            <div className="flex items-center space-x-2 text-xs font-semibold text-blue-500 uppercase tracking-wider mb-1">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span>MüşavirPro Akıllı Dashboard</span>
            </div>
            <h2 className="text-2xl font-bold tracking-tight">
              Hoş Geldiniz, {userName} 👋
            </h2>
            <p className="text-xs text-slate-400 mt-1 max-w-xl">
              Bugünkü nakit akışınız, banka bakiyeleriniz, süresi yaklaşan vergi beyannameleriniz ve resmi tebligatlarınız tek ekranda özetlenmiştir.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => onOpenSendMailModal()}
              className="flex items-center space-x-2 px-4 py-2.5 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-medium text-xs shadow-lg shadow-blue-500/20 active:scale-95 transition-all"
            >
              <Send className="w-4 h-4" />
              <span>Müşteriye Mail Gönder</span>
            </button>
            <button
              onClick={() => onNavigateTab('teklifler')}
              className={`flex items-center space-x-2 px-4 py-2.5 rounded-2xl font-medium text-xs border active:scale-95 transition-all ${
                darkMode
                  ? 'bg-slate-800/80 border-slate-700 hover:bg-slate-700 text-slate-200'
                  : 'bg-white border-slate-200 hover:bg-slate-50 text-slate-800 shadow-sm'
              }`}
            >
              <PlusCircle className="w-4 h-4 text-emerald-500" />
              <span>Yeni Teklif Hazırla</span>
            </button>
          </div>
        </div>
      </div>

      {/* 5 Core Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Bank Balances */}
        <div className={`p-5 rounded-3xl border transition-all ${
          darkMode ? 'bg-white/5 border-white/10' : 'bg-white border-slate-200 shadow-sm'
        }`}>
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400">Toplam Banka Bakiyesi</span>
            <div className="w-9 h-9 rounded-2xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center">
              <Wallet className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <h3 className="text-xl font-bold font-mono tracking-tight">
              ₺{totalBankBalance.toLocaleString('tr-TR', { minimumFractionDigits: 2 })}
            </h3>
            <p className="text-[11px] text-emerald-500 flex items-center mt-1 font-medium">
              <ArrowUpRight className="w-3 h-3 mr-0.5" /> 5 Farklı Banka Hesabı Aktif
            </p>
          </div>
        </div>

        {/* Daily Inflows */}
        <div className={`p-5 rounded-3xl border transition-all ${
          darkMode ? 'bg-white/5 border-white/10' : 'bg-white border-slate-200 shadow-sm'
        }`}>
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400">Bugünkü Tahsilatlar</span>
            <div className="w-9 h-9 rounded-2xl bg-blue-500/10 text-blue-500 flex items-center justify-center">
              <ArrowDownRight className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <h3 className="text-xl font-bold font-mono text-emerald-500 tracking-tight">
              +₺{todayInflows.toLocaleString('tr-TR', { minimumFractionDigits: 2 })}
            </h3>
            <p className="text-[11px] text-slate-400 mt-1">2 Müşteriden Havale Geldi</p>
          </div>
        </div>

        {/* Daily Outflows */}
        <div className={`p-5 rounded-3xl border transition-all ${
          darkMode ? 'bg-white/5 border-white/10' : 'bg-white border-slate-200 shadow-sm'
        }`}>
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400">Bugünkü Ödemeler</span>
            <div className="w-9 h-9 rounded-2xl bg-rose-500/10 text-rose-500 flex items-center justify-center">
              <ArrowUpRight className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <h3 className="text-xl font-bold font-mono text-rose-500 tracking-tight">
              -₺{todayOutflows.toLocaleString('tr-TR', { minimumFractionDigits: 2 })}
            </h3>
            <p className="text-[11px] text-slate-400 mt-1">GİB Vergi & Ofis Kirası</p>
          </div>
        </div>

        {/* Urgent Tebligat & Calendar */}
        <div className={`p-5 rounded-3xl border transition-all ${
          darkMode ? 'bg-white/5 border-white/10' : 'bg-white border-slate-200 shadow-sm'
        }`}>
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400">Acil Tebligat / Takvim</span>
            <div className="w-9 h-9 rounded-2xl bg-amber-500/10 text-amber-500 flex items-center justify-center">
              <MailWarning className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <h3 className="text-xl font-bold font-mono text-amber-500 tracking-tight">
              {urgentTebligatCount} Tebligat / {urgentCalendar.length} Vergi
            </h3>
            <p className="text-[11px] text-slate-400 mt-1">Aksiyon Bekleyen İşler</p>
          </div>
        </div>
      </div>

      {/* Middle Section: Bank Accounts & Cash Flow Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Bank Balances & Past Cash Flow Trend */}
        <div className="lg:col-span-2 space-y-6">
          {/* Bank Accounts List */}
          <div className={`p-6 rounded-3xl border ${
            darkMode ? 'bg-white/5 border-white/10' : 'bg-white border-slate-200 shadow-sm'
          }`}>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2">
                <Building className="w-4 h-4 text-blue-500" />
                <h3 className="text-sm font-bold tracking-tight">Günlük Banka Bakiyeleriniz</h3>
              </div>
              <button
                onClick={() => onNavigateTab('nakit_akis')}
                className="text-xs text-blue-500 hover:underline flex items-center font-medium"
              >
                <span>Tüm Hesapları Gör</span> <ChevronRight className="w-3 h-3 ml-0.5" />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              {bankAccounts.map((acc) => (
                <div
                  key={acc.id}
                  className={`p-4 rounded-2xl border transition-all relative overflow-hidden group ${
                    darkMode ? 'bg-white/5 border-white/10 hover:border-blue-500/50' : 'bg-slate-50 border-slate-200 hover:border-blue-300'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-bold tracking-wider px-2 py-0.5 rounded-md bg-blue-500/10 text-blue-500">
                      {acc.logoText}
                    </span>
                    <span className="text-[10px] font-mono text-slate-400">{acc.currency}</span>
                  </div>
                  <p className="text-xs font-semibold text-slate-400">{acc.bankName}</p>
                  <p className="text-base font-bold font-mono mt-1">
                    ₺{acc.balance.toLocaleString('tr-TR', { minimumFractionDigits: 2 })}
                  </p>
                  <p className="text-[10px] font-mono text-slate-400 truncate mt-2">
                    {acc.iban}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Past Payments Visualized (Cash Flow Visual Chart) */}
          <div className={`p-6 rounded-3xl border ${
            darkMode ? 'bg-white/5 border-white/10' : 'bg-white border-slate-200 shadow-sm'
          }`}>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-sm font-bold tracking-tight flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-emerald-500" />
                  Nakit Akış & Geçmiş Ödemeler Grafiği
                </h3>
                <p className="text-xs text-slate-400">Son 6 ayın tahsilat ve ödeme trendleri</p>
              </div>
              <span className="text-xs px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-500 font-medium">
                Pozitif Nakit Dengesi
              </span>
            </div>

            {/* Simulated Visual Chart Bar Graph */}
            <div className="space-y-4 pt-2">
              <div className="h-44 flex items-end justify-between gap-3 px-2 pt-6">
                {[
                  { month: 'Mart', inflow: 320, outflow: 180 },
                  { month: 'Nisan', inflow: 380, outflow: 210 },
                  { month: 'Mayıs', inflow: 410, outflow: 240 },
                  { month: 'Haziran', inflow: 490, outflow: 290 },
                  { month: 'Temmuz', inflow: 540, outflow: 310 },
                  { month: 'Ağustos', inflow: 610, outflow: 270 },
                ].map((item, index) => (
                  <div key={index} className="flex-1 flex flex-col items-center gap-2 h-full justify-end group">
                    <div className="w-full flex items-end justify-center gap-1 h-full">
                      {/* Inflow Bar */}
                      <div
                        className="w-1/2 bg-blue-500/80 rounded-t-lg transition-all group-hover:bg-blue-500 relative"
                        style={{ height: `${(item.inflow / 650) * 100}%` }}
                      >
                        <span className="opacity-0 group-hover:opacity-100 absolute -top-6 left-1/2 -translate-x-1/2 text-[9px] font-mono bg-slate-900 text-white px-1 rounded shadow">
                          ₺{item.inflow}K
                        </span>
                      </div>
                      {/* Outflow Bar */}
                      <div
                        className="w-1/2 bg-rose-500/80 rounded-t-lg transition-all group-hover:bg-rose-500 relative"
                        style={{ height: `${(item.outflow / 650) * 100}%` }}
                      >
                        <span className="opacity-0 group-hover:opacity-100 absolute -top-6 left-1/2 -translate-x-1/2 text-[9px] font-mono bg-slate-900 text-white px-1 rounded shadow">
                          ₺{item.outflow}K
                        </span>
                      </div>
                    </div>
                    <span className="text-[10px] font-medium text-slate-400">{item.month}</span>
                  </div>
                ))}
              </div>

              <div className="flex items-center justify-center space-x-6 pt-2 border-t border-slate-700/20 text-xs">
                <div className="flex items-center space-x-2">
                  <span className="w-3 h-3 rounded-md bg-blue-500"></span>
                  <span className="text-slate-400">Tahsilat / Gelir (₺)</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="w-3 h-3 rounded-md bg-rose-500"></span>
                  <span className="text-slate-400">Gider / Ödeme (₺)</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right 1 Col: FX Converter, Urgent Tax Deadlines & Client Balances quick list */}
        <div className="space-y-6">
          {/* Daily FX Exchange Calculator */}
          <div className={`p-5 rounded-3xl border ${
            darkMode ? 'bg-white/5 border-white/10' : 'bg-white border-slate-200 shadow-sm'
          }`}>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-1.5">
              <Calculator className="w-3.5 h-3.5 text-blue-500" />
              Günlük Döviz Çevirici
            </h3>

            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <input
                  type="number"
                  value={converterAmount}
                  onChange={(e) => setConverterAmount(Number(e.target.value))}
                  className={`w-full px-3 py-2 text-sm font-mono rounded-xl border outline-none ${
                    darkMode ? 'bg-white/5 border-white/10 text-white' : 'bg-slate-50 border-slate-200'
                  }`}
                />
                <select
                  value={selectedCurrency}
                  onChange={(e) => setSelectedCurrency(e.target.value as any)}
                  className={`px-3 py-2 text-sm font-bold rounded-xl border outline-none ${
                    darkMode ? 'bg-white/5 border-white/10 text-white' : 'bg-slate-50 border-slate-200'
                  }`}
                >
                  <option value="USD" className="bg-[#1C1C1E] text-white">USD ($)</option>
                  <option value="EUR" className="bg-[#1C1C1E] text-white">EUR (€)</option>
                </select>
              </div>

              <div className="p-3 rounded-2xl bg-blue-500/10 border border-blue-500/20 text-center">
                <span className="text-[10px] text-blue-400 block font-medium">TCMB Karşılığı</span>
                <span className="text-xl font-bold font-mono text-blue-500">
                  ₺{convertedTry}
                </span>
              </div>
            </div>
          </div>

          {/* Upcoming Tax Deadlines */}
          <div className={`p-5 rounded-3xl border ${
            darkMode ? 'bg-white/5 border-white/10' : 'bg-white border-slate-200 shadow-sm'
          }`}>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-amber-500" />
                Mali Takvim Yaklaşanlar
              </h3>
              <button
                onClick={() => onNavigateTab('mali_takvim')}
                className="text-[11px] text-blue-500 hover:underline"
              >
                Tümü
              </button>
            </div>

            <div className="space-y-2.5">
              {calendarEvents.slice(0, 3).map((event) => (
                <div
                  key={event.id}
                  className={`p-3 rounded-2xl border flex items-center justify-between ${
                    darkMode ? 'bg-white/5 border-white/10' : 'bg-slate-50 border-slate-200'
                  }`}
                >
                  <div>
                    <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-amber-500/10 text-amber-500">
                      {event.code}
                    </span>
                    <p className="text-xs font-semibold mt-1">{event.title}</p>
                    <p className="text-[10px] text-slate-400">Son Gün: {event.dueDate}</p>
                  </div>
                  <span className="text-xs font-bold text-amber-500 px-2 py-1 rounded-xl bg-amber-500/10">
                    {event.daysLeft} gün
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Critical Client Balances */}
          <div className={`p-5 rounded-3xl border ${
            darkMode ? 'bg-white/5 border-white/10' : 'bg-white border-slate-200 shadow-sm'
          }`}>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Alacağı Vadesi Geçen Müşteriler
              </h3>
              <button
                onClick={() => onNavigateTab('musteri_bakiyeleri')}
                className="text-[11px] text-blue-500 hover:underline"
              >
                Müşteri Listesi
              </button>
            </div>

            <div className="space-y-2">
              {clients
                .filter((c) => c.overdueBalance > 0)
                .slice(0, 3)
                .map((client) => (
                  <div
                    key={client.id}
                    className={`p-3 rounded-2xl border flex items-center justify-between ${
                      darkMode ? 'bg-white/5 border-white/10' : 'bg-slate-50 border-slate-200'
                    }`}
                  >
                    <div className="min-w-0 flex-1 pr-2">
                      <p className="text-xs font-semibold truncate">{client.name}</p>
                      <p className="text-[10px] font-mono text-rose-500 font-bold">
                        Vadesi Geçen: ₺{client.overdueBalance.toLocaleString('tr-TR')}
                      </p>
                    </div>
                    <button
                      onClick={() => onOpenSendMailModal(client)}
                      className="px-2.5 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-[10px] font-medium flex items-center space-x-1"
                    >
                      <Send className="w-3 h-3" />
                      <span>Mail At</span>
                    </button>
                  </div>
                ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
