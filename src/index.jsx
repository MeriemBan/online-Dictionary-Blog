import ReactDOM from "react-dom";
import "./main.css";
import App from "./App.jsx";
import React from "react";
import { Provider } from "react-redux";
import { createStore } from "redux";

import reloadMagic from "./reload-magic-client.js"; // automatic reload
reloadMagic(); // automatic reload

let reducer = (state, action) => {
  if (action.type === "signup-successful") {
    return { ...state, signedIn: true };
  }
  if (action.type === "login-successful") {
    return { ...state, loggedIn: true, username: action.username };
  }
  if (action.type === "logout") {
    return {
      ...state,
      loggedIn: false,
      username: action.username,
      searchResult: []
    };
  }
  if (action.type === "search-result") {
    return {
      ...state,
      searchResult: action.searchResult
    };
  }
  if (action.type === "display-posts") {
    return { ...state, blogs: action.blogs };
  }
  if (action.type === "increase-likes") {
    return { ...state, postId: action.postId, likes: action.likes };
  }

  return state;
};

const store = createStore(
  reducer,
  {
    loggedIn: false,
    signedIn: false,
    username: "",
    blogs: [],
    // searchResult: [],
    likes: 0,
    postId: ""
  },
  window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
);

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById("root")
);
