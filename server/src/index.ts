import "reflect-metadata";
import { GraphQLServer } from "graphql-yoga";
import { createConnection } from "typeorm";
import { resolvers } from './resolvers'

export const typeDefs = `

  type ArticlesResponse {
    articles: [Article!]
    articlesCount: Int!
  }

  type User {

    id: Int!
    email: String!
    username: String!
    image: String
    bio: String!
    following: Boolean! @default(value: false)
  }

  type Error {
    what: String!
    why: String!
  }

  type UserResponse {
    ok: Boolean!
    user: User
    error: Error
  }

  type Article {
    id: Int!
    slug: String!
    title: String!
    description: String!
    body: String!
    tags: [Tag!]!
    favorited: Boolean! @default(value: false)
    favoritesCount: Int! @default(value: 0)
    author: User!
  }

  type Tag {
    id: Int!
    kind: String!
  }
  
  input TagInput {
    kind: String!
  }

  type ArticleResponse {
    ok: Boolean!
    article: Article
    error: Error
  }

  type RegisterResponse {
    ok: Boolean!
    user: User
    error: Error
  }

  type LoginResponse {
    email: String!
    token: String!
    username: String!
    bio: String
    image: String
    error: String
  }

  type Query {
    me: User
    article(id: Int!): Article!
    articles(tag: String, authoredBy: String, favoritedBy: String) : ArticlesResponse!
    tags: [Tag!]
  }
  type Mutation {
    login(email: String!, password: String!): LoginResponse!
    createUser(email: String!, username: String!, image: String, bio: String!): UserResponse!
    createArticle(slug: String!, title: String!, description: String!, body: String!, tags: [TagInput!]): ArticleResponse!
    register(email: String!, password: String!, username: String!): RegisterResponse!
  }
`;


const server = new GraphQLServer({ typeDefs, resolvers });
createConnection()
  .then(() => {
    server.start(() => console.log("Server is running on localhost:4000"));
  })
  .catch();
