import express from "express";
import crypto from "crypto";
import { createClient } from "@supabase/supabase-js";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

// Shared Express app with every API route. Exported (not `.listen()`ed) so it
// can be used two ways:
//   - server.ts wraps it with Vite/static serving + app.listen() for a
//     traditional persistent-server deployment (Render, Railway, a VPS...).
//   - api/[...path].ts exports it directly as a Vercel serverless function.
// Because Vercel functions are stateless/ephemeral, sessions are kept in
// Supabase (a `sessions` table) rather than an in-memory Map.
export const app = express();

app.use(express.json({ limit: "10mb" }));

// ---------------------------------------------------------------------------
// Auth: fixed admin account ("novarge") + self-registered members. Users,
// sessions, the admin activity feed, and member <-> admin messages are all
// stored in Supabase (see sql.txt for the schema).
// ---------------------------------------------------------------------------
const ADMIN_USERNAME = "novarge";
const ADMIN_PASSWORD = "123456";

if (!process.env.SUPABASE_URL || !process.env.SUPABASE_ANON_KEY) {
  console.warn("SUPABASE_URL / SUPABASE_ANON_KEY tanımlı değil. Auth & mesajlaşma özellikleri çalışmayacak.");
}

const supabase = createClient(process.env.SUPABASE_URL || "", process.env.SUPABASE_ANON_KEY || "");

interface StoredUser {
  username: string;
  password_salt: string;
  password_hash: string;
}

interface SessionUser {
  username: string;
  role: "admin" | "member";
}

function hashPassword(password: string, salt: string): string {
  return crypto.scryptSync(password, salt, 64).toString("hex");
}

async function findUserByUsername(username: string): Promise<StoredUser | null> {
  const { data, error } = await supabase
    .from("users")
    .select("username, password_salt, password_hash")
    .ilike("username", username)
    .maybeSingle();
  if (error) throw new Error(error.message);
  return data;
}

async function appendActivity(user: SessionUser, action: string, details?: string) {
  const { error } = await supabase
    .from("activity_log")
    .insert({ username: user.username, role: user.role, action, details });
  if (error) console.error("Activity log insert error:", error.message);
}

// Sessions live in Supabase so any serverless instance can validate a token,
// not just the one that issued it.
async function createSession(user: SessionUser): Promise<string> {
  const token = crypto.randomUUID();
  const { error } = await supabase
    .from("sessions")
    .insert({ token, username: user.username, role: user.role });
  if (error) throw new Error(error.message);
  return token;
}

async function getSessionUser(req: express.Request): Promise<SessionUser | null> {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith("Bearer ")) return null;
  const token = authHeader.slice(7);
  const { data } = await supabase
    .from("sessions")
    .select("username, role")
    .eq("token", token)
    .maybeSingle();
  return data ? { username: data.username, role: data.role } : null;
}

async function destroySession(token: string) {
  await supabase.from("sessions").delete().eq("token", token);
}

app.post("/api/auth/register", async (req, res) => {
  try {
    const username = String(req.body?.username || "").trim();
    const password = String(req.body?.password || "");

    if (username.length < 3 || password.length < 4) {
      return res.status(400).json({ error: "Kullanıcı adı en az 3, şifre en az 4 karakter olmalıdır." });
    }
    if (username.toLowerCase() === ADMIN_USERNAME) {
      return res.status(400).json({ error: "Bu kullanıcı adı kullanılamaz." });
    }

    if (await findUserByUsername(username)) {
      return res.status(409).json({ error: "Bu kullanıcı adı zaten alınmış." });
    }

    const salt = crypto.randomBytes(16).toString("hex");
    const hash = hashPassword(password, salt);
    const { error } = await supabase
      .from("users")
      .insert({ username, password_salt: salt, password_hash: hash });
    if (error) throw new Error(error.message);

    const user: SessionUser = { username, role: "member" };
    const token = await createSession(user);
    await appendActivity(user, "Kayıt oldu");

    res.status(201).json({ token, user });
  } catch (err: any) {
    console.error("Register error:", err);
    res.status(500).json({ error: "Kayıt sırasında bir hata oluştu: " + err.message });
  }
});

