import React, { useState, useEffect } from 'react';
import { HeaderNav } from './components/HeaderNav';
import { Sidebar, TabType } from './components/Sidebar';
import { BottomTabBar } from './components/BottomTabBar';
import { DashboardView } from './components/DashboardView';
import { TebligatView } from './components/TebligatView';
import { CalendarView } from './components/CalendarView';
import { CashFlowView } from './components/CashFlowView';
import { ClientsView, SendMailModal } from './components/ClientsView';
import { ProposalView } from './components/ProposalView';
import { NewsView } from './components/NewsView';
import { EFaturaView } from './components/EFaturaView';
import { TaxReturnsView } from './components/TaxReturnsView';
import { AiAssistantWidget } from './components/AiAssistantWidget';
import { LoginView } from './components/LoginView';
import { RegisterView } from './components/RegisterView';
import { AdminActivityView } from './components/AdminActivityView';
import { MessagesView } from './components/MessagesView';
import { useAuth } from './hooks/useAuth';
import logo from './assets/logo.png';

import {
  INITIAL_TEBLIGATLAR,
  INITIAL_CALENDAR_EVENTS,
  INITIAL_BANK_ACCOUNTS,
  INITIAL_TRANSACTIONS,
  INITIAL_CLIENT_BALANCES,
  INITIAL_PROPOSAL_TEMPLATES,
  INITIAL_PROPOSALS,
  OFFICIAL_GAZETTE_NEWS,
  INITIAL_EXCHANGE_RATES
} from './mockData';
import { ClientBalance, ExchangeRate } from './types';

