import {
  registerDecorator,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface
} from 'class-validator';
import { UserModel } from '../entities/User';

export function Unique(validator: Function | ValidatorConstraintInterface, validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      validator: validator
    });
  };
}

@ValidatorConstraint({ async: true })
export class UniqueEmailConstraint implements ValidatorConstraintInterface {
  async validate(value: any) {
    const existingEmailUsers = await UserModel.find({ email: { $regex : new RegExp(value, 'i') } });
    return existingEmailUsers.length == 0
  }
}

@ValidatorConstraint({ async: true })
export class UniqueUsernameConstraint implements ValidatorConstraintInterface {
  async validate(value: any) {
    const existingEmailUsers = await UserModel.find({ username: { $regex : new RegExp(value, 'i') } });
    return existingEmailUsers.length == 0
  }
}
