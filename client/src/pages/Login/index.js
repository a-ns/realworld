import React from "react";
import { Redirect } from "react-router-dom";
import { UserContext } from "../../Contexts/UserContext";
import { Card, FormGroup, InputGroup, Button } from "@blueprintjs/core";

import { LOGIN_MUTATION } from "./queries";
import { Mutation } from "react-apollo";
import Loading from "../../Loading";

class Login extends React.Component {
  state = {
    email: "",
    password: ""
  };
  onChange = e => {
    const { name, value } = e.target;
    this.setState({ [name]: value });
  };
  render() {
    return (
      <Mutation mutation={LOGIN_MUTATION} variables={{ ...this.state }}>
        {(login, { loading, data }) => {
          return (
            <UserContext.Consumer>
              {({ token, username, updateUser }) => {
                if (loading) return <Loading />;
                if (data) {
                  updateUser({
                    username: data.login.user.username,
                    token: data.login.user.token
                  });
                  return <Redirect to="/me" />;
                }
                if (token) return <Redirect to="/me" />;
                return (
                  <Card>
                    <form
                      onSubmit={e => {
                        e.preventDefault();
                        login();
                      }}
                    >
                      <FormGroup label="Email" labelFor="Email">
                        <InputGroup
                          // round="true"
                          name="email"
                          id="email"
                          value={this.state.email}
                          onChange={this.onChange}
                        />
                      </FormGroup>
                      <FormGroup label="Password" labelFor="password">
                        <InputGroup
                          // round="true"
                          name="password"
                          intent={
                            this.state.password.length < 1 ? "danger" : "none"
                          }
                          type="password"
                          value={this.state.password}
                          onChange={this.onChange}
                        />
                      </FormGroup>

                      <Button intent="primary" type="submit" text="Submit" />
                    </form>
                  </Card>
                );
              }}
            </UserContext.Consumer>
          );
        }}
      </Mutation>
    );
  }
}

export default Login;
