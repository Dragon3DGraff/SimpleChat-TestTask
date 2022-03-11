import React, { useState, useEffect, useRef } from 'react'
import io from 'socket.io-client'
import VideoPanel from './VideoPanel'

// const SOCKET_IO_URL = "http://localhost:5000";
const SOCKET_IO_URL = 'http://192.168.50.232:5000'

function ChatWindow({ author, roomName }:any) {
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
            <li
                key={msg.text + msg.time}
                className={msg.author === author ? 'messages-own' : 'message-all'}
            >
                <span className="messages-author"> {msg.author}</span>
                <span className="messages-time"> at {msg.time}</span>
                <br />
                <div
                    className={
                        msg.author === author ? 'messages-message-own' : 'messages-message'
                    }
                >
                    {msg.text}
                </div>
            </li>
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
        <div className={chatStyle}>
            <div className="Chat-messages">
                <ul ref={messagesRef} className="messages" id="messages">
                    {messagesArr}
                </ul>
                <form action="" onSubmit={sendMessage}>
                    <input
                        ref={inputRef}
                        autoComplete="off"
                        className="messageInput"
                        id={`messageInput${roomName}`}
                        value={message}
                        onBlur={onInputFocusOut}
                        onChange={changeMessage}
                        onFocus={onInputFocus}
                    />
                    <button>Send</button>
                </form>
            </div>
            <div className="Chat-users">
                <div className="Chat-name">
                    {roomName}
                    <div className="ChatWindow-VideoButton" onClick={onVideoClick}>
            Video
                    </div>
                    {enableVideo ? (
                        <VideoPanel
                            author={author}
                            localStream={localStream}
                            roomName={roomName}
                            socket={chatSocket}
                            users={users}
                        ></VideoPanel>
                    ) : null}
                </div>
                <hr></hr>
                <div>Online ({users.length})</div>
                {users.map((user) => (
                    <div key={user.id + user.name} className="Chat-users">
                        {user.name}
                    </div>
                ))}
            </div>
            <div className="ChatWindow-CopyLink" onClick={onCopyLink}>
        Copy chat link
                <div ref={nameofRoomRef} className="ChatWindow-HiddenLink">
                    {encodeURI(window.location.origin + '/:' + roomName)}
                </div>
            </div>
        </div>
    )
}

export default ChatWindow
