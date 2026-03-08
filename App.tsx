import React from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Marketplace from './pages/Marketplace';
import Dashboard from './pages/Dashboard';
import { LanguageProvider, useLanguage } from './contexts/LanguageContext';
import { AuthProvider } from './contexts/AuthContext';
import AuthPage from './pages/Auth';

const AppContent: React.FC = () => {
  const { t } = useLanguage();

  return (
    <Router>
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/marketplace" element={<Marketplace />} />
            <Route path="/dashboard" element={<Dashboard />} />
            {/* Fallback for Suppliers route for now */}
            <Route path="/auth" element={<AuthPage />} />
            <Route path="/suppliers" element={<Marketplace />} />

          </Routes>
        </main>
        <footer className="bg-gray-900 text-white py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-lg font-bold mb-4">Made-In-Uzbekistan</h3>
              <p className="text-gray-400 text-sm">
                {t('description')}
              </p>
            </div>
            <div>
              <h3 className="text-lg font-bold mb-4">{t('quickLinks')}</h3>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><a href="#" className="hover:text-white">{t('aboutUs')}</a></li>
                <li><a href="#" className="hover:text-white">{t('buyerGuide')}</a></li>
                <li><a href="#" className="hover:text-white">{t('supplierVer')}</a></li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-bold mb-4">{t('contact')}</h3>
              <p className="text-gray-400 text-sm">support@madeinuzbekistan.com</p>
              <p className="text-gray-400 text-sm">+998 71 000 00 00</p>
              <p className="text-gray-400 text-sm">Tashkent, Uzbekistan</p>
            </div>
          </div>
          <div className="max-w-7xl mx-auto px-4 mt-8 pt-8 border-t border-gray-800 text-center text-sm text-gray-500">
            © {new Date().getFullYear()} {t('rights')}
          </div>
        </footer>
      </div>
    </Router>
  );
};

const App: React.FC = () => {
  return (
    <LanguageProvider>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </LanguageProvider>
  );
};

export default App;