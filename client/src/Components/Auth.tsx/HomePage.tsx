import { Button, Stack, Typography } from '@mui/material'
import { Box } from '@mui/system'
import React, { useState, useRef } from 'react'
import { LoginDialog } from './LoginDialog'
import { RegisterDialog } from './RegisterDialog'

type OwnProps = {
  onLogin: (userName: string) => void
}

function HomePage({onLogin}: OwnProps) {
  const inputRef = useRef(null)
  const [userName, setUserName] = useState('')

  function onChangeNameInput(e) {
    setUserName(e.target.value)
  }

  function onEnterClick() {
    if (!userName) return alert('Please, enter name')
    onLogin(userName)
  }

  return (
    <Stack alignItems="center" width="100%">
      <img alt='ЯТЬ' src='pictures/logo.jpg' width="20%" />
      <Typography fontWeight="bold" variant='h3'>ГлаголЪ</Typography>
      <LoginDialog />
      <RegisterDialog />
      {/*
      <div>
        <span>Enter your name </span>
        <input
          ref={inputRef}
          value={userName}
          onChange={onChangeNameInput}
        >
        </input>
        <button onClick={onEnterClick}>Let&apos;s chat</button>
      </div> */}
    </Stack>
  )
}

export default HomePage
