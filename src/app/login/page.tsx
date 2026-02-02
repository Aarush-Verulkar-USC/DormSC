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

    // Basic password validation for sign up
    if (isSignUp && password.length < 6) {
      setError('Password should be at least 6 characters');
      return;
    }

    try {
      setError('');
      setSuccess('');
      setLoading(true);

      if (isSignUp) {
        if (!email.endsWith('@usc.edu') && !isAdminEmail(email)) {
          throw new Error('Only @usc.edu email addresses are allowed.');
        }
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
      // Use the error message if it was thrown manually
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
      const result = await signInWithGoogle();
      const email = result.user?.email || '';

      if (!email.endsWith('@usc.edu') && !isAdminEmail(email)) {
        await logout();
        setError('Only @usc.edu email addresses are allowed. Please sign in with your USC email.');
        return;
      }

      router.push('/');
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Google sign-in failed. Please try again.';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden bg-gray-950 text-white">
      {/* Background */}
      <div className="absolute inset-0 bg-gray-950"></div>

      <div className="relative z-10 min-h-screen flex items-center justify-center p-4">
        <div className="w-full max-w-md mx-auto">

          {/* Header */}
          <div className="text-center mb-8 pt-20">
            <h1 className="text-4xl font-bold text-white mb-3 tracking-tight">
              Welcome to DormSC
            </h1>
            <p className="text-gray-300 text-lg leading-relaxed">
              Sign in to access student housing.
            </p>
          </div>

          {/* Main Card */}
          <div className="backdrop-blur-lg bg-white/10 border border-white/20 rounded-3xl shadow-2xl p-8">

            {error && (
              <div className="bg-red-500/20 border border-red-400/30 text-red-200 px-4 py-3 rounded-2xl text-sm mb-6 animate-fadeIn backdrop-blur-sm">
                <div className="flex items-center gap-3">
                  <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>{error}</span>
                </div>
              </div>
            )}

            {success && (
              <div className="bg-purple-500/20 border border-purple-400/30 text-purple-200 px-4 py-3 rounded-2xl text-sm mb-6 animate-fadeIn backdrop-blur-sm">
                <div className="flex items-center gap-3">
                  <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>{success}</span>
                </div>
              </div>
            )}

            <form onSubmit={handleEmailAuth} className="space-y-4 mb-6">
              <div>
                <label className="block text-gray-300 text-sm font-medium mb-1.5 ml-1">Email Address</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-white/20 focus:bg-white/10 transition-all duration-200"
                  placeholder="tommy@usc.edu"
                  required
                />
              </div>

              <div>
                <label className="block text-gray-300 text-sm font-medium mb-1.5 ml-1">Password</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-white/20 focus:bg-white/10 transition-all duration-200"
                  placeholder="••••••••"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 px-6 bg-purple-500 hover:bg-purple-600 text-white rounded-xl font-medium text-lg shadow-lg hover:shadow-purple-500/25 transition-all duration-300 hover:-translate-y-0.5 disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none"
              >
                {loading ? 'Processing...' : (isSignUp ? 'Create Account' : 'Sign In')}
              </button>

              <div className="flex items-center justify-between text-sm">
                <button
                  type="button"
                  onClick={() => setIsSignUp(!isSignUp)}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  {isSignUp ? 'Already have an account? Sign In' : 'Need an account? Sign Up'}
                </button>
                {!isSignUp && (
                  <button type="button" className="text-gray-400 hover:text-white transition-colors">
                    Forgot Password?
                  </button>
                )}
              </div>
            </form>

            <div className="relative mb-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-white/10"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 text-gray-400 bg-gray-950 rounded-full">Or continue with</span>
              </div>
            </div>

            <button
              type="button"
              onClick={handleGoogleSignIn}
              disabled={loading}
              className="w-full flex items-center justify-center gap-3 py-3 px-6 bg-white hover:bg-gray-50 text-gray-700 rounded-xl font-medium text-base shadow-lg transition-all duration-300 hover:-translate-y-0.5 disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none border border-gray-200"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-gray-600 border-t-transparent rounded-full animate-spin" />
              ) : (
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                </svg>
              )}
              <span>Google</span>
            </button>

            <div className="mt-8 text-center">
              <p className="text-gray-300 text-sm leading-relaxed">
                By signing in, you agree to our terms of service and privacy policy.
                <br />
                <span className="text-gray-400">USC students only.</span>
              </p>
            </div>
          </div>

          {/* Footer */}
          <div className="mt-8 text-center">
            <p className="text-gray-400 text-sm">
              Need help? Contact support at <span className="text-white">support@dormsc.com</span>
            </p>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .animate-fadeIn {
          animation: fadeIn 0.5s ease-out forwards;
        }
      `}</style>
    </div>
  );
}