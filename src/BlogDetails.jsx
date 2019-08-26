import React, { Component } from "react";
import { connect } from "react-redux";
// import css file

class UnconnectedBlogDetails extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render = () => {
    return <div>Blog post here</div>;
  };
}

let BlogDetails = connect()(UnconnectedBlogDetails);
export default BlogDetails;
