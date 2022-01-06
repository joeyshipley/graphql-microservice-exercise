import { NonEmptyArray } from 'type-graphql';
import { AccountsResolver } from './accounts.resolver';

const resolvers: NonEmptyArray<Function> = [
  AccountsResolver
];
export default resolvers;