app.post("/api/auth/login", async (req, res) => {
  try {
    const username = String(req.body?.username || "").trim();
    const password = String(req.body?.password || "");

    let user: SessionUser | null = null;

    if (username.toLowerCase() === ADMIN_USERNAME) {
      if (password === ADMIN_PASSWORD) {
        user = { username: ADMIN_USERNAME, role: "admin" };
      }
    } else {
      const stored = await findUserByUsername(username);
      if (stored && hashPassword(password, stored.password_salt) === stored.password_hash) {
        user = { username: stored.username, role: "member" };
      }
    }

    if (!user) {
      return res.status(401).json({ error: "Kullanıcı adı veya şifre hatalı." });
    }

    const token = await createSession(user);
    await appendActivity(user, "Giriş yaptı");

    res.json({ token, user });
  } catch (err: any) {
    console.error("Login error:", err);
    res.status(500).json({ error: "Giriş sırasında bir hata oluştu: " + err.message });
  }
});

app.get("/api/auth/me", async (req, res) => {
  const user = await getSessionUser(req);
  if (!user) return res.status(401).json({ error: "Oturum bulunamadı." });
  res.json({ user });
});

app.post("/api/auth/logout", async (req, res) => {
  const authHeader = req.headers.authorization;
  const token = authHeader?.startsWith("Bearer ") ? authHeader.slice(7) : null;
  if (token) {
    const user = await getSessionUser(req);
    if (user) await appendActivity(user, "Çıkış yaptı");
    await destroySession(token);
  }
  res.status(204).end();
});

// Members log their own notable actions here; the admin reads the full feed.
app.post("/api/activity", async (req, res) => {
  const user = await getSessionUser(req);
  if (!user) return res.status(401).json({ error: "Oturum bulunamadı." });

  const action = String(req.body?.action || "").trim();
  if (!action) return res.status(400).json({ error: "action alanı zorunludur." });
  const details = req.body?.details ? String(req.body.details) : undefined;

  await appendActivity(user, action, details);
  res.status(201).end();
});

app.get("/api/activity", async (req, res) => {
  const user = await getSessionUser(req);
  if (!user) return res.status(401).json({ error: "Oturum bulunamadı." });
  if (user.role !== "admin") return res.status(403).json({ error: "Bu alana erişim yetkiniz yok." });

  const { data, error } = await supabase
    .from("activity_log")
    .select("id, username, role, action, details, created_at")
    .order("created_at", { ascending: false })
    .limit(500);
  if (error) return res.status(500).json({ error: error.message });

  const entries = (data || []).map((e) => ({
    id: e.id,
    username: e.username,
    role: e.role,
    action: e.action,
    details: e.details ?? undefined,
    timestamp: e.created_at,
  }));
  res.json({ entries });
});

// ---------------------------------------------------------------------------
// Messaging: members can message the admin ("novarge") directly; the admin
// can reply to any member. Every member's thread is only ever with the admin.
// ---------------------------------------------------------------------------
app.post("/api/messages", async (req, res) => {
  const user = await getSessionUser(req);
  if (!user) return res.status(401).json({ error: "Oturum bulunamadı." });

  const body = String(req.body?.body || "").trim();
  if (!body) return res.status(400).json({ error: "Mesaj boş olamaz." });

  let recipientUsername: string;
  if (user.role === "member") {
    recipientUsername = ADMIN_USERNAME;
  } else {
    recipientUsername = String(req.body?.recipientUsername || "").trim();
    if (!recipientUsername) {
      return res.status(400).json({ error: "recipientUsername alanı zorunludur." });
    }
  }

  const { data, error } = await supabase
    .from("messages")
    .insert({
      sender_username: user.username,
      sender_role: user.role,
      recipient_username: recipientUsername,
      body,
    })
    .select()
    .single();
  if (error) return res.status(500).json({ error: error.message });

  await appendActivity(user, "Mesaj gönderdi", `→ ${recipientUsername}`);
  res.status(201).json({ message: data });
});

