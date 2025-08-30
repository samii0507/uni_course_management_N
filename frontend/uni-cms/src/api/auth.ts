import client from './client'

export interface User {
  id: number
  email: string
  username: string
  // backend returns isAdmin; sometimes libs map to "admin"—support both:
  isAdmin?: boolean
  admin?: boolean
}

export async function login(email: string, password: string): Promise<User> {
  const { data } = await client.post<User>('/auth/login', { email, password })
  return data
}

export async function register({ email, username, password }: { email: string; username: string; password: string }) {
  const { data } = await client.post('/auth/register', { email, username, password })
  return data
}
