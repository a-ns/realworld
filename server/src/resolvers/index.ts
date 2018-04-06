import { merge } from "lodash";
import * as bcrypt from "bcrypt";
import * as jwt from "jsonwebtoken";

import { User } from "../entity/User";

import { articleResolver } from "./article";
import { userResolver } from "./user";
import { tagResolver } from "./tag";
import { commentResolver } from "./comment";

const SALT_ROUNDS = 12;
const SECRET = "123456789abcdefghijkl";


export const resolvers = merge(
  articleResolver(),
  userResolver(SALT_ROUNDS, SECRET),
  tagResolver(),
  commentResolver(),
);
