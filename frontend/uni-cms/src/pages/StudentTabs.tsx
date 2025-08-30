import React, { useEffect, useMemo, useState } from 'react'
import {
  Box, Card, CardContent, CardActions, Button, Typography, Grid, Chip, Snackbar, Alert, CircularProgress
} from '@mui/material'
import { listCourses, Course } from '../api/courses'
import { enroll as enrollApi, getEnrollmentsByStudent, dropEnrollment, EnrollmentDto } from '../api/enrollments'
import { useAuth } from '../context/AuthContext'

const CourseCard: React.FC<{
  title: string; code: string; action?: React.ReactNode; footer?: React.ReactNode
}> = ({ title, code, action, footer }) => (
  <Card elevation={2} sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
    <CardContent sx={{ flexGrow: 1 }}>
      <Typography variant="h6">{title}</Typography>
      <Typography variant="body2" color="text.secondary">{code}</Typography>
      {footer}
    </CardContent>
    <CardActions>{action}</CardActions>
  </Card>
)

type Props = { tabIndex: number }

const StudentTabs: React.FC<Props> = ({ tabIndex }) => {
  const { user } = useAuth()
  const [loading, setLoading] = useState(true)
  const [courses, setCourses] = useState<Course[]>([])
  const [enrollments, setEnrollments] = useState<EnrollmentDto[]>([])
  const [toast, setToast] = useState<{type: 'success' | 'error', msg: string} | null>(null)
  const studentId = user!.id

  async function loadAll() {
    setLoading(true)
    try {
      const [c, e] = await Promise.all([listCourses(), getEnrollmentsByStudent(studentId)])
      setCourses(c.filter(x => x.active))
      setEnrollments(e)
    } catch (err) {
      setToast({ type: 'error', msg: 'Failed to load courses/enrollments' })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { loadAll() }, []) // eslint-disable-line

  const myCourseIds = useMemo(() => new Set(enrollments.map(e => e.courseId)), [enrollments])

  const myCourses = useMemo(
    () => courses.filter(c => myCourseIds.has(c.id)),
    [courses, myCourseIds]
  )

  const allCourses = useMemo(() => courses, [courses])

  async function handleEnroll(courseId: number) {
    try {
      const dto = await enrollApi(studentId, courseId)
      setEnrollments(prev => [...prev, dto])
      setToast({ type: 'success', msg: `Enrolled to ${dto.courseCode}` })
    } catch (err: any) {
      const msg = err?.response?.data || 'Enrollment failed'
      setToast({ type: 'error', msg: String(msg) })
    }
  }

  async function handleDrop(courseId: number) {
    const enr = enrollments.find(e => e.courseId === courseId)
    if (!enr) return
    try {
      await dropEnrollment(enr.id)
      setEnrollments(prev => prev.filter(e => e.id !== enr.id))
      setToast({ type: 'success', msg: `Dropped ${enr.courseCode}` })
    } catch {
      setToast({ type: 'error', msg: 'Failed to drop enrollment' })
    }
  }

  if (loading) {
    return (
      <Box sx={{ display: 'grid', placeItems: 'center', py: 8 }}>
        <CircularProgress />
      </Box>
    )
  }

  if (tabIndex === 0) {
    // My Courses
    return (
      <>
        <Grid container spacing={2}>
          {myCourses.map((c) => (
            <Grid item xs={12} sm={6} md={4} key={c.id}>
              <CourseCard
                title={c.title}
                code={c.code}
                footer={<Chip size="small" label={`${c.credits} credits`} sx={{ mt: 1 }} />}
                action={
                  <>
                    <Button size="small" onClick={() => handleDrop(c.id)}>Drop</Button>
                    <Button size="small" variant="contained">Go to course</Button>
                  </>
                }
              />
            </Grid>
          ))}
          {myCourses.length === 0 && (
            <Box sx={{ p: 2 }}><Typography>No enrollments yet.</Typography></Box>
          )}
        </Grid>
        {toast && (
          <Snackbar
            open={!!toast}
            autoHideDuration={2500}
            onClose={() => setToast(null)}
            anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
          >
            <Alert severity={toast.type}>{toast.msg}</Alert>
          </Snackbar>
        )}
      </>
    )
  }

  if (tabIndex === 1) {
    // All Courses (enroll if not already)
    return (
      <>
        <Grid container spacing={2}>
          {allCourses.map((c) => {
            const already = myCourseIds.has(c.id)
            return (
              <Grid item xs={12} sm={6} md={4} key={c.id}>
                <CourseCard
                  title={c.title}
                  code={c.code}
                  footer={
                    <Box sx={{ mt: 1, display: 'flex', gap: 1 }}>
                      <Chip size="small" label={`${c.credits} credits`} />
                      <Chip size="small" label={`Cap ${c.capacity}`} />
                    </Box>
                  }
                  action={
                    <Button
                      size="small"
                      variant="contained"
                      disabled={already}
                      onClick={() => handleEnroll(c.id)}
                    >
                      {already ? 'Enrolled' : 'Enroll'}
                    </Button>
                  }
                />
              </Grid>
            )
          })}
        </Grid>
        {toast && (
          <Snackbar
            open={!!toast}
            autoHideDuration={2500}
            onClose={() => setToast(null)}
            anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
          >
            <Alert severity={toast.type}>{toast.msg}</Alert>
          </Snackbar>
        )}
      </>
    )
  }

  // Results tab
  return (
    <Box sx={{ display: 'grid', gap: 1 }}>
      {enrollments.length === 0 && <Typography>No results yet.</Typography>}
      {enrollments.map((r) => (
        <Card key={r.id} elevation={1}>
          <CardContent sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Box>
              <Typography fontWeight={600}>{r.courseTitle}</Typography>
              <Typography variant="body2" color="text.secondary">{r.courseCode}</Typography>
            </Box>
            <Box sx={{ display: 'flex', gap: 2, alignItems: 'baseline' }}>
              <Typography color="text.secondary">Marks:</Typography>
              <Typography fontWeight={700}>{r.marks ?? '-'}</Typography>
              <Typography color="text.secondary">Grade:</Typography>
              <Typography fontWeight={700}>{r.grade ?? '-'}</Typography>
            </Box>
          </CardContent>
        </Card>
      ))}
    </Box>
  )
}

export default StudentTabs
