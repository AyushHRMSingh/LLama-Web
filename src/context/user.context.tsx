// @ts-nocheck
"use client"
import { useState, createContext, useEffect, useContext } from 'react';
import { auth, registerUserWithEmailAndPassword } from '@/lib/firebase';
import  {
  addUser,
  removeUser,
  getUser
} from "@/functions/user-actions"
import Cookies from 'js-cookie';

const AuthContext = createContext();

export function useAuth() {
  const context = useContext(AuthContext);
  return context;
}


export function AuthProvider({ children }) {
  const [loading, setLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState<any>(() => {
    // const storedUser = localStorage.getItem('currentUser');
    // const storedUser = getUser()
    const storedUser = Cookies.get('currentuser')
    return storedUser ? JSON.parse(JSON.stringify(storedUser)) : null;
  });

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        // console.log('User logged in:', JSON.stringify(user));
        Cookies.set('currentuser', JSON.stringify(user), { path: '/' });
      } else {
        Cookies.remove('currentuser')
        user = null;
      }
      setCurrentUser(user);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const value = { currentUser, setCurrentUser, loading, setLoading };
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;

}