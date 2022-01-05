import { InputType, Field } from 'type-graphql';
import { Length, IsEmail } from 'class-validator';
import { Unique, UniqueEmailConstraint, UniqueUsernameConstraint } from '../../util/class-validator.util';
import { User } from '../../entities/User';

@InputType()
export class UserCreateRequest implements Partial<User> {
  @Field()
  @Length(5, 35, {
    message: 'Username must be length of $constraint1 to $constraint2',
  })
  @Unique(UniqueUsernameConstraint, { message: 'Username is not available.' })
  username: String;

  @Field()
  @IsEmail({},{ message: 'Email is required and must be in an email format.' })
  @Unique(UniqueEmailConstraint, { message: 'Email is not available.'})
  email: String;
}
