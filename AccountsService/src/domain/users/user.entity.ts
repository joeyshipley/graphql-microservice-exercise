import { Directive, Field, ID, ObjectType } from 'type-graphql';
import { prop as Property, getModelForClass } from '@typegoose/typegoose';

@Directive(`@key(fields: "id")`)
@ObjectType()
export class User {
  @Field(() => ID)
  id: number;

  @Field()
  @Property({ required: true })
  username: string;

  @Field()
  @Property({ required: true })
  email: string;

  @Property({ required: true })
  password: string;

  @Field()
  @Property({ required: true })
  createdOn: string;

  @Field()
  @Property({ required: false })
  lastLoggedOn: string;
}

export const UserModel = getModelForClass(User);
