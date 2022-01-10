import { Directive, Field, ID, ObjectType } from 'type-graphql';
import { prop as Property, getModelForClass } from '@typegoose/typegoose';

@Directive(`@key(fields: "id")`)
@ObjectType()
export class User {
  @Field(() => ID)
  id: number;

  @Field()
  @Property({ required: true })
  username: String;

  @Field()
  @Property({ required: true })
  email: String;

  @Property({ required: true })
  password: String;

  @Field()
  @Property({ required: true })
  createdOn: Date;
}

export const UserModel = getModelForClass(User);
