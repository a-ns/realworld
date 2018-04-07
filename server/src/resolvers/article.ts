import { Article } from "../entity/Article";
import { ResolverMap } from "../types/ResolverType";
import { pick } from "lodash"

import {  ArticleQueryArgs, CreateArticleMutationArgs } from "../types/"
export const articleResolver = (): ResolverMap => ({
  Query: {
  article: async (_: any, args: ArticleQueryArgs, context: {user: string}) => {
    const article = await Article.findOne(args.id, { relations: ["tags"] })
    const following = !!article.author.followers.find(follower => follower.email === context.user)
    return {
      ...article,
      author: {...pick(article.author, ["username", "bio", "image", /* "following" */]), following}
    }
  },
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
    createArticle: async (_: any, args: CreateArticleMutationArgs) => {
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
            body: ["Could not create this article"]
          }
        };
      }
    }
  },
})
