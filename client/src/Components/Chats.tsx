import React, { useState, useEffect } from 'react'
import ChatWindow from './ChatWindow'
import axios from 'axios'
import io from 'socket.io-client'
import { Avatar, Button, List, ListItemAvatar, ListItemButton, ListItemText, Stack, TextField, Typography } from '@mui/material'
import { useLogout } from 'hooks/useLogout'
import { deepOrange } from '@mui/material/colors'

// const SOCKET_IO_URL = "http://localhost:5000";
const SOCKET_IO_URL = 'http://192.168.50.232:5000'

const socket = io(SOCKET_IO_URL)

type OwnProps = {
  author: string, onRoomCreate: (nameOfRoom: string) => void, pathname: string
}

function Chats({ author, onRoomCreate, pathname }: OwnProps) {
  const [nameOfRoom, setNameOfRoom] = useState('')
  const [rooms, setRooms] = useState<any[]>([])
  const [connectedRooms, setConnectedRooms] = useState(['Default room'])
  const [selectedRoom, setSelectedRoom] = useState('Default room')

  const { sendLogout } = useLogout()

  useEffect(() => {
    // let isSubscribed = true

    loadRooms()
    //add socket when room created
    socket.on('room created', () => {
      loadRooms()
    })

    return () => {socket.disconnect()}

    // return () => (isSubscribed = false)
  }, [])

  useEffect(() => {
    if (
      pathname !== '' &&
      rooms.includes(pathname) &&
      !connectedRooms.includes(pathname)
    ) {
      setConnectedRooms([pathname, ...connectedRooms])
    }
    // return () => {socket.disconnect()}

  }, [rooms])

  const loadRooms = async () => {
    const res = await axios.get('/rooms').catch((e) => console.log(e))

    res && setRooms(res.data.rooms)
  }

  const onInputChange = (e: { target: { value: React.SetStateAction<string> } }) => {
    setNameOfRoom(e.target.value)
  }

  const onCreateRoomClick = async () => {
    if (!nameOfRoom) return alert('Please, enter name of room')
    onRoomCreate(nameOfRoom)
    await axios.post('/rooms', { author: 'author', nameOfRoom }).then((response) => {
      if (response.data === 'Choose another name') alert(response.data)
    })
    socket.emit('room created', nameOfRoom)
    loadRooms()
    setConnectedRooms([nameOfRoom, ...connectedRooms])
    setNameOfRoom('')
    setSelectedRoom(nameOfRoom)
  }
  const onRoomNameClick = ( room: string) => {
    if (connectedRooms.includes(room)) return
    setConnectedRooms([room])
    setSelectedRoom(room)
  }

  return (
    <Stack alignItems='center' justifyContent="center">
      <Typography variant="h2">&#1123;-ГлаголЪ </Typography>

      {/* <Chats-Head> */}
      <Stack alignItems="baseline" direction='row' spacing={1}>
        <Typography>Вы - </Typography>
        <Typography color='primary' fontWeight="bold">
          {author}
        </Typography>
        <Button size='small' variant='text' onClick={() => sendLogout()}>Выйти</Button>
      </Stack>
      <Stack alignItems="center" direction='row' justifyContent='center' spacing={1} width='100%'>
        <TextField
          className="Chats-inputNewRoom"
          placeholder="Имя комнаты"
          size="small"
          value={nameOfRoom}
          variant='standard'
          onChange={onInputChange}
        >
        </TextField>
        <Button onClick={onCreateRoomClick}>Создать</Button>
      </Stack>

      <Stack direction="row">
        <List
          dense
          component="nav"
        >
          {rooms.map((room, index) => (
            <ListItemButton key={room} selected={selectedRoom === room} onClick={() => onRoomNameClick(room)}>
              <ListItemAvatar>
                <Avatar src={`https://i.pravatar.cc/50?img=${index+6}`} sx={{ bgcolor: deepOrange[500] }}>N</Avatar>
              </ListItemAvatar>
              <ListItemText>{room}</ListItemText>
            </ListItemButton>
          ))}
        </List>

        <ChatWindow author={author} roomName={selectedRoom} />
      </Stack>
    </Stack >
  )
}

export default Chats
