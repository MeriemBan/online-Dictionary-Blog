import React, { Component } from "react";
import { connect } from "react-redux";
// import css file

class UnconnectedNewWord extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render = () => {
    return <div>Add a new word here</div>;
  };
}

let NewWord = connect()(UnconnectedNewWord);
export default NewWord;
