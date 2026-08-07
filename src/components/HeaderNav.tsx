import React, { useState } from 'react';
import {
  Sun,
  Moon,
  TrendingUp,
  TrendingDown,
  Bell,
  Search,
  Sparkles,
  RefreshCw,
  Menu,
  X
} from 'lucide-react';
import { ExchangeRate } from '../types';
import logo from '../assets/logo.png';

interface HeaderNavProps {
  darkMode: boolean;
  setDarkMode: (val: boolean) => void;
  exchangeRates: ExchangeRate[];
  unreadTebligatCount: number;
  activeTabTitle: string;
  onOpenAssistant: () => void;
  onOpenMenu: () => void;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
}

export const HeaderNav: React.FC<HeaderNavProps> = ({
  darkMode,
  setDarkMode,
  exchangeRates,
  unreadTebligatCount,
  activeTabTitle,
  onOpenAssistant,
  onOpenMenu,
  searchQuery,
  setSearchQuery,
}) => {
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);

  return (
    <header className={`sticky top-0 z-30 border-b backdrop-blur-xl pt-safe transition-colors duration-200 ${
      darkMode
        ? 'bg-[#1C1C1E]/90 border-white/10 text-slate-100'
        : 'bg-white/90 border-slate-200 text-slate-800'
    }`}>
      {/* Top Bar */}
      <div className="flex items-center justify-between gap-2 px-3 sm:px-5 py-3">
        {/* Left: Menu (mobile) / Window Dots (desktop) & App Title */}
        <div className="flex items-center space-x-3 sm:space-x-4 min-w-0">
          {/* Mobile menu button */}
          <button
            onClick={onOpenMenu}
            className={`lg:hidden p-1.5 -ml-1 rounded-lg transition-colors ${
              darkMode ? 'text-slate-300 hover:bg-white/10' : 'text-slate-600 hover:bg-slate-100'
            }`}
            aria-label="Menüyü aç"
          >
            <Menu className="w-5 h-5" />
          </button>

          <div className="hidden lg:flex items-center space-x-2">
            <span className="w-3 h-3 rounded-full bg-red-500/90 shadow-sm hover:opacity-80 transition-opacity cursor-pointer"></span>
            <span className="w-3 h-3 rounded-full bg-amber-500/90 shadow-sm hover:opacity-80 transition-opacity cursor-pointer"></span>
            <span className="w-3 h-3 rounded-full bg-emerald-500/90 shadow-sm hover:opacity-80 transition-opacity cursor-pointer"></span>
          </div>

          <div className="hidden lg:block h-4 w-px bg-slate-500/20"></div>

          <div className="flex items-center space-x-2 min-w-0">
            <img src={logo} alt="MüşavirPro" className="w-6 h-6 rounded-md flex-shrink-0" />
            <h1 className="text-[15px] sm:text-base font-semibold tracking-tight font-sans truncate">
              MüşavirPro
            </h1>
            <span className="hidden sm:inline text-xs px-2 py-0.5 rounded-full font-medium bg-accent/10 text-accent border border-accent/20">
              macOS Edition
            </span>
          </div>

          <div className="hidden md:flex items-center space-x-2 pl-4 text-xs font-medium text-slate-400 min-w-0">
            <span>/</span>
            <span className={`truncate ${darkMode ? 'text-slate-200' : 'text-slate-700'}`}>{activeTabTitle}</span>
          </div>
        </div>

        {/* Center: Live FX Rates Ticker */}
        <div className="hidden xl:flex items-center space-x-4 px-4 py-1.5 rounded-full border bg-slate-500/5 text-xs font-medium border-slate-500/10 flex-shrink-0">
          <div className="flex items-center space-x-1 text-slate-400">
            <RefreshCw className="w-3 h-3 animate-spin" style={{ animationDuration: '10s' }} />
            <span>Piyasa (TCMB):</span>
          </div>
          {exchangeRates.map((fx) => (
            <div key={fx.code} className="flex items-center space-x-1.5">
              <span className="font-bold text-slate-400">{fx.code}:</span>
              <span className="font-mono">{fx.selling.toFixed(2)}₺</span>
              <span className={`flex items-center text-[10px] ${
                fx.changePercent >= 0 ? 'text-emerald-500' : 'text-rose-500'
              }`}>
                {fx.changePercent >= 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                {Math.abs(fx.changePercent)}%
              </span>
            </div>
          ))}
        </div>

        {/* Right: Search, Notifications, AI Assistant Trigger & Theme Toggle */}
        <div className="flex items-center space-x-1.5 sm:space-x-3 flex-shrink-0">
          {/* Search Box (desktop) */}
          <div className="relative hidden sm:block w-40 md:w-48 lg:w-64">
            <Search className="absolute left-3 top-2.5 w-3.5 h-3.5 text-slate-400" />
            <input
              type="text"
              placeholder="Firma, VKN, Tebligat veya Vergi ara..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={`w-full pl-9 pr-3 py-1.5 text-xs rounded-xl border outline-none transition-all focus:ring-2 focus:ring-accent/30 ${
                darkMode
                  ? 'bg-slate-800/60 border-slate-700/60 text-slate-200 focus:border-accent focus:bg-slate-800'
                  : 'bg-slate-100 border-slate-200 text-slate-800 focus:border-accent focus:bg-white'
              }`}
            />
          </div>

          {/* Search icon (mobile) */}
          <button
            onClick={() => setMobileSearchOpen((v) => !v)}
            className={`sm:hidden p-2 rounded-xl border transition-all ${
              darkMode ? 'bg-slate-800/60 border-slate-700/60 text-slate-300' : 'bg-slate-100 border-slate-200 text-slate-700'
            }`}
            aria-label="Ara"
          >
            {mobileSearchOpen ? <X className="w-4 h-4" /> : <Search className="w-4 h-4" />}
          </button>

          {/* AI Quick Button */}
          <button
            onClick={onOpenAssistant}
            className="flex items-center space-x-1.5 px-2.5 sm:px-3 py-1.5 text-xs font-medium rounded-xl bg-gradient-to-r from-accent to-indigo-600 text-white shadow-md shadow-blue-500/20 hover:opacity-95 active:scale-95 transition-all"
            title="AI Asistana Sor"
          >
            <Sparkles className="w-3.5 h-3.5 animate-pulse" />
            <span className="hidden md:inline">AI Müşavir</span>
          </button>

          {/* Notification bell */}
          <div className="relative">
            <button className={`p-2 rounded-xl border transition-all ${
              darkMode ? 'bg-slate-800/60 border-slate-700/60 hover:bg-slate-800 text-slate-300' : 'bg-slate-100 border-slate-200 hover:bg-slate-200 text-slate-700'
            }`}>
              <Bell className="w-4 h-4" />
              {unreadTebligatCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-red-500 text-white text-[10px] font-bold flex items-center justify-center animate-bounce">
                  {unreadTebligatCount}
                </span>
              )}
            </button>
          </div>

          {/* Light/Dark Toggle */}
          <button
            onClick={() => setDarkMode(!darkMode)}
            className={`hidden sm:inline-flex p-2 rounded-xl border transition-all ${
              darkMode ? 'bg-slate-800/60 border-slate-700/60 hover:bg-slate-800 text-amber-400' : 'bg-slate-100 border-slate-200 hover:bg-slate-200 text-slate-700'
            }`}
            title={darkMode ? 'Aydınlık Mod' : 'Karanlık Mod'}
          >
            {darkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Mobile search row */}
      {mobileSearchOpen && (
        <div className="sm:hidden px-3 pb-3">
          <div className="relative">
            <Search className="absolute left-3 top-2.5 w-3.5 h-3.5 text-slate-400" />
            <input
              type="text"
              autoFocus
              placeholder="Firma, VKN, Tebligat veya Vergi ara..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={`w-full pl-9 pr-3 py-2 text-sm rounded-xl border outline-none transition-all focus:ring-2 focus:ring-accent/30 ${
                darkMode
                  ? 'bg-slate-800/60 border-slate-700/60 text-slate-200 focus:border-accent'
                  : 'bg-slate-100 border-slate-200 text-slate-800 focus:border-accent'
              }`}
            />
          </div>
        </div>
      )}

      {/* Mobile FX ticker strip */}
      <div className={`xl:hidden flex items-center gap-3 overflow-x-auto scroll-touch px-3 sm:px-5 pb-2.5 text-[11px] font-medium ${
        darkMode ? 'text-slate-400' : 'text-slate-500'
      }`}>
        <span className="flex items-center gap-1 flex-shrink-0">
          <RefreshCw className="w-3 h-3" />
          TCMB:
        </span>
        {exchangeRates.map((fx) => (
          <div key={fx.code} className="flex items-center space-x-1 flex-shrink-0">
            <span className="font-bold">{fx.code}</span>
            <span className="font-mono">{fx.selling.toFixed(2)}₺</span>
            <span className={`flex items-center ${fx.changePercent >= 0 ? 'text-emerald-500' : 'text-rose-500'}`}>
              {fx.changePercent >= 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
            </span>
          </div>
        ))}
      </div>
    </header>
  );
};
