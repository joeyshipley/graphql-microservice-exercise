import {
  Resolver,
  Mutation,
  Arg,
  Query
} from 'type-graphql';
import { call as createCharacter, CharacterCreationRequest, CharacterCreationResult } from '../domain/characters/character-creation.interactor';
import { Character, CharacterModel } from '../domain/characters/character.entity';

@Resolver()
export class CharactersResolver {
  // TODO: PoC, remove once real functionality is created. Follow interactor pattern instead of this style.
  @Query(() => [Character])
  async allCharacters() {
    return CharacterModel.find();
  }

  @Mutation(() => CharacterCreationResult)
  async createCharacter(@Arg('request') request: CharacterCreationRequest): Promise<CharacterCreationResult> {
    return await createCharacter(request);
  }
}