export default function App() {
  const { user, token, checking, login, register, logout, logActivity } = useAuth();
  const [authView, setAuthView] = useState<'login' | 'register'>('login');

  const [darkMode, setDarkMode] = useState<boolean>(true);
  const [activeTab, setActiveTab] = useState<TabType>('dashboard');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [mobileNavOpen, setMobileNavOpen] = useState<boolean>(false);

  // Domain Data States
  const [tebligatlar, setTebligatlar] = useState(INITIAL_TEBLIGATLAR);
  const [calendarEvents, setCalendarEvents] = useState(INITIAL_CALENDAR_EVENTS);
  const [bankAccounts, setBankAccounts] = useState(INITIAL_BANK_ACCOUNTS);
  const [transactions, setTransactions] = useState(INITIAL_TRANSACTIONS);
  const [clients, setClients] = useState(INITIAL_CLIENT_BALANCES);
  const [templates, setTemplates] = useState(INITIAL_PROPOSAL_TEMPLATES);
  const [proposals, setProposals] = useState(INITIAL_PROPOSALS);
  const [newsList, setNewsList] = useState(OFFICIAL_GAZETTE_NEWS);
  const [exchangeRates, setExchangeRates] = useState(INITIAL_EXCHANGE_RATES);

  // Fetch live USD/EUR/GBP rates from TCMB on load (GAU stays as static estimate)
  useEffect(() => {
    let cancelled = false;
    fetch('/api/exchange-rates')
      .then((r) => r.json())
      .then((data: { rates?: ExchangeRate[] }) => {
        if (cancelled || !data.rates || data.rates.length === 0) return;
        setExchangeRates((prev) =>
          prev.map((fx) => data.rates!.find((live) => live.code === fx.code) || fx)
        );
      })
      .catch((err) => console.error('Kur bilgisi alınamadı:', err));
    return () => {
      cancelled = true;
    };
  }, []);

  // Send Mail Modal State
  const [mailModalOpen, setMailModalOpen] = useState(false);
  const [mailClient, setMailClient] = useState<ClientBalance | null>(null);
  const [prefilledSubject, setPrefilledSubject] = useState<string | undefined>();
  const [prefilledBody, setPrefilledBody] = useState<string | undefined>();

  // AI Assistant State
  const [isAiOpen, setIsAiOpen] = useState(false);
  const [aiExternalPrompt, setAiExternalPrompt] = useState<string | undefined>();

  const openSendMailModal = (
    client?: ClientBalance,
    subject?: string,
    body?: string
  ) => {
    setMailClient(client || null);
    setPrefilledSubject(subject);
    setPrefilledBody(body);
    setMailModalOpen(true);
  };

  const handleAskAi = (prompt: string) => {
    setAiExternalPrompt(prompt);
    setIsAiOpen(true);
  };

  // Wrap the domain-data setters so every member write action is reported to
  // the admin's activity feed, without touching the child components.
  const withLog = <T,>(
    setter: React.Dispatch<React.SetStateAction<T>>,
    action: string
  ): React.Dispatch<React.SetStateAction<T>> => (update) => {
    setter(update);
    logActivity(action);
  };

  const loggedSetTebligatlar = withLog(setTebligatlar, 'Tebligat durumunu güncelledi');
  const loggedSetCalendarEvents = withLog(setCalendarEvents, 'Mali takvim etkinliğini güncelledi');
  const loggedSetTransactions = withLog(setTransactions, 'Nakit akışına hareket ekledi');
  const loggedSetProposals = withLog(setProposals, 'Teklif oluşturdu');
  const loggedSetNewsList = withLog(setNewsList, 'Haberi okundu olarak işaretledi');

  const handleSetActiveTab = (tab: TabType) => {
    setActiveTab(tab);
    logActivity('Sayfa görüntüledi', getTabTitle(tab));
  };

  const handleMailSent = (subject: string, toEmail: string) => {
    logActivity('Müşteriye e-posta gönderdi', `${subject} → ${toEmail}`);
  };

  const unreadTebligatCount = tebligatlar.filter((t) => t.status === 'unread' || t.status === 'urgent').length;
  const urgentCalendarCount = calendarEvents.filter((c) => c.status === 'urgent').length;

  const getTabTitle = (tab: TabType) => {
    switch (tab) {
      case 'dashboard':
        return 'Genel Bakış Dashboard';
      case 'tebligatlar':
        return 'Gelen Tebligatlar (GİB, SGK, Diğer)';
      case 'mali_takvim':
        return 'Mali Takvim & Vergi Süreleri';
      case 'nakit_akis':
        return 'Nakit Akış Tablosu & Bankalar';
      case 'musteri_bakiyeleri':
        return 'Müşteri Cari Bakiyeleri & Mail';
      case 'teklifler':
        return 'Teklif Oluşturucu';
      case 'resmi_gazete':
        return 'Resmi Gazete & Haber Akışı';
      case 'efatura':
        return 'E-Fatura & E-Arşiv Portalı';
      case 'beyannameler':
        return 'Beyanname Takip Matrisi';
      case 'aktiviteler':
        return 'Üye Aktiviteleri (Yönetici)';
      case 'mesajlar':
        return 'Mesajlar';
      default:
        return 'MüşavirPro';
    }
  };

  if (checking) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0b0b0d]">
        <img src={logo} alt="MüşavirPro" className="w-14 h-14 rounded-2xl animate-pulse opacity-80" />
      </div>
    );
  }

  if (!user || !token) {
    return authView === 'login' ? (
      <LoginView onLogin={login} onSwitchToRegister={() => setAuthView('register')} />
    ) : (
      <RegisterView onRegister={register} onSwitchToLogin={() => setAuthView('login')} />
    );
  }

  return (
    <div className={`min-h-screen flex flex-col font-sans transition-colors duration-200 ${
      darkMode ? 'bg-[#1C1C1E] text-slate-100 dark' : 'bg-slate-50 text-slate-900'
    }`}>
      {/* Top Navigation */}
      <HeaderNav
        darkMode={darkMode}
        setDarkMode={setDarkMode}
        exchangeRates={exchangeRates}
        unreadTebligatCount={unreadTebligatCount}
        activeTabTitle={getTabTitle(activeTab)}
        onOpenAssistant={() => setIsAiOpen(true)}
        onOpenMenu={() => setMobileNavOpen(true)}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
      />

      {/* Main Body with Sidebar */}
      <div className="flex-1 flex overflow-hidden">
        <Sidebar
          activeTab={activeTab}
          setActiveTab={handleSetActiveTab}
          unreadTebligatCount={unreadTebligatCount}
          urgentCalendarCount={urgentCalendarCount}
          darkMode={darkMode}
          mobileOpen={mobileNavOpen}
          onMobileClose={() => setMobileNavOpen(false)}
          user={user}
          onLogout={() => {
            logActivity('Çıkış yaptı');
            logout();
          }}
        />

        {/* Dynamic View Area */}
        <main className="flex-1 overflow-y-auto scroll-touch p-3 sm:p-4 md:p-8 pb-24 lg:pb-8 max-w-7xl mx-auto w-full">
          {activeTab === 'dashboard' && (
            <DashboardView
              bankAccounts={bankAccounts}
              transactions={transactions}
              tebligatlar={tebligatlar}
              calendarEvents={calendarEvents}
              exchangeRates={exchangeRates}
              clients={clients}
              darkMode={darkMode}
              userName={user.username}
              onNavigateTab={(tab) => handleSetActiveTab(tab)}
              onOpenSendMailModal={openSendMailModal}
            />
          )}

          {activeTab === 'tebligatlar' && (
            <TebligatView
              tebligatlar={tebligatlar}
              setTebligatlar={loggedSetTebligatlar}
              darkMode={darkMode}
              onOpenSendMailModal={openSendMailModal}
            />
          )}

          {activeTab === 'mali_takvim' && (
            <CalendarView
              calendarEvents={calendarEvents}
              setCalendarEvents={loggedSetCalendarEvents}
              darkMode={darkMode}
              onOpenSendMailModal={openSendMailModal}
            />
          )}

          {activeTab === 'nakit_akis' && (
            <CashFlowView
              bankAccounts={bankAccounts}
              transactions={transactions}
              setTransactions={loggedSetTransactions}
              darkMode={darkMode}
            />
          )}

          {activeTab === 'musteri_bakiyeleri' && (
            <ClientsView
              clients={clients}
              darkMode={darkMode}
              onOpenSendMailModal={openSendMailModal}
            />
          )}

          {activeTab === 'teklifler' && (
            <ProposalView
              proposals={proposals}
              setProposals={loggedSetProposals}
              templates={templates}
              clients={clients}
              darkMode={darkMode}
              onOpenSendMailModal={openSendMailModal}
            />
          )}

          {activeTab === 'resmi_gazete' && (
            <NewsView
              newsList={newsList}
              setNewsList={loggedSetNewsList}
              darkMode={darkMode}
              onAskAi={handleAskAi}
            />
          )}

          {activeTab === 'efatura' && <EFaturaView darkMode={darkMode} />}

          {activeTab === 'beyannameler' && <TaxReturnsView darkMode={darkMode} />}

          {activeTab === 'aktiviteler' && user.role === 'admin' && (
            <AdminActivityView token={token} darkMode={darkMode} />
          )}

          {activeTab === 'mesajlar' && token && (
            <MessagesView token={token} user={user} darkMode={darkMode} />
          )}
        </main>
      </div>

      {/* Mobile Bottom Tab Bar */}
      <BottomTabBar
        activeTab={activeTab}
        setActiveTab={handleSetActiveTab}
        unreadTebligatCount={unreadTebligatCount}
        darkMode={darkMode}
        onOpenMore={() => setMobileNavOpen(true)}
      />

      {/* Send Mail Modal */}
      <SendMailModal
        isOpen={mailModalOpen}
        onClose={() => setMailModalOpen(false)}
        client={mailClient}
        initialSubject={prefilledSubject}
        initialBody={prefilledBody}
        darkMode={darkMode}
        onSend={handleMailSent}
      />

      {/* Floating Cheerful AI Assistant Widget */}
      <AiAssistantWidget
        isOpen={isAiOpen}
        setIsOpen={setIsAiOpen}
        bankAccounts={bankAccounts}
        tebligatlar={tebligatlar}
        clients={clients}
        darkMode={darkMode}
        externalPrompt={aiExternalPrompt}
        onClearExternalPrompt={() => setAiExternalPrompt(undefined)}
      />
    </div>
  );
}
