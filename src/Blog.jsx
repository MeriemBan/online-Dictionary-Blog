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

  // add pagination
  render = () => {
    return (
      <div>
        {/* {admin only} */}
        <Link to="/newPost">New post</Link>
        <div className="posts-global-box">
          <h1 className="main-box-head">Posts</h1>
          <div className="main-box">
            <div className="main-box-inside">
              {this.props.blogs
                ? this.props.blogs.map(blogPost => {
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

                          <div className="author">
                            <em>{"by "}</em>

                            {blogPost.author}
                          </div>
                          <div className="date-and-likes">
                            <div className="date">{blogPost.date}</div>
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
                          <div
                            className="tags"
                            style={{
                              display:
                                blogPost.tags !== undefined ? "block" : "none"
                            }}
                          >
                            <b>Tags:</b> {blogPost.tags.split(",").join(" - ")}
                          </div>
                          {console.log("blogPost.like", blogPost.like)}
                        </div>
                      </div>
                    );
                  })
                : "Blog empty"}
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
