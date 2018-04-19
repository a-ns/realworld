import { flattenDeep, difference } from "lodash";
import {
  CreateArticleMutationArgs,
  UpdateArticleMutationArgs,
  DeleteArticleMutationArgs,
  ArticleQueryArgs,
  ArticlesQueryArgs,
  ArticlesConnection,
  CommentsArticleArgs,
  FeedQueryArgs
} from "../types";
import { Article } from "../entity/Article";
import { Tag } from "../entity/Tag";
import { Errors } from "../types/error";
import { BaseController } from "./base";
import { Users } from "../entity/Users";
import { Context } from "../types/context";
import { getConnection } from "typeorm";
import { Comment } from "../entity/Comment";

export class ArticleController extends BaseController {
  context: Context;
  constructor(context: Context) {
    super();
    this.context = context;
  }
  async create(args: CreateArticleMutationArgs) {
    try {
      const tagsKinds = args.tagList;
      const existingTags = flattenDeep(
        await Promise.all(
          tagsKinds.map((kind: string) => Tag.find({ where: { kind } }))
        )
      );

      const tagsToMake = difference(
        tagsKinds,
        existingTags.map((f: any) => f.kind)
      );

      const newTags = await Promise.all(
        tagsToMake.map(kind => Tag.create({ kind }).save())
      );

      const finalTags = [...existingTags, ...newTags];
      const author = await Users.findOne({where: {username: this.context.username}, relations: ["articles"]})
      const article = await Article.create({
        ...args,
        author,
        tagList: finalTags
      }).save();
      author.articles.push(article)
      author.save()
      return { article };
    } catch (err) {
      console.log(err)
      return {
        errors: { body: ["Unable to create this article."] }
      };
    }
  }

  async readOne(args: ArticleQueryArgs): Promise<Article | Errors> {
    try {
      return Article.findOne({
        where: { slug: args.slug },
        relations: ["tagList", "author", "favoritedBy"]
      });
    } catch (err) {
      return {
        errors: {
          body: ["Unable to find specified article"]
        }
      };
    }
  }
  async read(args: ArticlesQueryArgs): Promise<ArticlesConnection | Errors> {
    try {
      const articles = await Article.find({
        where: args,
        relations: ["tagList", "author", "favoritedBy"]
      });

      const edges = articles.map(article => {
        return {
          node: article,
          cursor: this.toBase64(article)
        };
      });
      return {
        count: articles.length || 0,
        edges,
        pageInfo: {
          endCursor: edges[edges.length - 1].cursor,
          hasNextPage: false
        }
      } as any;
    } catch (err) {
      return {
        errors: { body: ["Unable to find specified article."] }
      };
    }
  }

  async update(args: UpdateArticleMutationArgs) {
    try {
      const article = await Article.findOne({ where: { slug: args.slug } });
      article.title = args.changes.title || article.title;
      article.body = args.changes.body || article.body;
      article.description = args.changes.description || article.description;
      return { article: article.save() };
    } catch (err) {
      return {
        errors: {
          body: ["Unable to update this article"]
        }
      };
    }
  }

  async delete(args: DeleteArticleMutationArgs) {
    try {
      const article = await Article.findOne({ where: { slug: args.slug } });
      await Article.delete(article);
      return true;
    } catch (err) {
      return false;
    }
  }

  async comments(parent: Article, {first, after}: CommentsArticleArgs) {
    try {
      const createdAfter = this.fromBase64(after).createdAfter
      const [comments, count] = await getConnection().createQueryBuilder()
                             .select()
                             .from(Comment, "comment")
                             .where("comment.articleId = :articleId", {articleId: parent.id})
                             .andWhere("comment.createdAt < :createdAfter", {createdAfter})
                             .orderBy("comment.createdAt", "DESC")
                             .getManyAndCount() 
      return this.paginate(comments.slice(0, first), {hasNextPage: count > first})
    }
    catch(err) {
      return this.paginate([], null)
    }               
  }

  async feed({first = 10, after = null}: FeedQueryArgs) {
    const createdAfter = this.fromBase64(after).createdAt || null
    const user = await Users.findOne({where: {username: this.context.username}})
    const userId = user.id
    const [articles, count] = await getConnection().createQueryBuilder()
                                  .select()
                                  .from(Article, "article")
                                  .where("article.authorId = :authorId", {authorId: userId})
                                  .andWhere("article.createdAt < :createdAfter", {createdAfter})
                                  .orderBy("article.createdAt", "DESC")
                                  .getManyAndCount()
    return this.paginate(articles.slice(0, first), {hasNextPage: count > first})
  }
}
