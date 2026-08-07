import React, { useState } from 'react';
import {
  Users,
  Send,
  AlertTriangle,
  CheckCircle2,
  Search,
  Mail,
  Phone,
  Building,
  CreditCard,
  FileText,
  X,
  Check
} from 'lucide-react';
import { ClientBalance } from '../types';

interface ClientsViewProps {
  clients: ClientBalance[];
  darkMode: boolean;
  onOpenSendMailModal: (client?: ClientBalance, prefilledSubject?: string, prefilledBody?: string) => void;
}

export const ClientsView: React.FC<ClientsViewProps> = ({
  clients,
  darkMode,
  onOpenSendMailModal,
}) => {
  const [searchTerm, setSearchTerm] = useState('');

  const totalBalance = clients.reduce((acc, c) => acc + c.totalBalance, 0);
  const totalOverdue = clients.reduce((acc, c) => acc + c.overdueBalance, 0);

  const filtered = clients.filter(
    (c) =>
      c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.vkn.includes(searchTerm) ||
      c.contactPerson.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6 pb-12">
      {/* Title & Stats */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold tracking-tight flex items-center gap-2">
            <Users className="w-5 h-5 text-blue-500" />
            Müşteri Cari Bakiyeleri & Akıllı Mail Hatırlatıcı
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Müşteri alacak takibi, vadesi geçen borçlar ve tek tıkla e-posta hatırlatma sistemi.
          </p>
        </div>

        <button
          onClick={() => onOpenSendMailModal()}
          className="flex items-center space-x-2 px-4 py-2.5 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-medium text-xs shadow-lg shadow-blue-500/20 active:scale-95 transition-all self-start"
        >
          <Send className="w-4 h-4" />
          <span>Toplu Müşteri Maili Gönder</span>
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className={`p-5 rounded-3xl border ${
          darkMode ? 'bg-white/5 border-white/10' : 'bg-white border-slate-200 shadow-sm'
        }`}>
          <span className="text-xs text-slate-400 font-medium">Toplam Müşteri Alacağı</span>
          <h3 className="text-2xl font-bold font-mono mt-1 text-blue-500">
            ₺{totalBalance.toLocaleString('tr-TR', { minimumFractionDigits: 2 })}
          </h3>
          <p className="text-[11px] text-slate-400 mt-1">{clients.length} Aktif Müşteri</p>
        </div>

        <div className={`p-5 rounded-3xl border ${
          darkMode ? 'bg-white/5 border-white/10' : 'bg-white border-slate-200 shadow-sm'
        }`}>
          <span className="text-xs text-slate-400 font-medium">Vadesi Geçen Alacaklar</span>
          <h3 className="text-2xl font-bold font-mono mt-1 text-rose-500">
            ₺{totalOverdue.toLocaleString('tr-TR', { minimumFractionDigits: 2 })}
          </h3>
          <p className="text-[11px] text-rose-400 mt-1">Acil Hatırlatma Maili Gerektiren</p>
        </div>

        <div className={`p-5 rounded-3xl border ${
          darkMode ? 'bg-white/5 border-white/10' : 'bg-white border-slate-200 shadow-sm'
        }`}>
          <span className="text-xs text-slate-400 font-medium">Cari Hesap Durumu</span>
          <h3 className="text-2xl font-bold font-mono mt-1 text-emerald-500">
            %82 Düzenli
          </h3>
          <p className="text-[11px] text-slate-400 mt-1">Ortalama Tahsilat Süresi 14 Gün</p>
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
            placeholder="Müşteri adı, VKN veya yetkili kişi ara..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={`w-full pl-10 pr-4 py-2 text-xs rounded-xl border outline-none ${
              darkMode ? 'bg-slate-800 border-slate-700 text-white' : 'bg-slate-50 border-slate-200'
            }`}
          />
        </div>
      </div>

      {/* Clients Cards List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filtered.map((client) => (
          <div
            key={client.id}
            className={`p-6 rounded-3xl border space-y-4 transition-all relative ${
              client.overdueBalance > 0
                ? darkMode
                  ? 'bg-white/5 border-rose-500/30 hover:border-rose-500/60'
                  : 'bg-white border-rose-200 hover:border-rose-400 shadow-sm'
                : darkMode
                ? 'bg-white/5 border-white/10 hover:border-blue-500/50'
                : 'bg-white border-slate-200 shadow-sm hover:border-blue-300'
            }`}
          >
            <div className="flex items-start justify-between gap-3">
              <div className="space-y-1">
                <div className="flex items-center space-x-2">
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-500/10 text-blue-400">
                    VKN: {client.vkn}
                  </span>
                  <span className="text-[10px] text-slate-400">{client.taxOffice}</span>
                </div>
                <h3 className="text-base font-bold tracking-tight text-slate-100">
                  {client.name}
                </h3>
              </div>

              {client.overdueBalance > 0 ? (
                <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-rose-500/10 text-rose-500 border border-rose-500/20 flex items-center gap-1">
                  <AlertTriangle className="w-3 h-3" /> Gecikmede
                </span>
              ) : (
                <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" /> Düzenli
                </span>
              )}
            </div>

            <div className="grid grid-cols-2 gap-3 p-3 rounded-2xl bg-slate-500/5 border border-slate-500/10 font-mono text-xs">
              <div>
                <span className="text-[10px] text-slate-400 block font-sans">Toplam Bakiye</span>
                <span className="text-sm font-bold text-slate-200">
                  ₺{client.totalBalance.toLocaleString('tr-TR', { minimumFractionDigits: 2 })}
                </span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 block font-sans">Vadesi Geçen Borç</span>
                <span className={`text-sm font-bold ${client.overdueBalance > 0 ? 'text-rose-500' : 'text-slate-400'}`}>
                  ₺{client.overdueBalance.toLocaleString('tr-TR', { minimumFractionDigits: 2 })}
                </span>
              </div>
            </div>

            <div className="text-xs text-slate-400 space-y-1">
              <p className="flex items-center gap-1.5">
                <Users className="w-3.5 h-3.5 text-blue-400" /> Yetkili: {client.contactPerson}
              </p>
              <p className="flex items-center gap-1.5 font-mono">
                <Mail className="w-3.5 h-3.5 text-blue-400" /> {client.email}
              </p>
            </div>

            <div className="pt-2 border-t border-slate-700/20 flex items-center justify-between">
              <span className="text-[10px] text-slate-500">Son İşlem: {client.lastTransactionDate}</span>

              <button
                onClick={() => onOpenSendMailModal(client)}
                className="px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold flex items-center space-x-1.5 shadow-md shadow-blue-500/20 active:scale-95 transition-all"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Müşteriye Mail At</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

/* Dedicated Mail Sending Modal with Ready Customizable Templates */
interface SendMailModalProps {
  isOpen: boolean;
  onClose: () => void;
  client?: ClientBalance | null;
  initialSubject?: string;
  initialBody?: string;
  darkMode: boolean;
  onSend?: (subject: string, toEmail: string) => void;
}

export const SendMailModal: React.FC<SendMailModalProps> = ({
  isOpen,
  onClose,
  client,
  initialSubject,
  initialBody,
  darkMode,
  onSend,
}) => {
  if (!isOpen) return null;

  const defaultEmail = client ? client.email : 'muhasebe@musterifirma.com';
  const clientName = client ? client.name : 'Sayın Müşterimiz';
  const balanceText = client ? `₺${client.totalBalance.toLocaleString('tr-TR')}` : '₺145,000.00';
  const overdueText = client ? `₺${client.overdueBalance.toLocaleString('tr-TR')}` : '₺85,000.00';

  const [toEmail, setToEmail] = useState(defaultEmail);
  const [selectedTemplate, setSelectedTemplate] = useState<'bakiye' | 'vadesi_gecen' | 'ekstre' | 'mutabakat'>('bakiye');
  const [subject, setSubject] = useState(initialSubject || '');
  const [body, setBody] = useState(initialBody || '');
  const [isSent, setIsSent] = useState(false);

  // Template Switcher
  const applyTemplate = (tpl: 'bakiye' | 'vadesi_gecen' | 'ekstre' | 'mutabakat') => {
    setSelectedTemplate(tpl);
    if (tpl === 'bakiye') {
      setSubject(`MüşavirPro - Cari Bakiye Bilgilendirmesi (${clientName})`);
      setBody(
        `Sayın ${clientName} Yetkilisi,\n\nBüromuz nezdindeki cari hesabınızda güncel bakiye durumunuz aşağıda bilgilerinize sunulmuştur:\n\n• Toplam Cari Bakiye: ${balanceText}\n• Vadesi Geçen Tutar: ${overdueText}\n\nÖdemelerinizin en kısa sürede tarafımıza ulaştırılmasını rica eder, iyi çalışmalar dileriz.\n\nSaygılarımızla,\nSMMM Mustafa Özkan - Mali Müşavirlik Büro Yöneticiliği\nİletişim: +90 (212) 444 09 12`
      );
    } else if (tpl === 'vadesi_gecen') {
      setSubject(`ÖNEMLİ: Vadesi Geçen Alacak Hatırlatması - ${clientName}`);
      setBody(
        `Sayın ${clientName} Yönetimi,\n\nFirmamız nezdinde vadesi geçmiş olan ${overdueText} tutarındaki alacağımızın ödeme süresi aşılmıştır.\n\nVergi ve beyanname süreçlerinizin kesintiye uğramaması adına ödemenizin aşağıdaki banka hesabımıza gün içinde yapılması hususunu önemle rica ederiz:\n\nGaranti BBVA IBAN: TR42 0006 2000 4491 9283 0100 01\n\nAnlayışınız için teşekkür ederiz.\n\nSaygılarımızla,\nMüşavirPro Finans Servisi`
      );
    } else if (tpl === 'ekstre') {
      setSubject(`${clientName} - Aylık Cari Hesap Ekstresi`);
      setBody(
        `Sayın Yetkili,\n\nEkte ${clientName} firmasına ait güncel dönem cari ekstre cetveli bilgilerinize sunulmuştur.\n\nEkstreyi inceleyerek mutabakat durumunuzu e-posta ile onaylamanızı rica ederiz.\n\nİyi çalışmalar,\nMüşavirPro`
      );
    } else if (tpl === 'mutabakat') {
      setSubject(`Dönemsel Cari Mutabakat Mektubu - ${clientName}`);
      setBody(
        `Sayın Yetkili,\n\n31/07/2026 tarihi itibarıyla kayıtlarımızda firmamız nezdindeki bakiyeniz ${balanceText} (Borç) olarak görünmektedir.\n\nMutabık olup olmadığınızı bu e-postaya yanıt vererek bildirmenizi rica ederiz.\n\nSaygılarımızla,\nMüşavirPro`
      );
    }
  };

  // Initialize body if not set
  React.useEffect(() => {
    if (!subject && !body) {
      applyTemplate('bakiye');
    }
  }, []);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSent(true);
    onSend?.(subject, toEmail);
    setTimeout(() => {
      setIsSent(false);
      onClose();
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
      <div className={`w-full max-w-2xl p-6 rounded-3xl border shadow-2xl space-y-4 relative ${
        darkMode ? 'bg-slate-900 border-slate-800 text-white' : 'bg-white border-slate-200 text-slate-900'
      }`}>
        <div className="flex items-center justify-between border-b pb-3 border-slate-700/30">
          <div className="flex items-center space-x-2">
            <Mail className="w-5 h-5 text-blue-500" />
            <h3 className="font-bold text-sm">Müşteriye E-Posta Gönderme Ekranı</h3>
          </div>
          <button onClick={onClose} className="p-1 rounded-full hover:bg-slate-800 text-slate-400">
            <X className="w-5 h-5" />
          </button>
        </div>

        {isSent ? (
          <div className="py-12 text-center space-y-3">
            <div className="w-12 h-12 rounded-full bg-emerald-500/20 text-emerald-500 flex items-center justify-center mx-auto animate-bounce">
              <Check className="w-6 h-6" />
            </div>
            <h4 className="text-base font-bold text-emerald-400">E-Posta Başarıyla Gönderildi!</h4>
            <p className="text-xs text-slate-400">Müşteriye gerekli hatırlatıcı ve ekstre iletildi.</p>
          </div>
        ) : (
          <form onSubmit={handleSend} className="space-y-4 text-xs">
            {/* Template Selector Buttons */}
            <div>
              <label className="block text-slate-400 mb-1.5 font-medium">Özelleştirilmiş Hazır Mesaj Şablonu Seçin:</label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {[
                  { id: 'bakiye', label: 'Bakiye Hatırlatma' },
                  { id: 'vadesi_gecen', label: 'Vadesi Geçen Borç' },
                  { id: 'ekstre', label: 'Cari Ekstre' },
                  { id: 'mutabakat', label: 'Mutabakat Mektubu' },
                ].map((tpl) => (
                  <button
                    key={tpl.id}
                    type="button"
                    onClick={() => applyTemplate(tpl.id as any)}
                    className={`py-2 px-2 rounded-xl text-[11px] font-semibold border text-center transition-all ${
                      selectedTemplate === tpl.id
                        ? 'bg-blue-600 text-white border-blue-600 shadow-md'
                        : darkMode
                        ? 'bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700'
                        : 'bg-slate-100 border-slate-200 text-slate-700'
                    }`}
                  >
                    {tpl.label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-slate-400 mb-1 font-medium">Alıcı E-Posta Adresi</label>
              <input
                type="email"
                required
                value={toEmail}
                onChange={(e) => setToEmail(e.target.value)}
                className={`w-full px-3 py-2 rounded-xl border font-mono outline-none ${
                  darkMode ? 'bg-slate-800 border-slate-700 text-white' : 'bg-slate-50 border-slate-200'
                }`}
              />
            </div>

            <div>
              <label className="block text-slate-400 mb-1 font-medium">Konu Başlığı</label>
              <input
                type="text"
                required
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className={`w-full px-3 py-2 rounded-xl border outline-none font-semibold ${
                  darkMode ? 'bg-slate-800 border-slate-700 text-white' : 'bg-slate-50 border-slate-200'
                }`}
              />
            </div>

            <div>
              <label className="block text-slate-400 mb-1 font-medium">Mesaj İçeriği (Düzenlenebilir)</label>
              <textarea
                rows={7}
                required
                value={body}
                onChange={(e) => setBody(e.target.value)}
                className={`w-full p-3 rounded-2xl border outline-none font-sans leading-relaxed ${
                  darkMode ? 'bg-slate-800 border-slate-700 text-white' : 'bg-slate-50 border-slate-200'
                }`}
              />
            </div>

            <div className="flex items-center justify-end space-x-3 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 font-semibold"
              >
                İptal
              </button>
              <button
                type="submit"
                className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold flex items-center space-x-2 shadow-lg shadow-blue-500/20"
              >
                <Send className="w-4 h-4" />
                <span>Müşteriye Maili Gönder</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
