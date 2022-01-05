import { NonEmptyArray } from 'type-graphql';
import { UserResolver } from './User';

const resolvers: NonEmptyArray<Function> = [
  UserResolver
];
export default resolvers;