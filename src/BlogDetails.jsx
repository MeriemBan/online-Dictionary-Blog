import React, { Component } from "react";
import { connect } from "react-redux";
// import css file

class UnconnectedBlogDetails extends Component {
  constructor(props) {
    super(props);
    this.state = { blog: [] };
  }

  render = () => {
    return (
      <div>
        Blog post here
        <div>
          {this.props.blog
            ? this.props.blog.map(blogPost => {
                return (
                  <div>
                    <h2>{blogPost.title}</h2>
                    <h3>{blogPost.author}</h3>
                    <h4>{blogPost.date}</h4>
                    <img src={blogPost.image} />
                    <div>{blogPost.post}</div>
                    <div>{blogPost.tags.join("-")}</div>
                    <div>{blogPost.likes + " likes"}</div>

                    <h2>Reviews</h2>
                    {blogPost.reviews.map(review => {
                      return (
                        <ul>
                          <li>
                            {review.username} - {review.date}:{" "}
                            {review.review_message}
                          </li>
                        </ul>
                      );
                    })}
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
    blog: state.blog
  };
};

let BlogDetails = connect(mapStateToProps)(UnconnectedBlogDetails);
export default BlogDetails;
