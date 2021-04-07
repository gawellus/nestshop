import {ExceptionFilter, Catch, ArgumentsHost, ImATeapotException} from '@nestjs/common';
import { Request, Response } from 'express';

@Catch(ImATeapotException)
export class ImATeapotExceptionFilter implements ExceptionFilter {
    catch(exception: ImATeapotException, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse<Response>();
        const request = ctx.getRequest<Request>();
        const status = exception.getStatus();

        response.json({
            status
        });
        
    }
}