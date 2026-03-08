import React, { useState } from 'react';
import { Product } from '../types';
import { X, Sparkles, Send, Loader2 } from 'lucide-react';
import { geminiService } from '../services/geminiService';
import { dbService } from '../services/dbService';
import { useLanguage } from '../contexts/LanguageContext';

interface RFQModalProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
}

const RFQModal: React.FC<RFQModalProps> = ({ product, isOpen, onClose }) => {
  const [quantity, setQuantity] = useState<number>(product?.moq || 100);
  const [message, setMessage] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [success, setSuccess] = useState(false);
  const { t, language } = useLanguage();

  // Reset state when modal opens with new product
  React.useEffect(() => {
    if (isOpen && product) {
        setQuantity(product.moq);
        setMessage('');
        setSuccess(false);
    }
  }, [isOpen, product]);

  if (!isOpen || !product) return null;

  const handleGenerateAI = async () => {
    if (!product) return;
    setIsGenerating(true);
    try {
        // Use a default short prompt if message is empty to trigger a generic inquiry
        const roughInput = message.length > 5 ? message : "I need pricing and shipping details.";
        const draft = await geminiService.generateRFQDraft(product.name, quantity, roughInput, language);
        setMessage(draft);
    } catch (e) {
        alert("Could not generate draft. Please check your internet or API key.");
    } finally {
        setIsGenerating(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSending(true);
    try {
        await dbService.createRFQ({
            product_id: product.id,
            buyer_id: 'user-123', // Hardcoded for MVP
            message,
            quantity,
            product_name: product.name
        });
        setSuccess(true);
        setTimeout(() => {
            onClose();
            setSuccess(false);
        }, 2000);
    } catch (error) {
        alert("Failed to send RFQ");
    } finally {
        setIsSending(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
      <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" aria-hidden="true" onClick={onClose}></div>

        <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg w-full">
          
          {success ? (
             <div className="p-10 flex flex-col items-center justify-center text-center">
                <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100">
                    <Send className="h-6 w-6 text-green-600" />
                </div>
                <h3 className="mt-4 text-lg font-medium text-gray-900">{t('sentSuccess')}</h3>
                <p className="mt-2 text-sm text-gray-500">{t('willContact')}</p>
             </div>
          ) : (
            <>
                <div className="bg-gray-50 px-4 py-3 sm:px-6 flex justify-between items-center border-b border-gray-200">
                    <h3 className="text-lg leading-6 font-medium text-gray-900" id="modal-title">
                    {t('contactSupplier')}
                    </h3>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-500 focus:outline-none">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <div className="px-4 py-5 sm:p-6">
                    <div className="flex items-center space-x-4 mb-6">
                        <img src={product.image_url} alt="" className="w-16 h-16 rounded object-cover border" />
                        <div>
                            <h4 className="font-semibold text-gray-900">{product.name}</h4>
                            <p className="text-sm text-gray-500">Supplier: {product.supplier?.company_name}</p>
                        </div>
                    </div>

                    <form onSubmit={handleSubmit}>
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700">{t('quantityReq')} ({product.unit})</label>
                            <input 
                                type="number" 
                                min={product.moq}
                                value={quantity}
                                onChange={(e) => setQuantity(Number(e.target.value))}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border"
                            />
                            <span className="text-xs text-gray-400">{t('minOrder')}: {product.moq} {product.unit}</span>
                        </div>

                        <div className="mb-4">
                            <div className="flex justify-between items-center mb-1">
                                <label className="block text-sm font-medium text-gray-700">{t('message')}</label>
                                <button 
                                    type="button" 
                                    onClick={handleGenerateAI}
                                    disabled={isGenerating}
                                    className="inline-flex items-center text-xs text-blue-600 hover:text-blue-800 disabled:opacity-50"
                                >
                                    {isGenerating ? <Loader2 className="w-3 h-3 mr-1 animate-spin"/> : <Sparkles className="w-3 h-3 mr-1" />}
                                    {t('aiAssist')}
                                </button>
                            </div>
                            <textarea 
                                rows={5}
                                value={message}
                                onChange={(e) => setMessage(e.target.value)}
                                placeholder={t('placeholderMsg')}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border"
                            />
                            <p className="text-xs text-gray-400 mt-1">
                                {t('tipAi')}
                            </p>
                        </div>

                        <div className="mt-5 sm:mt-6">
                            <button
                                type="submit"
                                disabled={isSending || !message}
                                className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {isSending ? t('sending') : t('sendInquiry')}
                            </button>
                        </div>
                    </form>
                </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default RFQModal;