import React, { useState } from 'react'
import Container from '@mui/material/Container'
import Navbar from '../components/Navbar'
import AdminPanel from './AdminPanel'
import StudentTabs from './StudentTabs'
import { useAuth } from '../context/AuthContext'

const Dashboard: React.FC = () => {
  const { isAdmin } = useAuth()
  const [tab, setTab] = useState<number>(0)

  return (
    <>
      <Navbar onTabChange={setTab} activeTab={tab} showStudentTabs={!isAdmin} />
      <Container maxWidth="lg" sx={{ pb: 6 }}>
        {isAdmin ? <AdminPanel /> : <StudentTabs tabIndex={tab} />}
      </Container>
    </>
  )
}

export default Dashboard
