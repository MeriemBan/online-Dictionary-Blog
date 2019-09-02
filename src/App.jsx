import React, { Component } from "react";
import {
  BrowserRouter as Router,
  Route,
  NavLink,
  withRouter,
  Redirect
} from "react-router-dom";
import { connect } from "react-redux";

import Dictionary from "./Dictionary.jsx";
import Signup from "./Signup.jsx";
import Login from "./Login.jsx";
import Blog from "./Blog.jsx";
import BlogDetails from "./BlogDetails.jsx";
import NewWord from "./NewWord.jsx";
import NewPost from "./NewPost.jsx";
import "./main.css";
import "./style/NavBar.css";

class UnconnectedNavigation extends Component {
  constructor(props) {
    super(props);
    this.state = {
      username: ""
      // ,
      // color: "#101010"
    };
  }
  // listenScrollEvent = e => {
  //   if (window.scrollY > 400) {
  //     this.setState({ color: "#101010" });
  //   } else {
  //     this.setState({ color: "#101010" });
  //   }
  // };

  // componentDidMount() {
  //   window.addEventListener("scroll", this.listenScrollEvent);
  // }
  // componentWillUnmount() {
  //   window.removeEventListener("scroll", this.listenScrollEvent);
  // }

  logout = async () => {
    console.log("clicked logout");
    let response = await (await fetch("/logout", { method: "POST" })).text();
    let body = JSON.parse(response);
    if (body.success) {
      this.props.history.push("/");
    }
  };
  goBack = () => {
    this.props.history.goBack();
  };
  render = () => {
    console.log("this.state.username", this.state.username);
    return (
      <div className="Nav-box">
        {/* <nav> */}
        <div className="Nav-dico">
          <NavLink to="/dictionary">Dictionary</NavLink>
        </div>
        <div className="Nav-blog">
          <NavLink to="/blog">Blog</NavLink>
        </div>
        <div className="Nav-new-post">
          <NavLink to="/newPost">Create a blog post</NavLink>
        </div>
        <div className="Nav-new-word">
          <NavLink to="/newWord">New words</NavLink>
        </div>
        <div className="Nav-logout">
          {/* <button onClick={this.logout}> */}
          <NavLink onClick={this.logout} to="/">
            Log out
          </NavLink>
          {/* </button> */}
        </div>
        {/* <div>
          {this.props.username ? (
            <div>{"hi " + this.props.username}</div>
          ) : null}{" "}
        </div> */}
        <div className="Nav-signup">
          <NavLink to="/signup">Sign Up</NavLink>
        </div>
        {/* </nav> */}
        <div className="footer">
          <div>Information Science dictionary</div>
        </div>
      </div>
    );
  };
}

let renderBlogPosts = routerData => {
  return (
    <div>
      <BlogDetails
        id={routerData.match.params.id}
        history={routerData.history}
      />
    </div>
  );
};

class UnconnectedApp extends Component {
  render = () => {
    return (
      <div>
        {/* {this.props.username ? <div>{"hi " + this.props.username}</div> : null} */}

        <Router>
          <Navigation />
          <div>
            <Route exact={true} path="/signup" component={Signup} />
            <Route exact={true} path="/" component={Login} />
          </div>

          <Route exact={true} path="/newPost" component={NewPost} />
          {this.props.loggedIn ? (
            <Route exact={true} path="/dictionary" component={Dictionary} />
          ) : (
            <Redirect
              to={{
                pathname: "/"
              }}
            />
          )}
          {this.props.loggedIn ? (
            <Route exact={true} path="/newWord" component={NewWord} />
          ) : (
            <Redirect
              to={{
                pathname: "/"
              }}
            />
          )}

          {this.props.loggedIn ? (
            <Route exact={true} path="/blog" component={Blog} />
          ) : (
            <Redirect
              to={{
                pathname: "/"
              }}
            />
          )}
          {this.props.loggedIn ? (
            <Route exact={true} path="/blog/:id" render={renderBlogPosts} />
          ) : (
            <Redirect
              to={{
                pathname: "/"
              }}
            />
          )}
        </Router>
      </div>
    );
  };
}

let mapStateToProps = state => {
  return {
    username: state.username,
    loggedIn: state.loggedIn,
    signedIn: state.signedIn
  };
};

let Navigation = withRouter(UnconnectedNavigation);
let App = connect(mapStateToProps)(UnconnectedApp);

export default App;
