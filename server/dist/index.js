"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
require("reflect-metadata");
const graphql_yoga_1 = require("graphql-yoga");
const typeorm_1 = require("typeorm");
const Article_1 = require("./entity/Article");
const Tag_1 = require("./entity/Tag");
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
        tags: () => Tag_1.Tag.find(),
        article: (_, args) => __awaiter(this, void 0, void 0, function* () {
            const article = yield Article_1.Article.findOne(args.id, { relations: ["tags"] });
            return article;
        }),
        articles: () => __awaiter(this, void 0, void 0, function* () {
            const articles = yield Article_1.Article.find({ relations: ["tags"] });
            return articles;
        })
    },
    Mutation: {
        createArticle: (_, args) => __awaiter(this, void 0, void 0, function* () {
            try {
                const article = yield Article_1.Article.saveWithTags(args);
                return {
                    ok: true,
                    article
                };
            }
            catch (err) {
                return {
                    ok: false,
                    error: {
                        what: 'Article',
                        why: 'Could not create this article'
                    }
                };
            }
        })
    }
};
const server = new graphql_yoga_1.GraphQLServer({ typeDefs, resolvers });
typeorm_1.createConnection().then(() => {
    server.start(() => console.log("Server is running on localhost:4000"));
}).catch();
//# sourceMappingURL=index.js.map