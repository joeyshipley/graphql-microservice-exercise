import { NonEmptyArray } from 'type-graphql';
import { AccountsResolver } from './accounts.resolver';
import { AuthResolver } from './auth.resolver';

const resolvers: NonEmptyArray<Function> = [
  AccountsResolver,
  AuthResolver
];
export default resolvers;