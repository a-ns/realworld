import "reflect-metadata";
import * as dotenv from "dotenv"
dotenv.config()
import { GraphQLServer } from "graphql-yoga";
import { createConnection } from "typeorm";
import * as jwt from "jsonwebtoken";
import * as path from "path"
import { importSchema } from "graphql-import";

import { resolvers } from "./resolvers";
const authUserMiddleware = (req: any, _: any, next: any) => {
  const token = req.headers.authorization
  if(token){
    try {
      const { user } = jwt.verify(token, process.env.SECRET) as {user: string}
      req.username = user
    }
    catch(err) { req.username = ""}
  }
  next()
}
const typeDefs =  importSchema(path.join(__dirname, './schema.graphql'))
const server = new GraphQLServer({
  typeDefs,
  resolvers,
  context: (req: any) => ({username: req.request.username})
});

server.express.use(authUserMiddleware)
createConnection()
  .then(() => {
    server.start(() => console.log("Server is running on localhost:4000"));
  })
  .catch();
