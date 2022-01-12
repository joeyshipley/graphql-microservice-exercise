import {
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface
} from 'class-validator';
import { UserModel } from '../domain/users/user.entity';

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

export function MatchProperty(property: string, validationOptions?: ValidationOptions) {
  return (object: any, propertyName: string) => {
    registerDecorator({
      name: 'MatchProperty',
      target: object.constructor,
      propertyName,
      constraints: [property],
      options: validationOptions,
      validator: {
        validate(value: any, args: ValidationArguments) {
          const [relatedPropertyName] = args.constraints;
          const relatedValue = (args.object as any)[relatedPropertyName];
          return value === relatedValue;
        },

        defaultMessage(args: ValidationArguments) {
          const [relatedPropertyName] = args.constraints;
          return `${propertyName} must match ${relatedPropertyName} exactly`;
        },
      },
    });
  };
}