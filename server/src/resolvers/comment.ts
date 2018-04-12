import { ResolverMap } from "../types/ResolverType";
import { AddCommentMutationArgs, DeleteCommentMutationArgs } from "../types";
import { RequiresAuth } from "../auth";
import { Article } from "../entity/Article";
import { Comment } from "../entity/Comment";
import { Users } from "../entity/Users";
export const commentResolver = (): ResolverMap => ({
  Mutation: {
    addComment: RequiresAuth(
      async (_: any, args: AddCommentMutationArgs, context: any) => {
        try {
          const article = await Article.findOne(null, {
            where: { slug: args.slug },
            relations: ["article"]
          });
          const author = await Users.findOne(null, {
            where: { username: context.user }
          });
          const comment = await Comment.create({
            article,
            author,
            body: args.body
          }).save();
          article.comments = [...article.comments, comment];
          await article.save();
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
      async (_, { id }: DeleteCommentMutationArgs, context) => {
        try {
          const comment = await Comment.findOne({ where: { id } });
          if (comment.author.username !== context.username) {
            return false;
          }
          const article = comment.article;
          const author = comment.author;
          article.comments = article.comments.filter(c => c.id !== comment.id);
          author.comments = author.comments.filter(c => c.id !== comment.id);
          article.save();
          author.save();
          comment.remove();
          return true;
        } catch (err) {
          return false;
        }
      }
    )
  }
});
