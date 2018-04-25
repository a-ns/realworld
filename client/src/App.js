import React from "react";
import { Link } from "react-router-dom";
import { Switch, Route } from "react-router";
import Loadable from "react-loadable";
import { Navbar, NavbarGroup, NavbarDivider, Text } from "@blueprintjs/core";

import Article from "./pages/Article";
import Login from "./pages/Login";
import { UserContext } from "./Contexts/UserContext";
import Loading from "./Loading";

const Header = () => (
  <Navbar className="pt-dark">
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
const Register = Loadable({
  loader: () => import("./pages/Register"),
  loading: () => <Loading />
});
const Home = Loadable({
  loader: () => import("./pages/Home"),
  loading: () => <Loading />
});
class App extends React.Component {
  state = {
    userContext: {
      username: undefined,
      token: undefined,
      updateUser: this.updateUser
    }
  };

  componentDidMount() {
    if (localStorage.getItem("token") && localStorage.getItem("username")) {
      this.setState({
        token: localStorage.getItem("token"),
        username: localStorage.getItem("username")
      });
    }
  }

  updateUser = ({ username, token }) => {
    localStorage.setItem("token", token);
    localStorage.setItem("username", username);
    this.setState({ username, token });
  };
  render() {
    return (
      <UserContext.Provider value={this.state.userContext}>
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
