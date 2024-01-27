import { ValidatorConstraint, ValidatorConstraintInterface, ValidationArguments, registerDecorator, ValidationOptions } from 'class-validator';
import { Report } from 'src/common/enums/report.enum';

@ValidatorConstraint({ name: 'IsValidReportCategory', async: false })
export class IsValidReportCategory implements ValidatorConstraintInterface {
  validate(category: any, args: ValidationArguments) {
    return Object.values(Report).includes(category);
  }

  defaultMessage(args: ValidationArguments) {
    return `${args.property} must be a valid report category.`;
  }
}

export function IsReportCategory(validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: 'isReportCategory',
      target: object.constructor,
      propertyName: propertyName,
      constraints: [],
      options: validationOptions,
      validator: IsValidReportCategory,
    });
  };
}
