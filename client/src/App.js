import React from "react";
import { Link } from "react-router-dom";
import { Switch, Route } from "react-router";
import { Navbar, NavbarGroup, NavbarDivider } from "@blueprintjs/core";

import Home from "./pages/Home";
import Article from "./pages/Article";
import Register from "./pages/Register";
import Login from "./pages/Login";
import { UserContext } from "./Contexts/UserContext";

const Header = () => (
  <Navbar>
    <NavbarGroup>
      <Link to="/">Home</Link>
      <NavbarDivider />
      <Link to="/me">Me</Link>
      <NavbarDivider />
      <Link to="/login">Login</Link>
      <NavbarDivider />
      <Link to="/register">Register</Link>
    </NavbarGroup>
  </Navbar>
);

class App extends React.Component {
  state = {
    username: undefined,
    token: undefined,
    updateUser: ({ username, token }) => {
      console.log("updating", username, token);
      this.setState(() => ({ username, token }));
    }
  };
  render() {
    return (
      <UserContext.Provider value={this.state}>
        <Header />
        <Switch>
          <Route exact path="/" component={Home} />
          <Route exact path="/register" component={Register} />
          <Route exact path="/login" component={Login} />
          <Route path="/article/:slug" component={Article} />
        </Switch>
      </UserContext.Provider>
    );
  }
}
export default App;
