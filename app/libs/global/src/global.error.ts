import { ApiResponseProperty } from '@nestjs/swagger';
import { ServiceException } from './global.exception';

export class ErrorCode {
  static ALL_ERRORS: ErrorCode[] = [];

  @ApiResponseProperty()
  code: number;
  @ApiResponseProperty()
  description: string;
  constructor(code: number, description: string) {
    this.code = code;
    this.description = description;
    ErrorCode.ALL_ERRORS.push(this);
  }

  asException(message?: string, data?: any): ServiceException {
    return new ServiceException(this, message, data);
  }

  // Bad Request - Client send invalid request or user input invalid data
  static BAD_REQUEST = new ErrorCode(400001, 'Bad Request');
  static ADDRESS_EXISTS = new ErrorCode(400002, 'Address already exists');
  static ACCOUNT_EXISTS = new ErrorCode(400003, 'Account already exists');
  static PASSWORD_NOT_MATCH = new ErrorCode(400004, 'Password not match');
  static WRONG_PASSWORD = new ErrorCode(400005, 'Wrong password');
  static INVALID_TOKEN = new ErrorCode(400006, 'Invalid Token');

  // Unauthorized - Client is not authorized
  static UNAUTHORIZED = new ErrorCode(401001, 'Unauthorized');
  static WRONG_EMAIL_OR_PASSWORD = new ErrorCode(
    401002,
    'Wrong email or password',
  );
  static WRONG_EMAIL_OR_TOKEN = new ErrorCode(401003, 'Wrong email or token');
  static ACCOUNT_NOT_ACTIVE = new ErrorCode(401004, 'Account is not active');

  // Forbidden - Client is authorized but doesn't have permission to perform action
  static FORBIDDEN = new ErrorCode(403001, 'Forbidden');
  static PROJECT_FORBIDDEN = new ErrorCode(
    403002,
    'User does not have permission to access project',
  );

  // Not Found - Resource is not found
  static NOT_FOUND = new ErrorCode(404001, 'Not Found');
  static ACCOUNT_NOT_FOUND = new ErrorCode(404002, 'Account Not Exists');
  static PROJECT_NOT_FOUND = new ErrorCode(404003, 'Project Not Found');
  static MONITOR_NOT_FOUND = new ErrorCode(404004, 'Monitor Not Found');
  static API_NOT_FOUND = new ErrorCode(404005, 'API Not Found');
  static APIKEY_NOT_FOUND = new ErrorCode(404006, 'Apikey Not Found');

  // Method Not Allowed - Client send request with invalid method
  static METHOD_NOT_ALLOWED = new ErrorCode(405001, 'Method Not Allowed');

  // Internal Server Error - Something went wrong
  static INTERNAL_SERVER_ERROR = new ErrorCode(500001, 'Internal Server Error');
  static UNDEFINED_ERROR = new ErrorCode(500002, 'Undefined Error');
}
