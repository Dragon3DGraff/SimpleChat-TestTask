import { Button, Card, CardContent, Chip, IconButton, Stack, TextField, Typography } from '@mui/material'
import React, { useState, useEffect, useRef } from 'react'
import io from 'socket.io-client'
import VideoPanel from './VideoPanel'
import ShareIcon from '@mui/icons-material/Share'
import VideocamIcon from '@mui/icons-material/Videocam'

// const SOCKET_IO_URL = "http://localhost:5000";
const SOCKET_IO_URL = 'http://192.168.50.232:5000'

function ChatWindow({ author, roomName }: any) {
  const messagesRef = useRef<HTMLUListElement>()
  const inputRef = useRef(null)
  const nameofRoomRef = useRef(null)
  const [message, setMessage] = useState('')
  const [messagesArr, setMessagesArr] = useState([])
  const [chatSocket, setChatsocket] = useState(null)
  const [users, setUsers] = useState([])
  const [chatStyle, setChatStyle] = useState('ChatWindow')
  const [enableVideo, setEnableVideo] = useState(false)
  const [localStream, setLocalStream] = useState(null)

  useEffect(() => {
    const socket = io(SOCKET_IO_URL)

    setChatsocket(socket)
    socket.on('chat message', function (msg) {
      updateMessages(msg)
    })
    socket.emit('user connected', roomName, author)
    socket.on('user connected', (fromServer) => {
      setUsers(fromServer.users)
      updateMessages(fromServer.messages)
    })
  }, [])

  useEffect(() => {
    messagesRef.current.scrollTo(0, 99999)
  }, [messagesArr])

  function updateMessages(msg) {
    const messages = msg.map((msg) => (
      <Stack key={msg.text + msg.time}
        className={msg.author === author ? 'messages-own' : 'message-all'}
        direction='column'
      >
        <span className="messages-author"> {msg.author}</span>
        <Typography color='secondary' variant='caption'> {msg.time}</Typography>
        <div
          className={
            msg.author === author ? 'messages-message-own' : 'messages-message'
          }
        >
          {msg.text}
        </div>
      </Stack>
    ))

    setMessagesArr(messages)
  }

  function sendMessage(e) {
    e.preventDefault()
    if (message === '') return
    chatSocket.emit('chat message', roomName, {
      text: message,
      author: author,
      time: new Date().toLocaleString('ru', {
        hour: 'numeric',
        minute: 'numeric',
        second: 'numeric',
      }),
    })
    setMessage('')
    inputRef.current.focus()
  }

  function changeMessage(e) {
    setMessage(e.target.value)
  }

  function onCopyLink() {
    const range = document.createRange()
    const selection = window.getSelection()

    selection.removeAllRanges()
    range.selectNodeContents(nameofRoomRef.current)
    selection.addRange(range)
    document.execCommand('copy')
    selection.removeAllRanges()
    alert(`Link "${range}" copied`)
  }

  function onInputFocus(e) {
    setChatStyle('ChatWindow-Activated')
  }

  function onInputFocusOut(e) {
    setChatStyle('ChatWindow')
  }

  const onVideoClick = () => {
    console.log(navigator.mediaDevices)
    navigator.mediaDevices
      .getUserMedia({ video: true, audio: true })
      .then((stream) => {
        setLocalStream(stream)
        setEnableVideo((prev) => !prev)
      })
  }

  return (

    <Stack direction="row">
      <Card>
        <CardContent>
          <Stack>
            <Stack ref={messagesRef} alignItems="flex-end" direction="column" id="messages" spacing={2}>
              {messagesArr}
            </Stack>
            <form action="" onSubmit={sendMessage}>
              {/* <Stack direction="row"> */}
              <TextField
                multiline
                autoComplete="off"
                className="messageInput"
                id={`messageInput${roomName}`}
                inputRef={inputRef}
                size='small'
                value={message}
                onBlur={onInputFocusOut}
                onChange={changeMessage}
                onFocus={onInputFocus}
              />
              <Button>Молвить</Button>
              {/* </Stack> */}
            </form>
          </Stack>

        </CardContent>
      </Card>
      <Stack p={2}>
        {/* <div className="Chat-users"> */}
        {/* <div className="Chat-name"> */}
        <Stack alignItems="center" direction="row" >
          <Typography>{roomName}</Typography>

          <IconButton onClick={onCopyLink}>
            <ShareIcon fontSize='small' />
          </IconButton>
          <IconButton onClick={onVideoClick}><VideocamIcon /></IconButton>
        </Stack>

        {enableVideo ? (
          <VideoPanel
            author={author}
            localStream={localStream}
            roomName={roomName}
            socket={chatSocket}
            users={users}
          />
        ) : null}
        {/* </div> */}
        {/* <hr></hr> */}
        <div>В сети ({users.length})</div>
        {users.map((user) => (
          <div key={user.id + user.name} className="Chat-users">
            {user.name}
          </div>
        ))}
        {/* </div> */}

        <Typography ref={nameofRoomRef} visibility='hidden'>
          {encodeURI(window.location.origin + '/:' + roomName)}
        </Typography>
      </Stack>
    </Stack>

  )
}

export default ChatWindow
