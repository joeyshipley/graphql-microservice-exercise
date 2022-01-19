import { Arg, Resolver, Mutation, Query, UseMiddleware } from 'type-graphql';
import { call as registerUser, UserRegistrationRequest, UserRegistrationResult } from '../domain/users/user-registration.interactor';
import { Authorize, AuthPayloadContext } from '../server/auth.middleware';
import { ViewCurrentUserResult, call as viewCurrentUser } from '../domain/users/view-current-user.interactor';
import { AuthPayload } from '../types';

@Resolver()
export class AccountsResolver {
  @UseMiddleware(Authorize)
  @Query(() => ViewCurrentUserResult)
  async viewCurrentUser(@AuthPayloadContext() auth: AuthPayload): Promise<ViewCurrentUserResult> {
    const request = {
      userId: auth.userId
    };
    return await viewCurrentUser(request);
  }

  @Mutation(() => UserRegistrationResult)
  async registerUser(@Arg('request') request: UserRegistrationRequest): Promise<UserRegistrationResult> {
    return await registerUser(request);
  }
}
