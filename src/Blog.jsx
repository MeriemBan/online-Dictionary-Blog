import React, { Component } from "react";
import { connect } from "react-redux";
// import css file

class UnconnectedBlog extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render = () => {
    return <div>Blog section here</div>;
  };
}

let Blog = connect()(UnconnectedBlog);
export default Blog;
