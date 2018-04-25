import React from "react";
import { Mutation } from "react-apollo";
import { Redirect } from "react-router-dom";
import { Label, Button, FormGroup, InputGroup, Card } from "@blueprintjs/core";
import gql from "graphql-tag";

import { UserContext } from "../../Contexts/UserContext";

function validateEmail(email) {
  var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(String(email).toLowerCase());
}

class Register extends React.Component {
  state = {
    username: "",
    password: "",
    email: "",
    submitTried: false
  };

  render() {
    return (
      <Mutation mutation={REGISTER_MUTATION} variables={{ ...this.state }}>
        {(register, { loading, error, data }) => {
          return (
            <UserContext.Consumer>
              {({ token, updateUser }) => {
                if (token) return <Redirect to="/" />;
                if (data) {
                  console.log("updating user", data);
                  updateUser({
                    token: data.register.user.token,
                    username: data.register.user.username
                  });
                  return <Redirect to="/me" />;
                }
                if (loading) return <div>Loading</div>;
                if (error) return <div>Error</div>;
                if (!data)
                  return (
                    <div
                      style={{
                        margin: "0 auto",
                        width: "400px"
                      }}
                    >
                      <Card>
                        <form
                          onSubmit={e => {
                            register();
                            this.setState({ submitTried: true });
                          }}
                        >
                          <FormGroup label="Username" labelFor="username">
                            <InputGroup
                              round="true"
                              id="username"
                              value={this.state.username}
                              onChange={e =>
                                this.setState({ username: e.target.value })
                              }
                            />
                          </FormGroup>
                          <FormGroup label="Email" labelFor="email">
                            <InputGroup
                              round="true"
                              placeholder="user@example.com"
                              id="email"
                              intent={
                                this.state.submitTried &&
                                this.state.email.length < 1 &&
                                !validateEmail(this.state.email)
                                  ? "danger"
                                  : "none"
                              }
                              value={this.state.email}
                              onChange={e =>
                                this.setState({ email: e.target.value })
                              }
                            />
                          </FormGroup>
                          <FormGroup label="Password" labelFor="password">
                            <InputGroup
                              round="true"
                              intent={
                                this.state.password.length < 1 &&
                                this.state.submitTried
                                  ? "danger"
                                  : "none"
                              }
                              type="password"
                              value={this.state.password}
                              onChange={e =>
                                this.setState({ password: e.target.value })
                              }
                            />
                          </FormGroup>
                          <Button
                            intent="primary"
                            type="submit"
                            text="Submit"
                          />
                        </form>
                      </Card>
                    </div>
                  );
              }}
            </UserContext.Consumer>
          );
        }}
      </Mutation>
    );
  }
}

const REGISTER_MUTATION = gql`
  mutation register($username: String!, $password: String!, $email: String!) {
    register(username: $username, password: $password, email: $email) {
      user {
        token
        username
      }
    }
  }
`;

export default Register;
