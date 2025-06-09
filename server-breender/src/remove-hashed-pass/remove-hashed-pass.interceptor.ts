import {
    Injectable,
    NestInterceptor,
    ExecutionContext,
    CallHandler,
    NotFoundException
  } from '@nestjs/common';
  import { Observable } from 'rxjs';
  import { map } from 'rxjs/operators';
  
  @Injectable()
  export class RemoveHashedPassInterceptor implements NestInterceptor {
    intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
      return next.handle().pipe(
        map((data) => {
          this.removeHashedPass(data);
          return data;
        })
      );
    }
  
    private removeHashedPass(obj: any) {
      if (Array.isArray(obj)) {
        obj.forEach((item) => this.removeHashedPass(item));
      } else if (obj && typeof obj === 'object') {
        delete obj.hashedPass;
        Object.values(obj).forEach((value) => this.removeHashedPass(value));
      }
    }
  }
  