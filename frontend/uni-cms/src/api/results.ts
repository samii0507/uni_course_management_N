import client from './client'

export interface Result {
  id: number
  grade: string | null
  marks: number | null
  // enrollment hidden by backend; not needed here
}

export async function updateResult(enrollmentId: number, grade: string | null, marks: number | null) {
  const { data } = await client.post<Result>('/results/update', { enrollmentId, grade, marks })
  return data
}

export async function getResult(enrollmentId: number) {
  const { data } = await client.get<Result>(`/results/${enrollmentId}`)
  return data
}
