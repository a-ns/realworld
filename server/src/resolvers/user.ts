import * as bcrypt from "bcrypt";
import * as jwt from "jsonwebtoken";

import { ResolverMap } from "../types/ResolverType";
import { User } from "../entity/User";
import { RequiresAuth } from "../auth";
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
    login: async (_: any, args: { email: string; password: string }) => {
      try {
        const user = await User.findOne({ where: { email: args.email } });
        const match = await bcrypt.compare(args.password, user.password);
        if (!match) {
          return { errors: { body: ["Login unsuccessful"] } };
        }
        const token = jwt.sign({ user: user.email }, SECRET, {
          expiresIn: "2d"
        }); // generate a JWT token put it in database, send it back to the user
        return { ...user, token };
      } catch (err) {
        return { errors: { body: ["Login unsuccessful"] } };
      }
    },
    register: async (
      _: any,
      args: { username: string; email: string; password: string }
    ) => {
      try {
        if (args.password.length < 5) {
          return { errors: { body: ["Registration unsuccessful"] } };
        }
        const password = await bcrypt.hash(args.password, SALT_ROUNDS);
        return User.create({ ...args, password }).save();
      } catch (err) {
        return {
          ok: false,
          errors: {
            body: ["unable to register user"]
          }
        };
      }
    }
  }
});
