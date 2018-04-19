import * as bcrypt from "bcrypt";
import { pick } from "lodash";
import * as jwt from "jsonwebtoken";
import { Users } from "../entity/Users";
import {
  RegisterMutationArgs,
  RegisterResponse,
  LoginResponse,
  FeedQueryArgs,
  UpdateUserMutationArgs,
  ArticlesProfileArgs,
  CommentsProfileArgs,
  FavoritesProfileArgs
} from "../types";
import { Errors } from "../types/error";
import { BaseController } from "./base";
import { Article } from "../entity/Article";
import { Context } from "../types/context";
import { getConnection } from "typeorm";
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

  async update(args: UpdateUserMutationArgs) {
    try {
      const user = await Users.findOne({ where: { username: this.context.username } });
      user.bio = args.bio || user.bio
      user.email = args.email || user.email
      user.image = args.image || user.image
      await user.save()
      return user;
    } catch (err) {
      return { errors: { body: "Unable to update user" } };
    }
  }

  async delete(args: any) {
    try {
      const userToDelete = await Users.findOne({where: {username: this.context.username}})
      if(!userToDelete) {
        return false
      }
      Users.remove(userToDelete)
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

  async articlesForProfile(parent: Users, {first = 10, after = null}: ArticlesProfileArgs) {
    try {
      const createdAfter = this.fromBase64(after).createdAt
      const query = getConnection().createQueryBuilder()
                  .select()
                  .from(Article, "article")
                  .where("article.authorId = :authorId", {authorId: parent.id})
      if(createdAfter) {
        query
        .andWhere("article.createdAt < :createdAfter" , {createdAfter})
      }
      query
      .orderBy("article.createdAt", "DESC")
      const [articles, count] = await  query.getManyAndCount()
      return this.paginate(articles.slice(0, first), {hasNextPage: count > first})
    }
    catch(err) {
      return this.paginate([], null)
    }
  }

  // async feed({ first, after }: FeedQueryArgs) {
  //   try {
  //     const cursorArticle: Partial<Article> = JSON.parse(
  //       this.fromBase64(after)
  //     );
  //     const user = await Users.findOne({
  //       where: { username: this.context.username }
  //     });
  //     let articles: Article[] = [];
  //     user.followers.forEach(fu => {
  //       fu.articles.forEach(a => {
  //         if (a.createdAt < cursorArticle.createdAt) {
  //           articles.push(a);
  //         }
  //       });
  //     });
  //     articles = articles.sort((a, b) => a.createdAt < b.createdAt? -1 : 1)
  //     return this.paginate(articles, { first, after });
  //   } catch (err) {
  //     return err;
  //   }
  // }
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

  async comments(parent: Users, {first = 10, after = null}: CommentsProfileArgs) {
    try {
      const createdAfter = this.fromBase64(after).createdAfter
      const query = getConnection()
                    .createQueryBuilder()
                    .relation(Users, "comments")
                    .of(parent)
                    .select()
      if(after){
        query
        .where("comment.createdAt < :createdAfter", {createdAfter})
      }
      const [comments, count] = await query.getManyAndCount()
      return this.paginate(comments.slice(0, first), {hasNextPage: count > first})
    } catch(err){
      return this.paginate([], null)
    }

  }
  async favorites(parent: Users, {first = 10, after = null}: FavoritesProfileArgs) {
    try {
      const createdAfter = this.fromBase64(after).createdAfter
      const query = getConnection()
                    .createQueryBuilder()
                    .relation(Users, "favorites")
                    .of(parent)
                    .select()
      if(after){
        query
        .where("article.createdAt < :createdAfter", {createdAfter})
      }
      const [favorites, count] = await  query.getManyAndCount()

      return this.paginate(favorites.slice(0, first) , {hasNextPage: count > first})              
    } catch(err){
      return this.paginate([], null)
    }
  }
}
