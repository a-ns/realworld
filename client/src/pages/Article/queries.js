import gql from "graphql-tag";
export const ADD_COMMENT_MUTATION = gql`
  mutation addComment($slug: String!, $body: String!) {
    addComment(slug: $slug, body: $body) {
      comment {
        body
        createdAt
        author {
          username
        }
      }
    }
  }
`;

export const FAVORITE_ARTICLE_MUTATION = gql`
  mutation favoriteArticle($slug: String!) {
    favoriteArticle(slug: $slug) {
      article {
        favorited
      }
    }
  }
`;

export const ARTICLE_QUERY = gql`
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
