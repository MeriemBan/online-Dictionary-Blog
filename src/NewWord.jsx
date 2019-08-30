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
      // <Redirect to="/dictionary" />;
      return;
    }
    console.log("not successful");
    alert("Oops! a problem occured, please try again");
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

  render = () => {
    return (
      <div>
        Add a new word here
        <form onSubmit={this.submitNewWord}>
          <input
            type="text"
            value={this.state.english_word}
            onChange={this.englishWordChange}
            placeholder="english word"
          />
          <input
            type="text"
            value={this.state.french_word}
            onChange={this.frenchWordChange}
            placeholder="french word"
          />
          <input
            type="text"
            value={this.state.arabic_word}
            onChange={this.arabicWordChange}
            placeholder="arabic word"
          />
          <input
            type="text"
            value={this.state.arabic_definition}
            onChange={this.arabicDefinitionChange}
            placeholder="arabic definition"
          />
          <input type="submit" value="add to dictionary" />
        </form>
        <div>
          {" "}
          {/* only admin */}
          <button onClick={this.upload}>upload dictionary</button>
        </div>
      </div>
    );
  };
}

let NewWord = connect()(UnconnectedNewWord);
export default NewWord;
