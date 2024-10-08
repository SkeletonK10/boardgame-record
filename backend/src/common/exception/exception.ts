import { HttpException } from '@nestjs/common';
import { ExceptionValues } from './exception.list';

export type ExceptionType = keyof typeof ExceptionValues;

export class ServiceException extends HttpException {
  constructor(exception: ExceptionType) {
    const { statusCode, errorCode, message } = ExceptionValues[exception];
    super(`${message} (${errorCode})`, statusCode);
  }
}
