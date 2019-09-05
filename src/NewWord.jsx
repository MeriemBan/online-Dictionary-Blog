import React, { Component } from "react";
import { connect } from "react-redux";
import { Redirect } from "react-router-dom";
import {
  englishWords,
  frenchWords,
  arabicWords,
  arabicDefinitions
} from "./Data_dictionary.jsx";
// import css file
import "./style/NewWord.css";

class UnconnectedNewWord extends Component {
  constructor(props) {
    super(props);
    this.state = {
      english_word: "",
      french_word: "",
      arabic_word: "",
      arabic_definition: ""
    };
  }
  // upload dictonary
  upload = async () => {
    event.preventDefault();
    let data = new FormData();

    for (let i = 0; i < englishWords.length; i++) {
      // console.log("englishWords[i]", englishWords[i]);
      data.append("englishWord", englishWords[i]);
      data.append("frenchWord", frenchWords[i]);
      data.append("arabicWord", arabicWords[i]);
      data.append("arabicDefinition", arabicDefinitions[i]);
    }

    let response = await fetch("/upload-dico", {
      method: "POST",
      body: data,
      credentials: "include"
    });
    let responseBody = await response.text();
  };

  // upload a new word
  submitNewWord = async () => {
    event.preventDefault();
    // if(this.state.english_word === "" || this.state.english_word === "")
    let data = new FormData();
    data.append("englishWord", this.state.english_word);
    data.append("frenchWord", this.state.french_word);
    data.append("arabicWord", this.state.arabic_word);
    data.append("arabicDefinition", this.state.arabic_definition);
    let response = await fetch("/new-word", {
      method: "POST",
      body: data,
      credentials: "include"
    });
    let responseBody = await response.text();
    let body = JSON.parse(responseBody);
    if (body.success) {
      console.log("body success");
      alert("word successfully added");
      this.props.history.push("/dictionary");
      return;
    }
    console.log("not successful");
    alert("Oops! a problem occured, please try again");
  };

  deleteContent = async () => {
    event.preventDefault();
    alert("Are you sure? This action can not be undone...");
    let response = await fetch("/delete-dico", {
      method: "POST"
    });
    let responseBody = await response.text();
  };

  englishWordChange = event => {
    this.setState({
      english_word: event.target.value
    });
  };

  frenchWordChange = event => {
    this.setState({
      french_word: event.target.value
    });
  };
  arabicWordChange = event => {
    this.setState({
      arabic_word: event.target.value
    });
  };
  arabicDefinitionChange = event => {
    this.setState({
      arabic_definition: event.target.value
    });
  };
  goBack = () => {
    this.props.history.goBack();
  };

  render = () => {
    return (
      <div>
        <div className="newWord-global-box">
          <div className="Nav-back">
            <button id="Nav-back-btn" onClick={this.goBack}>
              back
            </button>
          </div>

          <div className="newWord-main-box-head">
            <h1>ADD NEW WORDS</h1>
          </div>
          <div className="newWord-main-box-inside">
            <div>
              <button className="newWord-category">upload a word</button>
            </div>
            <form onSubmit={this.submitNewWord}>
              <div className="newWord-form">
                <h4 id="newWord-label">English word</h4>
                <input
                  id="newWord-input"
                  type="text"
                  value={this.state.english_word}
                  onChange={this.englishWordChange}
                  // placeholder="english word"
                />
                <h4 id="newWord-label">French word</h4>
                <input
                  id="newWord-input"
                  type="text"
                  value={this.state.french_word}
                  onChange={this.frenchWordChange}
                  // placeholder="french word"
                />
                <h4 id="newWord-label">Arabic word</h4>
                <input
                  id="newWord-input-arabic"
                  type="text"
                  value={this.state.arabic_word}
                  onChange={this.arabicWordChange}
                  // placeholder="arabic word"
                />
                <h4 id="newWord-label">Arabic definition</h4>
                <input
                  id="newWord-input-arabic"
                  type="text"
                  value={this.state.arabic_definition}
                  onChange={this.arabicDefinitionChange}
                  // placeholder="arabic definition"
                />
                <div>
                  <input
                    id="newWord-single-upload"
                    type="submit"
                    value="add to dictionary"
                  />
                </div>
              </div>
            </form>
            <div className="newWord-upload-options">
              <div className="upload-multiple-words">
                {/* only admin */}
                <button className="newWord-category" onClick={this.upload}>
                  upload multiple words
                </button>{" "}
                <h4 id="upload-label"> One click </h4>
              </div>
              <div>
                <button
                  className="newWord-category"
                  onClick={this.deleteContent}
                >
                  delete dictionary
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };
}

let NewWord = connect()(UnconnectedNewWord);
export default NewWord;
