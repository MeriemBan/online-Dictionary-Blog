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
                    <h2>{blogPost.title}</h2>
                    <h3>{blogPost.author}</h3>
                    <h4>{blogPost.date}</h4>
                    <Link to={"/blog/" + blogPost._id}>
                      <img src={blogPost.image} />
                    </Link>
                    <div>
                      Tags:{" "}
                      {blogPost.tags !== null
                        ? blogPost.tags.split(",").join(" - ")
                        : null}
                    </div>
                    {/* <div>{blogPost.likes + " likes"}</div> */}
                    {/* {add like button}*/}
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
