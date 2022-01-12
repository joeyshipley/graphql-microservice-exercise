import {
  Resolver,
  Mutation,
  Arg,
  Query, UseMiddleware
} from 'type-graphql';
import { call as createCharacter, CharacterCreationRequest, CharacterCreationResult } from '../domain/characters/character-creation.interactor';
import { Character, CharacterModel } from '../domain/characters/character.entity';
import { Authorize, AuthPayloadContext } from '../server/auth.middleware';
import { AuthPayload } from '../types';

@Resolver()
export class CharactersResolver {
  @Query(() => [Character])
  async allCharacters() {
    return CharacterModel.find();
  }

  @UseMiddleware(Authorize)
  @Mutation(() => CharacterCreationResult)
  async createCharacter(@Arg('request') request: CharacterCreationRequest, @AuthPayloadContext() auth: AuthPayload): Promise<CharacterCreationResult> {
    request.playerId = auth.userId;
    return await createCharacter(request);
  }
}