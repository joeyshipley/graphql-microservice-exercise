import { ObjectType, Field, ID } from 'type-graphql';
import { prop as Property, getModelForClass } from '@typegoose/typegoose';

@ObjectType()
export class Character {
  @Field(() => ID)
  id: number;

  @Field(() => ID)
  @Property({ required: true })
  playerId: string;

  @Field()
  @Property({ required: true })
  name: String;

  @Field()
  @Property({ required: true })
  createdOn: Date;
}

export const CharacterModel = getModelForClass(Character);
