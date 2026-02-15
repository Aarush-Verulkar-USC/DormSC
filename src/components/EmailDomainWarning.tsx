'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';

export default function EmailDomainWarning() {
    const { currentUser, authError } = useAuth();
    const [showWarning, setShowWarning] = useState(false);

    useEffect(() => {
        if (authError === 'INVALID_DOMAIN') {
            setShowWarning(true);
            const timer = setTimeout(() => {
                setShowWarning(false);
            }, 5000);
            return () => clearTimeout(timer);
        }
    }, [authError]);

    if (!showWarning) return null;

    return (
        <div className="fixed top-20 right-4 z-[100] animate-slide-in-right">
            <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4 shadow-xl max-w-sm backdrop-blur-md">
                <div className="flex items-start gap-3">
                    <div className="flex-shrink-0">
                        <svg className="w-6 h-6 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                        </svg>
                    </div>
                    <div className="flex-1">
                        <h3 className="text-sm font-semibold text-red-400 mb-1">Unauthorized Email</h3>
                        <p className="text-xs text-gray-300">
                            Only @usc.edu email addresses are allowed. Please sign in with your USC email.
                        </p>
                    </div>
                    <button
                        onClick={() => setShowWarning(false)}
                        className="flex-shrink-0 text-gray-400 hover:text-white transition-colors"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>
            </div>
        </div>
    );
}
