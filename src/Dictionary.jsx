import React, { Component } from "react";
import { connect } from "react-redux";

// import css file

class UnconnectedDictionary extends Component {
  constructor(props) {
    super(props);
    this.state = { enteredWord: "", page: 0 };
  }
  // search for exact value, to be modified
  handleSearchChange = async event => {
    this.setState({
      enteredWord: event.target.value
    });
    console.log("event.target.value", event.target.value);
    let data = new FormData();
    data.append("searchInput", event.target.value);
    data.append("page", this.state.page);
    let response = await fetch("/search-word", { method: "POST", body: data });
    let responseBody = await response.text();

    let parsed = JSON.parse(responseBody);
    console.log("parsed", parsed);
    this.props.dispatch({
      type: "search-result",
      searchResult: parsed
    });
    // this.setState({ ...this.state, searchResult: "" });
  };
  moreResults = async () => {
    this.setState({ ...this.state, page: (this.state.page += 1) });
    let data = new FormData();
    data.append("searchInput", this.state.enteredWord);
    data.append("page", this.state.page);
    let response = await fetch("/search-word", { method: "POST", body: data });
    let responseBody = await response.text();

    let parsed = JSON.parse(responseBody);
    console.log("parsed", parsed);
    this.props.dispatch({ type: "search-result", searchResult: parsed });
    // this.setState({ ...this.state, searchResult: "" });
  };
  lessResults = async () => {
    this.setState({ ...this.state, page: (this.state.page -= 1) });
    let data = new FormData();
    data.append("searchInput", this.state.enteredWord);
    data.append("page", this.state.page);
    let response = await fetch("/search-word", { method: "POST", body: data });
    let responseBody = await response.text();

    let parsed = JSON.parse(responseBody);
    console.log("parsed", parsed);
    this.props.dispatch({ type: "search-result", searchResult: parsed });
  };

  render = () => {
    console.log("this.props.username", this.props.username);
    console.log("this.props.searchResult", this.props.searchResult);

    return (
      <div>
        <label> Explore our library of over than 1000 words! </label>
        <form>
          <input
            type="text"
            placeholder="search dictionary"
            onChange={this.handleSearchChange}
          />
        </form>
        <br />

        {this.props.searchResult
          ? this.props.searchResult.map(result => {
              return (
                <div>
                  <h2>English: {result.english_word}</h2>
                  <h2>French: {result.french_word}</h2>
                  <h2>Arabic: {result.arabic_word}</h2>
                  <h3>Arabic definition:</h3>
                  <h3>{result.arabic_definition}</h3>
                  <div
                    style={
                      this.props.searchResult.length > 1
                        ? { display: "block" }
                        : { display: "none" }
                    }
                  >
                    <br /> -o- <br />
                  </div>
                </div>
              );
            })
          : null}

        <div>
          {this.state.page > 0 ? (
            <button onClick={this.lessResults}> {"<back"}</button>
          ) : null}
          {this.props.searchResult.length >= 3 ? (
            <button onClick={this.moreResults}>{"next>"}</button>
          ) : null}
        </div>
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
