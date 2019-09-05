import React, { Component } from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
// import css file
import "./style/Signup-Login.css";

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
      <div className="login-global-box">
        <div className="login-form-box">
          <div>
            <div id="dico-name">
              INFORMATION SCIENCE ~ TRILINGUAL DICTIONARY
            </div>
          </div>

          <div className="go-to-signup-login">
            <Link className="go-to-signup-login" to={"/"}>
              {" "}
              Login here
            </Link>
          </div>

          <form onSubmit={this.submitHandler}>
            <div className="sinup-login-username-label-input">
              <div className="signup-login-label">Enter your username</div>
              <input
                type="text"
                id="sinup-login-username"
                // placeholder="Your username here"
                name="username"
                value={this.state.username}
                onChange={this.usernameChangeHandler}
              />
            </div>

            <div className="sinup-login-password-label-input">
              <div className="signup-login-label">Enter your password </div>
              <input
                type="password"
                id="sinup-login-password"
                // placeholder="Your password here"
                name="password"
                value={this.state.password}
                onChange={this.passwordChangeHandler}
              />
            </div>
            <div>
              <button id="signup-login-btn">Sign up</button>
            </div>
          </form>
        </div>
      </div>
    );
  };
}

let Signup = connect()(UnconnectedSignup);
export default Signup;
