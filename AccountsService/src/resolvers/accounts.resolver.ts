import {
  Resolver,
  Mutation,
  Arg,
  Query
} from 'type-graphql';
import { call as registerUser, UserRegistrationRequest, UserRegistrationResult } from '../domain/users/user-registration.interactor';
import { User, UserModel } from '../domain/users/user';

@Resolver()
export class AccountsResolver {
  // TODO: PoC, remove once real functionality is created. Follow interactor pattern instead of this style.
  @Query(() => User)
  async findUser(@Arg('id') id: string) {
    return UserModel.findById({ _id: id });
  }

  // TODO: PoC, remove once real functionality is created. Follow interactor pattern instead of this style.
  @Query(() => [User])
  async allUsers() {
    return UserModel.find();
  }

  @Mutation(() => UserRegistrationResult)
  async registerUser(@Arg('request') request: UserRegistrationRequest): Promise<UserRegistrationResult> {
    return await registerUser(request);
  }
}