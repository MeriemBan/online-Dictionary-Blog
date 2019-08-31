import React, { Component } from "react";
import { connect } from "react-redux";

// import css file
import "./style/Signup_Login.css";

class UnconnectedSignup extends Component {
  constructor(props) {
    super(props);
    this.state = { username: "", password: "" };
  }
  passwordChangeHandler = event => {
    console.log(event.target.value);
    this.setState({ password: event.target.value });
  };

  usernameChangeHandler = event => {
    console.log(event.target.value);
    this.setState({ username: event.target.value });
  };

  submitHandler = async event => {
    event.preventDefault();
    console.log("signup");
    console.log(this.state);
    let data = new FormData();
    data.append("username", this.state.username);
    data.append("password", this.state.password);
    let response = await fetch("/signup", {
      method: "POST",
      body: data,
      credentials: "include"
    });
    let responseBody = await response.text();
    let body = JSON.parse(responseBody);
    console.log("body.success", body.success);
    if (!body.success) {
      alert("This username is alreay taken");
      return;
    }

    this.props.dispatch({
      type: "signup-successful"
    });
    this.props.history.push("/");
    return;
  };
  render = () => {
    return (
      <div>
        <form onSubmit={this.submitHandler}>
          <label>Enter your username</label>
          <input
            type="text"
            id="username"
            placeholder="Your username here"
            name="username"
            value={this.state.username}
            onChange={this.usernameChangeHandler}
          />
          <label>Enter your password </label>
          <input
            type="text"
            id="password"
            placeholder="Your password here"
            name="password"
            value={this.state.password}
            onChange={this.passwordChangeHandler}
          />
          <button>Sign up</button>
        </form>
      </div>
    );
  };
}

let Signup = connect()(UnconnectedSignup);
export default Signup;
