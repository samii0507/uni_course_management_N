import client from './client'

export interface EnrollmentDto {
  id: number
  studentId: number
  studentUsername: string
  courseId: number
  courseCode: string
  courseTitle: string
  enrolledAt: string
  grade?: string | null
  marks?: number | null
}

export async function enroll(studentId: number, courseId: number): Promise<EnrollmentDto> {
  const { data } = await client.post<EnrollmentDto>('/enrollments/enroll', { studentId, courseId })
  return data
}

export async function dropEnrollment(enrollmentId: number): Promise<void> {
  await client.delete(`/enrollments/${enrollmentId}`)
}

export async function getEnrollmentsByStudent(studentId: number): Promise<EnrollmentDto[]> {
  const { data } = await client.get<EnrollmentDto[]>(`/enrollments/student/${studentId}`)
  return data
}

export async function getEnrollmentsByCourse(courseId: number): Promise<EnrollmentDto[]> {
  const { data } = await client.get<EnrollmentDto[]>(`/enrollments/course/${courseId}`)
  return data
}
