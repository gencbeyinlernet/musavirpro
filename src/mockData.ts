import {
  TebligatItem,
  CalendarEvent,
  BankAccount,
  CashFlowTransaction,
  ClientBalance,
  ProposalTemplate,
  Proposal,
  OfficialGazetteNews,
  ExchangeRate
} from './types';

export const INITIAL_TEBLIGATLAR: TebligatItem[] = [
  {
    id: 'TEB-2026-001',
    source: 'GİB',
    title: 'KDV Matrah Artırımı İnceleme ve Bilgi İstenim Yazısı',
    documentNo: '20260807-GİB-88392',
    date: '04.08.2026',
    deadlineDate: '19.08.2026',
    daysLeft: 12,
    status: 'urgent',
    summary: '2025 yılı 3. geçici vergi dönemi KDV beyannameleri matrah farkına ilişkin açıklama istenmektedir.',
    clientName: 'Yılmaz Dış Ticaret Ltd. Şti.',
    clientVkn: '9840192837',
    pdfUrl: '#'
  },
  {
    id: 'TEB-2026-002',
    source: 'SGK',
    title: '2026/04 Dönemi Ek Bildirge ve Prim Farkı Tahakkuku',
    documentNo: 'SGK-34-884102',
    date: '02.08.2026',
    deadlineDate: '17.08.2026',
    daysLeft: 10,
    status: 'pending',
    summary: 'İmalat sektörü 5510 teşvik indirimi uyumsuzluğu sebebiyle ₺14,250.00 fark tahakkuk ettirilmiştir.',
    clientName: 'Anadolu Lojistik A.Ş.',
    clientVkn: '1029384756',
    pdfUrl: '#'
  },
  {
    id: 'TEB-2026-003',
    source: 'GİB',
    title: 'E-Fatura Uyumsuzluk ve İptal/İtiraz Portalı Uyarısı',
    documentNo: '20260801-GİB-10293',
    date: '01.08.2026',
    deadlineDate: '16.08.2026',
    daysLeft: 9,
    status: 'unread',
    summary: 'Haziran 2026 döneminde harici yolla reddedilen 3 adet e-faturanın BA/BS formları ile mutabakatsızlığı.',
    clientName: 'Ege Teknoloji Yazılım Ltd. Şti.',
    clientVkn: '3291048571',
    pdfUrl: '#'
  },
  {
    id: 'TEB-2026-004',
    source: 'DİĞER',
    title: 'Kadıköy Belediyesi Çevre Temizlik ve İlan Reklam Vergisi Tahakkuku',
    documentNo: 'BELD-2026-9921',
    date: '28.07.2026',
    deadlineDate: '28.08.2026',
    daysLeft: 21,
    status: 'pending',
    summary: '2026 yılı 2. taksit çevre temizlik ve tabela ilan reklam vergisi ödeme emri.',
    clientName: 'Marmara Gıda San. Tic. Ltd. Şti.',
    clientVkn: '5540192831',
    pdfUrl: '#'
  },
  {
    id: 'TEB-2026-005',
    source: 'GİB',
    title: '2025 Kurumlar Vergisi Beyannamesi Düzeltme İstem Yazısı',
    documentNo: '20260725-GİB-44102',
    date: '25.07.2026',
    deadlineDate: '10.08.2026',
    daysLeft: 3,
    status: 'urgent',
    summary: 'Ar-Ge indirimi istisnaları tablosundaki tutarların Sanayi Bakanlığı portal verileriyle doğrulanması.',
    clientName: 'TeknoAvrasya Ar-Ge A.Ş.',
    clientVkn: '7729104832',
    pdfUrl: '#'
  },
  {
    id: 'TEB-2026-006',
    source: 'SGK',
    title: 'İş Sağlığı ve Güvenliği Hizmet Alım Denetim Formu',
    documentNo: 'SGK-İSG-2026-112',
    date: '20.07.2026',
    deadlineDate: '20.08.2026',
    daysLeft: 13,
    status: 'completed',
    summary: 'Tehlikeli sınıftaki işyerleri için OSGB sözleşmelerinin sisteme entegrasyonu onaylanmıştır.',
    clientName: 'Boğaziçi İnşaat Taahhüt Ltd. Şti.',
    clientVkn: '8830192847',
    pdfUrl: '#'
  }
];

