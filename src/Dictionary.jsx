import React, { Component } from "react";
import { connect } from "react-redux";

// import css file
import "./style/Dictionary_search.css";
class UnconnectedDictionary extends Component {
  constructor(props) {
    super(props);
    this.state = {
      enteredWord: "",
      page: 0,
      searchResult: [],
      defaultLanguage: "english"
    };
  }

  onTagsChange = event => {
    event.preventDefault();
    let defaultLanguage = event.target.value;
    this.setState({ defaultLanguage }, () => {
      console.log("this.state.defaultLanguage", this.state.defaultLanguage);
    });
  };

  handleSearchChange = async event => {
    event.preventDefault();
    console.log("event.target.value", event.target.value);
    this.setState(
      {
        ...this.state,
        enteredWord: event.target.value
      },
      async () => {
        let data = new FormData();
        data.append("language", this.state.defaultLanguage);
        data.append("searchInput", this.state.enteredWord);
        data.append("page", this.state.page);
        let response = await fetch("/search-word", {
          method: "POST",
          body: data
        });
        let responseBody = await response.text();

        let parsed = JSON.parse(responseBody);
        console.log("parsed", parsed);

        this.setState({ searchResult: parsed });
      }
    );
  };
  moreResults = async () => {
    event.preventDefault();
    console.log("next page");
    this.setState({ ...this.state, page: (this.state.page += 1) }, async () => {
      let data = new FormData();
      data.append("language", this.state.defaultLanguage);
      data.append("searchInput", this.state.enteredWord);
      data.append("page", this.state.page);
      let response = await fetch("/search-word", {
        method: "POST",
        body: data
      });
      let responseBody = await response.text();

      let parsed = JSON.parse(responseBody);
      // console.log("parsed", parsed);
      this.setState({ searchResult: parsed });
    });

    console.log("this.state.searchResult", this.state.searchResult);
  };
  lessResults = async () => {
    event.preventDefault();
    console.log("this.state.page", this.state.page);
    this.setState({ ...this.state, page: (this.state.page -= 1) }, async () => {
      // console.log("this.state.page", this.state.page);
      let data = new FormData();
      data.append("language", this.state.defaultLanguage);
      data.append("searchInput", this.state.enteredWord);
      data.append("page", this.state.page);
      let response = await fetch("/search-word", {
        method: "POST",
        body: data
      });
      let responseBody = await response.text();

      let parsed = JSON.parse(responseBody);
      // console.log("parsed", parsed);
      this.setState({ searchResult: parsed });
    });
  };

  render = () => {
    // console.log("this.props.username", this.props.username);
    console.log("this.state.searchResult", this.state.searchResult);
    let results = this.state.searchResult.slice(0, 2);
    return (
      <div>
        <div className="home-items">
          <div className="center">
            <h1>Explore our library of over than 1000 words! </h1>
          </div>

          <div id="search-langChoice-pagination">
            <form>
              <input
                id="search-bar"
                autoFocus
                spellCheck="false"
                autoCapitalize="off"
                autoComplete="off"
                autoCorrect="off"
                type="text"
                placeholder="search dictionary"
                value={this.state.enteredWord}
                onChange={this.handleSearchChange}
              />
            </form>

            {/* <div id="lang-options"> */}
            <select
              id="lang-options"
              name="post"
              size="2"
              onClick={this.onTagsChange}
            >
              <option value="english">English</option>
              <option value="french">French</option>
            </select>
            {/* </div> */}

            <div id="pagination">
              {console.log("this.state.page", this.state.page)}
              {this.state.page > 0 && this.state.enteredWord !== "" ? (
                <button onClick={this.lessResults}>{"<back"}</button>
              ) : null}
              {this.state.searchResult.length > 2 &&
              this.state.enteredWord !== "" ? (
                <button onClick={this.moreResults}>{"next>"}</button>
              ) : null}
              {console.log("this.state.page", this.state.page)}
            </div>
          </div>
          <br />
        </div>
        <div className="definitions">
          {this.state.enteredWord !== ""
            ? results.map(result => {
                return (
                  <div>
                    <div
                      style={{
                        justifyContent: "space-between",
                        borderBottom: "dotted 1px  #000033",
                        padding: "20px",
                        marginLeft: "40px",
                        marginRight: "40px"
                      }}
                    >
                      {this.state.defaultLanguage === "english" ? (
                        <div>
                          <div>
                            <h4>English </h4>
                            <span>{result.english_word}</span>
                          </div>
                          <br />
                          <div>
                            <h4>French</h4>
                            <span>{result.french_word}</span>
                          </div>
                          <br />
                        </div>
                      ) : (
                        <div>
                          <div>
                            <h4>French</h4>
                            <span>{result.french_word}</span>
                          </div>
                          <br />
                          <div>
                            <h4>English </h4>
                            <span>{result.english_word}</span>
                          </div>
                          <br />
                        </div>
                      )}

                      <div>
                        <h4>Arabic</h4>
                        <span style={{ textAlign: "right" }}>
                          {result.arabic_word}
                        </span>
                        <br />
                        <br />
                        <em style={{ textAlign: "right" }}>
                          {result.arabic_definition}
                        </em>
                      </div>
                      <br />
                    </div>
                    <br />
                  </div>
                );
              })
            : null}
        </div>
      </div>
    );
  };
}

let mapStateToProps = state => {
  return {
    username: state.username
  };
};

let Dictionary = connect(mapStateToProps)(UnconnectedDictionary);
export default Dictionary;
