import React, { useEffect, useMemo, useState } from 'react'
import {
  Box, Tabs, Tab, Paper, Typography, IconButton, Tooltip, Snackbar, Alert,
  Button, Dialog, DialogTitle, DialogContent, DialogActions, TextField,
  Table, TableHead, TableRow, TableCell, TableBody, Chip, Stack, Grid,
  CircularProgress
} from '@mui/material'
import { Add, Edit, Delete, Save } from '@mui/icons-material'
import { listUsers, setAdmin, UserRow } from '../api/users'
import { Course, listCourses, createCourse, updateCourse, deleteCourse } from '../api/courses'
import { EnrollmentDto, getEnrollmentsByStudent, getEnrollmentsByCourse } from '../api/enrollments'
import { updateResult } from '../api/results'

type TabKey = 0 | 1 | 2 // Users, Courses, Results

const AdminPanel: React.FC = () => {
  const [tab, setTab] = useState<TabKey>(0)

  return (
    <Box sx={{ display: 'grid', gap: 2 }}>
      <Typography variant="h5" fontWeight={700}>Admin Panel</Typography>

      <Paper elevation={1} sx={{ p: 1 }}>
        <Tabs value={tab} onChange={(_, v) => setTab(v)}>
          <Tab label="Users" />
          <Tab label="Courses" />
          <Tab label="Results" />
        </Tabs>
      </Paper>

      {tab === 0 && <UsersAdmin />}
      {tab === 1 && <CoursesAdmin />}
      {tab === 2 && <ResultsAdmin />}
    </Box>
  )
}

export default AdminPanel

/* -------------------------- USERS -------------------------- */

