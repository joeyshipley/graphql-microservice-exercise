import {
  Resolver,
  Mutation,
  Arg,
  Query
} from 'type-graphql';
import { call as registerUser, UserRegistrationRequest, UserRegistrationResult } from '../domain/users/user-registration.interactor';
import { UserEntity, UserModel } from '../domain/users/user.entity';

@Resolver()
export class AccountsResolver {
  // TODO: PoC, remove once real functionality is created. Follow interactor pattern instead of this style.
  @Query(() => UserEntity)
  async findUser(@Arg('id') id: string) {
    return UserModel.findById({ _id: id });
  }

  // TODO: PoC, remove once real functionality is created. Follow interactor pattern instead of this style.
  @Query(() => [UserEntity])
  async allUsers() {
    return UserModel.find();
  }

  @Mutation(() => UserRegistrationResult)
  async registerUser(@Arg('request') request: UserRegistrationRequest): Promise<UserRegistrationResult> {
    return await registerUser(request);
  }
}