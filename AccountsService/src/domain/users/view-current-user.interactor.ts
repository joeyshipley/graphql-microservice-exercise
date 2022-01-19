import { IsNotEmpty } from 'class-validator';
import { Field, InputType, ObjectType } from 'type-graphql';
import { User, UserModel } from './user.entity';
import {
  validate,
  InputValidationErrors
} from '../../util/class-validator.util';

@ObjectType()
export class ViewCurrentUserResult {
  @Field()
  user?: User;
}

@InputType()
export class ViewCurrentUserRequest {
  @IsNotEmpty({
    message: 'Player is missing.'
  })
  userId: string;
}

export async function call(request: ViewCurrentUserRequest): Promise<ViewCurrentUserResult> {
  const validations = await validate(request);
  if(validations.length > 0) {
    throw new InputValidationErrors(validations);
  }

  let user = await UserModel.findOne({ id: request.userId });
  return { user: user || undefined };
}