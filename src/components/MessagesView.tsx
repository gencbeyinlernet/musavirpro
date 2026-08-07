import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Send, MessageCircle, Crown, UserCircle2, Search } from 'lucide-react';
import { AuthUser, ConversationSummary, DirectMessage } from '../types';

interface MessagesViewProps {
  token: string;
  user: AuthUser;
  darkMode: boolean;
}

const POLL_MS = 4000;

async function authedJson(url: string, token: string, init?: RequestInit) {
  const res = await fetch(url, {
    ...init,
    headers: { ...(init?.headers || {}), Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error((await res.json().catch(() => ({}))).error || 'İstek başarısız oldu.');
  return res.json();
}

const formatTime = (iso: string) =>
  new Date(iso).toLocaleString('tr-TR', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' });

const ThreadPane: React.FC<{
  token: string;
  user: AuthUser;
  withUser: string;
  darkMode: boolean;
  title: string;
  subtitle?: string;
}> = ({ token, user, withUser, darkMode, title, subtitle }) => {
  const [messages, setMessages] = useState<DirectMessage[]>([]);
  const [draft, setDraft] = useState('');
  const [sending, setSending] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  const load = useCallback(() => {
    authedJson(`/api/messages/thread?with=${encodeURIComponent(withUser)}`, token)
      .then((data) => setMessages(data.messages || []))
      .catch(() => {});
  }, [token, withUser]);

  useEffect(() => {
    load();
    const id = setInterval(load, POLL_MS);
    return () => clearInterval(id);
  }, [load]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages.length]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    const body = draft.trim();
    if (!body || sending) return;
    setSending(true);
    setDraft('');
    try {
      await authedJson('/api/messages', token, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(
          user.role === 'admin' ? { body, recipientUsername: withUser } : { body }
        ),
      });
      load();
    } catch {
      setDraft(body);
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="flex flex-col h-full min-h-0">
      <div className={`px-4 py-3 border-b flex items-center gap-2 flex-shrink-0 ${darkMode ? 'border-white/10' : 'border-slate-200'}`}>
        <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-accent to-indigo-500 flex items-center justify-center text-white flex-shrink-0">
          {title === 'Yönetici' ? <Crown className="w-4 h-4" /> : <UserCircle2 className="w-4 h-4" />}
        </div>
        <div className="min-w-0">
          <p className="text-sm font-semibold truncate">{title}</p>
          {subtitle && <p className="text-[11px] text-slate-400 truncate">{subtitle}</p>}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto scroll-touch px-4 py-4 space-y-3 min-h-0">
        {messages.length === 0 && (
          <p className="text-center text-xs text-slate-400 mt-8">Henüz mesaj yok. İlk mesajı gönderin.</p>
        )}
        {messages.map((m) => {
          const mine = m.sender_username === user.username;
          return (
            <div key={m.id} className={`flex ${mine ? 'justify-end' : 'justify-start'}`}>
              <div
                className={`max-w-[78%] sm:max-w-[65%] px-3.5 py-2 rounded-2xl text-sm leading-snug ${
                  mine
                    ? 'bg-accent text-white rounded-br-md'
                    : darkMode
                    ? 'bg-white/10 text-slate-100 rounded-bl-md'
                    : 'bg-slate-100 text-slate-800 rounded-bl-md'
                }`}
              >
                <p className="whitespace-pre-wrap break-words">{m.body}</p>
                <p className={`text-[10px] mt-1 ${mine ? 'text-white/70' : 'text-slate-400'}`}>{formatTime(m.created_at)}</p>
              </div>
            </div>
          );
        })}
        <div ref={bottomRef} />
      </div>

      <form onSubmit={handleSend} className={`p-3 border-t flex items-center gap-2 flex-shrink-0 ${darkMode ? 'border-white/10' : 'border-slate-200'}`}>
        <input
          type="text"
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          placeholder="Mesajınızı yazın…"
          className={`flex-1 px-3.5 py-2.5 text-sm rounded-xl border outline-none transition-all focus:ring-2 focus:ring-accent/30 ${
            darkMode
              ? 'bg-slate-800/60 border-slate-700/60 text-slate-100 focus:border-accent'
              : 'bg-slate-50 border-slate-200 text-slate-900 focus:border-accent'
          }`}
        />
        <button
          type="submit"
          disabled={!draft.trim() || sending}
          className="p-2.5 rounded-xl bg-accent text-white disabled:opacity-40 active:scale-95 transition-all flex-shrink-0"
        >
          <Send className="w-4 h-4" />
        </button>
      </form>
    </div>
  );
};

export const MessagesView: React.FC<MessagesViewProps> = ({ token, user, darkMode }) => {
  if (user.role === 'member') {
    return (
      <div className="space-y-4 pb-6 h-[calc(100vh-11rem)] lg:h-[calc(100vh-9rem)] flex flex-col">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-accent uppercase tracking-wider mb-1">
            <MessageCircle className="w-3.5 h-3.5" />
            <span>Mesajlar</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight">Yöneticiyle İletişim</h2>
        </div>
        <div className={`flex-1 min-h-0 rounded-3xl border overflow-hidden ${darkMode ? 'border-white/10 bg-white/[0.02]' : 'border-slate-200 bg-white'}`}>
          <ThreadPane token={token} user={user} withUser="novarge" darkMode={darkMode} title="Yönetici" subtitle="novarge" />
        </div>
      </div>
    );
  }

  return <AdminInbox token={token} user={user} darkMode={darkMode} />;
};

const AdminInbox: React.FC<MessagesViewProps> = ({ token, user, darkMode }) => {
  const [conversations, setConversations] = useState<ConversationSummary[]>([]);
  const [selected, setSelected] = useState<string | null>(null);
  const [search, setSearch] = useState('');

  const loadConversations = useCallback(() => {
    authedJson('/api/messages/conversations', token)
      .then((data) => {
        setConversations(data.conversations || []);
        setSelected((prev) => prev || data.conversations?.[0]?.username || null);
      })
      .catch(() => {});
  }, [token]);

  useEffect(() => {
    loadConversations();
    const id = setInterval(loadConversations, POLL_MS);
    return () => clearInterval(id);
  }, [loadConversations]);

  const filtered = conversations.filter((c) => c.username.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="space-y-4 pb-6 h-[calc(100vh-11rem)] lg:h-[calc(100vh-9rem)] flex flex-col">
      <div>
        <div className="flex items-center gap-2 text-xs font-semibold text-accent uppercase tracking-wider mb-1">
          <MessageCircle className="w-3.5 h-3.5" />
          <span>Mesajlar</span>
        </div>
        <h2 className="text-xl sm:text-2xl font-bold tracking-tight">Üye Mesajları</h2>
      </div>

      <div className={`flex-1 min-h-0 rounded-3xl border overflow-hidden grid grid-cols-1 ${
        selected ? 'lg:grid-cols-[280px_1fr]' : 'lg:grid-cols-[280px_1fr]'
      } ${darkMode ? 'border-white/10 bg-white/[0.02]' : 'border-slate-200 bg-white'}`}>
        {/* Conversation list */}
        <div className={`flex flex-col min-h-0 border-b lg:border-b-0 lg:border-r ${darkMode ? 'border-white/10' : 'border-slate-200'} ${selected ? 'hidden lg:flex' : 'flex'}`}>
          <div className={`p-3 border-b flex-shrink-0 ${darkMode ? 'border-white/10' : 'border-slate-200'}`}>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Üye ara…"
                className={`w-full pl-9 pr-3 py-2 text-xs rounded-xl border outline-none ${
                  darkMode ? 'bg-slate-800/60 border-slate-700/60 text-slate-200' : 'bg-slate-50 border-slate-200 text-slate-800'
                }`}
              />
            </div>
          </div>
          <div className="flex-1 overflow-y-auto scroll-touch">
            {filtered.length === 0 && (
              <p className="text-center text-xs text-slate-400 mt-8 px-4">Henüz mesaj gönderen üye yok.</p>
            )}
            {filtered.map((c) => (
              <button
                key={c.username}
                onClick={() => setSelected(c.username)}
                className={`w-full flex items-center gap-3 px-4 py-3 text-left transition-colors ${
                  selected === c.username
                    ? darkMode ? 'bg-accent/15' : 'bg-accent/10'
                    : darkMode ? 'hover:bg-white/5' : 'hover:bg-slate-50'
                }`}
              >
                <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-slate-500 to-slate-600 flex items-center justify-center text-white flex-shrink-0">
                  <UserCircle2 className="w-4 h-4" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-xs font-semibold truncate">{c.username}</p>
                    {c.unread > 0 && (
                      <span className="w-4 h-4 rounded-full bg-red-500 text-white text-[9px] font-bold flex items-center justify-center flex-shrink-0">
                        {c.unread}
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-slate-400 truncate">{c.lastMessage}</p>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Thread */}
        <div className={`min-h-0 ${selected ? 'flex' : 'hidden lg:flex'} flex-col`}>
          {selected ? (
            <>
              <button
                onClick={() => setSelected(null)}
                className={`lg:hidden text-left px-4 py-2 text-xs font-medium border-b flex-shrink-0 ${
                  darkMode ? 'border-white/10 text-slate-300' : 'border-slate-200 text-slate-600'
                }`}
              >
                ← Üyelere dön
              </button>
              <ThreadPane
                token={token}
                user={user}
                withUser={selected}
                darkMode={darkMode}
                title={selected}
                subtitle="Üye"
              />
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center text-sm text-slate-400">
              Görüntülemek için bir üye seçin.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
