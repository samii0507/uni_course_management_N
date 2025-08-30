import React from 'react'
import AppBar from '@mui/material/AppBar'
import Toolbar from '@mui/material/Toolbar'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import Box from '@mui/material/Box'
import { useAuth } from '../context/AuthContext'

type Props = {
  onTabChange: (idx: number) => void
  activeTab: number
  showStudentTabs?: boolean
}

const Navbar: React.FC<Props> = ({ onTabChange, activeTab, showStudentTabs }) => {
  const { user, isAdmin, logout } = useAuth()

  return (
    <AppBar position="static" color="inherit" elevation={1} sx={{ mb: 2 }}>
      <Toolbar sx={{ display: 'flex', gap: 2 }}>
        <Typography variant="h6" sx={{ flexGrow: 1 }}>
          eKelaniya CMS
        </Typography>

        {showStudentTabs && !isAdmin && (
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Button
              variant={activeTab === 0 ? 'contained' : 'text'}
              onClick={() => onTabChange(0)}
            >
              My Courses
            </Button>
            <Button
              variant={activeTab === 1 ? 'contained' : 'text'}
              onClick={() => onTabChange(1)}
            >
              All Courses
            </Button>
            <Button
              variant={activeTab === 2 ? 'contained' : 'text'}
              onClick={() => onTabChange(2)}
            >
              Results
            </Button>
          </Box>
        )}

        {isAdmin && <Button disabled variant="outlined">Admin Panel</Button>}

        {user && (
          <Button color="error" variant="outlined" onClick={logout}>
            Logout
          </Button>
        )}
      </Toolbar>
    </AppBar>
  )
}

export default Navbar
