import { Directive, Field, ID, ObjectType } from 'type-graphql';
import { prop as Property, getModelForClass } from '@typegoose/typegoose';

@Directive(`@key(fields: "id")`)
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
