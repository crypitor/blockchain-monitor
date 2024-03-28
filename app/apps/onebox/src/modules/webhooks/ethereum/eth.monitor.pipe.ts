import {
  ArgumentMetadata,
  BadRequestException,
  Injectable,
  PipeTransform,
} from '@nestjs/common';
import { validate } from 'class-validator';
import { plainToInstance } from 'class-transformer';

@Injectable()
export class CreateEthMonitorValidationPipe implements PipeTransform {
  async transform(value: any, { metatype }: ArgumentMetadata) {
    if (!metatype || !this.toValidate(metatype)) {
      return value;
    }
    const object = plainToInstance(metatype, value);
    const errors = await validate(object);
    if (errors.length > 0) {
      const err = this.buildError(errors);
      throw new BadRequestException(err, 'Validation failed');
    }
    value.address = value.address.toLowerCase();
    return value;
  }

  private buildError(errors) {
    const result = {
      error: {},
    };
    if (!errors) {
      throw new Error('`errors` should not be null or undefined');
    }
    errors.forEach((el) => {
      if (!el) {
        throw new Error('`el` should not be null or undefined');
      }
      const prop = el.property;
      if (!prop) {
        throw new Error('`prop` should not be null or undefined');
      }
      result.error[prop] = {};
      const constraints = el.children;
      if (!constraints) {
        throw new Error('`constraints` should not be null or undefined');
      }
      Object.entries(constraints).forEach((constraint) => {
        if (!constraint) {
          throw new Error('`constraint` should not be null or undefined');
        }
        const [key, value] = constraint;
        if (!key) {
          throw new Error('`key` should not be null or undefined');
        }
        if (!value) {
          throw new Error('`value` should not be null or undefined');
        }
        result.error[prop][key] = `${value}`;
      });
    });
    return result;
  }

  // eslint-disable-next-line @typescript-eslint/ban-types
  private toValidate(metatype: Function): boolean {
    // eslint-disable-next-line @typescript-eslint/ban-types
    const types: Function[] = [String, Boolean, Number, Array, Object];
    return !types.includes(metatype);
  }
}