// Conversation with a single counterpart. Members are always talking to the
// admin; the admin passes ?with=<memberUsername>.
app.get("/api/messages/thread", async (req, res) => {
  const user = await getSessionUser(req);
  if (!user) return res.status(401).json({ error: "Oturum bulunamadı." });

  const withUser = user.role === "member" ? ADMIN_USERNAME : String(req.query.with || "").trim();
  if (!withUser) return res.status(400).json({ error: "with parametresi zorunludur." });

  const { data, error } = await supabase
    .from("messages")
    .select("id, sender_username, sender_role, recipient_username, body, is_read, created_at")
    .or(
      `and(sender_username.eq.${user.username},recipient_username.eq.${withUser}),and(sender_username.eq.${withUser},recipient_username.eq.${user.username})`
    )
    .order("created_at", { ascending: true });
  if (error) return res.status(500).json({ error: error.message });

  // Mark incoming messages in this thread as read.
  await supabase
    .from("messages")
    .update({ is_read: true })
    .eq("recipient_username", user.username)
    .eq("sender_username", withUser)
    .eq("is_read", false);

  res.json({ messages: data || [] });
});

// Admin-only: list every member who has an active conversation, with a
// preview of the last message and an unread count.
app.get("/api/messages/conversations", async (req, res) => {
  const user = await getSessionUser(req);
  if (!user) return res.status(401).json({ error: "Oturum bulunamadı." });
  if (user.role !== "admin") return res.status(403).json({ error: "Bu alana erişim yetkiniz yok." });

  const { data, error } = await supabase
    .from("messages")
    .select("sender_username, sender_role, recipient_username, body, is_read, created_at")
    .or(`sender_username.eq.${ADMIN_USERNAME},recipient_username.eq.${ADMIN_USERNAME}`)
    .order("created_at", { ascending: true });
  if (error) return res.status(500).json({ error: error.message });

  const byMember = new Map<string, { lastMessage: string; lastAt: string; unread: number }>();
  for (const m of data || []) {
    const member = m.sender_username === ADMIN_USERNAME ? m.recipient_username : m.sender_username;
    const entry = byMember.get(member) || { lastMessage: "", lastAt: "", unread: 0 };
    entry.lastMessage = m.body;
    entry.lastAt = m.created_at;
    if (m.recipient_username === ADMIN_USERNAME && !m.is_read) entry.unread += 1;
    byMember.set(member, entry);
  }

  const conversations = Array.from(byMember.entries())
    .map(([username, info]) => ({ username, ...info }))
    .sort((a, b) => (a.lastAt < b.lastAt ? 1 : -1));

  res.json({ conversations });
});

// Server-side Gemini AI setup
const getGeminiClient = () => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) return null;
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        "User-Agent": "aistudio-build",
      },
    },
  });
};

