import { ResolverMap } from "../types/ResolverType";
import { User } from "../entity/User";
import { RequiresAuth } from "../auth";

import {
  LoginMutationArgs,
  RegisterMutationArgs,
  LoginResponse,
  RegisterResponse
} from "../types";
import { Errors } from "../types/error";
import { UserController } from "../controllers/user";
export const userResolver = (): ResolverMap => ({
  Query: {
    user: RequiresAuth(async (_, __, context, ___) =>
      User.findOne({ where: { email: context.user.username } })
    )
  },
  Mutation: {
    login: async (
      _: any,
      args: LoginMutationArgs
    ): Promise<LoginResponse | Errors> => {
      const controller = new UserController();
      return controller.login(args);
    },
    register: async (
      _: any,
      args: RegisterMutationArgs
    ): Promise<RegisterResponse | Errors> => {
      const controller = new UserController();

      return controller.create(args);
    }
  },
  Profile: {
    following: (parent: User, _, context: any) => {
      if(!context.user){
        return false;
      }
      return parent.followers.some((follower) => follower.username === context.user)
    },
    comments: (parent: User,/* args: {first: number, after: number} */) => {
      const edges = parent.comments.map(comment => ({
        node: comment,
        cursor: comment.id
      }));
      const count = edges.length;
      const pageInfo = {
        hasNextPage: false,
        endCursor: edges[count - 1].cursor
      };
      return {
        count,
        edges,
        pageInfo
      };
    },
    favorites: (parent: User, /* args: { first: number; after: number }*/) => {
      const edges = parent.favorites.map(article => ({
        node: article,
        cursor: article.slug
      }));
      const count = edges.length;
      const pageInfo = {
        hasNextPage: false,
        endCursor: edges[count - 1].cursor
      };
      return {
        edges,
        count,
        pageInfo
      };
    },
    feed: (parent: User,/* args: { first: number; after: number } */) => {
      const edges = parent.articles.map(article => ({
        node: article,
        cursor: article.slug
      }));
      const count = edges.length;
      const pageInfo = {
        hasNextPage: false,
        endCursor: edges[count - 1].cursor
      };
      return {
        edges,
        count,
        pageInfo
      };
    }
  }
});
