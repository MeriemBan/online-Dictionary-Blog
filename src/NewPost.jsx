import React, { Component } from "react";
import { connect } from "react-redux";
// import { NavLink } from "react-router-dom";
// import css file

class UnconnectedNewPost extends Component {
  constructor(props) {
    super(props);
    this.state = {
      title: "",
      post: "",
      image: {},
      tags: [],
      username: "",
      authorName: ""
    };
  }

  onTitleChange = event => {
    event.preventDefault();
    this.setState({ title: event.target.value });
    console.log("title", event.target.value);
  };

  onPostChange = event => {
    event.preventDefault();
    this.setState({ post: event.target.value });
    console.log("post", event.target.value);
  };

  onImageChange = event => {
    event.preventDefault();

    console.log("event.target.files[0]", event.target.files[0]);
    this.setState({ image: event.target.files[0] });
  };

  onTagsChange = event => {
    event.preventDefault();
    let tags = Array.from(event.target.selectedOptions).map(
      option => option.value
    );
    this.setState({ tags }, () => {
      console.log("this.state.tags", this.state.tags);
    });
  };
  onAuthorNameChange = event => {
    event.preventDefault();
    this.setState({ authorName: event.target.value });
  };

  handleSubmitPost = async () => {
    event.preventDefault();
    console.log("this.state.tags", this.state.tags);
    let data = new FormData();
    console.log("this.state.image", this.state.image);
    data.append("author", this.state.authorName);
    data.append("file", this.state.image);
    data.append("title", this.state.title);
    data.append("post", this.state.post);
    data.append("tags", this.state.tags);
    let response = await fetch("/new-post", {
      method: "POST",
      body: data,
      credentials: "include"
    });
    let responseBody = await response.text();

    this.setState({ title: "", post: "", image: {}, tags: [] });
    this.props.history.push("/blog");
  };
  render = () => {
    return (
      <div>
        Add a new post here
        <form onSubmit={this.handleSubmitPost}>
          <div>
            <input
              type="text"
              placeholder="First Name & Last Name"
              value={this.state.Name}
              onChange={this.onAuthorNameChange}
            />
          </div>
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
            <select name="post" size="5" multiple onChange={this.onTagsChange}>
              <option value="author">author</option>
              <option value="education">education</option>
              <option value="documentation">documentation</option>
              <option value="archival">archival</option>
              <option value="documentation-science">
                documentation science
              </option>
            </select>
          </div>
          <input type="file" name="file" onChange={this.onImageChange} />
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
