import "babel-polyfill";
import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import { BrowserRouter } from "react-router-dom";
import ApolloClient from "apollo-boost";
import { ApolloProvider } from "react-apollo";
import "@blueprintjs/core/lib/css/blueprint.css";
import "@blueprintjs/icons/lib/css/blueprint-icons.css";

const client = new ApolloClient({
  uri: process.env.API || "http://localhost:4000",
  request: async operation => {
    const token = await localStorage.getItem("token");
    operation.setContext({
      headers: {
        authorization: token
      }
    });
  }
});

ReactDOM.render(
  <ApolloProvider client={client}>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </ApolloProvider>,
  document.getElementById("root")
);
