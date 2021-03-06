import React from "react";
import { Link } from "react-router-dom";
import { Switch, Route } from "react-router";
import Loadable from "react-loadable";
import {
  Navbar,
  NavbarGroup,
  NavbarDivider,
  Text,
  Alignment,
  Button
} from "@blueprintjs/core";

import Article from "./pages/Article";
import Login from "./pages/Login";
import { UserContext } from "./Contexts/UserContext";
import Loading from "./Loading";

const Header = props => (
  <UserContext>
    {({ token, username }) => (
      <Navbar>
        <NavbarGroup align={Alignment.LEFT}>
          <Link to="/">
            <Button className="pt-minimal" text="Home" />
          </Link>
          <NavbarDivider />
          <Link to="/me">
            <Button className="pt-minimal" text="Me" />
          </Link>
          <NavbarDivider />
          <Link to="/login">
            <Button className="pt-minimal" text="Login" />
          </Link>
          <NavbarDivider />
          <Link to="/register">
            <Button className="pt-minimal" text="Register" />
          </Link>
        </NavbarGroup>
        <NavbarGroup align={Alignment.RIGHT}>
          {token ? <Button onClick={props.logout}>Logout</Button> : null}
        </NavbarGroup>
      </Navbar>
    )}
  </UserContext>
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
  updateUser = ({ username, token }) => {
    localStorage.setItem("token", token);
    localStorage.setItem("username", username);
    this.setState({
      userContext: { ...this.state.userContext, username, token }
    });
  };

  state = {
    userContext: {
      username: "",
      token: "",
      updateUser: this.updateUser
    }
  };

  componentDidMount() {
    if (localStorage.getItem("token") && localStorage.getItem("username")) {
      this.setState({
        userContext: {
          ...this.state.userContext,
          token: localStorage.getItem("token"),
          username: localStorage.getItem("username")
        }
      });
    }
  }

  logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    this.setState({
      userContext: {
        ...this.state.userContext,
        username: "",
        token: ""
      }
    });
  };

  render() {
    return (
      <UserContext.Provider value={this.state.userContext}>
        <Header logout={this.logout} />
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
