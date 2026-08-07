export type TebligatSource = 'GİB' | 'SGK' | 'DİĞER';
export type TebligatStatus = 'unread' | 'pending' | 'urgent' | 'completed';

export interface TebligatItem {
  id: string;
  source: TebligatSource;
  title: string;
  documentNo: string;
  date: string;
  deadlineDate: string;
  daysLeft: number;
  status: TebligatStatus;
  summary: string;
  clientName: string;
  clientVkn: string;
  pdfUrl?: string;
}

export type CalendarCategory = 'KDV' | 'Muhtasar' | 'SGK' | 'Geçici Vergi' | 'Kurumlar' | 'Damga' | 'Diğer';

export interface CalendarEvent {
  id: string;
  title: string;
  code: string;
  category: CalendarCategory;
  dueDate: string;
  daysLeft: number;
  status: 'pending' | 'urgent' | 'completed';
  description: string;
  affectedClientsCount: number;
}

export interface BankAccount {
  id: string;
  bankName: string;
  accountNumber: string;
  iban: string;
  currency: 'TRY' | 'USD' | 'EUR';
  balance: number;
  availableBalance: number;
  color: string;
  logoText: string;
}

export interface CashFlowTransaction {
  id: string;
  type: 'inflow' | 'outflow';
  category: string;
  amount: number;
  currency: 'TRY' | 'USD' | 'EUR';
  date: string;
  partyName: string;
  description: string;
  status: 'completed' | 'scheduled' | 'overdue';
}

export interface ClientBalance {
  id: string;
  name: string;
  vkn: string;
  taxOffice: string;
  totalBalance: number;
  overdueBalance: number;
  lastTransactionDate: string;
  email: string;
  phone: string;
  contactPerson: string;
  riskStatus: 'normal' | 'warning' | 'critical';
}

export interface ProposalItem {
  id: string;
  serviceName: string;
  description: string;
  quantity: number;
  unitPrice: number;
  vatRate: number; // 20, 10, 0
  discountPercent: number;
}

export interface ProposalTemplate {
  id: string;
  title: string;
  description: string;
  defaultNotes: string;
  defaultItems: Omit<ProposalItem, 'id'>[];
}

export interface Proposal {
  id: string;
  proposalNo: string;
  clientName: string;
  clientVkn: string;
  clientEmail: string;
  date: string;
  validUntil: string;
  items: ProposalItem[];
  templateId: string;
  notes: string;
  status: 'draft' | 'sent' | 'accepted' | 'rejected';
  totalNet: number;
  totalVat: number;
  totalAmount: number;
}

export interface OfficialGazetteNews {
  id: string;
  title: string;
  source: 'Resmi Gazete' | 'GİB Sirküler' | 'SGK Duyuru' | 'TÜRMOB';
  date: string;
  publishNo?: string;
  summary: string;
  content: string;
  category: string;
  isRead: boolean;
  link?: string;
}

export interface ExchangeRate {
  code: 'USD' | 'EUR' | 'GBP' | 'GAU';
  name: string;
  buying: number;
  selling: number;
  changePercent: number;
  trend: 'up' | 'down' | 'flat';
}

export type UserRole = 'admin' | 'member';

export interface AuthUser {
  username: string;
  role: UserRole;
}

export interface ActivityEntry {
  id: string;
  username: string;
  role: UserRole;
  action: string;
  details?: string;
  timestamp: string;
}

export interface DirectMessage {
  id: string;
  sender_username: string;
  sender_role: UserRole;
  recipient_username: string;
  body: string;
  is_read: boolean;
  created_at: string;
}

export interface ConversationSummary {
  username: string;
  lastMessage: string;
  lastAt: string;
  unread: number;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
  chartData?: {
    type: 'bar' | 'line' | 'pie';
    title: string;
    labels: string[];
    data: number[];
  };
}
