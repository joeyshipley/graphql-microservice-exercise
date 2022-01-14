import { IsEmail, IsNotEmpty, Length, Matches } from 'class-validator';
import { Field, InputType, ObjectType } from 'type-graphql';
import { encryptPassword } from '../../server/encryption';
import { DATE } from '../../util/date-time-util';
import { User, UserModel } from './user.entity';
import {
  MatchProperty,
  Unique,
  UniqueEmailConstraint,
  UniqueUsernameConstraint,
  validate,
  InputValidationErrors
} from '../../util/class-validator.util';

@ObjectType()
export class UserRegistrationResult {
  @Field()
  user?: User;
}

@InputType()
export class UserRegistrationRequest {
  @Field()
  @Length(5, 35, {
    message: 'Username must be length of $constraint1 to $constraint2.',
  })
  @Unique(UniqueUsernameConstraint, { message: 'Username is not available.' })
  username: String;

  @Field()
  @IsEmail({},{ message: 'Email is required and must be in an email format.' })
  @Unique(UniqueEmailConstraint, { message: 'Email is not available.'})
  email: String;

  @Field()
  @Length(8, 55, {
    message: 'Password must be length of $constraint1 to $constraint2.',
  })
  @Matches(/^(?=.{8,})(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[@#$%^&+=]).*$/, { message: 'Password must contain an Uppercase and Lowercase letter, along with a Number and a Special character.' })
  password: String;

  @Field()
  @IsNotEmpty({ message: 'Password Confirmation is required.' })
  @MatchProperty('password', { message: 'Password and Password Confirmation must match.' })
  passwordConfirmation: String;
}

export async function call(request: UserRegistrationRequest): Promise<UserRegistrationResult> {
  const validations = await validate(request);
  if(validations.length > 0) {
    throw new InputValidationErrors(validations);
  }

  let data = {
    username: request.username,
    email: request.email,
    password: encryptPassword(request.password as string),
    createdOn: DATE.utcNow()
  };
  let user = await UserModel.create(data);
  user = await user.save();
  return { user: user };
}