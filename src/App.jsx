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

class UnconnectedNavigation extends Component {
  constructor(props) {
    super(props);
    this.state = {
      username: ""
      //   ,
      //   color: "#101010"
    };
  }
  listenScrollEvent = e => {
    if (window.scrollY > 400) {
      this.setState({ color: "#101010" });
    } else {
      this.setState({ color: "#101010" });
    }
  };

  componentDidMount() {
    window.addEventListener("scroll", this.listenScrollEvent);
  }
  componentWillUnmount() {
    window.removeEventListener("scroll", this.listenScrollEvent);
  }

  logout = async () => {
    console.log("clicked logout");
    let response = await (await fetch("/logout", { method: "POST" })).text();
    let body = JSON.parse(response);
    if (body.success) {
      this.props.history.push("/");
    }
  };
  render = () => {
    console.log("this.state.username", this.state.username);
    return (
      <nav>
        <div>
          <NavLink to="/"></NavLink>
        </div>
        <div>
          <NavLink to="/dictionary">Dictionary/Home</NavLink>
        </div>
        <div>
          <NavLink to="/new-word">New word</NavLink>
        </div>
        <div>
          <NavLink to="/blog">Blog</NavLink>
        </div>
        <button onClick={this.logout}>Log out</button>
      </nav>
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
        <Router>
          <Navigation />
          <Route exact={true} path="/signup" component={Signup} />
          <Route exact={true} path="/" component={Login} />
          <Route exact={true} path="/dictionary" component={Dictionary} />
          <Route exact={true} path="/blog" component={Blog} />
          <Route exact={true} path="/new-word" component={NewWord} />
          <Route exact={true} path="/blog/:id" render={renderBlogPosts} />
          {/* {this.props.loggedIn ? (
            <Route exact={true} path="/dictionary" component={Dictionary} />
          ) : (
            <Redirect
              to={{
                pathname: "/"
              }}
            />
          )} */}
          {/* 
          {this.props.loggedIn ? (
            <Route exact={true} path="/blog" component={Blog} />
          ) : (
            <Redirect
              to={{
                pathname: "/"
              }}
            />
          )} */}

          {/* {this.props.loggedIn ? (
            <Route exact={true} path="/blog/:id" render={renderBlogPosts} />
          ) : (
            <Redirect
              to={{
                pathname: "/"
              }}
            />
          )} */}
        </Router>
      </div>
    );
  };
}

let mapStateToProps = state => {
  return {
    username: state.username,
    loggedIn: state.loggedIn
  };
};

let Navigation = withRouter(UnconnectedNavigation);
let App = connect(mapStateToProps)(UnconnectedApp);

export default App;