export const INITIAL_CALENDAR_EVENTS: CalendarEvent[] = [
  {
    id: 'CAL-001',
    title: 'KDV1 Beyannamesi (2026/07 Dönemi)',
    code: 'KDV-1001',
    category: 'KDV',
    dueDate: '2026-08-26',
    daysLeft: 19,
    status: 'urgent',
    description: 'Temmuz 2026 dönemine ait Katma Değer Vergisi beyannamesinin verilmesi ve ödenmesi.',
    affectedClientsCount: 42
  },
  {
    id: 'CAL-002',
    title: 'Muhtasar ve Prim Hizmet Beyannamesi (2026/07)',
    code: 'MUH-1003',
    category: 'Muhtasar',
    dueDate: '2026-08-27',
    daysLeft: 20,
    status: 'pending',
    description: 'Aylık muhtasar ve SGK sigortalı hizmet listesinin ortak beyan edilmesi.',
    affectedClientsCount: 38
  },
  {
    id: 'CAL-003',
    title: '2026/02. Dönem Geçici Vergi Beyannamesi',
    code: 'GÇV-1032',
    category: 'Geçici Vergi',
    dueDate: '2026-08-17',
    daysLeft: 10,
    status: 'urgent',
    description: 'Nisan-Mayıs-Haziran 2026 dönemini kapsayan 2. Geçici Vergi Beyannamesi (Enflasyon düzeltmeli).',
    affectedClientsCount: 35
  },
  {
    id: 'CAL-004',
    title: 'SGK Temmuz 2026 Prim Ödemeleri',
    code: 'SGK-PRM',
    category: 'SGK',
    dueDate: '2026-08-31',
    daysLeft: 24,
    status: 'pending',
    description: 'Temmuz ayı çalışan sigorta primlerinin ve işveren payının ödenmesi.',
    affectedClientsCount: 40
  },
  {
    id: 'CAL-005',
    title: 'Form BA / BS Bildirim Formları',
    code: 'BABS-2026',
    category: 'Diğer',
    dueDate: '2026-08-31',
    daysLeft: 24,
    status: 'pending',
    description: '₺5.000 üzerindeki e-fatura kapsamı dışı mal ve hizmet alım/satım bildirimleri.',
    affectedClientsCount: 28
  },
  {
    id: 'CAL-006',
    title: 'Damga Vergisi Beyannamesi',
    code: 'DMG-9047',
    category: 'Damga',
    dueDate: '2026-08-20',
    daysLeft: 13,
    status: 'pending',
    description: 'Sürekli damga vergisi mükellefiyeti olan firmaların Temmuz sözleşmelerinin beyanı.',
    affectedClientsCount: 12
  }
];

export const INITIAL_BANK_ACCOUNTS: BankAccount[] = [
  {
    id: 'BANK-01',
    bankName: 'Garanti BBVA',
    accountNumber: '4491-928301',
    iban: 'TR42 0006 2000 4491 9283 0100 01',
    currency: 'TRY',
    balance: 1250000.00,
    availableBalance: 1250000.00,
    color: 'from-emerald-500 to-teal-700',
    logoText: 'GARANTİ'
  },
  {
    id: 'BANK-02',
    bankName: 'Türkiye İş Bankası',
    accountNumber: '1092-883920',
    iban: 'TR88 0006 4000 1092 8839 2000 01',
    currency: 'TRY',
    balance: 850000.00,
    availableBalance: 850000.00,
    color: 'from-blue-600 to-indigo-800',
    logoText: 'İŞ BANKASI'
  },
  {
    id: 'BANK-03',
    bankName: 'Akbank T.A.Ş.',
    accountNumber: '0012-774921',
    iban: 'TR12 0004 6000 0012 7749 2100 01',
    currency: 'TRY',
    balance: 620000.00,
    availableBalance: 620000.00,
    color: 'from-red-500 to-rose-700',
    logoText: 'AKBANK'
  },
  {
    id: 'BANK-04',
    bankName: 'Yapı Kredi Bankası',
    accountNumber: '3301-112049',
    iban: 'TR55 0006 7000 3301 1120 4900 01',
    currency: 'TRY',
    balance: 430000.00,
    availableBalance: 430000.00,
    color: 'from-cyan-600 to-blue-700',
    logoText: 'YAPI KREDİ'
  },
  {
    id: 'BANK-05',
    bankName: 'VakıfBank',
    accountNumber: '9921-004812',
    iban: 'TR19 0001 5000 9921 0048 1200 01',
    currency: 'TRY',
    balance: 300800.00,
    availableBalance: 300800.00,
    color: 'from-amber-500 to-yellow-700',
    logoText: 'VAKIFBANK'
  }
];

