import {
  registerDecorator,
  ValidationArguments, ValidationError,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
  validate as classValidatorValidate
} from 'class-validator';
import { UserModel } from '../domain/users/user.entity';
import { ValidationMessage } from '../types';
import { ApolloError } from 'apollo-server-express';

export async function validate(request: object): Promise<ValidationMessage[]> {
  const validations = await classValidatorValidate(request);
  const messages = parseClassValidatorMessages(validations);
  return messages;

  function parseClassValidatorMessages(errors: ValidationError[]): ValidationMessage[] {
    let messages: ValidationMessage[] = [];
    if(!errors || errors.length == 0) { return messages; }

    for(let validation of errors) {
      // @ts-ignore
      let properties = Object.values(validation.constraints);
      for (let propertyValue of properties) {
        messages.push({ property: validation.property, value: propertyValue as string | null });
      }
    }
    return messages;
  }
}

export class InputValidationErrors extends ApolloError {
  constructor(validations: ValidationMessage[]) {
    super('Validation Errors Found.', 'VALIDATION_ERRORS', { validations: validations });
  }
}

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
