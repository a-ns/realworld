import * as bcrypt from "bcrypt";
import { pick } from "lodash";
import * as jwt from "jsonwebtoken";
import { Users } from "../entity/Users";
import {
  RegisterMutationArgs,
  MeResponse,
  UpdateUserMutationArgs,
  ArticlesProfileArgs,
  CommentsProfileArgs,
  FavoritesProfileArgs,
  UnfollowMutationArgs,
  FollowMutationArgs,
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
  async create(args: RegisterMutationArgs) {
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
          ...pick(user as any, ["email", "username", "bio", "image"]),
          token
        }
      };
    } catch (err) {
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
      const user = await Users.findOne({
        where: { username: this.context.username }
      });
      user.bio = args.bio || user.bio;
      user.email = args.email || user.email;
      user.image = args.image || user.image;
      await user.save();
      return user;
    } catch (err) {
      return { errors: { body: "Unable to update user" } };
    }
  }

  async delete() {
    try {
      const userToDelete = await Users.findOne({
        where: { username: this.context.username }
      });
      if (!userToDelete) {
        return false;
      }
      Users.remove(userToDelete);
      return true;
    } catch (err) {
      return false;
    }
  }

  async login(args: any): Promise<MeResponse | Errors> {
    try {
      const user = await Users.findOne({ where: { email: args.email } });
      const match = await bcrypt.compare(args.password, user.password);
      if (!match) {
        return { errors: { body: ["Login unsuccessful"] } };
      }
      const token = jwt.sign({ user: user.username }, process.env.SECRET, {
        expiresIn: "2d"
      }); // generate a JWT token send it back to the user
      return {
        user: { ...pick(user, ["email", "username", "bio", "image"]), token }
      };
    } catch (err) {
      return { errors: { body: ["Login unsuccessful"] } };
    }
  }

  async articlesForProfile(
    parent: Users,
    { first = 10, after = null }: ArticlesProfileArgs
  ) {
    try {
      const createdAfter = this.fromBase64(after).createdAt;
      const query = getConnection()
        .createQueryBuilder()
        .select()
        .from(Article, "article")
        .where("article.authorId = :authorId", { authorId: parent.id });
      if (createdAfter) {
        query.andWhere("article.createdAt < :createdAfter", { createdAfter });
      }
      query.orderBy("article.createdAt", "DESC");
      const [articles, count] = await query.getManyAndCount();
      return this.paginate(articles.slice(0, first), {
        hasNextPage: count > first
      });
    } catch (err) {
      return this.paginate([], null);
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
  async follow({ username }: FollowMutationArgs) {
    try {
      const [user, userToFollow] = await Promise.all([
        Users.findOne({
          where: { username: this.context.username },
          relations: ["followers"]
        }),
        Users.findOne({
          where: { username },
          relations: ["followers"]
        })
      ]);
      if(!user || !userToFollow){
        throw new Error()
      }
      for(let i = 0; i < userToFollow.followers.length -1; i++){
        if (userToFollow.followers[i].id === user.id) {
          return {profile: userToFollow} // already following
        }
      }
      userToFollow.followers = [...userToFollow.followers, user];
      await Promise.all([user.save(), userToFollow.save()]);
      return { profile: userToFollow };
    } catch (err) {
      return {
        errors: {
          body: ["Unable to follow specified user"]
        }
      };
    }
  }

  async unfollow({ username }: UnfollowMutationArgs) {
    try {
      const [follower, followed] = await Promise.all([
        getConnection().createQueryBuilder()
        .select("id")
        .from(Users, "user")
        .where("user.username = :username", {username: this.context.username})
        .getRawOne(),
        getConnection().createQueryBuilder()
        .select("id")
        .from(Users, "user")
        .where("user.username = :username", {username})
        .getRawOne()
      ])
      if (!follower || !followed) {
        throw new Error();
      }
      const query = getConnection()
        .createQueryBuilder()
        .delete()
        .from("follows")
        .where("follower = :id", { id: follower.id })
        .andWhere("followed = :followedId", {followedId: followed.id });
      await query.execute();
      return { profile: Users.findOne({where: {id: followed.id}, relations: ["articles", "comments", "followers"]}) };
    } catch (err) {
      console.log(err)
      return {
        errors: {
          body: ["Unable to unfollow specified user"]
        }
      };
    }
  }

  async comments(
    parent: Users,
    { first = 10, after = null }: CommentsProfileArgs
  ) {
    try {
      let comments = parent.comments;
      if (after) {
        const createdAfter = this.fromBase64(after).createdAt;
        comments = comments.filter(
          c => c.createdAt.toISOString() > createdAfter
        );
      }
      const count = comments.length;
      return this.paginate(comments.slice(0, first), {
        hasNextPage: count > first
      });
    } catch (err) {
      return this.paginate([], null);
    }
  }
  async favorites(
    parent: Users,
    { first = 10, after = null }: FavoritesProfileArgs
  ) {
    try {
      let favorites = parent.favorites;
      if (after) {
        const createdAfter = this.fromBase64(after).createdAfter;
        favorites = favorites.filter(
          f => f.createdAt.toISOString() > createdAfter
        );
      }
      const count = favorites.length;
      return this.paginate(favorites.slice(0, first), {
        hasNextPage: count > first
      });
    } catch (err) {
      return this.paginate([], null);
    }
  }
}