// API Endpoint for AI Accountant Assistant
app.post("/api/assistant", async (req, res) => {
  try {
    const { message, context } = req.body;
    if (!message) {
      return res.status(400).json({ error: "Mesaj boş olamaz." });
    }

    const ai = getGeminiClient();

    const systemInstruction = `Sen Türkiye'de görev yapan son derece deneyimli, samimi, yardımsever, neşeli ve net ifadeler kullanan uzman bir Mali Müşavir AI Asistanısın (Adın: MüşavirPro Asistanı).

Görevin:
1. Kullanıcıya (Muhasebeci / Mali Müşavir) mevzuat, Vergi Usul Kanunu (VUK), KDV, Gelir Vergi, Kurumlar Vergisi, SGK teşvikleri, Resmi Gazete kararları, GİB duyuruları ve genel finansal durumlar hakkında net, güncel ve özlü cevaplar vermek.
2. Kullanıcının mevcut finansal verileri (Nakit akışı, müşteri borçları, banka bakiyeleri, tebligatlar) ile ilgili sorularını yanıtlamak.
3. Yanıtlarında gereksiz uzun cümlelerden kaçın, içten, nazik ve profesyonel bir dil kullan.
4. Eğer kullanıcı verileri özetlemeni veya grafikle göstermeni isterse, yanıtın sonuna özel bir JSON blok formatı ekleyebilirsin:
   <<<CHART_DATA:{"type":"bar"|"line"|"pie","title":"Başlık","labels":["Etiket1","Etiket2"],"data":[10,20]}>>>

Mevcut Sistem Durum Özeti:
${context ? JSON.stringify(context, null, 2) : "Standart muhasebe ortamı aktif."}

Cevabını Türkçe olarak, anlaşılır ve yapıcı bir tonda ver.`;

    if (ai) {
      const response = await ai.models.generateContent({
        model: "gemini-3.6-flash",
        contents: [
          {
            role: "user",
            parts: [{ text: `${systemInstruction}\n\nKullanıcı Sorusu: ${message}` }],
          },
        ],
      });

      const replyText = response.text || "Üzgünüm, şu an yanıt oluşturamadım.";
      return res.json({ reply: replyText });
    } else {
      // Intelligent fallback responses when API Key is not present
      let fallbackReply = "Harika bir soru! Mevcut verilerinize göz attım: ";
      const lower = message.toLowerCase();

      if (lower.includes("nakit") || lower.includes("akış") || lower.includes("banka")) {
        fallbackReply = `Bugün itibarıyla toplam banka bakiyeniz **₺3,450,800.00** seviyesindedir. En yüksek bakiye Garanti BBVA hesabınızda (₺1.2M) bulunuyor. Günlük tahsilatınız ₺185,000, planlanan ödemeleriniz ise ₺92,400 tutarındadır.\n\n<<<CHART_DATA:{"type":"bar","title":"Günün Banka Bakiyeleri (₺)","labels":["Garanti","İş Bankası","Akbank","Yapı Kredi","Vakıfbank"],"data":[1250000,850000,620000,430000,300800]}>>>`;
      } else if (lower.includes("alacak") || lower.includes("borç") || lower.includes("müşteri") || lower.includes("bakiye")) {
        fallbackReply = `Toplam vadesi geçmiş müşteri alacağınız **₺485,200.00** tutarındadır. En yüksek alacağınız Yılmaz Dış Ticaret (₺145,000) ve TeknoAvrasya A.Ş. (₺112,000) firmalarındadır. Müşteriler sayfasından tek tıkla hatırlatma e-postası gönderebilirsiniz.`;
      } else if (lower.includes("tebligat") || lower.includes("gib") || lower.includes("sgk")) {
        fallbackReply = `Gelen tebligatlar kutunuzda toplam **3 yeni tebligat** bulunmaktadır:\n1. GİB - KDV Matrah Artırımı İnceleme Yazısı (Son 4 Gün)\n2. SGK - 2026/05 Dönemi Prim Fark Tahakkuku (Son 8 Gün)\n3. Diğer - Belediye Çevre Temizlik Vergisi Bildirimi.\n\nLütfen süresi yaklaşan GİB tebligatını öncelikle inceleyiniz.`;
      } else if (lower.includes("takvim") || lower.includes("vergi") || lower.includes("beyanname") || lower.includes("kdv")) {
        fallbackReply = `Yaklaşan Mali Takvim Bildirimleri:\n• **26 Ağustos**: KDV1 Beyannamesi Verilme ve Ödeme Son Günü\n• **27 Ağustos**: Muhtasar ve Prim Hizmet Beyannamesi Son Günü\n• **31 Ağustos**: SGK Prim Ödemeleri Son Günü.`;
      } else if (lower.includes("haber") || lower.includes("resmi gazete") || lower.includes("enflasyon")) {
        fallbackReply = `Resmi Gazete ve Mevzuat Haber Özeti:\n• **Enflasyon Düzeltmesi**: VUK Genel Tebliği uyarınca 2026 2. Geçici Vergi döneminde amortismana tabi iktisadi kıymetlerin katsayı güncellemesi yapıldı.\n• **SGK Teşvik**: 6111 Sayılı Genç İstihdam Teşviki süresi uzatıldı.`;
      } else {
        fallbackReply = `Size muhasebe, mevzuat, vergi takvimi, banka bakiyeleri veya müşteri alacaklarınız konusunda her an yardımcı olmaya hazırım! Dilerseniz sağ taraftaki verileri sizin için detaylıca özetleyebilirim.`;
      }

      return res.json({ reply: fallbackReply });
    }
  } catch (err: any) {
    console.error("Assistant API Error:", err);
    return res.status(500).json({ error: "Asistan yanıt verirken bir hata oluştu: " + err.message });
  }
});

