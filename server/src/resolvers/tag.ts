import { Tag } from "../entity/Tag";
import { ResolverMap } from '../types/ResolverType'
export const tagResolver = (): ResolverMap => ({
  Query: {
    tags: async () => Tag.find()
  },
  Mutation: {}
});
