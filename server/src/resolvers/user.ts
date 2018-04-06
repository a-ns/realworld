import * as bcrypt from "bcrypt";
import * as jwt from "jsonwebtoken";

import { ResolverMap } from '../types/ResolverType'
import { User } from "../entity/User";
export const userResolver = (SALT_ROUNDS: number, SECRET: string): ResolverMap => ({
  Query: {},
  Mutation: {
    login: async (_: any, args: { email: string; password: string }) => {
      try {
        const user = await User.findOne({ where: { email: args.email } });
        const match = await bcrypt.compare(args.password, user.password);
        if (!match) {
          return "Login unsuccessful"; // error, not a match
        }
        const token = jwt.sign({ user: user.email }, SECRET, {
          expiresIn: "2d"
        });
        // generate a JWT token put it in database, send it back to the user
        return { ...user, token };
      } catch (err) {}
    },
    register: async (
      _: any,
      args: { username: string; email: string; password: string }
    ) => {
      try {
        if (args.password.length < 5) {
          return {}; // error
        }
        const password = await bcrypt.hash(args.password, SALT_ROUNDS);
        return User.create({ ...args, password }).save();
      } catch (err) {
        return {
          ok: false,
          error: {
            what: "register",
            why: "unable to register user"
          }
        };
      }
    }
  }
});
