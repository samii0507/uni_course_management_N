import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { login as loginApi, register as registerApi } from '../api/auth'
import { useAuth } from '../context/AuthContext'
import {
  Box, Button, Card, CardContent, CardHeader, TextField, Typography, Alert
} from '@mui/material'

const AuthPage: React.FC = () => {
  const [email, setEmail] = useState('')
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [isLogin, setIsLogin] = useState(true)  // Toggle between Login/Registration
  const navigate = useNavigate()
  const { login } = useAuth()

  // Handle Login
  async function handleLoginSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const user = await loginApi(email, password)
      login(user)
      navigate('/')
    } catch {
      setError('Invalid credentials')
    } finally {
      setLoading(false)
    }
  }

  // Handle Registration
  async function handleRegisterSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    setError('')

    // Passwords should match
    if (password !== confirmPassword) {
      setError('Passwords do not match')
      setLoading(false)
      return
    }

    try {
      await registerApi({ email, username, password })
      setIsLogin(true) // Switch to login view after successful registration
    } catch {
      setError('Failed to register')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Box
      sx={{
        minHeight: '100vh',
        backgroundImage: 'url(/login-bg.jpg)', // background image
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        display: 'grid',
        placeItems: 'center',
        p: 2,
      }}
    >
      <Card sx={{ width: 420, backdropFilter: 'blur(3px)' }}>
        <CardHeader
          title={
            <Typography variant="h5" align="center" sx={{ fontWeight: 700 }}>
              eKelaniya {isLogin ? 'Login' : 'Register'}
            </Typography>
          }
        />
        <CardContent>
          <Box
            component="form"
            onSubmit={isLogin ? handleLoginSubmit : handleRegisterSubmit}
            sx={{ display: 'grid', gap: 2 }}
          >
            {/* Email Input */}
            <TextField
              label="Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              fullWidth
            />
            
            {/* Password Input */}
            <TextField
              label="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              fullWidth
            />
            {!isLogin && (
              // Confirm Password (only for registration)
              <TextField
                label="Confirm Password"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                fullWidth
              />
            )}

            {error && <Alert severity="error">{error}</Alert>}
            <Button type="submit" variant="contained" disabled={loading}>
              {loading ? (isLogin ? 'Logging in…' : 'Registering…') : (isLogin ? 'Log in' : 'Register')}
            </Button>
          </Box>

          <Box sx={{ mt: 2, display: 'flex', justifyContent: 'center' }}>
            <Button onClick={() => setIsLogin((prev) => !prev)} sx={{ textDecoration: 'underline' }}>
              {isLogin ? "Don't have an account? Register" : "Already have an account? Login"}
            </Button>
          </Box>
        </CardContent>
      </Card>
    </Box>
  )
}

export default AuthPage
