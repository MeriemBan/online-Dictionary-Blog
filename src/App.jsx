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
import Settings from "./Settings.jsx";
import "./main.css";
import "./style/NavBar.css";

class UnconnectedNavigation extends Component {
  constructor(props) {
    super(props);
    this.state = {
      username: "",
      opacity: 1
    };
  }
  listenScrollEvent = e => {
    if (window.scrollY > 20) {
      this.setState({ opacity: 0.5 });
    } else {
      this.setState({ opacity: 1 });
    }
  };

  componentDidMount() {
    window.addEventListener("scroll", this.listenScrollEvent);
  }
  componentWillUnmount() {
    window.removeEventListener("scroll", this.listenScrollEvent);
  }

  logout = async () => {
    // event.preventDefault();
    // console.log("clicked logout");
    // window.prompt("Are you sure?");
    // let confirmation = prompt("Are you sure?");

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
    return (
      <div className="Nav-box" style={{ opacity: this.state.opacity }}>
        {/* <nav> */}
        <div className="Nav-dico" style={{ opacity: this.state.opacity }}>
          <NavLink to="/dictionary">DICTIONARY</NavLink>
        </div>
        <div className="Nav-blog" style={{ opacity: this.state.opacity }}>
          <NavLink to="/blog">BLOG</NavLink>
        </div>
        <div
          className="Nav-new-post"
          style={{
            opacity: this.state.opacity,
            display: this.props.user.role === "admin" ? "block" : "none"
          }}
        >
          <NavLink to="/newPost">CREATE A BLOG POST</NavLink>
        </div>
        <div
          className="Nav-new-word"
          style={{
            opacity: this.state.opacity,
            display: this.props.user.role === "admin" ? "block" : "none"
          }}
        >
          <NavLink to="/newWord">ADD WORDS</NavLink>
        </div>
        <div className="Nav-logout" style={{ opacity: this.state.opacity }}>
          {/* <button onClick={this.logout}> */}
          <NavLink onClick={this.logout} to="/">
            log out
          </NavLink>
          {/* </button> */}
        </div>
        {/* <div>
          {this.props.username ? (
            <div>{"hi " + this.props.username}</div>
          ) : null}{" "}
        </div> */}
        <div className="Nav-signup" style={{ opacity: this.state.opacity }}>
          <NavLink to="/settings">settings</NavLink>
        </div>
        {/* </nav> */}
        <div className="footer">
          <div>Trilingual Information Science Dictionary</div>
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

          {this.props.loggedIn ? (
            <Route exact={true} path="/newPost" component={NewPost} />
          ) : (
            <Redirect
              to={{
                pathname: "/"
              }}
            />
          )}
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
          {this.props.loggedIn ? (
            <Route exact={true} path="/settings" component={Settings} />
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
    signedIn: state.signedIn,
    user: state.user
  };
};

let Navigation = withRouter(UnconnectedNavigation);
Navigation = connect(mapStateToProps)(UnconnectedNavigation);
let App = connect(mapStateToProps)(UnconnectedApp);

export default App;
