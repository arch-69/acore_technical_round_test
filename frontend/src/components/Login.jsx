import { useAuth } from '../useAuth'

export default function Login() {
  const { signInWithGoogle } = useAuth()

  return (
    <div className="login-screen">
      <h1>Todo App</h1>
      <p>Sign in with Google to manage your todos</p>
      <button className="google-btn" onClick={signInWithGoogle}>
        Sign in with Google
      </button>
    </div>
  )
}
