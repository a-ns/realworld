import { Tag } from "../entity/Tag";

export const tagResolver = () => ({
  Query: {
    tags: async () => Tag.find()
  },
  Mutation: {}
});
