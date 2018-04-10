import { flattenDeep, difference } from "lodash";
import {
  CreateArticleMutationArgs,
  UpdateArticleMutationArgs,
  DeleteArticleMutationArgs
} from "../types";
import { Article } from "../entity/Article";
import { Tag } from "../entity/Tag";
import { Errors } from "../types/error";
export class ArticleController {
  async create(args: CreateArticleMutationArgs): Promise<Article | Errors> {
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
      const article = await Article.create({
        ...args,
        tagList: finalTags
      }).save();

      return article;
    } catch (err) {
      return {
        errors: { body: ["Unable to create this article."] }
      };
    }
  }
  async read(args: any): Promise<any> {
    try {
      if (args.slug) {
        return Article.findOne({
          where: { slug: args.slug },
          relations: ["tagList"]
        });
      }
      const articles = await Article.find({
        where: args,
        relations: ["tagList"]
      });

      const edges = articles.map(article => {
        return {
          node: article,
          cursor: String(article.id)
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
        throw err
    }
  }

  async delete(args: DeleteArticleMutationArgs) {
    try {
        const article = await Article.findOne({where: {slug: args.slug}})
        await Article.delete(article)
        return true
    } catch (err) {
        return false
    }
  }
}