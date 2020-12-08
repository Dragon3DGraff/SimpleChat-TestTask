import React, { useReducer } from "react";
import "./App.css";
import { Router, Route } from "react-router-dom";
import { createBrowserHistory as createHistory } from "history";
import Chats from "./Components/Chats";
import HomePage from "./Components/HomePage";

const history = createHistory();

function App() {
  const reducer = (state, action) => {
    switch (action.type) {
      case "USERLOGGEDIN":
        return {
          ...state,
          userLoggedIn: true,
          author: action.payload.userName,
        };
      default:
        return state;
    }
  };
  const [state, dispatch] = useReducer(reducer, {
    userLoggedIn: false,
    author: null,
  });

  const pathname = decodeURI(window.location.pathname)
    .replace("/", "")
    .replace(":", "");

  function onLogin(userName) {
    dispatch({
      type: "USERLOGGEDIN",
      payload: { userName },
    });
  }

  async function onRoomCreate(nameOfRoom) {}

  return (
    <div className="App">
      <Router history={history}>
        {state.userLoggedIn ? (
          <Chats
            author={state.author}
            onRoomCreate={onRoomCreate}
            pathname={pathname}
          ></Chats>
        ) : (
          <Route
            path="/"
            component={(props) => (
              <HomePage
                userLoggedIn={state.userLoggedIn}
                onLogin={onLogin}
              ></HomePage>
            )}
          />
        )}
      </Router>
    </div>
  );
}

export default App;
