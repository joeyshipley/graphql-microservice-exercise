import { Arg, Resolver, Mutation, Query, UseMiddleware } from 'type-graphql';
import { call as registerUser, UserRegistrationRequest, UserRegistrationResult } from '../domain/users/user-registration.interactor';
import { UserEntity, UserModel } from '../domain/users/user.entity';
import { Authorize } from '../server/auth.middleware';

@Resolver()
export class AccountsResolver {
  // TODO: PoC, remove once real functionality is created. Follow interactor pattern instead of this style.
  @UseMiddleware(Authorize)
  @Query(() => [UserEntity])
  async allUsers() {
    return UserModel.find();
  }

  @Mutation(() => UserRegistrationResult)
  async registerUser(@Arg('request') request: UserRegistrationRequest): Promise<UserRegistrationResult> {
    return await registerUser(request);
  }
}
