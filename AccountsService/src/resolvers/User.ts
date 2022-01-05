import {
  Resolver,
  Mutation,
  Arg,
  Query,
} from 'type-graphql';
import { User, UserModel } from '../entities/User';
import { UserCreateRequest } from './types/user-create-request';

@Resolver((_of) => User)
export class UserResolver {
  @Query((_returns) => User, { nullable: false })
  async returnSingleUser(@Arg('id') id: string) {
    return UserModel.findById({ _id: id });
  }

  @Query(() => [User])
  async returnAllUsers() {
    return UserModel.find();
  }

  @Mutation(() => User)
  async createUser(
    @Arg('request', { validate: true }) request: UserCreateRequest
  ): Promise<User> {
    const user = (await UserModel.create(request))
      .save();
    return user;
  }

  @Mutation(() => Boolean)
  async deleteUser(@Arg('id') id: string) {
    await UserModel.deleteOne({ id });
    return true;
  }
}
