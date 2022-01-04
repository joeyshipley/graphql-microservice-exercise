import {
  Resolver,
  Mutation,
  Arg,
  Query,
} from 'type-graphql';
import { User, UserModel } from '../entities/User';
import { UserInput } from './types/user-input';

@Resolver((_of) => User)
export class UserResolver {
  @Query((_returns) => User, { nullable: false })
  async returnSingleUser(@Arg('id') id: string) {
    return await UserModel.findById({ _id: id });
  }

  @Query(() => [User])
  async returnAllUsers() {
    return await UserModel.find();
  }

  @Mutation(() => User)
  async createUser(
    @Arg('data') { username, email }: UserInput
  ): Promise<User> {
    const user = (
      await UserModel.create({
        username,
        email,
      })
    ).save();
    return user;
  }

  @Mutation(() => Boolean)
  async deleteUser(@Arg('id') id: string) {
    await UserModel.deleteOne({ id });
    return true;
  }
}
