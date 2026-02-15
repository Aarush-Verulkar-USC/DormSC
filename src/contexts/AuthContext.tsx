'use client';
import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  GoogleAuthProvider,
  signInWithPopup,
  sendEmailVerification,
  User
} from 'firebase/auth';
import { auth } from '../lib/firebase';
import { isAdminEmail } from '../lib/admin';

interface AuthContextType {
  currentUser: User | null;
  isAdmin: boolean;
  authError: string | null;
  signup: (email: string, password: string) => Promise<any>;
  login: (email: string, password: string) => Promise<any>;
  logout: () => Promise<void>;
  signInWithGoogle: () => Promise<any>;
  resendVerificationEmail: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [authError, setAuthError] = useState<string | null>(null);

  async function signup(email: string, password: string) {
    setAuthError(null);
    // Validate email domain before creating account
    const emailLower = email.toLowerCase();
    if (!emailLower.endsWith('@usc.edu') && !isAdminEmail(emailLower)) {
      throw new Error('Only @usc.edu email addresses are allowed.');
    }

    const result = await createUserWithEmailAndPassword(auth, email, password);
    await sendEmailVerification(result.user);
    return result;
  }

  async function login(email: string, password: string) {
    setAuthError(null);
    // Validate email domain before attempting login
    const emailLower = email.toLowerCase();
    if (!emailLower.endsWith('@usc.edu') && !isAdminEmail(emailLower)) {
      throw new Error('Only @usc.edu email addresses are allowed.');
    }

    return signInWithEmailAndPassword(auth, email, password);
  }

  function logout() {
    setAuthError(null);
    return signOut(auth);
  }

  async function signInWithGoogle() {
    setAuthError(null);
    const provider = new GoogleAuthProvider();
    const result = await signInWithPopup(auth, provider);

    // Validate email domain after Google sign-in
    const email = result.user?.email?.toLowerCase() || '';
    if (!email.endsWith('@usc.edu') && !isAdminEmail(email)) {
      // Sign out immediately if email is not USC
      await signOut(auth);
      setAuthError('INVALID_DOMAIN');
      throw new Error('Only @usc.edu email addresses are allowed. Please sign in with your USC email.');
    }

    return result;
  }

  async function resendVerificationEmail() {
    if (currentUser && !currentUser.emailVerified) {
      await sendEmailVerification(currentUser);
    } else {
      throw new Error('No user logged in or email already verified');
    }
  }

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      // Validate email domain for all authenticated users
      if (user && user.email) {
        const email = user.email.toLowerCase();

        // Check if email is USC or admin
        if (!email.endsWith('@usc.edu') && !isAdminEmail(email)) {
          console.warn('Unauthorized email domain detected:', email);
          // Automatically sign out users with invalid email domains
          await signOut(auth);
          setCurrentUser(null);
          setAuthError('INVALID_DOMAIN');
          setLoading(false);
          return;
        }
      }

      setCurrentUser(user);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const value: AuthContextType = {
    currentUser,
    isAdmin: isAdminEmail(currentUser?.email),
    authError,
    signup,
    login,
    logout,
    signInWithGoogle,
    resendVerificationEmail
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}