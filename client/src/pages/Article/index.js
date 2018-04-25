import React from "react";
import gql from "graphql-tag";
import styled from "styled-components";
import { Query } from "react-apollo";
import { Card, Text, Icon } from "@blueprintjs/core";
import Loading from "../../Loading";
const Container = styled.div`
  width: 60%;
  margin: 0 auto;
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
      console.log(data);
      if (!data.article) return <div>Unable to find this article</div>;
      return (
        <ArticleView
          author={data.article.author}
          slug={data.article.slug}
          title={data.article.title}
          description={data.article.description}
          body={data.article.body}
          tagList={data.article.tagList}
          createdAt={data.article.createdAt}
          updatedAt={data.article.updatedAt}
          favorited={data.article.favorited}
          favoritesCount={data.article.favoritesCount}
          comments={data.article.comments}
        />
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
    <Container className="pt-card .pt-elevation-2">
      <Title>{props.title}</Title>
      <Description>{props.description}</Description>
      <Favorited>
        <Icon icon={props.favorited ? "star" : "star-empty"} />
      </Favorited>
      <Body>
        <Text>{props.body}</Text>
      </Body>
    </Container>
    <Comments comments={props.comments} />
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

const FAVORITE_ARTICLE_MUTATION = gql`
  mutation favoriteArticle($slug: String!) {
    favoriteArticle(slug: $slug) {
      article {
        favorited
      }
    }
  }
`;

const ARTICLE_QUERY = gql`
  query article($slug: String!) {
    article(slug: $slug) {
      author {
        username
        email
      }
      slug
      title
      description
      body
      tagList
      createdAt
      updatedAt
      favorited
      favoritesCount
      comments {
        count
        edges {
          node {
            body
            author {
              username
            }
          }
        }
      }
    }
  }
`;

export default Article;
