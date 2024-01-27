import { ValidatorConstraint, ValidatorConstraintInterface, ValidationArguments, registerDecorator, ValidationOptions } from 'class-validator';
import { Template } from 'src/common/enums/mail.enum';

@ValidatorConstraint({ name: 'IsValidTemplateEmail', async: false })
export class IsValidTemplateEmail implements ValidatorConstraintInterface {
  validate(template: any, args: ValidationArguments) {
    return Object.values(Template).includes(template);
  }

  defaultMessage(args: ValidationArguments) {
    return `${args.property} must be a valid template email.`;
  }
}

export function IsTemplateEmail(validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: 'IsTemplateEmail',
      target: object.constructor,
      propertyName: propertyName,
      constraints: [],
      options: validationOptions,
      validator: IsValidTemplateEmail,
    });
  };
}
