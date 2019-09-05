import React, { Component } from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
// import css file
import "./style/Blog.css";

class UnconnectedBlog extends Component {
  constructor(props) {
    super(props);
    this.state = { blog: [], page: 0 };
  }
  // retrive blogs
  componentDidMount = /*async*/ () => {
    let updatePosts = async () => {
      // get all items from the server
      let response = await fetch("/all-posts");
      let responseBody = await response.text();
      //   console.log("responseBody", responseBody);
      let parsed = JSON.parse(responseBody);
      // console.log("parsed", parsed);
      this.props.dispatch({ type: "display-posts", blogs: parsed });
    };
    setInterval(updatePosts, 1000);
  };
  goBack = () => {
    this.props.history.goBack();
  };
  goBackToPreviousBlogPosts = () => {
    this.setState({ ...this.state, page: this.state.page - 1 });
  };
  goToNextBlogPosts = () => {
    this.setState({ ...this.state, page: this.state.page + 1 });
  };

  // add pagination
  render = () => {
    return (
      <div>
        <div className="posts-global-box">
          <div className="Nav-back">
            <button id="Nav-back-btn" onClick={this.goBack}>
              back
            </button>
          </div>
          <div className="main-box-head">
            <h1>BLOG POSTS</h1>
          </div>
          <div className="main-box-inside">
            {this.props.blogs
              ? this.props.blogs
                  .slice(this.state.page * 2, this.state.page * 2 + 2)
                  .map(blogPost => {
                    return (
                      <div className="entry-header-and-image-box">
                        <div
                          className="image-box"
                          style={{
                            display: blogPost.image !== null ? "block" : "none"
                          }}
                        >
                          <Link to={"/blog/" + blogPost._id}>
                            <img src={blogPost.image} id="blogimg" />
                          </Link>
                        </div>
                        <div className="entry-header">
                          {blogPost.image === null ? (
                            <Link to={"/blog/" + blogPost._id}>
                              <h2>{blogPost.title}</h2>
                            </Link>
                          ) : (
                            <h2 className="title">{blogPost.title}</h2>
                          )}

                          <h3 className="author">
                            <em>{"Written by "}</em>
                            <b id="blog-author"> {blogPost.author}</b>
                          </h3>

                          <div className="date-and-likes">
                            <h4 className="date">{blogPost.date}</h4>
                            <div
                              className="likes"
                              style={{
                                display:
                                  blogPost.likes !== undefined
                                    ? "block"
                                    : "none"
                              }}
                            >
                              <b>
                                {blogPost.likes > 1
                                  ? blogPost.likes + " likes"
                                  : blogPost.likes + " like"}
                              </b>
                            </div>
                          </div>

                          <h3
                            className="tags"
                            style={{
                              display:
                                blogPost.tags !== undefined ? "block" : "none"
                            }}
                          >
                            {"#" + blogPost.tags.split(",").join("   #")}
                          </h3>
                          {console.log("blogPost.like", blogPost.like)}
                        </div>
                      </div>
                    );
                  })
              : "Blog empty"}
            <div className="bnt-back-next">
              <button
                style={{
                  backgroundColor:
                    this.state.page === 0 ? "#f0f0f0" : "#faf1e7",
                  cursor: this.state.page === 0 ? "not-allowed" : "pointer"
                }}
                onClick={this.goBackToPreviousBlogPosts}
              >
                {" "}
                {"<back"}{" "}
              </button>{" "}
              <button
                onClick={this.goToNextBlogPosts}
                style={{
                  backgroundColor:
                    this.state.page < Math.floor(this.props.blogs.length / 2)
                      ? "#faf1e7"
                      : "#f0f0f0",
                  cursor:
                    this.state.page < Math.floor(this.props.blogs.length / 2)
                      ? "pointer"
                      : "not-allowed"
                }}
              >
                {"next>"}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };
}

let mapStateToProps = state => {
  return {
    blogs: state.blogs,
    username: state.username
  };
};
let Blog = connect(mapStateToProps)(UnconnectedBlog);
export default Blog;
