import { IsEmail, Length, Matches, validate } from 'class-validator';
import { DATE } from '../../util/date-time-util';
import { checkPassword, encryptData } from '../../server/encryption';
import { ENV } from '../../server/environment-variables';
import jwt from 'jsonwebtoken';
import { ArgumentValidationError, Field, InputType, ObjectType } from 'type-graphql';
import { AuthPayload } from '../../types';
import { UserModel } from './user.entity';

@ObjectType()
export class LoginResult {
  @Field()
  authenticated: Boolean;

  @Field()
  token: string;
}

@InputType()
export class LoginRequest {
  @Field()
  @IsEmail({},{ message: 'Email is required and must be in an email format.' })
  email: String;

  // TODO: put this email validation string into a shared constant.
  @Field()
  @Length(8, 55, {
    message: 'Password must be length of $constraint1 to $constraint2.',
  })
  @Matches(/^(?=.{8,})(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[@#$%^&+=]).*$/, { message: 'Password must contain an Uppercase and Lowercase letter, along with a Number and a Special character.' })
  password: String;
}

export async function call(request: LoginRequest): Promise<LoginResult> {
  const validations = await validate(request);
  if(validations.length > 0) {
    throw new ArgumentValidationError(validations);
  }

  let user = await UserModel.findOne({ email: request.email });
  if(!user) {
    return { authenticated: false, token: '' }; // TODO: look at how to create a Class-Validation ValidationError or consider dropping the library.
  }

  const validPassword = checkPassword(request.password as string, user?.password as string);
  if(!validPassword) {
    return { authenticated: false, token: '' };
  }

  // TODO: will refresh need this also? If so, will need to be moved.
  const tokenPayload: AuthPayload = {
    userId: user.id
  }
  const encryptedPayload = encryptData(tokenPayload);
  const expiresIn = '24h'; // `${ ENV.TOKEN_REFRESH_MINUTES }m`;
  const token = jwt.sign(
    { payload: encryptedPayload },
    ENV.TOKEN_KEY,
    {
      expiresIn
    }
  );

  user.lastLoggedOn = DATE.utcNow();
  await user.save();

  return { authenticated: true, token };
}