export const INITIAL_TRANSACTIONS: CashFlowTransaction[] = [
  {
    id: 'TR-101',
    type: 'inflow',
    category: 'Müşteri Tahsilatı',
    amount: 145000.00,
    currency: 'TRY',
    date: '2026-08-07',
    partyName: 'Yılmaz Dış Ticaret Ltd. Şti.',
    description: 'Temmuz Mali Müşavirlik & Danışmanlık Ücreti',
    status: 'completed'
  },
  {
    id: 'TR-102',
    type: 'inflow',
    category: 'Müşteri Tahsilatı',
    amount: 40000.00,
    currency: 'TRY',
    date: '2026-08-07',
    partyName: 'Ege Teknoloji Ltd. Şti.',
    description: 'E-Dönüşüm Destek ve Bordrolama Hizmet Bedeli',
    status: 'completed'
  },
  {
    id: 'TR-103',
    type: 'outflow',
    category: 'Vergi Ödemesi',
    amount: 52400.00,
    currency: 'TRY',
    date: '2026-08-07',
    partyName: 'Gelir İdaresi Başkanlığı (GİB)',
    description: 'Ofis Damga ve Muhtasar Vergi Ödemesi',
    status: 'completed'
  },
  {
    id: 'TR-104',
    type: 'outflow',
    category: 'Kira & İşletme',
    amount: 40000.00,
    currency: 'TRY',
    date: '2026-08-07',
    partyName: 'Maslak Plaza Yönetimi',
    description: 'Ağustos 2026 Ofis Kirası ve Aidatı',
    status: 'completed'
  },
  {
    id: 'TR-105',
    type: 'inflow',
    category: 'Müşteri Tahsilatı',
    amount: 98000.00,
    currency: 'TRY',
    date: '2026-08-08',
    partyName: 'Boğaziçi İnşaat A.Ş.',
    description: 'Şirket Birleşme ve Değerleme Danışmanlık Hakedişi',
    status: 'scheduled'
  },
  {
    id: 'TR-106',
    type: 'outflow',
    category: 'Personel Maaş',
    amount: 185000.00,
    currency: 'TRY',
    date: '2026-08-10',
    partyName: 'Büro Personel Maaşları',
    description: 'Temmuz 2026 Personel Net Maaş Transferleri',
    status: 'scheduled'
  },
  {
    id: 'TR-107',
    type: 'outflow',
    category: 'SGK Primi',
    amount: 72000.00,
    currency: 'TRY',
    date: '2026-08-31',
    partyName: 'SGK İstanbul İl Müdürlüğü',
    description: 'Büro Çalışanları SGK Prim Ödemesi',
    status: 'scheduled'
  }
];

