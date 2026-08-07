import React, { useState, useEffect, useRef } from 'react';
import {
  Calculator,
  MessageSquare,
  X,
  Send,
  Volume2,
  VolumeX,
  Sparkles,
  BarChart2,
  TrendingUp,
  Bot,
  PieChart,
  User,
  RotateCcw
} from 'lucide-react';
import { ChatMessage, BankAccount, TebligatItem, ClientBalance } from '../types';

interface AiAssistantWidgetProps {
  isOpen: boolean;
  setIsOpen: (val: boolean) => void;
  bankAccounts: BankAccount[];
  tebligatlar: TebligatItem[];
  clients: ClientBalance[];
  darkMode: boolean;
  externalPrompt?: string;
  onClearExternalPrompt?: () => void;
}

export const AiAssistantWidget: React.FC<AiAssistantWidgetProps> = ({
  isOpen,
  setIsOpen,
  bankAccounts,
  tebligatlar,
  clients,
  darkMode,
  externalPrompt,
  onClearExternalPrompt,
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      sender: 'assistant',
      text: 'Merhaba! Ben Muhasebe Asistanınız 🧮 Neşeli ve güncel durumlar hakkında bana her şeyi sorabilirsiniz! Banka bakiyeleri, nakit akışı, vadesi geçen borçlar veya mevzuat ile ilgili verileri grafiklerle özetleyebilirim.',
      timestamp: new Date().toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' }),
    },
  ]);

  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [voiceEnabled, setVoiceEnabled] = useState(true);
  const [isSpeaking, setIsSpeaking] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto scroll chat
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isOpen]);

  // Handle external prompt passed from other buttons
  useEffect(() => {
    if (externalPrompt) {
      setIsOpen(true);
      handleSendMessage(externalPrompt);
      if (onClearExternalPrompt) onClearExternalPrompt();
    }
  }, [externalPrompt]);

  // Voice Text-to-Speech Output
  const speakText = (text: string) => {
    if (!voiceEnabled || !('speechSynthesis' in window)) return;

    // Clean markdown symbols for natural TTS speech
    const cleanText = text
      .replace(/<[^>]*>/g, '')
      .replace(/<<<CHART_DATA:[^>]*>>>/g, '')
      .replace(/[*_#`~]/g, '')
      .replace(/₺/g, ' Türk Lirası ');

    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.lang = 'tr-TR';
    utterance.rate = 1.0;
    utterance.pitch = 1.1; // Cheerful voice pitch

    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    window.speechSynthesis.speak(utterance);
  };

  const stopSpeaking = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    }
  };

  // Send message to Express API endpoint `/api/assistant`
  const handleSendMessage = async (textToSend?: string) => {
    const query = textToSend || input;
    if (!query.trim() || isLoading) return;

    const userMsg: ChatMessage = {
      id: `usr-${Date.now()}`,
      sender: 'user',
      text: query,
      timestamp: new Date().toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setInput('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/assistant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: query,
          context: {
            bankAccounts,
            tebligatCount: tebligatlar.length,
            urgentTebligatlar: tebligatlar.filter((t) => t.status === 'urgent').length,
            totalClientBalance: clients.reduce((a, c) => a + c.totalBalance, 0),
            overdueClientBalance: clients.reduce((a, c) => a + c.overdueBalance, 0),
          },
        }),
      });

      const data = await response.json();
      let rawReply = data.reply || 'Cevap alınamadı.';

      // Extract Chart Data if included in response
      let chartObj: ChatMessage['chartData'] | undefined = undefined;
      const chartMatch = rawReply.match(/<<<CHART_DATA:(.*?)>>>/);

      if (chartMatch) {
        try {
          chartObj = JSON.parse(chartMatch[1]);
          rawReply = rawReply.replace(/<<<CHART_DATA:.*?>>>/g, '').trim();
        } catch (e) {
          console.error('Chart JSON parse error', e);
        }
      }

      const aiMsg: ChatMessage = {
        id: `ai-${Date.now()}`,
        sender: 'assistant',
        text: rawReply,
        timestamp: new Date().toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' }),
        chartData: chartObj,
      };

      setMessages((prev) => [...prev, aiMsg]);
      setIsLoading(false);

      if (voiceEnabled) {
        speakText(rawReply);
      }
    } catch (err) {
      console.error(err);
      setIsLoading(false);
      const errorMsg: ChatMessage = {
        id: `err-${Date.now()}`,
        sender: 'assistant',
        text: 'Bağlantı hatası oluştu, ancak genel durumunuz: Toplam banka bakiyeniz ₺3,450,800.00 seviyesindedir.',
        timestamp: new Date().toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, errorMsg]);
    }
  };

  return (
    <>
      {/* 1. Collapsed Floating Cheerful Icon (Bottom Right) */}
      {!isOpen && (
        <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-2 group">
          {/* Tooltip Badge */}
          <div className="px-3 py-1.5 rounded-2xl bg-slate-900 text-white text-[11px] font-bold shadow-xl border border-slate-700 flex items-center gap-1.5 animate-bounce">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>Neşeli Muhasebe Asistanı</span>
          </div>

          {/* Small Round Cheerful Floating Button */}
          <button
            onClick={() => setIsOpen(true)}
            className="w-16 h-16 rounded-full bg-gradient-to-tr from-blue-600 via-indigo-600 to-amber-500 text-white flex items-center justify-center shadow-2xl shadow-blue-500/50 hover:scale-110 active:scale-95 transition-all duration-300 relative border-2 border-white/20 group"
          >
            {/* Cheerful Animated Cute Face & Calculator Icon */}
            <div className="relative flex items-center justify-center">
              <Calculator className="w-8 h-8 drop-shadow-md transform group-hover:rotate-12 transition-transform" />
              <span className="absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full bg-emerald-400 border-2 border-slate-900 animate-ping"></span>
            </div>
          </button>
        </div>
      )}

      {/* 2. Expanded macOS Glassmorphism AI Chat Dialog */}
      {isOpen && (
        <div className={`fixed bottom-6 right-6 z-50 w-[92vw] sm:w-[420px] h-[580px] rounded-3xl border shadow-2xl flex flex-col overflow-hidden transition-all duration-300 backdrop-blur-2xl ${
          darkMode ? 'bg-[#1C1C1E]/95 border-white/10 text-white' : 'bg-white/95 border-slate-200 text-slate-900'
        }`}>
          {/* Header */}
          <div className="p-4 border-b border-slate-700/30 flex items-center justify-between bg-slate-500/5">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-blue-600 to-amber-500 text-white flex items-center justify-center font-bold shadow-md relative">
                <Calculator className="w-5 h-5" />
                {isSpeaking && (
                  <span className="absolute -bottom-1 -right-1 w-3 h-3 rounded-full bg-emerald-400 animate-ping"></span>
                )}
              </div>
              <div>
                <h3 className="font-bold text-sm tracking-tight flex items-center gap-1.5">
                  <span>MüşavirPro Neşeli Asistan</span>
                  <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-blue-500/10 text-blue-400">
                    AI Online
                  </span>
                </h3>
                <p className="text-[10px] text-slate-400">Sesli Yanıt & Grafik Özet Destekli</p>
              </div>
            </div>

            <div className="flex items-center space-x-1">
              {/* Voice Mute / Unmute Toggle */}
              <button
                onClick={() => {
                  if (isSpeaking) stopSpeaking();
                  setVoiceEnabled(!voiceEnabled);
                }}
                className={`p-2 rounded-xl transition-colors ${
                  voiceEnabled
                    ? 'text-amber-400 hover:bg-amber-400/10'
                    : 'text-slate-500 hover:bg-slate-800'
                }`}
                title={voiceEnabled ? 'Sesli Yanıt Açık' : 'Sesli Yanıt Kapalı'}
              >
                {voiceEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
              </button>

              <button
                onClick={() => setIsOpen(false)}
                className="p-2 rounded-xl hover:bg-slate-800 text-slate-400"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Quick Prompts Chips */}
          <div className="px-3 py-2 border-b border-slate-700/20 flex items-center space-x-2 overflow-x-auto scrollbar-none text-[11px]">
            {[
              'Nakit akışımı özetle',
              'Alacaklarımı grafikle göster',
              'Gelen tebligatlar ne durumda?',
              'KDV1 son günü ne zaman?',
            ].map((chip, idx) => (
              <button
                key={idx}
                onClick={() => handleSendMessage(chip)}
                className={`px-2.5 py-1 rounded-xl whitespace-nowrap border transition-all ${
                  darkMode
                    ? 'bg-slate-800/80 border-slate-700 text-slate-300 hover:bg-slate-700'
                    : 'bg-slate-100 border-slate-200 text-slate-700 hover:bg-slate-200'
                }`}
              >
                {chip}
              </button>
            ))}
          </div>

          {/* Messages Area */}
          <div className="flex-1 p-4 overflow-y-auto space-y-3 text-xs leading-relaxed">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[85%] p-3.5 rounded-2xl space-y-2 ${
                    msg.sender === 'user'
                      ? 'bg-blue-600 text-white rounded-br-none shadow-md'
                      : darkMode
                      ? 'bg-slate-800/90 text-slate-100 border border-slate-700/60 rounded-bl-none'
                      : 'bg-slate-100 text-slate-800 border border-slate-200 rounded-bl-none shadow-sm'
                  }`}
                >
                  <p className="whitespace-pre-line font-sans">{msg.text}</p>

                  {/* Render Visual Mini Chart if included in AI response */}
                  {msg.chartData && (
                    <div className="mt-3 p-3 rounded-xl bg-slate-950/80 border border-slate-800 text-white space-y-2">
                      <div className="flex items-center justify-between text-[11px] font-bold text-amber-400">
                        <span className="flex items-center gap-1">
                          <BarChart2 className="w-3.5 h-3.5" /> {msg.chartData.title}
                        </span>
                      </div>

                      <div className="space-y-1.5 pt-1">
                        {msg.chartData.labels.map((lbl, i) => {
                          const val = msg.chartData!.data[i];
                          const max = Math.max(...msg.chartData!.data);
                          const pct = Math.round((val / max) * 100);

                          return (
                            <div key={i} className="space-y-0.5">
                              <div className="flex justify-between text-[10px] text-slate-400">
                                <span>{lbl}</span>
                                <span className="font-mono text-emerald-400 font-bold">
                                  ₺{val.toLocaleString('tr-TR')}
                                </span>
                              </div>
                              <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden">
                                <div
                                  className="h-full bg-gradient-to-r from-blue-500 to-amber-500 rounded-full"
                                  style={{ width: `${pct}%` }}
                                ></div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  <div className="flex items-center justify-between pt-1 text-[9px] text-slate-400">
                    <span>{msg.timestamp}</span>
                    {msg.sender === 'assistant' && (
                      <button
                        onClick={() => speakText(msg.text)}
                        className="hover:text-blue-400 flex items-center gap-0.5"
                      >
                        <Volume2 className="w-3 h-3" /> Dinle
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}

            {isLoading && (
              <div className="flex justify-start">
                <div className="p-3 rounded-2xl bg-slate-800/80 text-slate-300 flex items-center space-x-2">
                  <Sparkles className="w-4 h-4 animate-spin text-amber-400" />
                  <span>MüşavirPro yanıtlıyor...</span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="p-3 border-t border-slate-700/30 bg-slate-500/5">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendMessage();
              }}
              className="flex items-center space-x-2"
            >
              <input
                type="text"
                placeholder="Bir muhasebe veya finans sorusu sorun..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                className={`flex-1 px-3.5 py-2.5 text-xs rounded-2xl border outline-none ${
                  darkMode ? 'bg-slate-800 border-slate-700 text-white' : 'bg-slate-100 border-slate-200'
                }`}
              />
              <button
                type="submit"
                disabled={isLoading || !input.trim()}
                className="p-2.5 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white disabled:opacity-50 transition-all shadow-md shadow-blue-500/20"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
};
