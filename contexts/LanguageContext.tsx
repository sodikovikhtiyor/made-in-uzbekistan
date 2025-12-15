import React, { createContext, useState, useContext, ReactNode } from 'react';

export type Language = 'en' | 'ru';

export interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string, params?: Record<string, string | number>) => string;
}

const translations: Record<Language, Record<string, string>> = {
  en: {
    // General
    loading: "Loading...",
    // Navbar
    marketplace: "Marketplace",
    suppliers: "Suppliers",
    supplierLogin: "Supplier Login",
    buyerView: "Switch to Buyer View",
    supplierView: "Switch to Supplier View",
    // Home
    heroTitlePrefix: "Sourcing from",
    heroTitle: "Uzbekistan",
    heroTitleSuffix: "made easy",
    heroSubtitle: "Connect directly with verified manufacturers of textiles, dried fruits, and construction materials.",
    searchPlaceholder: "What are you looking for? (e.g. Cotton Yarn)",
    searchButton: "Search",
    verifiedSuppliers: "Verified Suppliers",
    verifiedDesc: "Manually checked business licenses",
    factoryPrices: "Direct Factory Prices",
    factoryDesc: "No middleman markup",
    logistics: "Logistics Support",
    logisticsDesc: "Partners for rail & air freight",
    popularIndustries: "Popular Industries",
    readyToSource: "Ready to source?",
    startRequest: "Start your request for quotation today.",
    browseProducts: "Browse Products",
    // Marketplace
    foundProducts: "Found {count} products from Uzbekistan",
    filter: "Filter",
    categories: "Categories",
    allCategories: "All Categories",
    noProducts: "No products found matching your criteria.",
    // Product Card
    moq: "MOQ",
    fobPrice: "FOB Price",
    inquire: "Inquire",
    verifiedMan: "Verified Manufacturer",
    // RFQ Modal
    contactSupplier: "Contact Supplier",
    quantityReq: "Quantity Required",
    minOrder: "Min. Order",
    message: "Message",
    aiAssist: "AI Assist",
    sendInquiry: "Send Inquiry",
    sending: "Sending...",
    sentSuccess: "RFQ Sent Successfully!",
    willContact: "The supplier will contact you shortly.",
    placeholderMsg: "Describe your requirements, shipping destination, and specific questions...",
    tipAi: "Tip: Use the 'AI Assist' button to polish your message.",
    // Dashboard
    dashboardTitle: "Supplier Dashboard",
    totalInquiries: "Total Inquiries",
    activeProducts: "Active Products",
    pendingResponse: "Pending Response",
    recentInquiries: "Recent Inquiries",
    viewDetails: "View Details",
    qtyRequested: "Quantity requested",
    re: "Re",
    noInquiries: "No active inquiries yet.",
    // Footer
    aboutUs: "About Us",
    buyerGuide: "Buyer Guide",
    supplierVer: "Supplier Verification",
    quickLinks: "Quick Links",
    contact: "Contact",
    description: "The trusted B2B gateway to Uzbekistan's finest manufacturers. Connecting global buyers with authentic Silk Road quality.",
    rights: "Made-In-Uzbekistan Marketplace. All rights reserved.",
    // Categories
    cat_textiles: "Textiles & Silk",
    cat_agriculture: "Agriculture & Dried Fruits",
    cat_handicrafts: "Ceramics & Handicrafts",
    cat_construction: "Construction Materials",
    cat_chemical: "Chemical Industry"
  },
  ru: {
    // General
    loading: "Загрузка...",
    // Navbar
    marketplace: "Маркетплейс",
    suppliers: "Поставщики",
    supplierLogin: "Вход для поставщиков",
    buyerView: "Режим покупателя",
    supplierView: "Режим поставщика",
    // Home
    heroTitlePrefix: "Поставки из",
    heroTitle: "Узбекистана",
    heroTitleSuffix: "это просто",
    heroSubtitle: "Связывайтесь напрямую с проверенными производителями текстиля, сухофруктов и стройматериалов.",
    searchPlaceholder: "Что вы ищете? (например, Хлопковая пряжа)",
    searchButton: "Найти",
    verifiedSuppliers: "Проверенные поставщики",
    verifiedDesc: "Проверка бизнес-лицензий вручную",
    factoryPrices: "Прямые цены заводов",
    factoryDesc: "Без наценки посредников",
    logistics: "Логистическая поддержка",
    logisticsDesc: "Партнеры по ж/д и авиаперевозкам",
    popularIndustries: "Популярные отрасли",
    readyToSource: "Готовы начать?",
    startRequest: "Оставьте заявку на квоту сегодня.",
    browseProducts: "Каталог товаров",
    // Marketplace
    foundProducts: "Найдено {count} товаров из Узбекистана",
    filter: "Фильтр",
    categories: "Категории",
    allCategories: "Все категории",
    noProducts: "Товары не найдены по вашим критериям.",
    // Product Card
    moq: "Мин. заказ",
    fobPrice: "Цена FOB",
    inquire: "Запросить",
    verifiedMan: "Проверенный производитель",
    // RFQ Modal
    contactSupplier: "Связаться с поставщиком",
    quantityReq: "Требуемое количество",
    minOrder: "Мин. заказ",
    message: "Сообщение",
    aiAssist: "AI Помощник",
    sendInquiry: "Отправить",
    sending: "Отправка...",
    sentSuccess: "Запрос отправлен!",
    willContact: "Поставщик свяжется с вами в ближайшее время.",
    placeholderMsg: "Опишите ваши требования, место доставки и вопросы...",
    tipAi: "Совет: Используйте 'AI Помощник' для улучшения текста.",
    // Dashboard
    dashboardTitle: "Панель поставщика",
    totalInquiries: "Всего запросов",
    activeProducts: "Активные товары",
    pendingResponse: "Ожидают ответа",
    recentInquiries: "Недавние запросы",
    viewDetails: "Подробнее",
    qtyRequested: "Запрошено",
    re: "Кас",
    noInquiries: "Нет активных запросов.",
    // Footer
    aboutUs: "О нас",
    buyerGuide: "Гид покупателя",
    supplierVer: "Проверка поставщиков",
    quickLinks: "Ссылки",
    contact: "Контакты",
    description: "Надежный B2B портал лучших производителей Узбекистана. Связываем глобальных покупателей с качеством Шелкового пути.",
    rights: "Made-In-Uzbekistan Marketplace. Все права защищены.",
    // Categories
    cat_textiles: "Текстиль и Шелк",
    cat_agriculture: "Сельское хозяйство",
    cat_handicrafts: "Керамика и Ремесла",
    cat_construction: "Стройматериалы",
    cat_chemical: "Химическая промышленность"
  }
};

export const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>('en');

  const t = (key: string, params?: Record<string, string | number>) => {
    let text = translations[language][key] || key;
    if (params) {
      Object.entries(params).forEach(([k, v]) => {
        text = text.replace(`{${k}}`, String(v));
      });
    }
    return text;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};