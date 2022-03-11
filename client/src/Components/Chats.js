import React, { useState, useEffect } from "react";
import ChatWindow from "./ChatWindow";
import "./Chats.css";
import axios from "axios";
import io from "socket.io-client";
import { Typography } from "@mui/material";

// const SOCKET_IO_URL = "http://localhost:5000";
const SOCKET_IO_URL = "http://192.168.50.232:5000";

const socket = io(SOCKET_IO_URL);

function Chats({ author, onRoomCreate, pathname }) {
  const [nameOfRoom, setNameOfRoom] = useState("");
  const [rooms, setRooms] = useState([]);
  const [connectedRooms, setConnectedRooms] = useState(["Default room"]);

  useEffect(() => {
    loadRooms();
    //add socket when room created
    socket.on("room created", () => {
      loadRooms();
    });
  }, []);

  useEffect(() => {
    if (
      pathname !== "" &&
      rooms.includes(pathname) &&
      !connectedRooms.includes(pathname)
    ) {
      setConnectedRooms([pathname, ...connectedRooms]);
    }
  }, [rooms]);

  const loadRooms = async () => {
    const { data } = await axios.get(`/rooms/`).catch((e) => console.log(e));
    setRooms(data.rooms);
  };

  const onInputChange = (e) => {
    setNameOfRoom(e.target.value);
  };

  const onCreateRoomClick = async () => {
    if (!nameOfRoom) return alert("Please, enter name of room");
    onRoomCreate(nameOfRoom);
    await axios.post("/rooms", { author, nameOfRoom }).then((response) => {
      if (response.data === "Choose another name") alert(response.data);
    });
    socket.emit("room created", nameOfRoom);
    loadRooms();
    setConnectedRooms([nameOfRoom, ...connectedRooms]);
    setNameOfRoom("");
  };
  const onRoomNameClick = (e) => {
    if (connectedRooms.includes(e.target.innerHTML)) return;
    setConnectedRooms([e.target.innerHTML, ...connectedRooms]);
  };

  return (
    <div className="Chats-main">
      
      {/* <Chats-Head> */}
        <div>
        <Typography variant="h2">&#1123;&#1123; ГлаголЪ</Typography>
          You joined as <span className="Chats-TitleAuthor">{author}</span>{" "}
        </div>
        <br></br>
        <input
          placeholder={"Enter name for new room"}
          className="Chats-inputNewRoom"
          value={nameOfRoom}
          onChange={onInputChange}
        ></input>
        <button onClick={onCreateRoomClick}>New room</button>
        <ul className="Chats-existed-rooms">
          {" "}
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
    </div>
  );
}

export default Chats;
