import { NonEmptyArray } from 'type-graphql';
import { CharactersResolver } from './characters.resolver';

const resolvers: NonEmptyArray<Function> = [
  CharactersResolver
];
export default resolvers;