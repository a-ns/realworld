import React from "react";
import { Redirect } from "react-router-dom";
import { UserContext } from "../../Contexts/UserContext";

class Login extends React.Component {
  render() {
    return (
      <UserContext.Consumer>
        {({ token, username }) => {
          if (token) return <Redirect to="/" />;
          return <div>Login</div>;
        }}
      </UserContext.Consumer>
    );
  }
}

export default Login;
