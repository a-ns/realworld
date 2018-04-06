import { merge } from "lodash";

import { articleResolver } from "./article";
import { userResolver } from "./user";
import { tagResolver } from "./tag";
import { commentResolver } from "./comment";

import { ResolverMap } from '../types/ResolverType'

const SALT_ROUNDS = 12;
const SECRET = process.env.SECRET || "123456789abcdefghijkl";


export const resolvers: ResolverMap = merge(
  articleResolver(),
  userResolver(SALT_ROUNDS, SECRET),
  tagResolver(),
  commentResolver(),
);
