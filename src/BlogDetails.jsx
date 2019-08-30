import React, { Component } from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import { PassThrough } from "stream";
// import css file

class UnconnectedBlogDetails extends Component {
  constructor(props) {
    super(props);
    this.state = { blogs: [], review: "", username: "", likes: 0 };
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
    let body = JSON.parse(responseBody);
    if (body.success) {
      this.setState({ ...this.state, review: "" });
    }
  };

  likeIt = async () => {
    event.preventDefault();
    let data = new FormData();
    this.setState({}, async () => {
      data.append("likes", 1);
      data.append("postId", this.props.id);
      let response = await fetch("/likes", {
        method: "POST",
        body: data,
        credentials: "include"
      });
      let responseBody = await response.text();
      let body = JSON.parse(responseBody);
      if (body.success) {
        this.props.dispatch({
          type: "increase-likes",
          postId: this.props.id,
          likes: (this.state.likes += 1)
        });
        return;
      }
    });
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
                {console.log("blogPost.image", blogPost.image)}
                <div
                  style={{
                    display: blogPost.image !== null ? "block" : "none"
                  }}
                >
                  <img
                    width="810"
                    height="562"
                    src={blogPost.image}
                    className="blogimg"
                  />
                </div>
                <div>{blogPost.post}</div>
                <div
                  style={{
                    display: blogPost.tags !== undefined ? "block" : "none"
                  }}
                >
                  Tags: {blogPost.tags.split(",").join(" - ")}
                </div>
                {console.log("blogPost.likes", blogPost.likes)}
                <div
                  style={{
                    display: blogPost.likes !== undefined ? "block" : "none"
                  }}
                >
                  {blogPost.likes > 1
                    ? blogPost.likes + " likes"
                    : blogPost.likes + " like"}
                </div>
                <br />
                <button onClick={this.likeIt}>Like it!</button>
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
    username: state.username,
    likes: state.likes
  };
};

let BlogDetails = connect(mapStateToProps)(UnconnectedBlogDetails);
export default BlogDetails;