const UsersAdmin: React.FC = () => {
  const [rows, setRows] = useState<UserRow[] | null>(null)
  const [toast, setToast] = useState<{type:'success'|'error', msg:string} | null>(null)

  async function load() {
    try {
      const data = await listUsers()
      setRows(data)
    } catch {
      setToast({ type: 'error', msg: 'Failed to load users' })
    }
  }

  useEffect(() => { load() }, [])

  async function toggleAdmin(u: UserRow) {
    const next = !(u.isAdmin ?? u.admin ?? false)
    try {
      const updated = await setAdmin(u.id, next)
      setRows(r => (r ?? []).map(x => x.id === u.id ? updated : x))
      setToast({ type: 'success', msg: `${updated.username} is now ${next ? 'Admin' : 'Student'}` })
    } catch (e:any) {
      setToast({ type: 'error', msg: e?.response?.data || 'Update failed' })
    }
  }

  if (!rows) return <CenteredSpinner />

  return (
    <>
      <Paper elevation={1}>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Username</TableCell>
              <TableCell>Email</TableCell>
              <TableCell align="center">Role</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map(u => {
              const isAdmin = !!(u.isAdmin ?? u.admin)
              return (
                <TableRow key={u.id}>
                  <TableCell>{u.id}</TableCell>
                  <TableCell>{u.username}</TableCell>
                  <TableCell>{u.email}</TableCell>
                  <TableCell align="center">
                    <Chip size="small" color={isAdmin ? 'primary' : 'default'} label={isAdmin ? 'Admin' : 'Student'} />
                  </TableCell>
                  <TableCell align="right">
                    <Button size="small" variant="outlined" onClick={() => toggleAdmin(u)}>
                      {isAdmin ? 'Make Student' : 'Make Admin'}
                    </Button>
                  </TableCell>
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
      </Paper>

      <Snack toast={toast} onClose={() => setToast(null)} />
    </>
  )
}

/* -------------------------- COURSES -------------------------- */

type CourseFormState = Partial<Course>

const CoursesAdmin: React.FC = () => {
  const [courses, setCourses] = useState<Course[] | null>(null)
  const [open, setOpen] = useState(false)
  const [editing, setEditing] = useState<Course | null>(null)
  const [form, setForm] = useState<CourseFormState>({})
  const [toast, setToast] = useState<{type:'success'|'error', msg:string} | null>(null)

  async function load() {
    try {
      const data = await listCourses()
      setCourses(data)
    } catch {
      setToast({ type: 'error', msg: 'Failed to load courses' })
    }
  }
  useEffect(() => { load() }, [])

  function openCreate() {
    setEditing(null)
    setForm({ code: '', title: '', description: '', credits: 3, capacity: 100, active: true })
    setOpen(true)
  }

  function openEdit(c: Course) {
    setEditing(c)
    setForm({ ...c })
    setOpen(true)
  }

  async function save() {
    try {
      if (editing) {
        const upd = await updateCourse(editing.id, form)
        setCourses(cs => (cs ?? []).map(c => c.id === upd.id ? upd : c))
        setToast({ type: 'success', msg: `Updated ${upd.code}` })
      } else {
        const created = await createCourse(form)
        setCourses(cs => [created, ...(cs ?? [])])
        setToast({ type: 'success', msg: `Created ${created.code}` })
      }
      setOpen(false)
    } catch (e:any) {
      setToast({ type: 'error', msg: e?.response?.data || 'Save failed' })
    }
  }

  async function remove(id: number) {
    try {
      await deleteCourse(id)
      setCourses(cs => (cs ?? []).filter(c => c.id !== id))
      setToast({ type: 'success', msg: 'Course deleted' })
    } catch {
      setToast({ type: 'error', msg: 'Delete failed' })
    }
  }

  if (!courses) return <CenteredSpinner />

  return (
    <>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
        <Typography variant="h6">Courses</Typography>
        <Button startIcon={<Add />} variant="contained" onClick={openCreate}>Add course</Button>
      </Box>

      <Paper elevation={1}>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>Code</TableCell>
              <TableCell>Title</TableCell>
              <TableCell>Credits</TableCell>
              <TableCell>Capacity</TableCell>
              <TableCell>Active</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {courses.map(c => (
              <TableRow key={c.id}>
                <TableCell>{c.code}</TableCell>
                <TableCell>{c.title}</TableCell>
                <TableCell>{c.credits}</TableCell>
                <TableCell>{c.capacity}</TableCell>
                <TableCell>
                  <Chip size="small" color={c.active ? 'primary' : 'default'} label={c.active ? 'Yes' : 'No'} />
                </TableCell>
                <TableCell align="right">
                  <Stack direction="row" spacing={1} justifyContent="flex-end">
                    <Tooltip title="Edit"><IconButton onClick={() => openEdit(c)}><Edit /></IconButton></Tooltip>
                    <Tooltip title="Delete"><IconButton onClick={() => remove(c.id)}><Delete /></IconButton></Tooltip>
                  </Stack>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Paper>

      <Dialog open={open} onClose={() => setOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>{editing ? 'Edit Course' : 'Create Course'}</DialogTitle>
        <DialogContent sx={{ display: 'grid', gap: 2, pt: 2 }}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={4}>
              <TextField label="Code" value={form.code ?? ''} onChange={e => setForm(f => ({ ...f, code: e.target.value }))} fullWidth />
            </Grid>
            <Grid item xs={12} sm={8}>
              <TextField label="Title" value={form.title ?? ''} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} fullWidth />
            </Grid>
          </Grid>
          <TextField label="Description" multiline minRows={3} value={form.description ?? ''} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} />
          <Grid container spacing={2}>
            <Grid item xs={6}>
              <TextField type="number" label="Credits" value={form.credits ?? 3}
                onChange={e => setForm(f => ({ ...f, credits: Number(e.target.value) }))} fullWidth />
            </Grid>
            <Grid item xs={6}>
              <TextField type="number" label="Capacity" value={form.capacity ?? 100}
                onChange={e => setForm(f => ({ ...f, capacity: Number(e.target.value) }))} fullWidth />
            </Grid>
          </Grid>
          <TextField
            label="Active (true/false)"
            value={String(form.active ?? true)}
            onChange={e => setForm(f => ({ ...f, active: e.target.value === 'true' }))}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>Cancel</Button>
          <Button startIcon={<Save />} variant="contained" onClick={save}>
            Save
          </Button>
        </DialogActions>
      </Dialog>

      <Snack toast={toast} onClose={() => setToast(null)} />
    </>
  )
}

/* -------------------------- RESULTS -------------------------- */

const ResultsAdmin: React.FC = () => {
  const [courses, setCourses] = useState<Course[] | null>(null)
  const [selectedCourseId, setSelectedCourseId] = useState<number | ''>('')
  const [enrs, setEnrs] = useState<EnrollmentDto[] | null>(null)
  const [savingId, setSavingId] = useState<number | null>(null)
  const [grades, setGrades] = useState<Record<number, string>>({})
  const [marks, setMarks] = useState<Record<number, string>>({})
  const [toast, setToast] = useState<{type:'success'|'error', msg:string} | null>(null)

  useEffect(() => { (async () => {
    try {
      const c = await listCourses()
      setCourses(c)
    } catch {
      setToast({ type: 'error', msg: 'Failed to load courses' })
    }
  })() }, [])

  async function loadEnrollments(courseId: number) {
    try {
      const data = await getEnrollmentsByCourse(courseId)
      setEnrs(data)
      // prefill forms with current values
      setGrades(Object.fromEntries(data.map(d => [d.id, d.grade ?? ''])))
      setMarks(Object.fromEntries(data.map(d => [d.id, d.marks != null ? String(d.marks) : ''])))
    } catch {
      setToast({ type: 'error', msg: 'Failed to load enrollments' })
    }
  }

  const selectedCourse = useMemo(
    () => courses?.find(c => c.id === selectedCourseId),
    [courses, selectedCourseId]
  )

  async function save(enrollmentId: number) {
    try {
      setSavingId(enrollmentId)
      const grade = (grades[enrollmentId] ?? '').trim() || null
      const markStr = (marks[enrollmentId] ?? '').trim()
      const markNum = markStr === '' ? null : Number(markStr)
      if (markNum != null && (isNaN(markNum) || markNum < 0 || markNum > 100)) {
        setToast({ type: 'error', msg: 'Marks must be 0–100' })
        return
      }
      await updateResult(enrollmentId, grade, markNum)
      setToast({ type: 'success', msg: 'Saved' })
    } catch (e:any) {
      setToast({ type: 'error', msg: e?.response?.data || 'Save failed' })
    } finally {
      setSavingId(null)
    }
  }

  return (
    <>
      <Stack direction="row" spacing={2} alignItems="center">
        <Typography variant="h6">Update Results</Typography>
        <TextField
          select
          SelectProps={{ native: true }}
          label="Course"
          value={selectedCourseId}
          onChange={(e) => {
            const id = Number(e.target.value)
            setSelectedCourseId(id)
            loadEnrollments(id)
          }}
          sx={{ minWidth: 280 }}
        >
          <option value="" />
          {courses?.map(c => <option key={c.id} value={c.id}>{c.code} — {c.title}</option>)}
        </TextField>
        {selectedCourse && <Chip label={`Capacity ${selectedCourse.capacity}`} size="small" />}
      </Stack>

      {!enrs && selectedCourseId !== '' && <CenteredSpinner />}

      {enrs && (
        <Paper elevation={1} sx={{ mt: 2 }}>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>Student</TableCell>
                <TableCell>Course</TableCell>
                <TableCell>Marks</TableCell>
                <TableCell>Grade</TableCell>
                <TableCell align="right">Save</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {enrs.map(e => (
                <TableRow key={e.id}>
                  <TableCell>{e.studentUsername} (ID {e.studentId})</TableCell>
                  <TableCell>{e.courseCode}</TableCell>
                  <TableCell width={140}>
                    <TextField
                      size="small"
                      value={marks[e.id] ?? ''}
                      onChange={(ev) => setMarks(m => ({ ...m, [e.id]: ev.target.value }))}
                      inputProps={{ inputMode: 'numeric', pattern: '[0-9]*' }}
                      placeholder="0-100"
                    />
                  </TableCell>
                  <TableCell width={120}>
                    <TextField
                      size="small"
                      value={grades[e.id] ?? ''}
                      onChange={(ev) => setGrades(g => ({ ...g, [e.id]: ev.target.value }))}
                      placeholder="A+ / A / B+ ..."
                    />
                  </TableCell>
                  <TableCell align="right" width={120}>
                    <Button
                      startIcon={savingId === e.id ? <CircularProgress size={16} /> : <Save />}
                      variant="contained"
                      onClick={() => save(e.id)}
                      disabled={savingId === e.id}
                    >
                      Save
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
              {enrs.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5}>
                    <Typography>No enrollments for this course.</Typography>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </Paper>
      )}

      <Snack toast={toast} onClose={() => setToast(null)} />
    </>
  )
}

/* -------------------------- helpers -------------------------- */

const Snack: React.FC<{toast: {type:'success'|'error', msg:string} | null, onClose: () => void}> =
({ toast, onClose }) => (
  toast ? (
    <Snackbar open autoHideDuration={2500} onClose={onClose} anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}>
      <Alert severity={toast.type}>{toast.msg}</Alert>
    </Snackbar>
  ) : null
)

const CenteredSpinner: React.FC = () => (
  <Box sx={{ display: 'grid', placeItems: 'center', py: 8 }}>
    <CircularProgress />
  </Box>
)
