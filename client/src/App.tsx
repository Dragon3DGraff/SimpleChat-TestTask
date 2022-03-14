import React, { useReducer } from 'react'
import { Router, Route } from 'react-router-dom'
import { createBrowserHistory as createHistory } from 'history'
import Chats from './Components/Chats'
import HomePage from './Components/Auth.tsx/HomePage'
import { useTestAuth } from 'hooks/useTestAuth'
import { Box, LinearProgress } from '@mui/material'

const history = createHistory()

function App() {
  const {isLoading, isAuth} = useTestAuth()

  const reducer = (state: any, action: { type: any; payload: { userName: any } }) => {
    switch (action.type) {
    case 'USERLOGGEDIN':
      return {
        ...state,
        userLoggedIn: true,
        author: action.payload.userName,
      }
    default:
      return state
    }
  }
  const [state, dispatch] = useReducer(reducer, {
    userLoggedIn: false,
    author: null,
  })

  const pathname = decodeURI(window.location.pathname)
    .replace('/', '')
    .replace(':', '')

  function onLogin(userName: any) {
    dispatch({
      type: 'USERLOGGEDIN',
      payload: { userName },
    })
  }

  async function onRoomCreate(nameOfRoom: any) {
    console.log(nameOfRoom)
  }

  return (
    <Box height="100vh" width="100vw">
      {isLoading && <LinearProgress />}
      {/* <Router history={history}> */}
      {isAuth ? (
        <Chats
          author={state.author}
          pathname={pathname}
          onRoomCreate={onRoomCreate}
        >
        </Chats>
      ) : (
      // <Route
      //   path="/"
      //   component={(props) => (
        <HomePage
          // userLoggedIn={state.userLoggedIn}
          onLogin={onLogin}
        />

      // )}
      // />
      )}
      {/* </Router> */}
    </Box>
  )
}

export default App
