import { User } from "../entities/User";
import { MyContext } from "src/types";
import {
  Resolver,
  Mutation,
  Arg,
  InputType,
  Field,
  Ctx,
  ObjectType,
  Query,
} from "type-graphql";
import argon2 from "argon2";
import { emit } from "process";

@InputType()
class UsernamePasswordInput {
  @Field()
  username: string;

  @Field()
  password: string;
}

@ObjectType()
class FieldError {
  @Field()
  field?: string;

  @Field()
  message: string;
}

@ObjectType()
class UserResponse {
  @Field(() => [FieldError], { nullable: true })
  errors?: FieldError[];

  @Field(() => User, { nullable: true })
  user?: User;
}

@Resolver()
export class UserResolver {
  @Query(() => User, { nullable: true })
  async me(@Ctx() { req, em }: MyContext): Promise<User | null> {
    if (!req.session.userId) {
      return null;
    }

    const user = await em.findOne(User, { id: req.session.userId });
    return user;
  }

  @Mutation(() => UserResponse)
  async register(
    @Arg("options") options: UsernamePasswordInput,
    @Ctx() { em, req }: MyContext
  ): Promise<UserResponse | null> {
    let errors: FieldError[] = [];

    const existingUser = em.findOne(User, { username: options.username });

    if (existingUser) {
      errors.push({
        field: "username",
        message: "already exists",
      });
    }

    if (options.username.length <= 3) {
      errors.push({
        field: "username",
        message: "length must be greater than 3",
      });
    }

    if (options.password.length <= 3) {
      errors.push({
        field: "password",
        message: "length must be greater than 3",
      });
    }
    if (errors.length > 0) {
      return { errors: errors };
    }

    const hashedPassword = await argon2.hash(options.password);
    const user = em.create(User, {
      username: options.username,
      password: hashedPassword,
    });

    try {
      await em.persistAndFlush(user);
    } catch (err) {
      // Print only err message for now
      console.error(
        `Unable to persist user with username = ${user.username}`,
        err.message
      );
      return null;
    }

    req.session.userId = user.id;

    return { user };
  }

  @Mutation(() => UserResponse)
  async login(
    @Arg("options") options: UsernamePasswordInput,
    @Ctx() { em, req }: MyContext
  ): Promise<UserResponse> {
    const user = await em.findOne(User, { username: options.username });

    if (!user) {
      return {
        errors: [
          {
            field: "username",
            message: `Username ${options.username} does not exist`,
          },
        ],
      };
    }

    const isValidPwd = await argon2.verify(user.password, options.password);
    if (!isValidPwd) {
      return {
        errors: [
          {
            field: "password",
            message: `Password is incorrect`,
          },
        ],
      };
    }

    req.session.userId = user.id;

    return { user };
  }
}
