import { ResolverMap } from "../types/ResolverType";
import { Users } from "../entity/Users";
import { RequiresAuth } from "../auth";

import {
  LoginMutationArgs,
  RegisterMutationArgs,
  LoginResponse,
  RegisterResponse,
  CommentsProfileArgs,
  FavoritesProfileArgs,
  FeedQueryArgs,
  ProfileQueryArgs,
  ArticlesProfileArgs
} from "../types";
import { Errors } from "../types/error";
import { UserController } from "../controllers/user";
import { Context } from "../types/context";
import { ArticleController } from "../controllers/article";
export const userResolver = (): ResolverMap => ({
  Query: {
    user: RequiresAuth(async (_, __, context: Context, ___) => {
      const userController = new UserController(context);
      return userController.read({ username: context.username });
    }),
    feed: RequiresAuth(
      async (_, { first, after }: FeedQueryArgs, context: any) => {
        try {
          const userController = new UserController(context);
          return userController.feed({ first, after });
        } catch (err) {
          return {
            errors: {
              body: ["Unable to find this feed"]
            }
          };
        }
      }
    ),
    profile: async (_, args: ProfileQueryArgs) => {
      try {
        const profile = await Users.findOne({
          where: args,
          relations: ["followers", "articles"]
        });
        
        return { profile };
      } catch (err) {
        return {
          errors: { body: ["Unable to find this profile"] }
        };
      }
    }
  },
  Mutation: {
    login: async (
      _: any,
      args: LoginMutationArgs
    ): Promise<LoginResponse | Errors> => {
      const controller = new UserController(null);
      return controller.login(args);
    },
    register: async (
      _: any,
      args: RegisterMutationArgs
    ): Promise<RegisterResponse | Errors> => {
      const controller = new UserController(null);

      return controller.create(args);
    },
    follow: RequiresAuth(async (_, args: any, context: Context) => {
      const userController = new UserController(context);
      return userController.follow(args);
    }),
    unfollow: RequiresAuth(async (_, args: any, context: Context) => {
      const userController = new UserController(context);
      return userController.unfollow(args);
    })
  },
  Profile: {
    following: (parent: Users, _, context: Context) => {
      if (!context.username) {
        return false;
      }
      return parent.followers.some(
        follower => follower.username === context.username
      );
    },
    comments: (parent: Users, { first, after }: CommentsProfileArgs) => {
      const userController = new UserController(null);
      return userController.comments({
        comments: parent.comments,
        first,
        after
      });
    },
    favorites: (parent: Users, { first, after }: FavoritesProfileArgs) => {
      const userController = new UserController(null);
      return userController.favorites({
        first,
        after,
        favorites: parent.favorites
      });
    },
    // feed: (parent: Users, {first, after}: FeedQueryArgs) => {
    //   const userController = new UserController(null)
    //   return userController.paginate(parent.articles, {first, after})
    // }
    articles:(parent: Users, {first, after}: ArticlesProfileArgs) => {
      const articleController = new ArticleController(null)
      return articleController.paginate(parent.articles, {first, after})
    }
  }
});
