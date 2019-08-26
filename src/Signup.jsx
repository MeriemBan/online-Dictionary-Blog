import React, { Component } from "react";
import { connect } from "react-redux";
// import css file

class UnconnectedSignup extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render = () => {
    return <div>Signup here</div>;
  };
}

let Signup = connect()(UnconnectedSignup);
export default Signup;
