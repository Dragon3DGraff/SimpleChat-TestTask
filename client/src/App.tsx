import { Route, Routes } from 'react-router-dom'
import Chats from './Components/Chats'
import HomePage from './Components/Auth.tsx/HomePage'
import { useTestAuth } from 'hooks/useTestAuth'
import { Box, LinearProgress, Stack } from '@mui/material'
import { LoginIn } from 'Components/Auth.tsx/LoginIn'
import { Registration } from 'Components/Auth.tsx/Registration'

function App() {
  const {isLoading} = useTestAuth()

  if (isLoading) return <Box><LinearProgress /></Box>

  return (
    <Stack alignItems="center" px={3} width="80vw">
      <Routes>
        <Route
          element={
            <HomePage />
          } path="/" />
        <Route
          element={
            <Chats author='Вася' pathname='v' onRoomCreate={(nameOfRoom) => console.log(`${nameOfRoom} created`)} />
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

    </Stack>
  )
}

export default App
