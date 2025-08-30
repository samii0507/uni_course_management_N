import client from './client'

export interface UserRow {
  id: number
  email: string
  username: string
  isAdmin?: boolean
  admin?: boolean
}

export async function listUsers(): Promise<UserRow[]> {
  // Controller should expose GET /api/users
  const { data } = await client.get<UserRow[]>('/users')
  return data
}

export async function setAdmin(userId: number, isAdmin: boolean): Promise<UserRow> {
  // Map to your UserService.updateAdminStatus()
  // Controller route assumed: PUT /api/users/{id}/admin with body {isAdmin}
  const { data } = await client.put<UserRow>(`/users/${userId}/admin`, { isAdmin })
  return data
}
