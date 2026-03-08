import React from 'react';
import { Product } from '../types';
import { MapPin, ShieldCheck, ArrowRight } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

interface ProductCardProps {
  product: Product;
  onInquire: (product: Product) => void;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, onInquire }) => {
  const { t } = useLanguage();

  return (
    <div className="group bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-200 overflow-hidden flex flex-col h-full">
      <div className="relative h-48 bg-gray-200 overflow-hidden">
        <img 
          src={product.image_url} 
          alt={product.name} 
          className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute top-2 left-2 bg-white/90 backdrop-blur-sm px-2 py-1 rounded text-xs font-medium text-gray-700">
          {t('moq')}: {product.moq} {product.unit}
        </div>
      </div>
      
      <div className="p-4 flex flex-col flex-grow">
        <div className="flex items-start justify-between">
            <h3 className="text-lg font-semibold text-gray-900 line-clamp-2">{product.name}</h3>
        </div>
        
        <p className="mt-1 text-sm text-gray-500 line-clamp-2">{product.description}</p>
        
        <div className="mt-4 flex items-center text-xs text-gray-500">
          <MapPin className="w-3 h-3 mr-1" />
          {product.supplier?.location || "Uzbekistan"}
        </div>

        {product.supplier?.verified && (
          <div className="mt-1 flex items-center text-xs text-green-600 font-medium">
            <ShieldCheck className="w-3 h-3 mr-1" />
            {t('verifiedMan')}
          </div>
        )}

        <div className="mt-auto pt-4 flex items-center justify-between border-t border-gray-100">
           <div className="flex flex-col">
             <span className="text-xs text-gray-500">{t('fobPrice')}</span>
             <span className="font-bold text-blue-900">
               ${product.price_min} - ${product.price_max} <span className="text-xs font-normal text-gray-500">/ {product.unit}</span>
             </span>
           </div>
           <button 
             onClick={() => onInquire(product)}
             className="inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-lg shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
           >
             {t('inquire')}
             <ArrowRight className="ml-1.5 w-4 h-4" />
           </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;