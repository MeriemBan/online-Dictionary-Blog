import React, { Component } from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
// import css file
import "./style/Signup-Login.css";

class UnconnectedLogin extends Component {
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
  // fetchUser = async () => {
  //   console.log("fetch user");
  //   let response = await fetch("/user");
  //   let responseBody = await response.text();
  //   let parsed = JSON.parse(responseBody);
  //   console.log("parsed[0]", parsed[0]);
  //   this.props.dispatch({ type: "user-profile", user: parsed[0] });
  // };

  submitHandler = async event => {
    event.preventDefault();

    console.log("login");
    console.log(this.state);
    let data = new FormData();
    data.append("username", this.state.username);
    data.append("password", this.state.password);
    let response = await fetch("/login", {
      method: "POST",
      body: data,
      credentials: "include"
    });
    let responseBody = await response.text();
    let body = JSON.parse(responseBody);
    console.log("body.success", body.success);
    if (body.success) {
      console.log("body", body);
      this.setState({ username: this.state.username });
      this.props.dispatch({
        type: "login-successful",
        username: this.state.username
      });

      console.log("fetch user");
      let responseUser = await fetch("/user");
      let responseBodyUser = await responseUser.text();
      let parsedUser = JSON.parse(responseBodyUser);
      console.log("parsedUser[0]", parsedUser[0]);
      this.props.dispatch({ type: "user-profile", user: parsedUser[0] });

      this.props.history.push("/dictionary");

      return;
    }
    alert("Oops, wrong username or password, please try again");
    this.setState({ username: "", password: "" });
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
            <Link className="go-to-signup-login" to={"/signup"}>
              {" "}
              Sign up here
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
              <button id="signup-login-btn">Login</button>
            </div>
          </form>
        </div>
      </div>
    );
  };
}

let Login = connect()(UnconnectedLogin);
export default Login;
