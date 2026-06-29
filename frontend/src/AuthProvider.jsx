import { useEffect, useState } from 'react'
import {
  signInWithPopup,
  signOut as firebaseSignOut,
  onAuthStateChanged,
} from 'firebase/auth'
import { auth, provider } from './firebase'
import { login } from './api'
import { AuthContext } from './AuthContext'

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [idToken, setIdToken] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        const token = await firebaseUser.getIdToken()
        setIdToken(token)
        try {
          const userData = await login(token)
          setUser(userData)
        } catch {
          setUser({ firebaseUid: firebaseUser.uid, email: firebaseUser.email })
        }
      } else {
        setUser(null)
        setIdToken(null)
      }
      setLoading(false)
    })
    return unsub
  }, [])

  async function signInWithGoogle() {
    const result = await signInWithPopup(auth, provider)
    const token = await result.user.getIdToken()
    setIdToken(token)
    const userData = await login(token)
    setUser(userData)
  }

  async function signOut() {
    await firebaseSignOut(auth)
    setUser(null)
    setIdToken(null)
  }

  return (
    <AuthContext.Provider value={{ user, idToken, loading, signInWithGoogle, signOut }}>
      {children}
    </AuthContext.Provider>
  )
}
