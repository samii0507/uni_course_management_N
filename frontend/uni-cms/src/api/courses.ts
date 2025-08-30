import client from './client'

export interface Course {
  id: number
  code: string
  title: string
  description?: string
  credits: number
  capacity: number
  active: boolean
}

export async function listCourses(): Promise<Course[]> {
  const { data } = await client.get<Course[]>('/courses')
  return data
}

/** Admin-only helpers (wire up in Admin Panel later) */
export async function createCourse(payload: Partial<Course>): Promise<Course> {
  const { data } = await client.post<Course>('/courses', payload)
  return data
}

export async function updateCourse(id: number, payload: Partial<Course>): Promise<Course> {
  const { data } = await client.put<Course>(`/courses/${id}`, payload)
  return data
}

export async function deleteCourse(id: number): Promise<void> {
  await client.delete(`/courses/${id}`)
}
