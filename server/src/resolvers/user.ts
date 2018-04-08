import * as bcrypt from "bcrypt";
import * as jwt from "jsonwebtoken";
import { pick } from "lodash";
import { ResolverMap } from "../types/ResolverType";
import { User } from "../entity/User";
import { RequiresAuth } from "../auth";

import {
  LoginMutationArgs,
  RegisterMutationArgs,
  LoginResponse,
  RegisterResponse,
  User as UserType
} from "../types";
import { Errors } from "../types/error";
import { UserController } from "../controllers/user";
export const userResolver = (
  SALT_ROUNDS: number,
  SECRET: string
): ResolverMap => ({
  Query: {
    user: RequiresAuth(async (_, __, context, ___) =>
      User.findOne({ where: { email: context.user.email } })
    )
  },
  Mutation: {
    login: async (_: any, args: LoginMutationArgs): Promise<LoginResponse | Errors> => {
      try {
        const user = await User.findOne({ where: { email: args.email } });
        const match = await bcrypt.compare(args.password, user.password);
        if (!match) {
          return { errors: { body: ["Login unsuccessful"] } };
        }
        const token = jwt.sign({ user: user.email }, SECRET, {
          expiresIn: "2d"
        }); // generate a JWT token put it in database, send it back to the user
         
        return {
          ...pick(user, ["email", "username", "bio", "image"]),
          token
        };
      } catch (err) {
        return { errors: { body: ["Login unsuccessful"] } };
      }
    },
    register: async (_: any, args: RegisterMutationArgs): Promise<RegisterResponse | Errors> => {
      
      const controller = new UserController()

      return controller.create(args)
    }
  }
});
