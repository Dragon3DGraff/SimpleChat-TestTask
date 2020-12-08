import React, { useState, useRef } from "react";
import "./HomePage.css";

function HomePage(props) {
  const inputRef = useRef(null);
  const [userName, setUserName] = useState("");

  function onChangeNameInput(e) {
    setUserName(e.target.value);
  }

  function onEnterClick() {
    if (!userName) return alert("Please, enter name");
    props.onLogin(userName);
  }

  return (
    <div className="homepage-wrapper">
      <div className="homePage-main">
        <div>
          <span>Enter your name </span>
          <input
            ref={inputRef}
            onChange={onChangeNameInput}
            value={userName}
          ></input>
          <button onClick={onEnterClick}>Let's chat</button>
        </div>
      </div>
    </div>
  );
}

export default HomePage;
