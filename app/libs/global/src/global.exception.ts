import {
  ArgumentsHost,
  BadRequestException,
  Catch,
  ExceptionFilter,
  ForbiddenException,
  HttpException,
  Logger,
  MethodNotAllowedException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { HttpAdapterHost } from '@nestjs/core';
import { ErrorCode } from './global.error';

export function handleException(exception): HttpException {
  Logger.error(exception);
  try {
    if (exception instanceof UnauthorizedException) {
      return ErrorCode.UNAUTHORIZED.asException();
    }
    if (exception instanceof BadRequestException) {
      return ErrorCode.BAD_REQUEST.asException(null, exception.getResponse());
    }
    if (exception instanceof NotFoundException) {
      return ErrorCode.API_NOT_FOUND.asException(
        exception.message,
        exception.getResponse(),
      );
    }
    if (exception instanceof MethodNotAllowedException) {
      return ErrorCode.METHOD_NOT_ALLOWED.asException(
        exception.message,
        exception.getResponse(),
      );
    }
    if (exception instanceof ForbiddenException) {
      return ErrorCode.FORBIDDEN.asException(
        exception.message,
        exception.getResponse(),
      );
    }
    if (exception instanceof ServiceException) {
      return exception;
    }
    if (exception instanceof HttpException) {
      return ErrorCode.UNDEFINED_ERROR.asException(
        exception.message || 'undefined error',
        exception.getResponse(),
      );
    }
    return ErrorCode.INTERNAL_SERVER_ERROR.asException(null, {
      error: exception.message,
    });
  } catch (e) {
    return ErrorCode.INTERNAL_SERVER_ERROR.asException(null, {
      error: exception.message,
    });
  }
}

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  constructor(private readonly httpAdapterHost: HttpAdapterHost) {}

  catch(exception: unknown, host: ArgumentsHost): void {
    // In certain situations `httpAdapter` might not be available in the
    // constructor method, thus we should resolve it here.
    const { httpAdapter } = this.httpAdapterHost;

    const error = handleException(exception);

    const ctx = host.switchToHttp();

    const httpStatus = error.getStatus();

    const responseBody = error.getResponse();

    httpAdapter.reply(ctx.getResponse(), responseBody, httpStatus);
  }
}

export class ServiceException extends HttpException {
  constructor(errorCode: ErrorCode, message?: string, data?: any) {
    super(
      {
        code: errorCode.code,
        message: message || errorCode.description,
        data: data,
      },
      Math.floor(errorCode.code / 1000),
    );
  }
}
