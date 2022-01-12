import { Arg, Resolver, Mutation } from 'type-graphql';
import { call as login, LoginRequest, LoginResult } from '../domain/users/login.interactor';

@Resolver()
export class AuthResolver {
  @Mutation(() => LoginResult)
  async login(@Arg('request') request: LoginRequest): Promise<LoginResult> {
    return await login(request);
  }

  // TODO: implement token refresh mutation
}