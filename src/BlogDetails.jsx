import React, { Component } from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import { PassThrough } from "stream";
// import css file
import "./style/Blog_details.css";

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
    console.log("textareaObject.value", event.target.value);
  };
  goBack = () => {
    this.props.history.goBack();
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
        <div className="Nav-back">
          <button id="Nav-back-btn" onClick={this.goBack}>
            back
          </button>
        </div>
        <div>
          {displayedPost.map(blogPost => {
            return (
              <div className="post-global-box">
                <div className="header-image-text-footer">
                  <div className="post-header-and-image">
                    <div className="post-header-box">
                      <h2 className="post-title">{blogPost.title}</h2>
                      <div className="post-author">
                        <em>{"Written by "}</em>
                        {blogPost.author}
                      </div>
                      <div className="post-date">{blogPost.date}</div>
                    </div>
                    <div className="post-tags-and-likes">
                      {console.log("blogPost.likes", blogPost.likes)}
                      <div
                        className="post-likes"
                        style={{
                          display:
                            blogPost.likes !== undefined ? "block" : "none"
                        }}
                      >
                        {blogPost.likes > 1
                          ? blogPost.likes + " likes "
                          : blogPost.likes + " like "}
                        <button id="post-like-btn" onClick={this.likeIt}>
                          <b>Like it!</b>
                        </button>
                      </div>
                      <div
                        className="post-tags"
                        style={{
                          display:
                            blogPost.tags !== undefined ? "block" : "none"
                        }}
                      >
                        {"#" + blogPost.tags.split(",").join("   #")}
                      </div>
                    </div>
                    {console.log("blogPost.image", blogPost.image)}
                    <div className="post-img-and-text">
                      <div
                        className="post-img-box"
                        style={{
                          display: blogPost.image !== null ? "block" : "none"
                        }}
                      >
                        <img id="post-img" src={blogPost.image} />
                      </div>
                      <p className="post-text">{blogPost.post}</p>
                    </div>
                  </div>
                </div>

                <div className="post-reviews-box">
                  <h2 className="post-reviews-title"> Leave a comment</h2>
                  <div className="review-input-and-submit">
                    <form onSubmit={this.submitReview}>
                      <div>
                        <input
                          className="review-input"
                          type="text"
                          value={this.state.review}
                          placeholder="express yourself!"
                          onChange={this.onReviewChange}
                        />
                      </div>
                      <div>
                        <input
                          className="review-submit"
                          type="submit"
                          value="post"
                        />
                      </div>
                    </form>
                  </div>
                  <div>
                    {blogPost.reviews !== undefined
                      ? blogPost.reviews.map(review => {
                          return (
                            <div className="reviews-title-and-message">
                              <div className="post-reviews-title">
                                <em>
                                  {review.username} - {review.date}:{" "}
                                </em>
                              </div>
                              <div className="post-reviews-message">
                                {" "}
                                {review.review_message}
                              </div>
                            </div>
                          );
                        })
                      : null}
                  </div>
                </div>
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
