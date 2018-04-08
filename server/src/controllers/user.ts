import * as bcrypt from "bcrypt";
import {pick} from "lodash";
import { User } from "../entity/User";
import { RegisterMutationArgs, RegisterResponse } from "../types";
export class UserController {
  async create(args: RegisterMutationArgs): Promise<RegisterResponse> {
    // try {
    //   const user = await User.create(args).save();
    //   return user;
    // } catch (err) {
    //     return {errors: {body: ["Unable to create user"]}}
    // }
    try {
        if (args.password.length < 5) {
          return { errors: { body: ["Registration unsuccessful"] } };
        }
        const password = await bcrypt.hash(args.password, process.env.SALT_ROUNDS || 12);
        const user = await User.create({ ...args, password }).save()
        return {user: pick(user as any, ["email", "token", "username", "bio", "image"])} 
      } catch (err) {
        return {
          errors: {
            body: ["unable to register user"]
          }
        };
      }
  }

  async read(args: any ) {
    try {
        const user = await User.findOne({where: args})
        return user
    }
    catch (err) {
        return {errors: {body: "Unable to find user"}}
    }
  }

  async update(args: any /* UpdateUserMutationArgs */) {
      try {
        let user = await User.findOne({where: {email: args.email}})
        user = {...user, ...args}
        return user
      }
      catch(err) {
          return {errors: {body: "Unable to update user"}}
      }
  }

  async delete(args: any /* RemoveUserMutationArgs */) {
    try {
        await User.delete({ email: args.email });
        return true
    }
    catch(err){
        return false
    }
  }
}
