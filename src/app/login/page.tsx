'use client';

import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { isAdminEmail } from '@/lib/admin';

export default function Login() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);

  const { signInWithGoogle, login, signup, logout } = useAuth();
  const router = useRouter();

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Please fill in all fields');
      return;
    }

    if (isSignUp && password.length < 6) {
      setError('Password should be at least 6 characters');
      return;
    }

    try {
      setError('');
      setSuccess('');
      setLoading(true);

      if (isSignUp) {
        await signup(email, password);
        await logout();
        setSuccess('Account created! Check your email for a verification link, then sign in.');
        setIsSignUp(false);
        setPassword('');
        return;
      } else {
        const result = await login(email, password);
        if (!result.user.emailVerified && !isAdminEmail(result.user.email)) {
          await logout();
          setError('Please verify your email before signing in. Check your inbox.');
          return;
        }
      }

      router.push('/');
    } catch (error: any) {
      console.error(error);
      let msg = 'Authentication failed';
      if (error.code === 'auth/invalid-credential') msg = 'Invalid email or password';
      if (error.code === 'auth/email-already-in-use') msg = 'Email already in use';
      if (error.code === 'auth/weak-password') msg = 'Password is too weak';
      if (error.message && !error.code) msg = error.message;

      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      setError('');
      setLoading(true);
      await signInWithGoogle();
      router.push('/');
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Google sign-in failed. Check the console for more details.';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center p-4 relative overflow-hidden">
      {/* Background Ambience */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-orange/20 rounded-full blur-[120px] opacity-40 mix-blend-screen" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-orange/10 rounded-full blur-[120px] opacity-30 mix-blend-screen" />
      </div>

      <div className="w-full max-w-[400px] relative z-10">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-serif text-white mb-2">
            {isSignUp ? 'Join DormSC' : 'Welcome Back'}
          </h1>
          <p className="text-gray-400 text-sm">
            {isSignUp ? 'Find your perfect student home' : 'Sign in to manage your listings'}
          </p>
        </div>

        <div className="backdrop-blur-xl bg-white/[0.03] border border-white/[0.08] rounded-2xl p-6 shadow-2xl relative overflow-hidden group">
          {/* Google Sign In */}
          <button
            type="button"
            onClick={handleGoogleSignIn}
            disabled={loading}
            className="w-full bg-white text-black h-11 rounded-lg font-medium text-sm flex items-center justify-center gap-3 hover:bg-gray-100 transition-colors disabled:opacity-70 disabled:cursor-not-allowed mb-6"
          >
            {loading ? (
              <div className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin" />
            ) : (
              <>
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                </svg>
                Continue with Google
              </>
            )}
          </button>

          <div className="relative mb-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-white/[0.08]"></div>
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="px-3 bg-black/50 backdrop-blur-xl text-gray-500">Or use email</span>
            </div>
          </div>

          <form onSubmit={handleEmailAuth} className="space-y-4">
            {error && (
              <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-xs flex items-center gap-2">
                <svg className="w-4 h-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {error}
              </div>
            )}

            {success && (
              <div className="p-3 bg-green-500/10 border border-green-500/20 rounded-lg text-green-400 text-xs flex items-center gap-2">
                <svg className="w-4 h-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                {success}
              </div>
            )}

            <div className="space-y-4">
              <div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-white/[0.05] border border-white/[0.08] rounded-lg px-4 py-3 text-sm text-white focus:outline-none focus:border-orange/50 focus:ring-1 focus:ring-orange/50 transition-all placeholder:text-gray-600"
                  placeholder="USC Email (tommy@usc.edu)"
                  required
                />
              </div>

              <div>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-white/[0.05] border border-white/[0.08] rounded-lg px-4 py-3 text-sm text-white focus:outline-none focus:border-orange/50 focus:ring-1 focus:ring-orange/50 transition-all placeholder:text-gray-600"
                  placeholder="Password"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-orange to-red-600 text-white border-none h-11 rounded-lg font-medium text-sm flex items-center justify-center gap-2 hover:shadow-lg hover:shadow-orange/20 transition-all disabled:opacity-70 mt-6"
            >
              {loading ? (
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                isSignUp ? 'Create Account' : 'Sign In'
              )}
            </button>
          </form>

          <div className="mt-6 text-center">
            <button
              type="button"
              onClick={() => {
                setIsSignUp(!isSignUp);
                setError('');
                setSuccess('');
              }}
              className="text-xs text-gray-500 hover:text-white transition-colors"
            >
              {isSignUp ? 'Already have an account? Sign in' : "Don't have an account? Create one"}
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-8 text-center space-y-2">
          <div className="flex items-center justify-center gap-2 text-xs text-gray-600">
            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-1.07 3.97-2.9 5.33z" />
            </svg>
            <span>Secured by Firebase</span>
          </div>
          <p className="text-xs text-gray-700">© 2026 DormSC. All rights reserved.</p>
        </div>
      </div>
    </div>
  );
}