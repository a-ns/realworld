import { ResolverMap } from "../types/ResolverType";
import { User } from "../entity/User";
import { RequiresAuth } from "../auth";

import {
  LoginMutationArgs,
  RegisterMutationArgs,
  LoginResponse,
  RegisterResponse,
  CommentsProfileArgs,
  FavoritesProfileArgs,
  FeedQueryArgs
} from "../types";
import { Errors } from "../types/error";
import { UserController } from "../controllers/user";
import { Context } from "../types/context";
export const userResolver = (): ResolverMap => ({
  Query: {
    user: RequiresAuth(async (_, __, context: Context, ___) => {
      const userController = new UserController(context)
      return userController.read({username: context.username})
    }
    ),
    feed: RequiresAuth(
      async (_, { first, after }: FeedQueryArgs, context: any) => {
        try {
          const userController = new UserController(context)
          return userController.feed({first, after})
        } catch (err) {
          return {
            errors: {
              body: ["Unable to find this feed"]
            }
          };
        }
      }
    )
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
    }
  },
  Profile: {
    following: (parent: User, _, context: any) => {
      if (!context.user) {
        return false;
      }
      return parent.followers.some(
        follower => follower.username === context.user
      );
    },
    comments: (parent: User, { first, after }: CommentsProfileArgs) => {
      const userController = new UserController(null)
      return userController.comments({comments: parent.comments, first, after})
    },
    favorites: (parent: User, { first, after }: FavoritesProfileArgs) => {
      const userController = new UserController(null)
      return userController.favorites({first, after, favorites: parent.favorites})
    },
    feed: (parent: User, {first, after}: FeedQueryArgs) => {
      const userController = new UserController(null)
      return userController.paginate(parent.articles, {first, after})
    }
  }
});
