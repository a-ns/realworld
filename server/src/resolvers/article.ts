import { Article } from "../entity/Article";
import { ResolverMap } from "../types/ResolverType";

import {
  ArticleQueryArgs,
  CreateArticleMutationArgs,
  ArticlesQueryArgs,
  ArticlesConnection,
  UpdateArticleMutationArgs,
  DeleteArticleMutationArgs
} from "../types/";
import { ArticleController } from "../controllers/article";
import { Errors } from "../types/error";
export const articleResolver = (): ResolverMap => ({
  Query: {
    article: <T extends ArticleQueryArgs>(_: any, args: T): Promise<Article | Errors> => {
      const articleController = new ArticleController();
      return articleController.read(args);
    },
    articles: (
      _: any,
      args: ArticlesQueryArgs
    ): Promise<ArticlesConnection | Errors> => {
      const articleController = new ArticleController();
      return articleController.read(args);
    }
  },
  Mutation: {
    createArticle: (_: any, args: CreateArticleMutationArgs) => {
      const articleController = new ArticleController();
      return articleController.create(args);
    },
    deleteArticle: (_: any, args: DeleteArticleMutationArgs) => {
      const articleController = new ArticleController()
      return articleController.delete(args)
    },
    updateArticle: (_: any, args: UpdateArticleMutationArgs) => {
      const articleController = new ArticleController()
      return articleController.update(args)
    }
  },
  Article: {
    favorited: (parent: Article, _: any, context: any) => {
      return parent.favoritedBy.some(
        follower => follower.username === context.user
      );
    },
    tagList: (parent: Article) => {
      return parent.tagList.map(tag => tag.kind);
    }
  }
});
