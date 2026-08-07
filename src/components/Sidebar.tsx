import React from 'react';
import { AnimatePresence, motion } from 'motion/react';
import {
  LayoutDashboard,
  MailWarning,
  CalendarDays,
  WalletCards,
  Users,
  FileSignature,
  Newspaper,
  Receipt,
  FileText,
  ChevronRight,
  ShieldCheck,
  Crown,
  LogOut,
  MessageCircle,
  X
} from 'lucide-react';
import { AuthUser } from '../types';

export type TabType =
  | 'dashboard'
  | 'tebligatlar'
  | 'mali_takvim'
  | 'nakit_akis'
  | 'musteri_bakiyeleri'
  | 'teklifler'
  | 'resmi_gazete'
  | 'efatura'
  | 'beyannameler'
  | 'mesajlar'
  | 'aktiviteler';

interface SidebarProps {
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;
  unreadTebligatCount: number;
  urgentCalendarCount: number;
  darkMode: boolean;
  mobileOpen: boolean;
  onMobileClose: () => void;
  user: AuthUser;
  onLogout: () => void;
}

const useNavGroups = (unreadTebligatCount: number, urgentCalendarCount: number, isAdmin: boolean) => [
  {
    group: 'ANA MENÜ',
    items: [
      { id: 'dashboard' as TabType, label: 'Genel Bakış', icon: LayoutDashboard },
      { id: 'mesajlar' as TabType, label: 'Mesajlar', icon: MessageCircle },
    ],
  },
  {
    group: 'EVRAK & TAKİP',
    items: [
      {
        id: 'tebligatlar' as TabType,
        label: 'Gelen Tebligatlar',
        icon: MailWarning,
        badge: unreadTebligatCount > 0 ? unreadTebligatCount : undefined,
        badgeColor: 'bg-red-500 text-white',
      },
      {
        id: 'mali_takvim' as TabType,
        label: 'Mali Takvim',
        icon: CalendarDays,
        badge: urgentCalendarCount > 0 ? urgentCalendarCount : undefined,
        badgeColor: 'bg-amber-500 text-white',
      },
      { id: 'resmi_gazete' as TabType, label: 'Resmi Gazete & Haber', icon: Newspaper },
    ],
  },
  {
    group: 'FİNANS & YÖNETİM',
    items: [
      { id: 'nakit_akis' as TabType, label: 'Nakit Akışı & Bankalar', icon: WalletCards },
      { id: 'musteri_bakiyeleri' as TabType, label: 'Müşteri Bakiyeleri & Mail', icon: Users },
      { id: 'teklifler' as TabType, label: 'Teklif Oluşturucu', icon: FileSignature },
    ],
  },
  {
    group: 'E-MÜŞAVİR',
    items: [
      { id: 'efatura' as TabType, label: 'E-Fatura & E-Arşiv', icon: Receipt },
      { id: 'beyannameler' as TabType, label: 'Beyanname Takip', icon: FileText },
    ],
  },
  ...(isAdmin
    ? [
        {
          group: 'YÖNETİCİ',
          items: [{ id: 'aktiviteler' as TabType, label: 'Üye Aktiviteleri', icon: ShieldCheck }],
        },
      ]
    : []),
];

