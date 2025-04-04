// @ts-nocheck
"use client"
import { useState, createContext, useEffect, useContext } from 'react';
import { auth, registerUserWithEmailAndPassword } from '@/lib/firebase';
// import Cookies from 'js-cookie';

const AuthContext = createContext();

export function useAuth() {
  const context = useContext(AuthContext);
  return context;
}


export function AuthProvider({ children }) {
  const [loading, setLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState<any>(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      setTimeout(()=> {
        if (user) {
          setCurrentUser(user);
        } else {
          // Cookies.remove('currentuser')
          // sessionStorage.removeItem('sessionAuthenticated');
          // user = null;
          setCurrentUser(null);
        }
        setLoading(false);
      },0);
    });
    return unsubscribe;
  }, []);

  console.log()
  const value = { currentUser, setCurrentUser, loading, setLoading };
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;

}