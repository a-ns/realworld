import "reflect-metadata";
import { GraphQLServer } from "graphql-yoga";
import { createConnection } from "typeorm";
import * as jwt from "jsonwebtoken";

import { resolvers } from "./resolvers";

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
    body: [String!]!
  }

  type UserResponse {
    ok: Boolean!
    user: User
    errors: Error
  }

  type Article {
    id: Int!
    slug: String!
    title: String!
    description: String!
    body: String!
    tagList: [String!]!
    favorited: Boolean! @default(value: false)
    favoritesCount: Int! @default(value: 0)
    author: User!
  }
  

  type ArticleResponse {
    ok: Boolean!
    article: Article
    errors: Error
  }

  type RegisterResponse {
    ok: Boolean!
    user: User
    errors: Error
  }

  type LoginResponse {
    email: String!
    token: String!
    username: String!
    bio: String
    image: String
    errors: Error
  }

  type Query {
    user: User
    article(id: Int!): Article!
    articles(tag: String, authoredBy: String, favoritedBy: String) : ArticlesResponse!
    tags: [String!]
  }
  type Mutation {
    login(email: String!, password: String!): LoginResponse!
    createUser(email: String!, username: String!, image: String, bio: String!): UserResponse!
    createArticle(slug: String!, title: String!, description: String!, body: String!, tags: [String!]): ArticleResponse!
    register(email: String!, password: String!, username: String!): RegisterResponse!
  }
`;

const decodeTokenMiddleware = (req: any, _: any, next: any) => {
  const token = req.headers["x-token"]
  if(token){
    try {
      const { user } = jwt.verify(token, process.env.SECRET) as {user: string}
      req.user = user
    }
    catch(err) { req.user = {}}
  }
  next()
}
const server = new GraphQLServer({
  typeDefs,
  resolvers,
  context: (req: any) => ({user: req.user})
});

server.express.use(decodeTokenMiddleware)
createConnection()
  .then(() => {
    server.start(() => console.log("Server is running on localhost:4000"));
  })
  .catch();
