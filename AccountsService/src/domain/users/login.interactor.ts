import { IsEmail, Length, Matches } from 'class-validator';
import { DATE } from '../../util/date-time-util';
import { checkPassword, encryptData } from '../../server/encryption';
import { ENV } from '../../server/environment-variables';
import jwt from 'jsonwebtoken';
import { Field, InputType, ObjectType } from 'type-graphql';
import { AuthPayload } from '../../types';
import { UserModel } from './user.entity';
import { validate, InputValidationErrors } from '../../util/class-validator.util';

@ObjectType()
export class LoginResult {
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
    throw new InputValidationErrors(validations);
  }

  let user = await UserModel.findOne({ email: request.email });
  if(!user) {
    throw new InputValidationErrors([ { property: 'none', value: 'Unable to login with the supplied data.' } ]);
  }

  const validPassword = checkPassword(request.password as string, user?.password as string);
  if(!validPassword) {
    throw new InputValidationErrors([ { property: 'none', value: 'Unable to login with the supplied data.' } ]);
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

  return { token };
}