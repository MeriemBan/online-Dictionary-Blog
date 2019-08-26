import React, { Component } from "react";
import { connect } from "react-redux";
// import css file

class UnconnectedDictionary extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render = () => {
    return <div>Dictionary and search bar here</div>;
  };
}

let Dictionary = connect()(UnconnectedDictionary);
export default Dictionary;