export const INITIAL_CLIENT_BALANCES: ClientBalance[] = [
  {
    id: 'CLI-01',
    name: 'Yılmaz Dış Ticaret Ltd. Şti.',
    vkn: '9840192837',
    taxOffice: 'Mecidiyeköy V.D.',
    totalBalance: 145000.00,
    overdueBalance: 85000.00,
    lastTransactionDate: '15.06.2026',
    email: 'muhasebe@yilmazdisticaret.com.tr',
    phone: '+90 212 444 09 12',
    contactPerson: 'Ahmet Yılmaz (Genel Müdürü)',
    riskStatus: 'critical'
  },
  {
    id: 'CLI-02',
    name: 'TeknoAvrasya Ar-Ge A.Ş.',
    vkn: '7729104832',
    taxOffice: 'Maslak V.D.',
    totalBalance: 112000.00,
    overdueBalance: 62000.00,
    lastTransactionDate: '30.06.2026',
    email: 'finans@teknoavrasya.com',
    phone: '+90 212 882 10 99',
    contactPerson: 'Selin Arslan (Finans Müdürü)',
    riskStatus: 'warning'
  },
  {
    id: 'CLI-03',
    name: 'Boğaziçi İnşaat Taahhüt Ltd. Şti.',
    vkn: '8830192847',
    taxOffice: 'Beşiktaş V.D.',
    totalBalance: 98000.00,
    overdueBalance: 0.00,
    lastTransactionDate: '01.08.2026',
    email: 'bozok@bogaziciinsaat.com',
    phone: '+90 212 334 50 00',
    contactPerson: 'Murat Bozok (Yönetim Kurulu Bşk.)',
    riskStatus: 'normal'
  },
  {
    id: 'CLI-04',
    name: 'Anadolu Lojistik A.Ş.',
    vkn: '1029384756',
    taxOffice: 'Kavaklıdere V.D.',
    totalBalance: 76500.00,
    overdueBalance: 24000.00,
    lastTransactionDate: '10.07.2026',
    email: 'muhasebe@anadolulojistik.com',
    phone: '+90 312 210 44 22',
    contactPerson: 'Kemal Öztürk (Mali İşler)',
    riskStatus: 'warning'
  },
  {
    id: 'CLI-05',
    name: 'Ege Teknoloji Yazılım Ltd. Şti.',
    vkn: '3291048571',
    taxOffice: 'Kordon V.D.',
    totalBalance: 53700.00,
    overdueBalance: 0.00,
    lastTransactionDate: '02.08.2026',
    email: 'info@egeteknoloji.com.tr',
    phone: '+90 232 422 11 00',
    contactPerson: 'Derya Şahin (Kurucu)',
    riskStatus: 'normal'
  }
];

export const INITIAL_PROPOSAL_TEMPLATES: ProposalTemplate[] = [
  {
    id: 'TPL-01',
    title: 'Standart Aylık Mali Müşavirlik & Defter Tutma Teklifi',
    description: 'Aylık e-defter tutma, KDV, Muhtasar, SGK ve Kurumlar geçici vergi beyannamelerinin hazırlanması ve danışmanlık paketi.',
    defaultNotes: 'Teklifimiz onay tarihinden itibaren 1 takvim yılı geçerlidir. Ücretler her yıl başında TÜFE/ÜFE oranında güncellenir.',
    defaultItems: [
      { serviceName: 'Aylık Mali Müşavirlik ve E-Defter Hizmeti', description: 'Gelen/Giden faturaların işlenmesi, e-defter beratlarının GİB onayına sunulması', quantity: 1, unitPrice: 18000, vatRate: 20, discountPercent: 0 },
      { serviceName: 'Bordrolama ve SGK İşlemleri (1-10 Çalışan)', description: 'Aylık puantaj, bordro hazırlığı, muhtasar ve prim hizmet beyannamesi', quantity: 1, unitPrice: 6500, vatRate: 20, discountPercent: 0 },
      { serviceName: 'Vergi Mevzuatı Sürekli Danışmanlık', description: 'Telefon ve e-posta üzerinden sınırsız günlük mevzuat ve finansal danışmanlık', quantity: 1, unitPrice: 4500, vatRate: 20, discountPercent: 10 }
    ]
  },
  {
    id: 'TPL-02',
    title: 'Limited / Anonim Şirket Kuruluş ve Tescil Paketi',
    description: 'Ana sözleşme hazırlığı, MERSİS başvurusu, Ticaret Odası tescil ve imza sirküleri süreç yönetimi.',
    defaultNotes: 'Noter, Harç ve Ticaret Odası resmi masrafları müşteriye ait olup yukarıdaki tutarlara dahil değildir.',
    defaultItems: [
      { serviceName: 'MERSİS Ana Sözleşme ve Kuruluş Danışmanlığı', description: 'Sözleşme taslağı, NACE kodu tespiti ve MERSİS randevu süreçleri', quantity: 1, unitPrice: 25000, vatRate: 20, discountPercent: 0 },
      { serviceName: 'Vergi Dairesi Açılış & Yoklama Takibi', description: 'Açılış bildirimi ve mobil yoklama süreci rektörlük takibi', quantity: 1, unitPrice: 8500, vatRate: 20, discountPercent: 0 },
      { serviceName: 'E-Dönüşüm (E-Fatura / E-Arşiv) Kurulumu', description: 'GİB e-imza başvurusu ve özel entegratör aktivasyonu', quantity: 1, unitPrice: 5000, vatRate: 20, discountPercent: 20 }
    ]
  },
  {
    id: 'TPL-03',
    title: 'Enflasyon Düzeltmesi & Dönem Sonu Değerleme Hizmeti',
    description: 'VUK 555 Genel Tebliği uyarınca parasal olmayan kıymetlerin enflasyon düzeltmesi ve özel raporlama.',
    defaultNotes: 'Hesaplamalar TÜİK Yİ-ÜFE endeksleri baz alınarak hazırlanır ve bağımsız denetim standartlarına uygundur.',
    defaultItems: [
      { serviceName: 'Parasal Olmayan Kıymetler Enflasyon Düzeltmesi', description: 'Stoklar, duran varlıklar ve özkaynak kalemlerinin katsayı analizi', quantity: 1, unitPrice: 35000, vatRate: 20, discountPercent: 0 },
      { serviceName: 'Enflasyon Düzeltmesi Raporu ve Beyan Kontrolü', description: 'Vergi matrahına etki analizi ve detaylı mali tablo sunumu', quantity: 1, unitPrice: 15000, vatRate: 20, discountPercent: 0 }
    ]
  }
];

