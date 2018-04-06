import { Article } from "../entity/Article";
import { ResolverMap } from '../types/ResolverType'

export const articleResolver = (): ResolverMap => ({
  Query: {
    article: async (_: any, args: any) =>
      Article.findOne(args.id, { relations: ["tags"] }),
    articles: async () => {
      try {
        const articles = await Article.find({ relations: ["tags"] });
        return {
          articles,
          articlesCount: articles.length
        };
      } catch (err) {
        console.log(err);
        return {};
      }
    }
  },
  Mutation: {
    createArticle: async (_: any, args: any) => {
      try {
        const article = await Article.saveWithTags(args);
        return {
          ok: true,
          article
        };
      } catch (err) {
        return {
          ok: false,
          error: {
            what: "Article",
            why: "Could not create this article"
          }
        };
      }
    }
  }
});
