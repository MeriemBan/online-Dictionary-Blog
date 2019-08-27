import React, { Component } from "react";
import { connect } from "react-redux";

// import css file

class UnconnectedDictionary extends Component {
  constructor(props) {
    super(props);
    this.state = { searchResult: "" };
  }
  // search for exact value, to be modified
  handleSearchChange = async event => {
    this.setState({
      searchResult: event.target.value
    });
    console.log("event.target.value", event.target.value);
    let data = new FormData();
    data.append("english_word", event.target.value);
    let response = await fetch("/search-word", { method: "POST", body: data });
    let responseBody = await response.text();

    let parsed = JSON.parse(responseBody);
    console.log("parsed", parsed);
    this.props.dispatch({ type: "search-result", searchResult: parsed });
  };

  render = () => {
    console.log("this.props.username", this.props.username);
    return (
      <div>
        Dictionary and search bar here
        <form>
          <input
            type="text"
            placeholder="search for a word"
            onChange={this.handleSearchChange}
          />
        </form>
        <br />
        {this.props.searchResult ? (
          <div>
            <h2>English: {this.props.searchResult.english_word}</h2>
            <h2>French: {this.props.searchResult.french_word}</h2>
            <h2>Arabic: {this.props.searchResult.arabic_word}</h2>
            <h3>Arabic definition:</h3>
            <h3>{this.props.searchResult.arabic_definition}</h3>
          </div>
        ) : null}
      </div>
    );
  };
}

let mapStateToProps = state => {
  return {
    searchResult: state.searchResult,
    username: state.username
  };
};

let Dictionary = connect(mapStateToProps)(UnconnectedDictionary);
export default Dictionary;