export const INITIAL_PROPOSALS: Proposal[] = [
  {
    id: 'PROP-2026-001',
    proposalNo: 'MSV-2026-104',
    clientName: 'Karaköy Mimarlık Tasarım A.Ş.',
    clientVkn: '4920192841',
    clientEmail: 'info@karakoymimarlik.com',
    date: '05.08.2026',
    validUntil: '05.09.2026',
    templateId: 'TPL-01',
    notes: 'Ödemeler her ayın 1-5 tarihleri arasında banka hesabımıza yapılacaktır.',
    status: 'sent',
    items: [
      { id: '1', serviceName: 'Aylık Mali Müşavirlik ve E-Defter Hizmeti', description: 'E-defter berat süreçleri ve KDV beyanları', quantity: 1, unitPrice: 20000, vatRate: 20, discountPercent: 0 },
      { id: '2', serviceName: 'Bordrolama Hizmeti (15 Personel)', description: 'Aylık personel maaş bordroları', quantity: 1, unitPrice: 8000, vatRate: 20, discountPercent: 0 }
    ],
    totalNet: 28000,
    totalVat: 5600,
    totalAmount: 33600
  }
];

export const OFFICIAL_GAZETTE_NEWS: OfficialGazetteNews[] = [
  {
    id: 'NEWS-001',
    title: 'VUK Genel Tebliği: 2026/2. Geçici Vergi Enflasyon Düzeltmesi Uygulama Esasları Yayınlandı',
    source: 'Resmi Gazete',
    date: '06 Ağustos 2026',
    publishNo: 'Sayı: 33281',
    summary: 'Hazine ve Maliye Bakanlığı, 2026 yılı ikinci geçici vergi döneminde uygulanacak enflasyon düzeltmesi kat sayıları ve istisna maddelerini belirledi.',
    content: 'Resmi Gazete’de yayımlanan Vergi Usul Kanunu Genel Tebliği ile parasal olmayan kıymetlerin düzeltilmesinde kullanılacak Yİ-ÜFE endeksleri güncellendi. Özkaynak kalemlerinin düzeltilmesinde oluşan farkların vergisiz fon hesabına aktarılması esası korundu. Detaylar ve hesaplama tablosu sirkülerimizde yer almaktadır.',
    category: 'Vergi Mevzuatı',
    isRead: false
  },
  {
    id: 'NEWS-002',
    title: 'GİB Duyurusu: E-Fatura ve E-Arşiv Fatura Senaryolarında QR Kod Zorunluluğu Genişletildi',
    source: 'GİB Sirküler',
    date: '01 Ağustos 2026',
    publishNo: 'Sirküler No: 2026/18',
    summary: 'Gelir İdaresi Başkanlığı, 1 Eylül 2026 tarihinden itibaren düzenlenen tüm e-fatura ve e-arşiv faturalarda dinamik QR kod bulundurulmasını zorunlu kıldı.',
    content: 'Gelir İdaresi Başkanlığı tarafından yapılan duyuruya göre, e-fatura ve e-arşiv faturaların görsel tasarımlarında karekod (QR Code) alanının bulunması şartı getirilmiştir. Entegratör firmaların 1 Eylül tarihine kadar şablon güncellemelerini tamamlamaları gerekmektedir.',
    category: 'E-Dönüşüm',
    isRead: false
  },
  {
    id: 'NEWS-003',
    title: 'SGK Genelgesi: Genç İstihdam ve Kadın Çalışan Prim Teşviki (6111 Sayılı Kanun) Uzatıldı',
    source: 'SGK Duyuru',
    date: '24 Temmuz 2026',
    publishNo: 'Genelge 2026/12',
    summary: 'SGK işveren prim desteğinde 18-29 yaş arası genç ve kadın istihdamı teşvik süresi 31 Aralık 2026 tarihine kadar uzatılmıştır.',
    content: 'Sosyal Güvenlik Kurumu, ilave istihdam sağlayan işverenlerin yararlandığı 6111 ve 7103 sayılı kanun kapsamındaki işveren hissesi prim desteğinin süresini yıl sonuna kadar uzatmıştır. Şartları sağlayan sigortalılar e-SGK portalı üzerinden tanımlanmaya devam edebilir.',
    category: 'SGK & Teşvikler',
    isRead: true
  },
  {
    id: 'NEWS-004',
    title: 'TÜRMOB Açıklaması: 2026 Asgari Ücret Tarifesi ve Müşavirlik Ücret İndekslemesi',
    source: 'TÜRMOB',
    date: '15 Haziran 2026',
    publishNo: 'Duyuru 2026/09',
    summary: 'Serbest Muhasebeci Mali Müşavirlik ve Yeminli Mali Müşavirlik Asgari Ücret Tarifesinde 2. yarıyıl artış oranı %18.5 olarak tavsiye edildi.',
    content: 'TÜRMOB Yönetim Kurulu, yılın ikinci yarısında enflasyonist baskılar ve büro maliyetlerindeki artışlar nedeniyle SMMM asgari ücret tarifesine tavsiye niteliğinde %18.5 güncelleme yapılması gerektiğini bildirdi.',
    category: 'Mesleki Kararlar',
    isRead: true
  },
  {
    id: 'NEWS-005',
    title: 'Resmi Gazete: İhracat Bedellerinin Yurda Getirilmesi Hakkında Kararda Esneklik',
    source: 'Resmi Gazete',
    date: '28 Mayıs 2026',
    publishNo: 'Sayı: 33211',
    summary: 'Hizmet ve mal ihracatında bedellerin bankalara bozdurulma zorunluluğunda muafiyet sınırı 50.000 USD tutarına yükseltildi.',
    content: 'TCMB İhracat Genelgesi uyarınca mal ve hizmet ihracatı yapan mükelleflerin döviz getirme yükümlülüğündeki terkint ve istisna tutarları artırıldı. İhracatçı müşterilerimizin bilgilendirilmesi önem arz etmektedir.',
    category: 'Finans & Kambiyo',
    isRead: true
  }
];

export const INITIAL_EXCHANGE_RATES: ExchangeRate[] = [
  { code: 'USD', name: 'ABD Doları', buying: 38.4250, selling: 38.4810, changePercent: +0.24, trend: 'up' },
  { code: 'EUR', name: 'Euro', buying: 41.8510, selling: 41.9230, changePercent: +0.18, trend: 'up' },
  { code: 'GBP', name: 'İngiliz Sterlini', buying: 49.1200, selling: 49.2500, changePercent: -0.05, trend: 'down' },
  { code: 'GAU', name: 'Gram Altın (₺)', buying: 3120.50, selling: 3128.00, changePercent: +0.65, trend: 'up' }
];
