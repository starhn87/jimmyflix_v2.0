import React, { Component } from "react";
import BasicRouter from "./Router";
import GlobalStyles from "./GlobalStyles";

class App extends Component {
  render() {
    return (
      <>
        <BasicRouter />
        <GlobalStyles />
      </>
    )
  }
}

export default App;
