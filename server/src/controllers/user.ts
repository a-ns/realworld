import * as bcrypt from "bcrypt";
import { pick } from "lodash";
import * as jwt from "jsonwebtoken";
import { Users } from "../entity/Users";
import {
  RegisterMutationArgs,
  RegisterResponse,
  LoginResponse,
  FeedQueryArgs
} from "../types";
import { Errors } from "../types/error";
import { BaseController } from "./base";
import { Article } from "../entity/Article";
import { Context } from "../types/context";
export class UserController extends BaseController {
  context: Context;
  constructor(context: any) {
    super();
    this.context = context;
  }
  /*
     * Only called for registration.
     */
  async create(args: RegisterMutationArgs): Promise<RegisterResponse> {
    try {
      if (args.password.length < 5) {
        throw new Error();
      }
      const password = await bcrypt.hash(
        args.password,
        Number(process.env.SALT_ROUNDS) || 12
      );
      const user = await Users.create({ ...args, password }).save();
      const token = jwt.sign({ user: user.username }, process.env.SECRET, {
        expiresIn: "2d"
      });
      return {
        user: {
          ...pick(user as any, ["email", "token", "username", "bio", "image"]),
          token
        }
      };
    } catch (err) {
      console.log(err);
      return {
        errors: {
          body: ["unable to register user"]
        }
      };
    }
  }

  async read(args: any) {
    try {
      const user = await Users.findOne({ where: args });
      return { user };
    } catch (err) {
      return { errors: { body: "Unable to find user" } };
    }
  }

  async update(args: any /* UpdateUserMutationArgs */) {
    try {
      let user = await Users.findOne({ where: { email: args.email } });
      user = { ...user, ...args };
      return user;
    } catch (err) {
      return { errors: { body: "Unable to update user" } };
    }
  }

  async delete(args: any /* RemoveUserMutationArgs */) {
    try {
      await Users.delete({ email: args.email });
      return true;
    } catch (err) {
      return false;
    }
  }

  async login(args: any): Promise<LoginResponse | Errors> {
    try {
      const user = await Users.findOne({ where: { email: args.email } });
      const match = await bcrypt.compare(args.password, user.password);
      if (!match) {
        return { errors: { body: ["Login unsuccessful"] } };
      }
      const token = jwt.sign({ user: user.username }, process.env.SECRET, {
        expiresIn: "2d"
      }); // generate a JWT token send it back to the user

      console.log("token", token);
      return {
        user: { ...pick(user, ["email", "username", "bio", "image"]), token }
      };
    } catch (err) {
      return { errors: { body: ["Login unsuccessful"] } };
    }
  }

  async feed({ first, after }: FeedQueryArgs) {
    try {
      const cursorArticle: Partial<Article> = JSON.parse(
        this.fromBase64(after)
      );
      const user = await Users.findOne({
        where: { username: this.context.username }
      });
      let articles: Article[] = [];
      user.followers.forEach(fu => {
        fu.articles.forEach(a => {
          if (a.createdAt < cursorArticle.createdAt) {
            articles.push(a);
          }
        });
      });
      articles = articles.sort((a, b) => a.createdAt < b.createdAt? -1 : 1)
      return this.paginate(articles, { first, after });
    } catch (err) {
      return err;
    }
  }
  async follow({ username }: any) {
    try {
      const user = await Users.findOne({
        where: { username: this.context.username }, relations: ["followers"]
      });

      const userToFollow = await Users.findOne({ 
        where: { username }, relations: ["followers"]
      });
      userToFollow.followers = [...userToFollow.followers, user]
      await user.save();
      await userToFollow.save();
      console.log(user, userToFollow)
      return { profile: userToFollow };
    } catch (err) {
      console.log(err)
      return {
        errors: {
          body: ["Unable to follow specified user"]
        }
      };
    }
  }

  async unfollow({ username }: any) {
    try {
      const user = await Users.findOne({
        where: { username: this.context.username }
      });
      const userToUnfollow = await Users.findOne({ where: { username } });
      // user.following = user.following.filter(f => f.username !== username);
      // userToUnfollow.followers = userToUnfollow.followers.filter(
      //   f => f.username !== user.username
      // );
      user.save();
      await userToUnfollow.save();
      return { profile: userToUnfollow };
    } catch (err) {
      console.log(err)
      return {
        errors: {
          body: ["Unable to unfollow specified user"]
        }
      };
    }
  }

  comments(args: any) {
    const { first, after, comments } = args;
    return this.paginate(comments, { first, after });
  }
  favorites(args: any) {
    const { first, after, favorites } = args;
    return this.paginate(favorites, { first, after });
  }
}
