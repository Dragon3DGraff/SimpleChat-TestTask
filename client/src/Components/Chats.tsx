import React, { useState, useEffect, ReactEventHandler, SyntheticEvent } from 'react'
import ChatWindow from './ChatWindow'
import axios from 'axios'
import io from 'socket.io-client'
import { Stack, Typography } from '@mui/material'

// const SOCKET_IO_URL = "http://localhost:5000";
const SOCKET_IO_URL = 'http://192.168.50.232:5000'

const socket = io(SOCKET_IO_URL)

function Chats({ author, onRoomCreate, pathname }: any) {
    const [nameOfRoom, setNameOfRoom] = useState('')
    const [rooms, setRooms] = useState<any[]>([])
    const [connectedRooms, setConnectedRooms] = useState(['Default room'])

    useEffect(() => {
        loadRooms()
        //add socket when room created
        socket.on('room created', () => {
            loadRooms()
        })
    }, [])

    useEffect(() => {
        if (
            pathname !== '' &&
      rooms.includes(pathname) &&
      !connectedRooms.includes(pathname)
        ) {
            setConnectedRooms([pathname, ...connectedRooms])
        }
    }, [rooms])

    const loadRooms = async () => {
        const res = await axios.get('/rooms/').catch((e) => console.log(e))

        res && setRooms(res.data.rooms)
    }

    const onInputChange = (e: { target: { value: React.SetStateAction<string> } }) => {
        setNameOfRoom(e.target.value)
    }

    const onCreateRoomClick = async () => {
        if (!nameOfRoom) return alert('Please, enter name of room')
        onRoomCreate(nameOfRoom)
        await axios.post('/rooms', { author, nameOfRoom }).then((response) => {
            if (response.data === 'Choose another name') alert(response.data)
        })
        socket.emit('room created', nameOfRoom)
        loadRooms()
        setConnectedRooms([nameOfRoom, ...connectedRooms])
        setNameOfRoom('')
    }
    const onRoomNameClick = (e: React.MouseEvent<HTMLLIElement>) => {
        // if (connectedRooms.includes(e.target.innerHTML)) return
        // setConnectedRooms([e.target.innerHTML, ...connectedRooms])
    }

    return (
        <Stack alignItems='center' justifyContent="center">
            <Typography variant="h2">&#1123;-ГлаголЪ </Typography>

            {/* <Chats-Head> */}
            <Stack alignItems="center" direction='row' spacing={1}>        <Typography>You joined as</Typography>
                <Typography color='primary' fontWeight="bold">
                    {author}
                </Typography></Stack>
            <br></br>
            <input
                className="Chats-inputNewRoom"
                placeholder="Enter name for new room"
                value={nameOfRoom}
                onChange={onInputChange}
            ></input>
            <button onClick={onCreateRoomClick}>New room</button>
            <ul className="Chats-existed-rooms">
                {' '}
        Existed rooms - click name to join
                {rooms.map((room) => (
                    <li key={room} onClick={onRoomNameClick}>
                        {room}
                    </li>
                ))}
            </ul>
            {/* </Chats-Head> */}
            <div className="Chats-chats">
                {connectedRooms.map((room) => (
                    <ChatWindow key={room} author={author} roomName={room}></ChatWindow>
                ))}
            </div>
        </Stack >
    )
}

export default Chats
