import React, { useState } from 'react';
import {
  FileSignature,
  Plus,
  Trash2,
  FileText,
  Send,
  Printer,
  Download,
  Copy,
  Check,
  X,
  Building,
  Sparkles,
  Calculator
} from 'lucide-react';
import { Proposal, ProposalItem, ProposalTemplate, ClientBalance } from '../types';

interface ProposalViewProps {
  proposals: Proposal[];
  setProposals: React.Dispatch<React.SetStateAction<Proposal[]>>;
  templates: ProposalTemplate[];
  clients: ClientBalance[];
  darkMode: boolean;
  onOpenSendMailModal: (client?: ClientBalance, prefilledSubject?: string, prefilledBody?: string) => void;
}

export const ProposalView: React.FC<ProposalViewProps> = ({
  proposals,
  setProposals,
  templates,
  clients,
  darkMode,
  onOpenSendMailModal,
}) => {
  const [selectedTemplateId, setSelectedTemplateId] = useState<string>('TPL-01');
  const [clientName, setClientName] = useState('Anadolu Lojistik A.Ş.');
  const [clientVkn, setClientVkn] = useState('1029384756');
  const [clientEmail, setClientEmail] = useState('muhasebe@anadolulojistik.com');
  const [proposalNo, setProposalNo] = useState(`MSV-2026-${Math.floor(100 + Math.random() * 900)}`);
  const [date, setDate] = useState('07.08.2026');
  const [validUntil, setValidUntil] = useState('07.09.2026');
  const [notes, setNotes] = useState('Teklifimiz onay tarihinden itibaren 1 takvim yılı geçerlidir. Fiyatlara resmi vergi harçları dahil değildir.');

  // Proposal items state
  const [items, setItems] = useState<ProposalItem[]>([
    {
      id: '1',
      serviceName: 'Aylık Mali Müşavirlik ve E-Defter Hizmeti',
      description: 'E-Defter berat süreçleri, KDV ve SGK beyanları',
      quantity: 1,
      unitPrice: 18000,
      vatRate: 20,
      discountPercent: 0,
    },
    {
      id: '2',
      serviceName: 'Bordrolama ve SGK İşlemleri (1-10 Çalışan)',
      description: 'Aylık puantaj, bordro ve muhtasar prim beyanı',
      quantity: 1,
      unitPrice: 6500,
      vatRate: 20,
      discountPercent: 0,
    },
  ]);

  const [previewModalOpen, setPreviewModalOpen] = useState(false);

  // Apply template
  const handleTemplateChange = (tplId: string) => {
    setSelectedTemplateId(tplId);
    const tpl = templates.find((t) => t.id === tplId);
    if (tpl) {
      setNotes(tpl.defaultNotes);
      setItems(
        tpl.defaultItems.map((item, idx) => ({
          ...item,
          id: String(idx + 1),
        }))
      );
    }
  };

  // Add Item
  const addItem = () => {
    const newItem: ProposalItem = {
      id: String(Date.now()),
      serviceName: 'Yeni Hizmet Kalemi',
      description: 'Hizmet açıklaması...',
      quantity: 1,
      unitPrice: 5000,
      vatRate: 20,
      discountPercent: 0,
    };
    setItems((prev) => [...prev, newItem]);
  };

  const removeItem = (id: string) => {
    if (items.length <= 1) return;
    setItems((prev) => prev.filter((i) => i.id !== id));
  };

  const updateItem = (id: string, field: keyof ProposalItem, val: any) => {
    setItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, [field]: val } : item))
    );
  };

  // Calculate totals
  const totalNet = items.reduce((acc, item) => {
    const discountedPrice = item.unitPrice * (1 - item.discountPercent / 100);
    return acc + discountedPrice * item.quantity;
  }, 0);

  const totalVat = items.reduce((acc, item) => {
    const discountedPrice = item.unitPrice * (1 - item.discountPercent / 100);
    const net = discountedPrice * item.quantity;
    return acc + net * (item.vatRate / 100);
  }, 0);

  const totalAmount = totalNet + totalVat;

  const handleSaveProposal = () => {
    const newProp: Proposal = {
      id: `PROP-${Date.now()}`,
      proposalNo,
      clientName,
      clientVkn,
      clientEmail,
      date,
      validUntil,
      items,
      templateId: selectedTemplateId,
      notes,
      status: 'draft',
      totalNet,
      totalVat,
      totalAmount,
    };
    setProposals((prev) => [newProp, ...prev]);
    setPreviewModalOpen(true);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Title */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold tracking-tight flex items-center gap-2">
            <FileSignature className="w-5 h-5 text-blue-500" />
            Özelleştirilebilir Şablonlar ile Teklif Oluşturucu
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Müşterilerinize özel mali müşavirlik, danışmanlık veya kuruluş tekliflerini hızlıca hazırlayın ve e-posta ile gönderin.
          </p>
        </div>

        <button
          onClick={() => setPreviewModalOpen(true)}
          className="flex items-center space-x-2 px-4 py-2.5 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-medium text-xs shadow-lg shadow-blue-500/20 active:scale-95 transition-all self-start"
        >
          <FileText className="w-4 h-4" />
          <span>Teklif Önizlemesi & İndir</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Proposal Form */}
        <div className="lg:col-span-2 space-y-6">
          {/* Template Selection */}
          <div className={`p-6 rounded-3xl border space-y-3 ${
            darkMode ? 'bg-white/5 border-white/10' : 'bg-white border-slate-200 shadow-sm'
          }`}>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
              1. Hazır Şablon Seçimi
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {templates.map((tpl) => (
                <button
                  key={tpl.id}
                  onClick={() => handleTemplateChange(tpl.id)}
                  className={`p-3.5 rounded-2xl border text-left transition-all ${
                    selectedTemplateId === tpl.id
                      ? 'bg-blue-600/10 border-blue-500 text-blue-400 shadow'
                      : darkMode
                      ? 'bg-white/5 border-white/10 hover:bg-white/10 text-slate-300'
                      : 'bg-slate-50 border-slate-200 text-slate-700'
                  }`}
                >
                  <p className="text-xs font-bold">{tpl.title}</p>
                  <p className="text-[10px] text-slate-400 line-clamp-2 mt-1">{tpl.description}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Client & Date Details */}
          <div className={`p-6 rounded-3xl border space-y-4 ${
            darkMode ? 'bg-white/5 border-white/10' : 'bg-white border-slate-200 shadow-sm'
          }`}>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
              2. Müşteri & Teklif Bilgileri
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="block text-slate-400 mb-1">Müşteri Seçin veya Yazın</label>
                <input
                  type="text"
                  value={clientName}
                  onChange={(e) => setClientName(e.target.value)}
                  className={`w-full px-3 py-2 rounded-xl border outline-none ${
                    darkMode ? 'bg-slate-800 border-slate-700 text-white' : 'bg-slate-50 border-slate-200'
                  }`}
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1">VKN / TCKN</label>
                <input
                  type="text"
                  value={clientVkn}
                  onChange={(e) => setClientVkn(e.target.value)}
                  className={`w-full px-3 py-2 rounded-xl border font-mono outline-none ${
                    darkMode ? 'bg-slate-800 border-slate-700 text-white' : 'bg-slate-50 border-slate-200'
                  }`}
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Müşteri E-Posta Adresi</label>
                <input
                  type="email"
                  value={clientEmail}
                  onChange={(e) => setClientEmail(e.target.value)}
                  className={`w-full px-3 py-2 rounded-xl border font-mono outline-none ${
                    darkMode ? 'bg-slate-800 border-slate-700 text-white' : 'bg-slate-50 border-slate-200'
                  }`}
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Teklif Numarası</label>
                <input
                  type="text"
                  value={proposalNo}
                  onChange={(e) => setProposalNo(e.target.value)}
                  className={`w-full px-3 py-2 rounded-xl border font-mono outline-none ${
                    darkMode ? 'bg-slate-800 border-slate-700 text-white' : 'bg-slate-50 border-slate-200'
                  }`}
                />
              </div>
            </div>
          </div>

          {/* Line Items Table */}
          <div className={`p-6 rounded-3xl border space-y-4 ${
            darkMode ? 'bg-slate-900/90 border-slate-800' : 'bg-white border-slate-200 shadow-sm'
          }`}>
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                3. Hizmet Kalemleri & Fiyatlandırma
              </h3>
              <button
                onClick={addItem}
                className="px-3 py-1.5 rounded-xl bg-blue-600 text-white text-xs font-bold flex items-center space-x-1"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Kalem Ekle</span>
              </button>
            </div>

            <div className="space-y-3">
              {items.map((item, idx) => (
                <div
                  key={item.id}
                  className={`p-4 rounded-2xl border space-y-3 ${
                    darkMode ? 'bg-slate-800/40 border-slate-700/60' : 'bg-slate-50 border-slate-200'
                  }`}
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-xs font-bold text-blue-500">#{idx + 1} Kalem</span>
                    <button
                      onClick={() => removeItem(item.id)}
                      className="p-1 text-slate-400 hover:text-rose-500"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                    <div>
                      <label className="block text-[10px] text-slate-400 mb-0.5">Hizmet Adı</label>
                      <input
                        type="text"
                        value={item.serviceName}
                        onChange={(e) => updateItem(item.id, 'serviceName', e.target.value)}
                        className={`w-full px-2.5 py-1.5 rounded-xl border outline-none font-semibold ${
                          darkMode ? 'bg-slate-800 border-slate-700 text-white' : 'bg-white border-slate-200'
                        }`}
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] text-slate-400 mb-0.5">Açıklama</label>
                      <input
                        type="text"
                        value={item.description}
                        onChange={(e) => updateItem(item.id, 'description', e.target.value)}
                        className={`w-full px-2.5 py-1.5 rounded-xl border outline-none ${
                          darkMode ? 'bg-slate-800 border-slate-700 text-white' : 'bg-white border-slate-200'
                        }`}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-4 gap-2 text-xs font-mono">
                    <div>
                      <label className="block text-[10px] text-slate-400 mb-0.5 font-sans">Miktar</label>
                      <input
                        type="number"
                        value={item.quantity}
                        onChange={(e) => updateItem(item.id, 'quantity', Number(e.target.value))}
                        className={`w-full px-2.5 py-1.5 rounded-xl border outline-none ${
                          darkMode ? 'bg-slate-800 border-slate-700 text-white' : 'bg-white border-slate-200'
                        }`}
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] text-slate-400 mb-0.5 font-sans">Birim Fiyat (₺)</label>
                      <input
                        type="number"
                        value={item.unitPrice}
                        onChange={(e) => updateItem(item.id, 'unitPrice', Number(e.target.value))}
                        className={`w-full px-2.5 py-1.5 rounded-xl border outline-none ${
                          darkMode ? 'bg-slate-800 border-slate-700 text-white' : 'bg-white border-slate-200'
                        }`}
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] text-slate-400 mb-0.5 font-sans">KDV %</label>
                      <select
                        value={item.vatRate}
                        onChange={(e) => updateItem(item.id, 'vatRate', Number(e.target.value))}
                        className={`w-full px-2.5 py-1.5 rounded-xl border outline-none ${
                          darkMode ? 'bg-slate-800 border-slate-700 text-white' : 'bg-white border-slate-200'
                        }`}
                      >
                        <option value={20}>%20</option>
                        <option value={10}>%10</option>
                        <option value={0}>%0 (İstisna)</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-[10px] text-slate-400 mb-0.5 font-sans">İndirim %</label>
                      <input
                        type="number"
                        value={item.discountPercent}
                        onChange={(e) => updateItem(item.id, 'discountPercent', Number(e.target.value))}
                        className={`w-full px-2.5 py-1.5 rounded-xl border outline-none ${
                          darkMode ? 'bg-slate-800 border-slate-700 text-white' : 'bg-white border-slate-200'
                        }`}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right 1 Col: Proposal Calculation Summary */}
        <div className="space-y-6">
          <div className={`p-6 rounded-3xl border space-y-4 ${
            darkMode ? 'bg-slate-900/90 border-slate-800' : 'bg-white border-slate-200 shadow-sm'
          }`}>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
              <Calculator className="w-4 h-4 text-blue-500" />
              Teklif Tutar Hesaplaması
            </h3>

            <div className="space-y-3 font-mono text-xs border-y py-3 border-slate-700/20">
              <div className="flex items-center justify-between text-slate-400">
                <span>Ara Toplam (Net):</span>
                <span>₺{totalNet.toLocaleString('tr-TR', { minimumFractionDigits: 2 })}</span>
              </div>
              <div className="flex items-center justify-between text-slate-400">
                <span>Hesaplanan KDV (%20):</span>
                <span>₺{totalVat.toLocaleString('tr-TR', { minimumFractionDigits: 2 })}</span>
              </div>
              <div className="flex items-center justify-between text-base font-bold text-blue-500 pt-2 border-t border-slate-700/20">
                <span>Genel Toplam:</span>
                <span>₺{totalAmount.toLocaleString('tr-TR', { minimumFractionDigits: 2 })}</span>
              </div>
            </div>

            <div className="space-y-2">
              <button
                onClick={handleSaveProposal}
                className="w-full py-3 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-lg shadow-blue-500/20 active:scale-95 transition-all"
              >
                Teklifi Tamamla ve Önizle
              </button>

              <button
                onClick={() =>
                  onOpenSendMailModal(
                    {
                      id: 'p1',
                      name: clientName,
                      vkn: clientVkn,
                      email: clientEmail,
                      taxOffice: '',
                      totalBalance: 0,
                      overdueBalance: 0,
                      lastTransactionDate: '',
                      phone: '',
                      contactPerson: '',
                      riskStatus: 'normal'
                    },
                    `Mali Müşavirlik Hizmet Teklifi (${proposalNo}) - ${clientName}`,
                    `Sayın ${clientName} Yetkilisi,\n\nFirmanıza özel olarak hazırladığımız Mali Müşavirlik ve Danışmanlık hizmet teklifimizin detayları aşağıda yer almaktadır:\n\nTeklif No: ${proposalNo}\nToplam Tutar: ₺${totalAmount.toLocaleString('tr-TR')} (KDV Dahil)\nGeçerlilik Tarihi: ${validUntil}\n\nTeklif belgesi detaylarını incelemenizi ve onayınızı rica ederiz.\n\nSaygılarımızla,\nSMMM Mustafa Özkan`
                  )
                }
                className="w-full py-2.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center justify-center space-x-1.5"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Müşteriye Doğrudan E-Posta Gönder</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* PDF / Document Print Preview Modal */}
      {previewModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
          <div className="w-full max-w-3xl bg-white text-slate-900 rounded-3xl p-8 shadow-2xl space-y-6 my-8">
            <div className="flex items-center justify-between border-b pb-4 border-slate-200">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-2xl bg-blue-600 text-white font-bold flex items-center justify-center">
                  SMMM
                </div>
                <div>
                  <h3 className="font-bold text-lg leading-tight">SMMM Mustafa Özkan</h3>
                  <p className="text-xs text-slate-500">Mali Müşavirlik & Denetim Bürosu</p>
                </div>
              </div>
              <button
                onClick={() => setPreviewModalOpen(false)}
                className="p-1 rounded-full hover:bg-slate-100 text-slate-500"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Proposal Document Body */}
            <div className="space-y-6 text-xs">
              <div className="flex items-center justify-between bg-slate-50 p-4 rounded-2xl border border-slate-200">
                <div>
                  <span className="text-[10px] text-slate-400 block font-bold uppercase">MÜŞTERİ BİLGİLERİ</span>
                  <p className="font-bold text-sm text-slate-900">{clientName}</p>
                  <p className="text-slate-500 font-mono">VKN: {clientVkn} | {clientEmail}</p>
                </div>
                <div className="text-right font-mono">
                  <p className="font-bold text-blue-600">{proposalNo}</p>
                  <p className="text-slate-500">Tarih: {date}</p>
                  <p className="text-slate-500">Geçerlilik: {validUntil}</p>
                </div>
              </div>

              {/* Items Table */}
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 text-slate-500 font-bold uppercase text-[10px]">
                    <th className="py-2">Hizmet Tanımı</th>
                    <th className="py-2 text-center">Miktar</th>
                    <th className="py-2 text-right">Birim Fiyat</th>
                    <th className="py-2 text-right">KDV</th>
                    <th className="py-2 text-right">Toplam (₺)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-mono">
                  {items.map((item, idx) => {
                    const price = item.unitPrice * (1 - item.discountPercent / 100);
                    const lineNet = price * item.quantity;

                    return (
                      <tr key={idx}>
                        <td className="py-3 font-sans font-semibold">
                          {item.serviceName}
                          <p className="text-[10px] text-slate-400 font-normal">{item.description}</p>
                        </td>
                        <td className="py-3 text-center">{item.quantity}</td>
                        <td className="py-3 text-right">₺{item.unitPrice.toLocaleString('tr-TR')}</td>
                        <td className="py-3 text-right">%{item.vatRate}</td>
                        <td className="py-3 text-right font-bold">₺{lineNet.toLocaleString('tr-TR')}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>

              {/* Totals */}
              <div className="flex justify-end pt-3 border-t border-slate-200">
                <div className="w-64 space-y-1.5 font-mono text-right">
                  <div className="flex justify-between text-slate-500">
                    <span>Ara Toplam:</span>
                    <span>₺{totalNet.toLocaleString('tr-TR', { minimumFractionDigits: 2 })}</span>
                  </div>
                  <div className="flex justify-between text-slate-500">
                    <span>KDV Tutarı:</span>
                    <span>₺{totalVat.toLocaleString('tr-TR', { minimumFractionDigits: 2 })}</span>
                  </div>
                  <div className="flex justify-between text-base font-bold text-slate-900 pt-2 border-t border-slate-300">
                    <span>Genel Toplam:</span>
                    <span>₺{totalAmount.toLocaleString('tr-TR', { minimumFractionDigits: 2 })}</span>
                  </div>
                </div>
              </div>

              {/* Notes */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-slate-600">
                <p className="font-bold text-slate-800 mb-1">NOTLAR VE ŞARTLAR:</p>
                <p>{notes}</p>
              </div>
            </div>

            <div className="flex items-center justify-end space-x-3 pt-4 border-t border-slate-200">
              <button
                onClick={() => setPreviewModalOpen(false)}
                className="px-4 py-2 rounded-xl bg-slate-100 text-slate-700 font-semibold text-xs"
              >
                Kapat
              </button>
              <button
                onClick={() => window.print()}
                className="px-4 py-2 rounded-xl bg-blue-600 text-white font-semibold text-xs flex items-center space-x-1.5"
              >
                <Printer className="w-4 h-4" />
                <span>Yazdır / PDF İndir</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
