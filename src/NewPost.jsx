import React, { Component } from "react";
import { connect } from "react-redux";
// import { NavLink } from "react-router-dom";
// import css file
import "./style/NewPost.css";

class UnconnectedNewPost extends Component {
  constructor(props) {
    super(props);
    this.state = {
      title: "",
      post: "",
      image: {},
      tags: [],
      username: "",
      authorName: "",
      value: ""
    };
  }

  onTitleChange = event => {
    event.preventDefault();
    console.log("EVENT", event.target);
    this.setState({ title: event.target.value });
    console.log("title", event.target.value);
  };

  onPostChange = event => {
    event.preventDefault();
    // this.setState({ post: event.target.value });
    console.log("post", event.target.value);
    // let area = document.getElementById("input-body");
    // console.log("EVENT post", event.object);
    // let id = "input-body";
    // console.log("POST value", area.value);
    // console.log("POST val", area.val());
    // console.log("POST target", event.target.id);
    // console.log("this.state.value", this.state.value);
    this.setState({ post: event.target.value });
    // console.log("post", area.val());
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
  goBack = () => {
    this.props.history.goBack();
  };
  render = () => {
    return (
      <div>
        <div className="newPost-global-box">
          <div className="Nav-back">
            <button id="Nav-back-btn" onClick={this.goBack}>
              back
            </button>
          </div>
          <div className="newPost-main-box-head">
            <h1>CREATE YOUR BLOG POST</h1>
          </div>

          <div className="newPost-main-box-inside">
            <form onSubmit={this.handleSubmitPost}>
              <div className="newPost-auhorName-and-input">
                <h4 id="newPost-label">Author's First Name & Last Name</h4>
                <input
                  id="newPost-input"
                  type="text"
                  // placeholder="First Name & Last Name"
                  value={this.state.Name}
                  onChange={this.onAuthorNameChange}
                />
              </div>
              <div className="newPost-title-and-input">
                <h4 id="newPost-label">Title</h4>
                <input
                  id="newPost-input"
                  type="text"
                  // placeholder="Title"
                  value={this.state.title}
                  onChange={this.onTitleChange}
                />
              </div>
              <div className="newPost-postBody-and-input">
                <h4 id="newPost-label">Post body</h4>
                {/* <input
                  id="newPost-input-body"
                  type="text"
                  // placeholder="Body"
                  value={this.state.post}
                  onChange={this.onPostChange}
                /> */}
                <textarea
                  id="post"
                  name="post"
                  rows="20"
                  cols="50"
                  value={this.state.post}
                  onChange={this.onPostChange}
                ></textarea>
              </div>
              <div className="newPost-tag-and-select-option">
                <h4 id="newPost-label">
                  Tags{" "}
                  <em>
                    <h6>(select your tags)</h6>
                  </em>
                </h4>
                <select
                  id="newPost-select-tags"
                  name="post"
                  size="5"
                  multiple
                  onChange={this.onTagsChange}
                >
                  <option id="newPost-option-tags" value="author">
                    author
                  </option>
                  <option id="newPost-option-tags" value="education">
                    education
                  </option>
                  <option id="newPost-option-tags" value="documentation">
                    documentation
                  </option>
                  <option id="newPost-option-tags" value="archival">
                    archival
                  </option>
                  <option
                    id="newPost-option-tags"
                    value="documentation-science"
                  >
                    documentation science
                  </option>
                </select>
              </div>
              <div className="newPost-image-and-chooseFileButton">
                <h4 id="newPost-label">Post image</h4>
                <input
                  id="newPost-input-image"
                  type="file"
                  name="file"
                  onChange={this.onImageChange}
                />
                {/* <label id="select-image-button" for="file">
                  select your blog image
                </label> */}
              </div>
              <input id="newPost-btn-post" type="submit" value="post" />
            </form>
          </div>
        </div>
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
