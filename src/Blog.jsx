import React, { Component } from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
// import css file

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
        <div>
          {this.props.blogs
            ? this.props.blogs.map(blogPost => {
                return (
                  <div>
                    {blogPost.image === null ? (
                      <Link to={"/blog/" + blogPost._id}>
                        <h2>{blogPost.title}</h2>
                      </Link>
                    ) : (
                      <h2>{blogPost.title}</h2>
                    )}

                    <h3>{blogPost.author}</h3>
                    <h4>{blogPost.date}</h4>
                    <div
                      style={{
                        display: blogPost.tags !== undefined ? "block" : "none"
                      }}
                    >
                      Tags: {blogPost.tags.split(",").join(" - ")}
                    </div>
                    {console.log("blogPost.like", blogPost.like)}
                    <div
                      style={{
                        display: blogPost.likes !== undefined ? "block" : "none"
                      }}
                    >
                      {blogPost.likes > 1
                        ? blogPost.likes + " likes"
                        : blogPost.likes + " like"}
                    </div>
                    <div
                      style={{
                        display: blogPost.image !== null ? "block" : "none"
                      }}
                    >
                      <img src={blogPost.image} className="blogimg" />
                    </div>
                  </div>
                );
              })
            : "Blog empty"}
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
