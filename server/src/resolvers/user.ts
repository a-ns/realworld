import { ResolverMap } from "../types/ResolverType";
import { Users } from "../entity/Users";
import { RequiresAuth } from "../auth";

import {
  LoginMutationArgs,
  RegisterMutationArgs,
  CommentsProfileArgs,
  FavoritesProfileArgs,
  ProfileQueryArgs,
  ArticlesProfileArgs,
  UpdateUserMutationArgs,
  MeResponse,
  UnfollowMutationArgs
} from "../types";
import { Errors } from "../types/error";
import { UserController } from "../controllers/user";
import { Context } from "../types/context";
export const userResolver = (): ResolverMap => ({
  Query: {
    user: RequiresAuth(async (_, __, context: Context, ___) => {
      const userController = new UserController(context);
      return userController.read({ username: context.username });
    }),
    // feed: RequiresAuth(
    //   async (_, { first, after }: FeedQueryArgs, context: any) => {
    //     try {
    //       const userController = new UserController(context);
    //       return userController.feed({ first, after });
    //     } catch (err) {
    //       return {
    //         errors: {
    //           body: ["Unable to find this feed"]
    //         }
    //       };
    //     }
    //   }
    // ),
    profile: async (_, args: ProfileQueryArgs) => {
      try {
        const profile = await Users.findOne({
          where: args,
          relations: ["followers",]
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
    ): Promise<MeResponse | Errors> => {
      const controller = new UserController(null);
      return controller.login(args);
    },
    register: async (
      _: any,
      args: RegisterMutationArgs
    ): Promise<MeResponse | Errors> => {
      const controller = new UserController(null);

      return controller.create(args);
    },
    updateUser: RequiresAuth(
      async (_, args: UpdateUserMutationArgs, context: Context) => {
        const userController = new UserController(context);
        return userController.update(args);
      }
    ),
    follow: RequiresAuth(async (_, args: any, context: Context) => {
      const userController = new UserController(context);
      return userController.follow(args);
    }),
    unfollow: RequiresAuth(async (_, args: UnfollowMutationArgs, context: Context) => {
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
    comments: (
      parent: Users,
      { first, after }: CommentsProfileArgs,
      context: Context
    ) => {
      const userController = new UserController(context);
      return userController.comments(parent, {
        first,
        after
      });
    },
    favorites: (parent: Users, { first, after }: FavoritesProfileArgs, context: Context) => {
      const userController = new UserController(context);
      return userController.favorites(parent, {
        first,
        after
      });
    },
    // feed: (parent: Users, {first, after}: FeedQueryArgs) => {
    //   const userController = new UserController(null)
    //   return userController.paginate(parent.articles, {first, after})
    // }
    articles: (
      parent: Users,
      { first, after }: ArticlesProfileArgs,
      context: Context
    ) => {
      console.log('profile articles', parent)
      const userController = new UserController(context);
      return userController.articlesForProfile(parent, { first, after });
    }
  }
});
