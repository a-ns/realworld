import "reflect-metadata";
import { GraphQLServer } from "graphql-yoga";
import { createConnection } from "typeorm";

import { Article } from "./entity/Article";
import { Tag } from "./entity/Tag";


const typeDefs = `
  type Query {
    user(id: Int!): UserResponse!
    allUsers: [User!]
    article(id: Int!): Article!
    articles: [Article!]
    tags: [Tag!]
  }

  type User {
    id: Int!
    email: String!
    username: String!
    image: String
    bio: String!
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
  type Mutation {
    createUser(email: String!, username: String!, image: String, bio: String!): UserResponse!
    createArticle(slug: String!, title: String!, description: String!, body: String!, tags: [TagInput!]): ArticleResponse!
  }
`;

const resolvers = {
  Query: {
    
    tags: () => Tag.find(),
    article: async (_: any, args: any) => {
      const article = await Article.findOne(args.id, {relations: ["tags"]})
      return article
    },
    articles: async () =>  {
      const articles = await Article.find({relations: ["tags"]})
      return articles
    } 
  },
  Mutation: {
    createArticle: async (_: any, args: any) => {
      try {
        const article = await Article.saveWithTags(args)
        return {
          ok: true,
          article
        }
      }
      catch (err) {
        return {
          ok: false,
          error: {
            what: 'Article',
            why: 'Could not create this article'
          }
        }
      }
    }
  }
};

const server = new GraphQLServer({ typeDefs, resolvers });
createConnection().then(() => {
  server.start(() => console.log("Server is running on localhost:4000"));
}).catch();
