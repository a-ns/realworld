import React from "react";
import gql from "graphql-tag";
import { Query } from "react-apollo";
const Article = props => (
  <Query query={ARTICLE_QUERY} variables={{ slug: props.match.params.slug }}>
    {({ loading, error, data }) => {
      if (loading) return <div>Loading</div>;
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
        />
      );
    }}
  </Query>
);

const ArticleView = props => (
  <div>
    <div>slug: {props.slug}</div>
    <div>title: {props.title}</div>
    <div>description: {props.description}</div>
  </div>
);

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
    }
  }
`;

export default Article;
