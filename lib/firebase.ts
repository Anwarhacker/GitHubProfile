"use client"

import { initializeApp, getApps, type FirebaseApp } from "firebase/app"
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
  onAuthStateChanged,
  type Auth,
  type User,
} from "firebase/auth"

const firebaseConfig = {
  apiKey: "AIzaSyAgNkjsSqjIxWNJLILgdqqNKkRSfrfotJw",
  authDomain: "gitanalyzer-2cfbc.firebaseapp.com",
  projectId: "gitanalyzer-2cfbc",
  storageBucket: "gitanalyzer-2cfbc.firebasestorage.app",
  messagingSenderId: "6613158783",
  appId: "1:6613158783:web:a269548b5134cfe5c0a84a",
  measurementId: "G-4VJV54F3QT",
}

let app: FirebaseApp | null = null
let auth: Auth | null = null
let googleProvider: GoogleAuthProvider | null = null

const getFirebaseApp = (): FirebaseApp | null => {
  if (typeof window === "undefined") return null

  try {
    if (!app) {
      app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0]
    }
    return app
  } catch (error) {
    console.error("Error initializing Firebase app:", error)
    return null
  }
}

const getFirebaseAuth = (): Auth | null => {
  if (typeof window === "undefined") return null

  try {
    const firebaseApp = getFirebaseApp()
    if (!firebaseApp) return null

    if (!auth) {
      auth = getAuth(firebaseApp)
    }
    return auth
  } catch (error) {
    console.error("Error initializing Firebase auth:", error)
    return null
  }
}

const getGoogleProvider = (): GoogleAuthProvider | null => {
  if (typeof window === "undefined") return null

  try {
    if (!googleProvider) {
      googleProvider = new GoogleAuthProvider()
      googleProvider.setCustomParameters({
        prompt: "select_account",
      })
    }
    return googleProvider
  } catch (error) {
    console.error("Error initializing Google provider:", error)
    return null
  }
}

export const signInWithGoogle = async (): Promise<User> => {
  if (typeof window === "undefined") {
    throw new Error("Firebase can only be used in the browser")
  }

  const currentAuth = getFirebaseAuth()
  const currentProvider = getGoogleProvider()

  if (!currentAuth || !currentProvider) {
    throw new Error("Failed to initialize Firebase authentication")
  }

  try {
    const result = await signInWithPopup(currentAuth, currentProvider)
    return result.user
  } catch (error: any) {
    console.error("Error signing in with Google:", error)
    throw error
  }
}

export const logOut = async (): Promise<void> => {
  if (typeof window === "undefined") {
    throw new Error("Firebase can only be used in the browser")
  }

  const currentAuth = getFirebaseAuth()

  if (!currentAuth) {
    throw new Error("Failed to initialize Firebase authentication")
  }

  try {
    await signOut(currentAuth)
  } catch (error) {
    console.error("Error signing out:", error)
    throw error
  }
}

export const onAuthStateChange = (callback: (user: User | null) => void) => {
  if (typeof window === "undefined") {
    callback(null)
    return () => {}
  }

  const currentAuth = getFirebaseAuth()

  if (!currentAuth) {
    callback(null)
    return () => {}
  }

  try {
    return onAuthStateChanged(currentAuth, callback)
  } catch (error) {
    console.error("Error setting up auth state listener:", error)
    callback(null)
    return () => {}
  }
}

export { getFirebaseAuth as auth, getGoogleProvider as googleProvider }
export type { User }