// TCMB (Türkiye Cumhuriyet Merkez Bankası) live exchange rates
const TCMB_CURRENCY_NAMES: Record<string, string> = {
  USD: "ABD Doları",
  EUR: "Euro",
  GBP: "İngiliz Sterlini",
};

interface TcmbParsedRate {
  buying: number;
  selling: number;
}

function parseTcmbRates(xml: string): Record<string, TcmbParsedRate> {
  const rates: Record<string, TcmbParsedRate> = {};
  const blocks = xml.match(/<Currency\b[^>]*>[\s\S]*?<\/Currency>/g) || [];
  for (const block of blocks) {
    const code = block.match(/Kod="([A-Z]+)"/)?.[1];
    const buying = parseFloat(block.match(/<ForexBuying>([^<]*)<\/ForexBuying>/)?.[1] || "");
    const selling = parseFloat(block.match(/<ForexSelling>([^<]*)<\/ForexSelling>/)?.[1] || "");
    if (code && Number.isFinite(buying) && Number.isFinite(selling)) {
      rates[code] = { buying, selling };
    }
  }
  return rates;
}

function tcmbDateSuffix(date: Date): string {
  const dd = String(date.getDate()).padStart(2, "0");
  const mm = String(date.getMonth() + 1).padStart(2, "0");
  const yyyy = date.getFullYear();
  return `${dd}${mm}${yyyy}`;
}

async function fetchTcmbXml(daysAgo: number): Promise<string> {
  const url =
    daysAgo === 0
      ? "https://www.tcmb.gov.tr/kurlar/today.xml"
      : (() => {
          const d = new Date();
          d.setDate(d.getDate() - daysAgo);
          const suffix = tcmbDateSuffix(d);
          const yyyymm = suffix.slice(4) + suffix.slice(2, 4);
          return `https://www.tcmb.gov.tr/kurlar/${yyyymm}/${suffix}.xml`;
        })();
  const response = await fetch(url);
  if (!response.ok) throw new Error(`TCMB isteği başarısız: ${response.status}`);
  return response.text();
}

let exchangeRateCache: { rates: any[]; asOf: string | null; fetchedAt: number } | null = null;
const EXCHANGE_RATE_CACHE_TTL_MS = 60 * 60 * 1000; // 1 saat

app.get("/api/exchange-rates", async (_req, res) => {
  if (exchangeRateCache && Date.now() - exchangeRateCache.fetchedAt < EXCHANGE_RATE_CACHE_TTL_MS) {
    return res.json({ rates: exchangeRateCache.rates, asOf: exchangeRateCache.asOf });
  }

  try {
    const todayXml = await fetchTcmbXml(0);
    const todayRates = parseTcmbRates(todayXml);
    const asOf = todayXml.match(/Tarih="([^"]*)"/)?.[1] || null;

    // Bir önceki iş gününü bulmayı dene (değişim yüzdesi için)
    let prevRates: Record<string, TcmbParsedRate> = {};
    for (let i = 1; i <= 5; i++) {
      try {
        prevRates = parseTcmbRates(await fetchTcmbXml(i));
        if (Object.keys(prevRates).length > 0) break;
      } catch {
        // hafta sonu / resmi tatil, bir önceki günü dene
      }
    }

    const rates = (["USD", "EUR", "GBP"] as const)
      .filter((code) => todayRates[code])
      .map((code) => {
        const current = todayRates[code];
        const previous = prevRates[code];
        const changePercent = previous
          ? Number((((current.selling - previous.selling) / previous.selling) * 100).toFixed(2))
          : 0;
        return {
          code,
          name: TCMB_CURRENCY_NAMES[code],
          buying: current.buying,
          selling: current.selling,
          changePercent,
          trend: changePercent > 0 ? "up" : changePercent < 0 ? "down" : "flat",
        };
      });

    exchangeRateCache = { rates, asOf, fetchedAt: Date.now() };
    res.json({ rates, asOf });
  } catch (err: any) {
    console.error("Exchange rate fetch error:", err);
    if (exchangeRateCache) {
      return res.json({ rates: exchangeRateCache.rates, asOf: exchangeRateCache.asOf, stale: true });
    }
    res.status(502).json({ error: "Kur bilgisi alınamadı: " + err.message });
  }
});
