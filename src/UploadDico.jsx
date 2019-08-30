import React, { Component } from "react";
import { connect } from "react-redux";
import { Redirect } from "react-router-dom";
// import css file

MyDictionary = async () => {
  let englishWord = "test english";
  let frenchWord = "test french";
  let arabicWord = "test arabic word";
  let arabicDefinition = "test arabic definition";

  let data = new FormData();
  data.append("englishWord", englishWord);
  data.append("frenchWord", frenchWord);
  data.append("arabicWord", arabicWord);
  data.append("arabicDefinition", arabicDefinition);
  let response = await fetch("/new-word", {
    method: "POST",
    body: data,
    credentials: "include"
  });
  let responseBody = await response.text();
  let body = JSON.parse(responseBody);
  if (body.success) {
    alert("word uploaded");
    return;
  }
};

MyDictionary();
