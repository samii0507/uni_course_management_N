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

export async function register(params: {
  email: string
  username: string
  password: string
}): Promise<User> {
  const { data } = await client.post<User>('/auth/register', params)
  return data
}
