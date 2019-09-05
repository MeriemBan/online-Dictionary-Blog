import React, { Component } from "react";
import { connect } from "react-redux";
import { Redirect, Link } from "react-router-dom";
import "./style/Settings.css";

class UnconnectedSettings extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  goBack = () => {
    this.props.history.goBack();
  };

  render = () => {
    console.log("this.props.user.role", this.props.user.role);
    return (
      <div>
        <div className="settings-global-box">
          <div className="Nav-back">
            <button id="Nav-back-btn" onClick={this.goBack}>
              back
            </button>
          </div>
          <div>
            <div className="settings-main-box-head">
              <h1> YOUR PROFILE</h1>
            </div>
            <div className="settings-details">
              <div className="settings-profile-item">
                <div id="settings-label"> Username:</div>
                <div id="settings-profile-value">
                  {this.props.user.username}
                </div>
              </div>

              <div className="settings-profile-item">
                <div id="settings-label">Access group:</div>
                <div id="settings-profile-value"> {this.props.user.role}</div>
              </div>

              <div id="settings-profile-value">
                <div id="settings-label">
                  You have access to the following functionalities:{" "}
                </div>
                <ul id="settings-access-options">
                  <li>dictionary </li>
                  <li>blog </li>
                  <li
                    style={{
                      textDecoration:
                        this.props.user.role === "standard"
                          ? "line-through"
                          : "none"
                    }}
                  >
                    create a blog post{" "}
                  </li>
                  <li
                    style={{
                      textDecoration:
                        this.props.user.role === "standard"
                          ? "line-through"
                          : "none"
                    }}
                  >
                    add words to the dictionary{" "}
                  </li>
                </ul>
              </div>

              <div id="settings-link">
                <Link to={"/signup"}>Create a new account</Link>
              </div>
              <div id="settings-link">
                <Link to={"/"}>Log into another account</Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };
}

let mapStateToProps = state => {
  return {
    username: state.username,
    user: state.user
  };
};

let Settings = connect(mapStateToProps)(UnconnectedSettings);
export default Settings;
