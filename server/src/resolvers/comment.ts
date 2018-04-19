import { ResolverMap } from "../types/ResolverType";
import { AddCommentMutationArgs, DeleteCommentMutationArgs } from "../types";
import { RequiresAuth } from "../auth";
import { Article } from "../entity/Article";
import { Comment } from "../entity/Comment";
import { Users } from "../entity/Users";
import { Context } from "../types/context";
export const commentResolver = (): ResolverMap => ({
  Mutation: {
    addComment: RequiresAuth(
      async (_: any, args: AddCommentMutationArgs, context: Context) => {
        try {
          const article = await Article.findOne({
            where: { slug: args.slug },
            relations: ["tagList", "author", "comments", "favoritedBy"]
          });
          const author = await Users.findOne({
            where: { username: context.username },
            relations: ["comments"]
          });
          const comment = await Comment.create({
            article,
            author,
            body: args.body
          }).save();
          article.comments = [...article.comments, comment];
          author.comments = [...author.comments, comment];
          article.save();
          author.save();
          return {
            comment
          };
        } catch (err) {
          return {
            errors: {
              body: ["Unable to create comment"]
            }
          };
        }
      }
    ),
    deleteComment: RequiresAuth(
      async (_, { id }: DeleteCommentMutationArgs, context: Context) => {
        try {
          const comment = await Comment.findOne({
            where: { id },
            relations: ["author", "article"]
          });
          if (comment.author.username !== context.username) {
            return false;
          }
          await comment.remove();
          return true;
        } catch (err) {
          return false;
        }
      }
    )
  }
});
