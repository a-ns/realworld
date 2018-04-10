import { ResolverMap } from '../types/ResolverType'
import { AddCommentMutationArgs } from '../types'
import { RequiresAuth } from '../auth';
import { Article } from '../entity/Article';
import { Comment } from '../entity/Comment';
import { User } from '../entity/User';
export const commentResolver = (): ResolverMap => ({

  Mutation: {
    addComment: RequiresAuth(async (_: any, args: AddCommentMutationArgs, context: any) => {
      try {
      const article = await Article.findOne(null, {where: {slug: args.slug}, relations: ["article"]})
      const author = await User.findOne(null, {where: {username: context.user}})
      const comment = await Comment.create({article, author, body: args.body}).save()
      article.comments = [...article.comments, comment]
      await article.save()
        return {
          comment
        }
      }
      catch(err) {
        return {
          errors: {
            body: ["Unable to create comment"]
          }
        }
      }
    
    })
  }
});
