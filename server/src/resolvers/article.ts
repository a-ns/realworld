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
import { Context } from "../types/context";
export const articleResolver = (): ResolverMap => ({
  Query: {
    article: (_: any, args: ArticleQueryArgs, context: Context): Promise<Article | Errors> => {
      const articleController = new ArticleController(context);
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
    createArticle: (_: any, args: CreateArticleMutationArgs, context: Context) => {
      const articleController = new ArticleController(context);
      return articleController.create(args);
    },
    deleteArticle: (_: any, args: DeleteArticleMutationArgs, context: Context) => {
      const articleController = new ArticleController(context);
      return articleController.delete(args);
    },
    updateArticle: (_: any, args: UpdateArticleMutationArgs, context: Context) => {
      const articleController = new ArticleController(context);
      return articleController.update(args);
    }
  },
  Article: {
    favorited: (parent: Article, _: any, context: Context) => {
      /* Map the user[] to a single boolean.  */
      return parent.favoritedBy.some(
        user => user.username === context.username
      );
    },
    tagList: (parent: Article) => {
      /* map the Tag objects to their descriptions */
      return parent.tagList.map(tag => tag.kind);
    },
    author: (parent: Article) => {
      console.log('getting author', parent)
      return parent.author
    },
    favoritesCount: (parent: Article) => {
      return parent.favoritedBy.length
    },
    comments: (parent: Article) => {
      console.log('resolving comments for article', parent)
      const articleController = new ArticleController(null)
      return articleController.paginate(parent.comments, null)
    }
  }
});
