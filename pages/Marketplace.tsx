import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import RFQModal from '../components/RFQModal';
import { dbService } from '../services/dbService';
import { Product } from '../types';
import { CATEGORIES } from '../constants';
import { Filter, Search } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

const Marketplace: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchParams] = useSearchParams();
  const categoryFilter = searchParams.get('category');
  const [searchTerm, setSearchTerm] = useState('');
  const { t } = useLanguage();

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const data = await dbService.getProducts();
        setProducts(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const handleInquire = (product: Product) => {
    setSelectedProduct(product);
    setIsModalOpen(true);
  };

  const filteredProducts = products.filter(p => {
    const matchesCategory = categoryFilter ? p.category.toLowerCase().includes(categoryFilter.toLowerCase()) : true;
    const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header & Filter Bar */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{t('marketplace')}</h1>
            <p className="text-sm text-gray-500 mt-1">{t('foundProducts', { count: filteredProducts.length })}</p>
          </div>

          <div className="flex gap-2">
            <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Search className="h-4 w-4 text-gray-400" />
                </div>
                <input 
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder={t('searchPlaceholder')}
                    className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-blue-500 focus:border-blue-500 w-full md:w-64"
                />
            </div>
            
            <button className="flex items-center px-4 py-2 border border-gray-300 rounded-lg bg-white text-sm font-medium text-gray-700 hover:bg-gray-50">
                <Filter className="w-4 h-4 mr-2" />
                {t('filter')}
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Sidebar Filters */}
            <div className="hidden lg:block space-y-6">
                <div>
                    <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-3">{t('categories')}</h3>
                    <div className="space-y-2">
                        <button 
                            onClick={() => window.location.href='/marketplace'}
                            className={`block text-sm ${!categoryFilter ? 'text-blue-600 font-medium' : 'text-gray-600 hover:text-gray-900'}`}
                        >
                            {t('allCategories')}
                        </button>
                        {CATEGORIES.map(cat => (
                             <button
                                key={cat.id} 
                                onClick={() => setSearchTerm(cat.name.split(' ')[0])} // Simple client-side filter sim
                                className="block text-sm text-gray-600 hover:text-gray-900 text-left w-full truncate"
                             >
                                {t(`cat_${cat.slug}`)}
                             </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Product Grid */}
            <div className="lg:col-span-3">
                {loading ? (
                    <div className="flex justify-center items-center h-64">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                    </div>
                ) : filteredProducts.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredProducts.map(product => (
                            <ProductCard 
                                key={product.id} 
                                product={product} 
                                onInquire={handleInquire}
                            />
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-20 bg-white rounded-lg border border-dashed border-gray-300">
                        <p className="text-gray-500">{t('noProducts')}</p>
                    </div>
                )}
            </div>
        </div>

      </div>

      <RFQModal 
        product={selectedProduct} 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
      />
    </div>
  );
};

export default Marketplace;