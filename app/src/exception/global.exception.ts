import { BadRequestException, InternalServerErrorException } from "@nestjs/common";
import {
    ExceptionFilter,
    Catch,
    ArgumentsHost,
    HttpException,
    HttpStatus,
} from '@nestjs/common';
import { HttpAdapterHost } from '@nestjs/core';
import { MongoError, MongoServerError } from 'mongodb';

export function handleException(exception): HttpException {
    let error: HttpException;
    if (exception instanceof MongoError) {
        if (exception instanceof MongoServerError && exception.code === 11000) {
            Object.keys(exception.keyValue).forEach((key) => {
                error = new DuplicateKeyException(key);
            });
        } else {
            error = new BadRequestException(exception);
        }
    } else if (exception instanceof HttpException) {
        error = exception;
    } else {
        error = new InternalServerErrorException(exception);
    }

    return error;
}

// @Catch(MongoError)
// export class MongoExceptionFilter implements ExceptionFilter {
//     constructor(private readonly httpAdapterHost: HttpAdapterHost) { }
//     catch(exception: MongoError, host: ArgumentsHost) {
//         const { httpAdapter } = this.httpAdapterHost;
//         switch (exception.code) {
//             case 11000:
//                 const { httpAdapter } = this.httpAdapterHost;

//                 const error = new BadRequestException({
//                     error: exception,
//                 },
//                     'Bad request',);

//                 const ctx = host.switchToHttp();

//                 const httpStatus = HttpStatus.BAD_REQUEST;

//                 const responseBody = { ...error.getResponse() as object, message: error.message };

//                 httpAdapter.reply(ctx.getResponse(), responseBody, httpStatus);
//         }
//     }
// }


@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
    constructor(private readonly httpAdapterHost: HttpAdapterHost) { }

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


export class DuplicateKeyException extends BadRequestException {
    constructor(key: string) {
        super({
            error: {
                key: {
                    notUnique: `'${key}' is already in use by a different id`,
                },
            },
        },);
    }
}


