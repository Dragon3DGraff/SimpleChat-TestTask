import React, {useState, useEffect, useRef} from 'react';
import './ChatWindow.css';
import io from "socket.io-client";

const SOCKET_IO_URL = "http://localhost:5000";

function ChatWindow({author, roomName}) {

	const messagesRef = useRef([]);
	const inputRef = useRef(null);
	const nameofRoomRef = useRef(null);
	const [message, setMessage] = useState('');
	const [messagesArr, setMessagesArr ] = useState([]);
	const [chatSocket, setChatsocket] = useState(null);
	const [users, setUsers] = useState([]);
	const [chatStyle, setChatStyle] = useState('ChatWindow')

	useEffect( () => {
		const socket = io(SOCKET_IO_URL);
		setChatsocket(socket)
		socket.on('chat message', function(msg){
			updateMessages(msg)
			});
		socket.emit('user connected', roomName, author);
		socket.on('user connected', (fromServer) => {
			setUsers(fromServer.users);
			updateMessages(fromServer.messages);
		})

	},[])

	useEffect(() => {
		messagesRef.current.scrollTo(0, 99999);
	  }, [messagesArr]);

	function updateMessages(msg) {
		let messages = msg.map( msg =>
		 <li key={msg.text+msg.time} className={msg.author===author?"messages-own":"message-all"} >
			<span className={"messages-author"}> {msg.author}</span>
			<span className="messages-time"> at {msg.time}</span>
			<br />
			<div className={msg.author === author?"messages-message-own":"messages-message"}>{msg.text}</div>
			</li>)
		setMessagesArr(messages);
	}

	function sendMessage(e) {
		e.preventDefault();
		if(message === "") return;
		chatSocket.emit('chat message',
		roomName, 
		 {
			 text: message,
			 author: author,
			 time: new Date().toLocaleString("ru", {
				 hour: 'numeric',
				 minute: 'numeric',
				second: 'numeric'
			})
		});
		setMessage('');
		inputRef.current.focus();
	}

	function changeMessage(e) {
		setMessage(e.target.value)
	}

	function onCopyLink() {
		let range = document.createRange();
		let selection = window.getSelection();
		selection.removeAllRanges();
		range.selectNodeContents(nameofRoomRef.current);
		selection.addRange(range)
		document.execCommand('copy')
		selection.removeAllRanges();
		alert(`Link "${range}" copied`);
	}

	function onInputFocus(e) {
		setChatStyle('ChatWindow-Activated');
	}

	function onInputFocusOut(e) {
		setChatStyle('ChatWindow');
	}

	return(
		<div className={chatStyle} >
			<div className="Chat-messages">
				<ul ref={messagesRef} className='messages' id="messages">
					{messagesArr}
				</ul>
				<form action="" onSubmit={sendMessage}>
					<input ref={inputRef} autoComplete="off" className='messageInput' id={`messageInput${roomName}`} value={message} onChange={changeMessage} onFocus={onInputFocus} onBlur={onInputFocusOut} /><button >Send</button>
				</form>
			</div>
			<div className="Chat-users">
				<div className="Chat-name">{roomName}
					{/* <div className="ChatWindow-LeaveButton" onClick={onClickLeave}>X</div> */}
				</div>
				
				<hr></hr>
				<div>Online ({users.length})</div>
				{users.map((user) => <div key={user.id+user.name} className="Chat-users">{user.name}</div> )}
			</div>
			<div className='ChatWindow-CopyLink' onClick={onCopyLink}>Copy chat link
				<div ref={nameofRoomRef} className="ChatWindow-HiddenLink" >{encodeURI(window.location.origin + '/:' + roomName)}</div>
			</div>
			
	</div>
	)
}

export default ChatWindow;