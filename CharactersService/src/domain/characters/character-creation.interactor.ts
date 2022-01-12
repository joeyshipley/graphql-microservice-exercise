import { Length, IsNotEmpty, validate } from 'class-validator';
import { ArgumentValidationError, Field, InputType, ObjectType } from 'type-graphql';
import { Character, CharacterModel } from './character.entity';
import { DATE } from '../../util/date-time-util';

@ObjectType()
export class CharacterCreationResult {
  @Field()
  character?: Character;
}

@InputType()
export class CharacterCreationRequest {
  @IsNotEmpty({
    message: 'Player is missing.'
  })
  playerId: string;

  @Field()
  @Length(4, 35, {
    message: 'Character Name must be length of $constraint1 to $constraint2.',
  })
  name: String;
}

export async function call(request: CharacterCreationRequest): Promise<CharacterCreationResult> {
  const validations = await validate(request);
  if(validations.length > 0) {
    throw new ArgumentValidationError(validations);
  }

  let data = {
    playerId: request.playerId,
    name: request.name,
    createdOn: DATE.utcNow()
  };
  let character = await CharacterModel.create(data);
  character = await character.save();
  return { character: character };
}