import React, { useState } from 'react';
import {
  WalletCards,
  Building2,
  ArrowUpRight,
  ArrowDownRight,
  TrendingUp,
  PlusCircle,
  Filter,
  CheckCircle2,
  Clock,
  ChevronRight,
  CreditCard,
  DollarSign
} from 'lucide-react';
import { BankAccount, CashFlowTransaction } from '../types';

interface CashFlowViewProps {
  bankAccounts: BankAccount[];
  transactions: CashFlowTransaction[];
  setTransactions: React.Dispatch<React.SetStateAction<CashFlowTransaction[]>>;
  darkMode: boolean;
}

export const CashFlowView: React.FC<CashFlowViewProps> = ({
  bankAccounts,
  transactions,
  setTransactions,
  darkMode,
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'bankas' | 'inflows' | 'outflows' | 'chart'>('bankas');
  const [showAddTransactionModal, setShowAddTransactionModal] = useState(false);

  // New transaction state
  const [newType, setNewType] = useState<'inflow' | 'outflow'>('inflow');
  const [newCategory, setNewCategory] = useState('Müşteri Tahsilatı');
  const [newAmount, setNewAmount] = useState<number>(10000);
  const [newParty, setNewParty] = useState('');
  const [newDesc, setNewDesc] = useState('');

  const totalBalance = bankAccounts.reduce((acc, b) => acc + b.balance, 0);

  const inflows = transactions.filter((t) => t.type === 'inflow');
  const outflows = transactions.filter((t) => t.type === 'outflow');

  const totalInflows = inflows.reduce((acc, t) => acc + t.amount, 0);
  const totalOutflows = outflows.reduce((acc, t) => acc + t.amount, 0);

  const handleAddTransaction = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newParty || !newAmount) return;

    const newTr: CashFlowTransaction = {
      id: `TR-${Date.now()}`,
      type: newType,
      category: newCategory,
      amount: newAmount,
      currency: 'TRY',
      date: '2026-08-07',
      partyName: newParty,
      description: newDesc || 'Yeni Nakit Hareket Kaydı',
      status: 'completed',
    };

    setTransactions((prev) => [newTr, ...prev]);
    setShowAddTransactionModal(false);
    setNewParty('');
    setNewDesc('');
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Title & Stats Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold tracking-tight flex items-center gap-2">
            <WalletCards className="w-5 h-5 text-blue-500" />
            Nakit Akış Tablosu & Banka Hesap Yönetimi
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Günlük banka bakiyeleri, tahsilatlar, ödemeler ve geçmiş ödeme analitiği.
          </p>
        </div>

        <button
          onClick={() => setShowAddTransactionModal(true)}
          className="flex items-center space-x-2 px-4 py-2.5 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-medium text-xs shadow-lg shadow-blue-500/20 active:scale-95 transition-all self-start"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Yeni İşlem / Ödeme Ekle</span>
        </button>
      </div>

      {/* Top 3 Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className={`p-5 rounded-3xl border ${
          darkMode ? 'bg-white/5 border-white/10' : 'bg-white border-slate-200 shadow-sm'
        }`}>
          <span className="text-xs text-slate-400 font-medium">Toplam Banka Bakiyesi</span>
          <h3 className="text-2xl font-bold font-mono mt-1 text-blue-500">
            ₺{totalBalance.toLocaleString('tr-TR', { minimumFractionDigits: 2 })}
          </h3>
          <p className="text-[11px] text-slate-400 mt-1">5 Banka Entegrasyonu Aktif</p>
        </div>

        <div className={`p-5 rounded-3xl border ${
          darkMode ? 'bg-white/5 border-white/10' : 'bg-white border-slate-200 shadow-sm'
        }`}>
          <span className="text-xs text-slate-400 font-medium">Toplam Tahsilat (Gelen)</span>
          <h3 className="text-2xl font-bold font-mono mt-1 text-emerald-500">
            +₺{totalInflows.toLocaleString('tr-TR', { minimumFractionDigits: 2 })}
          </h3>
          <p className="text-[11px] text-slate-400 mt-1">{inflows.length} Adet İşlem</p>
        </div>

        <div className={`p-5 rounded-3xl border ${
          darkMode ? 'bg-white/5 border-white/10' : 'bg-white border-slate-200 shadow-sm'
        }`}>
          <span className="text-xs text-slate-400 font-medium">Toplam Ödemeler (Giden)</span>
          <h3 className="text-2xl font-bold font-mono mt-1 text-rose-500">
            -₺{totalOutflows.toLocaleString('tr-TR', { minimumFractionDigits: 2 })}
          </h3>
          <p className="text-[11px] text-slate-400 mt-1">{outflows.length} Adet İşlem</p>
        </div>
      </div>

      {/* Sub Tab Navigation */}
      <div className={`p-1 rounded-2xl border flex items-center space-x-1 ${
        darkMode ? 'bg-white/5 border-white/10' : 'bg-slate-100 border-slate-200'
      }`}>
        {[
          { id: 'bankas', label: 'Banka Bakiyeleri' },
          { id: 'inflows', label: 'Günlük Tahsilatlar' },
          { id: 'outflows', label: 'Günlük Ödemeler' },
          { id: 'chart', label: 'Geçmiş Ödemeler Grafiği' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveSubTab(tab.id as any)}
            className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
              activeSubTab === tab.id
                ? 'bg-blue-600 text-white shadow'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab 1: Bank Accounts List */}
      {activeSubTab === 'bankas' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {bankAccounts.map((acc) => (
            <div
              key={acc.id}
              className={`p-5 rounded-3xl border space-y-3 relative overflow-hidden group transition-all ${
                darkMode ? 'bg-slate-900/90 border-slate-800 hover:border-blue-500/50' : 'bg-white border-slate-200 shadow-sm'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 rounded-xl bg-blue-500/10 text-blue-500 font-bold text-xs flex items-center justify-center">
                    <Building2 className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold">{acc.bankName}</h4>
                    <span className="text-[10px] text-slate-400">Hesap No: {acc.accountNumber}</span>
                  </div>
                </div>
                <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-blue-500/10 text-blue-500">
                  {acc.currency}
                </span>
              </div>

              <div>
                <span className="text-[10px] text-slate-400 block font-medium">Bakiye</span>
                <p className="text-xl font-bold font-mono text-emerald-500">
                  ₺{acc.balance.toLocaleString('tr-TR', { minimumFractionDigits: 2 })}
                </p>
              </div>

              <div className="p-3 rounded-2xl bg-slate-500/5 border border-slate-500/10 font-mono text-[10px] text-slate-400 truncate">
                {acc.iban}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Tab 2 & 3: Daily Inflows & Outflows Tables */}
      {(activeSubTab === 'inflows' || activeSubTab === 'outflows') && (
        <div className={`p-6 rounded-3xl border ${
          darkMode ? 'bg-slate-900/90 border-slate-800' : 'bg-white border-slate-200 shadow-sm'
        }`}>
          <h3 className="text-sm font-bold tracking-tight mb-4 flex items-center gap-2">
            {activeSubTab === 'inflows' ? (
              <ArrowDownRight className="w-4 h-4 text-emerald-500" />
            ) : (
              <ArrowUpRight className="w-4 h-4 text-rose-500" />
            )}
            {activeSubTab === 'inflows' ? 'Tahsilat Hareketleri (Gelen Para)' : 'Ödeme Hareketleri (Giden Para)'}
          </h3>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className={`text-[11px] font-bold uppercase tracking-wider border-b ${
                  darkMode ? 'border-slate-800 text-slate-400' : 'border-slate-200 text-slate-500'
                }`}>
                  <th className="pb-3 px-3">Tarih</th>
                  <th className="pb-3 px-3">Taraf / Müşteri / Kurum</th>
                  <th className="pb-3 px-3">Kategori</th>
                  <th className="pb-3 px-3">Açıklama</th>
                  <th className="pb-3 px-3 text-right">Tutar</th>
                  <th className="pb-3 px-3 text-right">Durum</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/30 text-xs">
                {(activeSubTab === 'inflows' ? inflows : outflows).map((t) => (
                  <tr key={t.id} className="hover:bg-slate-500/5 transition-colors">
                    <td className="py-3.5 px-3 font-mono text-slate-400">{t.date}</td>
                    <td className="py-3.5 px-3 font-semibold text-slate-100">{t.partyName}</td>
                    <td className="py-3.5 px-3">
                      <span className="px-2 py-0.5 rounded-md text-[10px] font-medium bg-blue-500/10 text-blue-400">
                        {t.category}
                      </span>
                    </td>
                    <td className="py-3.5 px-3 text-slate-400">{t.description}</td>
                    <td className={`py-3.5 px-3 font-mono font-bold text-right text-sm ${
                      t.type === 'inflow' ? 'text-emerald-500' : 'text-rose-500'
                    }`}>
                      {t.type === 'inflow' ? '+' : '-'}₺{t.amount.toLocaleString('tr-TR', { minimumFractionDigits: 2 })}
                    </td>
                    <td className="py-3.5 px-3 text-right">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        t.status === 'completed'
                          ? 'bg-emerald-500/10 text-emerald-500'
                          : 'bg-amber-500/10 text-amber-500'
                      }`}>
                        {t.status === 'completed' ? 'Tamamlandı' : 'Planlandı'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 4: Past Payments Visual Chart */}
      {activeSubTab === 'chart' && (
        <div className={`p-6 rounded-3xl border ${
          darkMode ? 'bg-slate-900/90 border-slate-800' : 'bg-white border-slate-200 shadow-sm'
        }`}>
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-base font-bold tracking-tight">Geçmiş Ödemeler ve Harcama Analitiği</h3>
              <p className="text-xs text-slate-400">Son 6 ayda ödenen vergi, maaş, SGK ve kira gider dağılımı</p>
            </div>
            <span className="text-xs px-3 py-1 rounded-full bg-rose-500/10 text-rose-500 font-bold">
              Kritik Giderler
            </span>
          </div>

          <div className="space-y-6">
            {/* Visual Bar Category Breakdown */}
            {[
              { label: 'Vergi ve Harç Ödemeleri (GİB)', amount: 312000, color: 'bg-blue-500', percent: 45 },
              { label: 'SGK İşveren ve Sigortalı Primleri', amount: 185000, color: 'bg-indigo-500', percent: 27 },
              { label: 'Büro Personel Net Maaşları', amount: 120000, color: 'bg-amber-500', percent: 17 },
              { label: 'Ofis Kiraları & Genel İşletme Giderleri', amount: 76000, color: 'bg-rose-500', percent: 11 },
            ].map((cat, idx) => (
              <div key={idx} className="space-y-2">
                <div className="flex items-center justify-between text-xs font-semibold">
                  <span>{cat.label}</span>
                  <span className="font-mono">₺{cat.amount.toLocaleString('tr-TR')} ({cat.percent}%)</span>
                </div>
                <div className="h-3 w-full bg-slate-800 rounded-full overflow-hidden">
                  <div className={`h-full ${cat.color} rounded-full`} style={{ width: `${cat.percent}%` }}></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Add Transaction Modal */}
      {showAddTransactionModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className={`w-full max-w-md p-6 rounded-3xl border shadow-2xl space-y-4 ${
            darkMode ? 'bg-slate-900 border-slate-800 text-white' : 'bg-white border-slate-200 text-slate-900'
          }`}>
            <h3 className="text-base font-bold">Yeni Nakit / Ödeme Kaydı Ekle</h3>

            <form onSubmit={handleAddTransaction} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-400 mb-1">İşlem Tipi</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setNewType('inflow')}
                    className={`py-2 rounded-xl font-bold border ${
                      newType === 'inflow'
                        ? 'bg-emerald-600 text-white border-emerald-600'
                        : 'bg-slate-800 border-slate-700 text-slate-400'
                    }`}
                  >
                    + Tahsilat (Gelen)
                  </button>
                  <button
                    type="button"
                    onClick={() => setNewType('outflow')}
                    className={`py-2 rounded-xl font-bold border ${
                      newType === 'outflow'
                        ? 'bg-rose-600 text-white border-rose-600'
                        : 'bg-slate-800 border-slate-700 text-slate-400'
                    }`}
                  >
                    - Ödeme (Giden)
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Taraf / Müşteri / Kurum</label>
                <input
                  type="text"
                  required
                  placeholder="Örn: Yılmaz Dış Ticaret"
                  value={newParty}
                  onChange={(e) => setNewParty(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border bg-slate-800 border-slate-700 text-white outline-none"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Tutar (₺)</label>
                <input
                  type="number"
                  required
                  value={newAmount}
                  onChange={(e) => setNewAmount(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-xl border bg-slate-800 border-slate-700 text-white outline-none font-mono text-sm"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Açıklama</label>
                <input
                  type="text"
                  placeholder="İşlem detayı..."
                  value={newDesc}
                  onChange={(e) => setNewDesc(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border bg-slate-800 border-slate-700 text-white outline-none"
                />
              </div>

              <div className="flex items-center justify-end space-x-2 pt-3">
                <button
                  type="button"
                  onClick={() => setShowAddTransactionModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300"
                >
                  İptal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-blue-600 text-white font-bold"
                >
                  Kaydet
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
