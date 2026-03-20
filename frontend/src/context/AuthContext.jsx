import { createContext, useContext, useReducer, useEffect } from 'react'
import { authService } from '../services/authService'
import { userService } from '../services/userService'

const AuthContext = createContext(null)

const initialState = {
  user: JSON.parse(localStorage.getItem('user')) || null,
  token: localStorage.getItem('token') || null,
  loading: false,
  initialized: false
}

function authReducer(state, action) {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, loading: action.payload }
    case 'LOGIN_SUCCESS':
      return { ...state, user: action.payload.user, token: action.payload.token, loading: false }
    case 'UPDATE_USER':
      return { ...state, user: action.payload }
    case 'LOGOUT':
      return { ...state, user: null, token: null, loading: false }
    case 'INITIALIZED':
      return { ...state, initialized: true }
    default:
      return state
  }
}

export function AuthProvider({ children }) {
  const [state, dispatch] = useReducer(authReducer, initialState)

  // Verify token on mount
  useEffect(() => {
    const verifyToken = async () => {
      if (state.token) {
        try {
          const { data } = await userService.getProfile()
          dispatch({ type: 'UPDATE_USER', payload: data.user })
          localStorage.setItem('user', JSON.stringify(data.user))
        } catch {
          logout()
        }
      }
      dispatch({ type: 'INITIALIZED' })
    }
    verifyToken()
  }, [])

  const login = async (credentials) => {
    dispatch({ type: 'SET_LOADING', payload: true })
    try {
      const { data } = await authService.login(credentials)
      localStorage.setItem('token', data.token)
      localStorage.setItem('user', JSON.stringify(data.user))
      dispatch({ type: 'LOGIN_SUCCESS', payload: { user: data.user, token: data.token } })
      return data
    } catch (err) {
      dispatch({ type: 'SET_LOADING', payload: false })
      throw err
    }
  }

  const register = async (userData) => {
    dispatch({ type: 'SET_LOADING', payload: true })
    try {
      const { data } = await authService.register(userData)
      localStorage.setItem('token', data.token)
      localStorage.setItem('user', JSON.stringify(data.user))
      dispatch({ type: 'LOGIN_SUCCESS', payload: { user: data.user, token: data.token } })
      return data
    } catch (err) {
      dispatch({ type: 'SET_LOADING', payload: false })
      throw err
    }
  }

  const logout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    dispatch({ type: 'LOGOUT' })
  }

  const updateUser = (user) => {
    localStorage.setItem('user', JSON.stringify(user))
    dispatch({ type: 'UPDATE_USER', payload: user })
  }

  return (
    <AuthContext.Provider value={{ ...state, login, register, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}