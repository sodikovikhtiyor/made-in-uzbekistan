import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { User, Globe, Menu } from 'lucide-react';
import { APP_NAME } from '../constants';
import { useLanguage } from '../contexts/LanguageContext';
import { useAuth } from '../contexts/AuthContext';

const Navbar: React.FC = () => {
  const location = useLocation();
  const isSupplier = location.pathname.includes('dashboard');
  const { t, language, setLanguage } = useLanguage();
  const { user, profile, signOut } = useAuth();

  const toggleLanguage = () => {
    setLanguage(language === 'en' ? 'ru' : 'en');
  };

  return (
    <nav className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          
          <div className="flex items-center">
            <Link to="/" className="flex-shrink-0 flex items-center gap-2">
               <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold text-xl">
                 Uz
               </div>
               <span className="font-bold text-xl tracking-tight text-blue-900">{APP_NAME}</span>
            </Link>
            
            <div className="hidden sm:ml-8 sm:flex sm:space-x-8">
              <Link 
                to="/marketplace" 
                className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${location.pathname === '/marketplace' ? 'border-blue-500 text-gray-900' : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'}`}
              >
                {t('marketplace')}
              </Link>
              <Link 
                to="/suppliers" 
                className="inline-flex items-center px-1 pt-1 border-b-2 border-transparent text-sm font-medium text-gray-500 hover:border-gray-300 hover:text-gray-700"
              >
                {t('suppliers')}
              </Link>
            </div>
          </div>

          <div className="flex items-center gap-4">
             <button 
                onClick={toggleLanguage}
                className="hidden md:flex items-center text-gray-500 hover:text-blue-600 transition-colors"
             >
               <Globe className="w-5 h-5 mr-1" />
               <span className="text-sm font-medium">{language === 'en' ? 'English' : 'Русский'}</span>
             </button>

             {isSupplier ? (
               <Link to="/" className="text-sm font-medium text-blue-600 hover:text-blue-500">
                 {t('buyerView')}
               </Link>
             ) : (
               <Link to="/dashboard" className="text-sm font-medium text-gray-600 hover:text-blue-600">
                 {t('supplierLogin')}
               </Link>
               
             )}

             <div className="ml-3 relative">
                <button className="bg-blue-600 flex text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 p-1">
                  <span className="sr-only">Open user menu</span>
                  <User className="h-6 w-6 text-white" />
                </button>
             </div>
             
             <div className="sm:hidden">
               <button 
                  onClick={toggleLanguage}
                  className="text-gray-500 p-2 mr-1"
               >
                 <span className="font-bold text-sm">{language.toUpperCase()}</span>
               </button>
               <button className="text-gray-500 p-2">
                 <Menu className="w-6 h-6" />
               </button>
             </div>
          </div>

        </div>
      </div>
    </nav>
  );
};

export default Navbar;