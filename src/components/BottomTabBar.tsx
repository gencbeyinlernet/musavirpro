import React from 'react';
import { LayoutDashboard, MailWarning, WalletCards, Users, Menu } from 'lucide-react';
import { TabType } from './Sidebar';

interface BottomTabBarProps {
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;
  unreadTebligatCount: number;
  darkMode: boolean;
  onOpenMore: () => void;
}

export const BottomTabBar: React.FC<BottomTabBarProps> = ({
  activeTab,
  setActiveTab,
  unreadTebligatCount,
  darkMode,
  onOpenMore,
}) => {
  const items: {
    id: TabType | 'more';
    label: string;
    icon: React.ElementType;
    badge?: number;
  }[] = [
    { id: 'dashboard', label: 'Genel Bakış', icon: LayoutDashboard },
    { id: 'tebligatlar', label: 'Tebligat', icon: MailWarning, badge: unreadTebligatCount || undefined },
    { id: 'nakit_akis', label: 'Nakit Akış', icon: WalletCards },
    { id: 'musteri_bakiyeleri', label: 'Müşteriler', icon: Users },
    { id: 'more', label: 'Daha Fazla', icon: Menu },
  ];

  return (
    <nav
      className={`lg:hidden fixed bottom-0 inset-x-0 z-30 pb-safe border-t backdrop-blur-xl transition-colors duration-200 ${
        darkMode ? 'bg-[#1C1C1E]/85 border-white/10' : 'bg-white/85 border-slate-200'
      }`}
      style={{ paddingBottom: 'max(env(safe-area-inset-bottom), 0.5rem)' }}
    >
      <div className="grid grid-cols-5">
        {items.map((item) => {
          const Icon = item.icon;
          const isActive = item.id !== 'more' && activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => (item.id === 'more' ? onOpenMore() : setActiveTab(item.id as TabType))}
              className="relative flex flex-col items-center justify-center gap-0.5 pt-2 pb-1 active:scale-95 transition-transform"
            >
              <div className="relative">
                <Icon
                  className={`w-5 h-5 ${
                    isActive ? 'text-accent' : darkMode ? 'text-slate-400' : 'text-slate-500'
                  }`}
                  strokeWidth={isActive ? 2.4 : 2}
                />
                {item.badge !== undefined && (
                  <span className="absolute -top-1.5 -right-2 min-w-[15px] h-[15px] px-1 rounded-full bg-red-500 text-white text-[9px] font-bold flex items-center justify-center">
                    {item.badge}
                  </span>
                )}
              </div>
              <span
                className={`text-[10px] font-medium ${
                  isActive ? 'text-accent' : darkMode ? 'text-slate-400' : 'text-slate-500'
                }`}
              >
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
