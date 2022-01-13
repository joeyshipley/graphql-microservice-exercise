import { Length, IsNotEmpty } from 'class-validator';
import { Field, InputType, ObjectType } from 'type-graphql';
import { Character, CharacterModel } from './character.entity';
import { DATE } from '../../util/date-time-util';
import { validate, InputValidationErrors } from '../../util/class-validator.util';


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
    throw new InputValidationErrors(validations);
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
