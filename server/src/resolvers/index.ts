import { merge } from "lodash";

import { articleResolver } from "./article";
import { userResolver } from "./user";
import { tagResolver } from "./tag";
import { commentResolver } from "./comment";

import { ResolverMap } from '../types/ResolverType'

export const resolvers: ResolverMap = merge(
  articleResolver(),
  userResolver(),
  tagResolver(),
  commentResolver(),
);
