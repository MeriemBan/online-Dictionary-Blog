import React, { Component } from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
// import css file

class UnconnectedBlogDetails extends Component {
  constructor(props) {
    super(props);
    this.state = { blogs: [], review: "", username: "" };
  }
  // component did mount?
  // likes

  submitReview = async () => {
    event.preventDefault();
    let data = new FormData();
    data.append("review", this.state.review);
    data.append("username", this.props.username);
    data.append("blogPostId", this.props.id);
    let response = await fetch("/add-review", {
      method: "POST",
      body: data,
      credentials: "include"
    });
    let responseBody = await response.text();
    if (body.success) {
      this.setState({ ...this.state, review: "" });
    }
  };

  onReviewChange = event => {
    event.preventDefault();
    this.setState({ ...this.state, review: event.target.value });
  };

  render = () => {
    let displayedPost;
    if (this.props.blogs !== []) {
      displayedPost = this.props.blogs.filter(blog => {
        return blog._id === this.props.id;
      });
    }
    return (
      <div>
        <div>
          {/* {admin only} */}
          <Link to="/newPost">New post</Link>
        </div>
        Blog post here
        <div>
          {displayedPost.map(blogPost => {
            return (
              <div>
                <h2>{blogPost.title}</h2>
                <h3>{blogPost.author}</h3>
                <h4>{blogPost.date}</h4>
                <img src={blogPost.image} />
                <div>{blogPost.post}</div>
                <div>
                  Tags:{" "}
                  {blogPost.tags !== null
                    ? blogPost.tags.split(",").join(" - ")
                    : null}
                </div>
                {/* <div>{blogPost.likes + " likes"}</div> */}

                <h2>Reviews</h2>
                <div>
                  express yourself!
                  <form onSubmit={this.submitReview}>
                    <input
                      type="text"
                      value={this.state.review}
                      placeholder="enter a review"
                      onChange={this.onReviewChange}
                    />
                    <input type="submit" value="post" />
                  </form>
                </div>
                {blogPost.reviews !== undefined
                  ? blogPost.reviews.map(review => {
                      return (
                        <ul>
                          <li>
                            {review.username} - {review.date}:{" "}
                            {review.review_message}
                          </li>
                        </ul>
                      );
                    })
                  : null}
              </div>
            );
          })}
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

let BlogDetails = connect(mapStateToProps)(UnconnectedBlogDetails);
export default BlogDetails;
