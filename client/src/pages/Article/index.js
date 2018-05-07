import React from "react";
import styled from "styled-components";
import { Query, Mutation } from "react-apollo";
import { Card, Text, Icon, EditableText, Button } from "@blueprintjs/core";
import Loading from "../../Loading";
import CenterContainer from "../../CenterContainer";
import {
  ARTICLE_QUERY,
  ADD_COMMENT_MUTATION,
  FAVORITE_ARTICLE_MUTATION
} from "./queries";

const ArticleContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  grid-template-rows: repeat(4, 1fr);
  grid-template-areas:
    "title title favorited ..."
    "description description ... ..."
    "body body body body"
    "body body body body";
`;
const Article = props => (
  <Query query={ARTICLE_QUERY} variables={{ slug: props.match.params.slug }}>
    {({ loading, error, data }) => {
      if (loading) return <Loading />;
      if (error) return <div>Error</div>;
      const { article } = data;
      if (!article) return <div>Unable to find this article</div>;
      return (
        <CenterContainer>
          <ArticleView {...article} />
        </CenterContainer>
      );
    }}
  </Query>
);

const Title = styled.h1`
  grid-area: title;
`;
const Description = styled.h6`
  grid-area: description;
`;
const Body = styled.div`
  grid-area: body;
`;
const Favorited = styled.div`
  grid-area: favorited;
`;
const ArticleView = props => (
  <React.Fragment>
    <ArticleContainer className="pt-card .pt-elevation-2">
      <Title>{props.title}</Title>
      <Description>{props.description}</Description>
      <Favorited>
        <Icon icon={props.favorited ? "star" : "star-empty"} />
      </Favorited>
      <Body>
        <Text>{props.body}</Text>
      </Body>
    </ArticleContainer>
    <Comments comments={props.comments} />
    <AddComment slug={props.slug} />
  </React.Fragment>
);

const Comments = props => (
  <div>{props.comments.edges.map(c => <Comment comment={c} />)}</div>
);

const Comment = props => (
  <div>
    <div>{props.comment.author.username}</div>
    <div>{props.comment.body}</div>
  </div>
);

class AddComment extends React.Component {
  state = {
    comment: {
      body: ""
    }
  };
  onSubmit = e => {
    e.preventDefault();
    this.setState({ comment: { body: "" } });
  };
  onChange = e => {
    this.setState({ comment: { body: e } });
  };
  render() {
    return (
      <Mutation
        mutation={ADD_COMMENT_MUTATION}
        variables={{ slug: this.props.slug, body: this.state.commend.body }}
      >
        {(mutate, { data, loading, called, error }) => (
          <form
            onSubmit={e => {
              mutate();
              this.onSubmit(e);
            }}
          >
            <EditableText
              multiline="true"
              minLines={2}
              placeholder="Add new comment"
              onChange={this.onChange}
              value={this.state.comment.body}
            />
            <Button type="submit" intent="primary" disabled={loading}>
              {loading ? <Loading /> : "Submit Comment"}
            </Button>
          </form>
        )}
      </Mutation>
    );
  }
}

export default Article;
