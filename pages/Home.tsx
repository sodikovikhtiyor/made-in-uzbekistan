import React from 'react';
import { Link } from 'react-router-dom';
import { CATEGORIES } from '../constants';
import { Search, TrendingUp, ShieldCheck, Truck } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

const Home: React.FC = () => {
  const { t } = useLanguage();

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <div className="relative bg-blue-900 overflow-hidden">
        <div className="absolute inset-0">
          <img 
            className="w-full h-full object-cover opacity-20"
            src="https://images.unsplash.com/photo-1548115682-1dd7b2123512?q=80&w=2940&auto=format&fit=crop"
            alt="Uzbekistan Architecture"
          />
          <div className="absolute inset-0 bg-blue-900/60 mix-blend-multiply" />
        </div>
        
        <div className="relative max-w-7xl mx-auto py-24 px-4 sm:py-32 sm:px-6 lg:px-8 flex flex-col items-center text-center">
          <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl lg:text-6xl">
            {t('heroTitlePrefix')} <span className="text-amber-400">{t('heroTitle')}</span> {t('heroTitleSuffix')}
          </h1>
          <p className="mt-6 text-xl text-blue-100 max-w-3xl">
            {t('heroSubtitle')}
          </p>
          
          <div className="mt-10 max-w-xl w-full">
            <div className="relative rounded-md shadow-sm">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                className="focus:ring-amber-500 focus:border-amber-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md py-4 text-gray-900"
                placeholder={t('searchPlaceholder')}
              />
              <div className="absolute inset-y-0 right-0 flex items-center">
                <Link to="/marketplace" className="h-full aspect-square rounded-r-md bg-amber-500 hover:bg-amber-600 text-white flex items-center justify-center font-medium px-4">
                  {t('searchButton')}
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Feature Pills */}
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="flex items-center justify-center space-x-3 text-gray-700">
                    <ShieldCheck className="w-8 h-8 text-blue-600" />
                    <div className="text-left">
                        <p className="font-bold">{t('verifiedSuppliers')}</p>
                        <p className="text-xs text-gray-500">{t('verifiedDesc')}</p>
                    </div>
                </div>
                <div className="flex items-center justify-center space-x-3 text-gray-700">
                    <TrendingUp className="w-8 h-8 text-blue-600" />
                    <div className="text-left">
                        <p className="font-bold">{t('factoryPrices')}</p>
                        <p className="text-xs text-gray-500">{t('factoryDesc')}</p>
                    </div>
                </div>
                <div className="flex items-center justify-center space-x-3 text-gray-700">
                    <Truck className="w-8 h-8 text-blue-600" />
                    <div className="text-left">
                        <p className="font-bold">{t('logistics')}</p>
                        <p className="text-xs text-gray-500">{t('logisticsDesc')}</p>
                    </div>
                </div>
            </div>
        </div>
      </div>

      {/* Categories */}
      <div className="bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-extrabold text-gray-900 mb-8">{t('popularIndustries')}</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {CATEGORIES.map((cat) => (
              <Link to={`/marketplace?category=${cat.slug}`} key={cat.id} className="group relative rounded-lg overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 h-40">
                <img src={cat.image} alt={cat.name} className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                <div className="absolute inset-0 bg-black/40 group-hover:bg-black/50 transition-colors" />
                <div className="absolute inset-0 flex items-center justify-center p-4 text-center">
                    <span className="text-white font-bold text-lg leading-tight">{t(`cat_${cat.slug}`)}</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
      
      {/* CTA */}
      <div className="bg-blue-600">
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:py-16 lg:px-8 lg:flex lg:items-center lg:justify-between">
          <h2 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
            <span className="block">{t('readyToSource')}</span>
            <span className="block text-blue-200">{t('startRequest')}</span>
          </h2>
          <div className="mt-8 flex lg:mt-0 lg:flex-shrink-0">
            <div className="inline-flex rounded-md shadow">
              <Link to="/marketplace" className="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-blue-600 bg-white hover:bg-gray-50">
                {t('browseProducts')}
              </Link>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
};

export default Home;