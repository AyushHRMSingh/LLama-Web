import { initializeApp } from "firebase/app";
import { initializeFirestore, updateDoc } from "firebase/firestore";
import {
  getAuth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
} from "firebase/auth";

import { doc, getDoc, setDoc, getFirestore } from "firebase/firestore";
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};


// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);

export const db = initializeFirestore(app, {
  experimentalForceLongPolling: true,
});

export const registerUserWithEmailAndPassword = async (email:string, password:string) => {
  if (!email || !password) return;

  const response = await createUserWithEmailAndPassword(auth, email, password);

  const userDocRef = doc(db, 'users', response.user.uid,);
  const userDocSnap = await getDoc(userDocRef);
  if (!userDocSnap.exists()) {
    try {
      await setDoc(userDocRef, {
        id: response.user.uid,
        email: response.user.email,
        createdAt: new Date().toISOString(),
        resources: {},
      });
    } catch (error) {
      console.error('Error adding document: ', error);
    }

    return true;
  }
};

export const signInUserWithEmailAndPassword = async (email:string, password:string) => {
  if (!email || !password) return false;
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return {
      success:true,
      message:"Account authenticated successfully"
    };
  } catch(e) {
    console.error(e)
    return {
      success:false,
      message:"Authentication Failed"
    };
  }
};

export const signOutUser = async () => {
  await auth.signOut();
  console.log("User signed out");
};

export const updateResource = async (resourceDict: JSON, user:any) => {
  const userDocRef = doc(db, 'users', user.uid);
  const userDocSnap = await getDoc(userDocRef);
  console.log(resourceDict);
  if (userDocSnap.exists()) {
    try {
      await updateDoc(userDocRef, {
        resources: resourceDict,
      });
    } catch (error) {
      console.error('Error updating document: ', error);
    }
  }
}

export const getResource = async (user:any) => {
  const userDocRef = await doc(db, 'users', user["uid"]);
  const userDocSnap = await getDoc(userDocRef);
  if (userDocSnap.exists()) {
    return userDocSnap.data().resources;
  } else {
    return {};
  }
}