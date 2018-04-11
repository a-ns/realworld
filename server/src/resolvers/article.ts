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
    article: (_: any, args: ArticleQueryArgs): Promise<Article | Errors> => {
      const articleController = new ArticleController(null);
      return articleController.readOne(args);
    },
    articles: (
      _: any,
      args: ArticlesQueryArgs
    ): Promise<ArticlesConnection | Errors> => {
      const articleController = new ArticleController(null);
      return articleController.read(args);
    }
  },
  Mutation: {
    createArticle: (_: any, args: CreateArticleMutationArgs) => {
      const articleController = new ArticleController(null);
      return articleController.create(args);
    },
    deleteArticle: (_: any, args: DeleteArticleMutationArgs) => {
      const articleController = new ArticleController(null);
      return articleController.delete(args);
    },
    updateArticle: (_: any, args: UpdateArticleMutationArgs) => {
      const articleController = new ArticleController(null);
      return articleController.update(args);
    }
  },
  Article: {
    favorited: (parent: Article, _: any, context: any) => {
      /* Map the user[] to a single boolean.  */
      return parent.favoritedBy.some(
        user => user.username === context.user
      );
    },
    tagList: (parent: Article) => {
      /* map the Tag objects to their descriptions */
      return parent.tagList.map(tag => tag.kind);
    },
  }
});
