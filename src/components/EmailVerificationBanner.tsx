'use client';
import { useAuth } from '@/contexts/AuthContext';
import { useState } from 'react';

export default function EmailVerificationBanner() {
    const { currentUser, resendVerificationEmail } = useAuth();
    const [sending, setSending] = useState(false);
    const [message, setMessage] = useState('');
    const [dismissed, setDismissed] = useState(false);

    if (!currentUser || currentUser.emailVerified || dismissed) {
        return null;
    }

    const handleResend = async () => {
        try {
            setSending(true);
            setMessage('');
            await resendVerificationEmail();
            setMessage('Verification email sent! Please check your inbox.');
        } catch (error) {
            setMessage('Failed to send verification email. Please try again.');
        } finally {
            setSending(false);
        }
    };

    return (
        <div className="bg-yellow-500/10 border-b border-yellow-500/30">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
                <div className="flex items-center justify-between flex-wrap gap-3">
                    <div className="flex-1">
                        <div className="flex items-center gap-2">
                            <svg className="w-5 h-5 text-yellow-400 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                            </svg>
                            <div>
                                <p className="text-yellow-200 font-medium text-sm">
                                    Please verify your email address
                                </p>
                                <p className="text-yellow-200/80 text-xs mt-1">
                                    We sent a verification link to <strong>{currentUser.email}</strong>
                                </p>
                            </div>
                        </div>
                        {message && (
                            <p className={`text-xs mt-2 ${message.includes('sent') ? 'text-green-400' : 'text-red-400'}`}>
                                {message}
                            </p>
                        )}
                    </div>

                    <div className="flex items-center gap-2">
                        <button
                            onClick={handleResend}
                            disabled={sending}
                            className="px-4 py-2 bg-yellow-500 hover:bg-yellow-600 text-black rounded-lg text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {sending ? 'Sending...' : 'Resend Email'}
                        </button>
                        <button
                            onClick={() => setDismissed(true)}
                            className="p-2 text-yellow-200 hover:text-gray-900 transition-colors"
                            aria-label="Dismiss"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
