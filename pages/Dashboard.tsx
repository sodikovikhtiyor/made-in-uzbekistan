import React, { useEffect, useState } from 'react';
import { dbService } from '../services/dbService';
import { RFQ } from '../types';
import { MessageSquare, Package, Clock, CheckCircle } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { useAuth } from '../contexts/AuthContext';
import { Navigate } from 'react-router-dom';
const Dashboard: React.FC = () => {
    const [rfqs, setRfqs] = useState<RFQ[]>([]);
    const [loading, setLoading] = useState(true);
    const { t } = useLanguage();
    const { user, loading: authLoading } = useAuth();
    // Mocking logged in user as Buyer ID for demo, but displaying as if we are viewing requests sent
    // In a real app, this would query RFQs where product.supplier_id == auth.user.id
    useEffect(() => {
        const fetchRequests = async () => {
            if (!user) return;
            try {
                const data = await dbService.getBuyerRFQs(user.id); // later you can switch to supplier logic
                setRfqs(data);
            } finally {
                setLoading(false);
            }
        };
        fetchRequests();
    }, [user]);
    if (authLoading) {
        return <div className="p-8 text-center text-gray-500">Checking session...</div>;
    }

    if (!user) {
        return <Navigate to="/auth" replace />;
    }

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <h1 className="text-2xl font-bold text-gray-900 mb-6">{t('dashboardTitle')}</h1>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                        <div className="flex items-center">
                            <div className="p-3 bg-blue-100 rounded-full text-blue-600">
                                <MessageSquare className="w-6 h-6" />
                            </div>
                            <div className="ml-4">
                                <p className="text-sm font-medium text-gray-500">{t('totalInquiries')}</p>
                                <p className="text-2xl font-bold text-gray-900">{rfqs.length}</p>
                            </div>
                        </div>
                    </div>
                    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                        <div className="flex items-center">
                            <div className="p-3 bg-green-100 rounded-full text-green-600">
                                <Package className="w-6 h-6" />
                            </div>
                            <div className="ml-4">
                                <p className="text-sm font-medium text-gray-500">{t('activeProducts')}</p>
                                <p className="text-2xl font-bold text-gray-900">4</p>
                            </div>
                        </div>
                    </div>
                    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                        <div className="flex items-center">
                            <div className="p-3 bg-amber-100 rounded-full text-amber-600">
                                <Clock className="w-6 h-6" />
                            </div>
                            <div className="ml-4">
                                <p className="text-sm font-medium text-gray-500">{t('pendingResponse')}</p>
                                <p className="text-2xl font-bold text-gray-900">{rfqs.filter(r => r.status === 'PENDING').length}</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="bg-white shadow-sm rounded-lg border border-gray-200 overflow-hidden">
                    <div className="px-6 py-4 border-b border-gray-200">
                        <h3 className="text-lg font-medium text-gray-900">{t('recentInquiries')}</h3>
                    </div>
                    {loading ? (
                        <div className="p-8 text-center text-gray-500">{t('loading')}</div>
                    ) : rfqs.length === 0 ? (
                        <div className="p-8 text-center text-gray-500">{t('noInquiries')}</div>
                    ) : (
                        <ul className="divide-y divide-gray-200">
                            {rfqs.map((rfq) => (
                                <li key={rfq.id} className="p-6 hover:bg-gray-50 transition-colors">
                                    <div className="flex items-center justify-between mb-2">
                                        <div className="flex items-center">
                                            <span className={`px-2 py-1 text-xs font-semibold rounded-full ${rfq.status === 'PENDING' ? 'bg-amber-100 text-amber-800' : 'bg-green-100 text-green-800'}`}>
                                                {rfq.status}
                                            </span>
                                            <span className="ml-3 text-sm text-gray-500">
                                                {new Date(rfq.created_at).toLocaleDateString()}
                                            </span>
                                        </div>
                                        <button className="text-sm text-blue-600 hover:text-blue-800 font-medium">
                                            {t('viewDetails')}
                                        </button>
                                    </div>
                                    <h4 className="text-md font-semibold text-gray-900 mb-1">
                                        {t('re')}: {rfq.product_name || 'Product Inquiry'}
                                    </h4>
                                    <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                                        {rfq.message}
                                    </p>
                                    <div className="flex items-center text-sm text-gray-500">
                                        <span className="font-medium mr-2">{t('qtyRequested')}:</span>
                                        {rfq.quantity}
                                    </div>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Dashboard;