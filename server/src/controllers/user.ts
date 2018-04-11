import * as bcrypt from "bcrypt";
import { pick } from "lodash";
import * as jwt from "jsonwebtoken";
import { User } from "../entity/User";
import {
  RegisterMutationArgs,
  RegisterResponse,
  LoginResponse
} from "../types";
import { Errors } from "../types/error";
export class UserController extends BaseController {
  context: {user: string}
  constructor(context: any){
    super()
    this.context = context
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
        process.env.SALT_ROUNDS || 12
      );
      const user = await User.create({ ...args, password }).save();
      return {
        user: pick(user as any, ["email", "token", "username", "bio", "image"])
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
      const user = await User.findOne({ where: args });
      return user;
    } catch (err) {
      return { errors: { body: "Unable to find user" } };
    }
  }

  async update(args: any /* UpdateUserMutationArgs */) {
    try {
      let user = await User.findOne({ where: { email: args.email } });
      user = { ...user, ...args };
      return user;
    } catch (err) {
      return { errors: { body: "Unable to update user" } };
    }
  }

  async delete(args: any /* RemoveUserMutationArgs */) {
    try {
      await User.delete({ email: args.email });
      return true;
    } catch (err) {
      return false;
    }
  }

  async login(args: any): Promise<LoginResponse | Errors> {
    try {
      const user = await User.findOne({ where: { email: args.email } });
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

  async feed(args: any){
    const user = await User.findOne({where: {username: this.context.user}})

    return this.paginate(user.articles, {...args})
  }

  comments(args: any){
    const {first, after, comments}  = args
    return this.paginate(comments, {first, after})
  }
  favorites(args: any){
    const {first, after, favorites} = args
    return this.paginate(favorites, {first, after})
  }
}
