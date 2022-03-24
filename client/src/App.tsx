import { Route, Routes } from 'react-router-dom'
import Chats from './Components/Chats'
import HomePage from './Components/Auth.tsx/HomePage'
import { useTestAuth } from 'hooks/useTestAuth'
import { Box, LinearProgress } from '@mui/material'
import { LoginIn } from 'Components/Auth.tsx/LoginIn'
import { Registration } from 'Components/Auth.tsx/Registration'

function App() {
  const {isLoading} = useTestAuth()

  return (
    <Box height="100vh" width="100vw">
      {isLoading && <LinearProgress />}
      <Routes>
        <Route
          element={
            <HomePage />
          } path="/" />
        <Route
          element={
            <Chats />
          } path="/chats" />
        <Route
          element={
            <LoginIn />
          } path="/login" />
        <Route
          element={
            <Registration />
          } path="/registration" />

      </Routes>

    </Box>
  )
}

export default App
