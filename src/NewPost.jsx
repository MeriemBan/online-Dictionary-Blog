import React, { Component } from "react";
import { connect } from "react-redux";
// import { NavLink } from "react-router-dom";
// import css file

class UnconnectedNewPost extends Component {
  constructor(props) {
    super(props);
    this.state = { title: "", post: "", image: {}, tags: [], username: "" };
  }

  onTitleChange = event => {
    event.preventDefault();
    this.setState({ ...this.state, title: event.target.value });
    console.log("title", event.target.value);
  };

  onPostChange = event => {
    event.preventDefault();
    this.setState({ ...this.state, post: event.target.value });
    console.log("post", event.target.value);
  };

  onImageChange = event => {
    event.preventDefault();

    console.log("event.target.files[0]", event.target.files[0]);
    this.setState({ ...this.state, image: event.target.files[0] });
  };

  onTagsChange = event => {
    event.preventDefault();
    console.log("event.target.value of tags", event.target.value);
    this.setState({
      ...this.state,
      tags: this.state.tags.push(event.target.value)
    });
  };

  handleSubmitPost = async () => {
    // event.preventDefault();
    let data = new FormData();
    data.append("file", this.state.image);
    data.append("title", this.state.title);
    data.append("post", this.state.post);
    // data.append("tags", this.state.tags);
    let response = await fetch("/new-post", {
      method: "POST",
      body: data,
      credentials: "include"
    });
    let responseBody = await response.text();
    // let parsed = JSON.parse(responseBody);
    // if (body.success) {
    //   alert("post added successfully");
    //   this.props.history.push("/blog");
    //   return;
    // }
    this.setState({ ...this.state, title: "", post: "", image: {}, tags: [] });
    this.props.history.push("/blog"); //?
  };
  render = () => {
    return (
      <div>
        Add a new post here
        <form onSubmit={this.handleSubmitPost}>
          <div>
            <input
              type="text"
              placeholder="Title"
              value={this.state.title}
              onChange={this.onTitleChange}
            />
          </div>
          <div>
            <input
              type="text"
              placeholder="Body"
              value={this.state.post}
              onChange={this.onPostChange}
            />
          </div>
          <div>
            {/* <select name="post" size="5" multiple onChange={this.onTagsChange}>
              <option value="author">author</option>
              <option value="education">education</option>
              <option value="documentation">documentation</option>
              <option value="archival">archival</option>
              <option value="documentation-science">
                documentation science
              </option>
            </select> */}
          </div>
          <input
            type="file"
            name="file"
            //   value={this.state.image}
            onChange={this.onImageChange}
          />
          <input type="submit" value="post" />
        </form>
      </div>
    );
  };
}

let mapStateToProps = state => {
  return {
    username: state.username
  };
};
let NewPost = connect(mapStateToProps)(UnconnectedNewPost);
export default NewPost;
