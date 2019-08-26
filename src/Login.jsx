import React, { Component } from "react";
import { connect } from "react-redux";
// import css file

class UnconnectedLogin extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render = () => {
    return <div>Login here</div>;
  };
}

let Login = connect()(UnconnectedLogin);
export default Login;