const NavList: React.FC<{
  darkMode: boolean;
  activeTab: TabType;
  onSelect: (tab: TabType) => void;
  navItems: ReturnType<typeof useNavGroups>;
}> = ({ darkMode, activeTab, onSelect, navItems }) => (
  <div className="space-y-6 overflow-y-auto scroll-touch pr-1">
    {navItems.map((group, idx) => (
      <div key={idx} className="space-y-1">
        <h2 className="px-3 text-[10px] font-bold tracking-wider text-slate-400 uppercase">{group.group}</h2>
        <div className="space-y-1 mt-1">
          {group.items.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onSelect(item.id)}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-[13px] font-medium transition-all active:scale-[0.98] group ${
                  isActive
                    ? darkMode
                      ? 'bg-accent text-white shadow-md shadow-blue-600/30 font-semibold'
                      : 'bg-accent text-white shadow-md shadow-blue-500/20 font-semibold'
                    : darkMode
                    ? 'hover:bg-slate-800/80 text-slate-300 hover:text-white'
                    : 'hover:bg-slate-200/80 text-slate-700 hover:text-slate-900'
                }`}
              >
                <div className="flex items-center space-x-2.5 min-w-0">
                  <Icon
                    className={`w-4 h-4 flex-shrink-0 transition-transform group-hover:scale-110 ${
                      isActive ? 'text-white' : 'text-slate-400'
                    }`}
                  />
                  <span className="truncate">{item.label}</span>
                </div>

                <div className="flex items-center space-x-1 flex-shrink-0">
                  {item.badge !== undefined && (
                    <span className={`px-1.5 py-0.5 rounded-full text-[10px] font-bold ${item.badgeColor}`}>
                      {item.badge}
                    </span>
                  )}
                  <ChevronRight
                    className={`w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity ${
                      isActive ? 'text-white opacity-100' : 'text-slate-400'
                    }`}
                  />
                </div>
              </button>
            );
          })}
        </div>
      </div>
    ))}
  </div>
);

const UserFooter: React.FC<{ darkMode: boolean; user: AuthUser; onLogout: () => void }> = ({
  darkMode,
  user,
  onLogout,
}) => (
  <div
    className={`mt-4 p-3 rounded-2xl border flex items-center space-x-3 ${
      darkMode ? 'bg-white/5 border-white/10' : 'bg-white border-slate-200'
    }`}
  >
    <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-accent to-indigo-500 text-white flex items-center justify-center font-bold text-xs shadow-sm flex-shrink-0 uppercase">
      {user.username.slice(0, 2)}
    </div>
    <div className="flex-1 min-w-0">
      <p className="text-xs font-semibold truncate leading-tight">{user.username}</p>
      <p className="text-[10px] text-slate-400 truncate flex items-center gap-1">
        {user.role === 'admin' ? (
          <>
            <Crown className="w-2.5 h-2.5 text-amber-500 flex-shrink-0" /> Yönetici
          </>
        ) : (
          <>
            <ShieldCheck className="w-2.5 h-2.5 text-emerald-500 flex-shrink-0" /> Üye
          </>
        )}
      </p>
    </div>
    <button
      onClick={onLogout}
      title="Çıkış Yap"
      className={`p-1.5 rounded-lg flex-shrink-0 transition-colors ${
        darkMode ? 'hover:bg-white/10 text-slate-400 hover:text-rose-400' : 'hover:bg-slate-100 text-slate-500 hover:text-rose-500'
      }`}
    >
      <LogOut className="w-3.5 h-3.5" />
    </button>
  </div>
);

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  setActiveTab,
  unreadTebligatCount,
  urgentCalendarCount,
  darkMode,
  mobileOpen,
  onMobileClose,
  user,
  onLogout,
}) => {
  const navItems = useNavGroups(unreadTebligatCount, urgentCalendarCount, user.role === 'admin');

  const handleSelect = (tab: TabType) => {
    setActiveTab(tab);
    onMobileClose();
  };

  return (
    <>
      {/* Desktop persistent sidebar */}
      <aside
        className={`hidden lg:flex w-64 flex-shrink-0 border-r flex-col justify-between p-3 select-none transition-colors duration-200 ${
          darkMode ? 'bg-[#1C1C1E] border-white/10 text-slate-300' : 'bg-slate-100/70 border-slate-200/80 text-slate-700'
        }`}
      >
        <NavList darkMode={darkMode} activeTab={activeTab} onSelect={handleSelect} navItems={navItems} />
        <UserFooter darkMode={darkMode} user={user} onLogout={onLogout} />
      </aside>

      {/* Mobile off-canvas drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              key="backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={onMobileClose}
              className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm lg:hidden"
            />
            <motion.aside
              key="drawer"
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', stiffness: 340, damping: 34 }}
              className={`fixed inset-y-0 left-0 z-50 w-[82%] max-w-xs flex flex-col justify-between p-3 pt-safe select-none lg:hidden ${
                darkMode ? 'bg-[#1C1C1E] text-slate-300' : 'bg-slate-50 text-slate-700'
              }`}
            >
              <div>
                <div className="flex items-center justify-between px-2 py-2 mb-2">
                  <span className="text-sm font-semibold">Menü</span>
                  <button
                    onClick={onMobileClose}
                    className={`p-1.5 rounded-full ${darkMode ? 'bg-slate-800 text-slate-300' : 'bg-slate-200 text-slate-600'}`}
                    aria-label="Menüyü kapat"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
                <NavList darkMode={darkMode} activeTab={activeTab} onSelect={handleSelect} navItems={navItems} />
              </div>
              <UserFooter darkMode={darkMode} user={user} onLogout={onLogout} />
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
};
