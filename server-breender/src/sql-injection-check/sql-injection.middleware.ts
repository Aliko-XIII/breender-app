import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class SqlInjectionMiddleware implements NestMiddleware {
  private readonly sqlInjectionPatterns: RegExp[] = [
    // Detects patterns like "OR 1=1" or "AND 1=1", commonly used in Boolean-based SQL injections
    /\b(or|and)\b.*\b(1=1|0=0)\b/i,


    // Detects common SQL keywords like 'SELECT', 'INSERT', 'UPDATE', 'DELETE', 'DROP', and 'UNION'
    // These keywords are usually used in SQL injection attacks to perform unauthorized actions
    /\b(select|insert|update|delete|drop|union)\b/i,
  ];


  private isPotentialSqlInjection(input: string): boolean {
    return this.sqlInjectionPatterns.some((pattern) => pattern.test(input));
  }


  use(req: Request, res: Response, next: NextFunction) {
    // Check URL parameters
    for (const key in req.params) {
      if (this.isPotentialSqlInjection(req.params[key])) {
        return res.status(400).json({ message: `SQL injection attempt detected in params` });
      }
    }


    // Check query parameters
    for (const key in req.query) {
      if (this.isPotentialSqlInjection(req.query[key] as string)) {
        return res.status(400).json({ message: `SQL injection attempt detected in query params` });
      }
    }


    // Check JSON body parameters
    if (req.is('application/json') && req.body) {
      for (const key in req.body) {
        if (this.isPotentialSqlInjection(req.body[key])) {
          return res.status(400).json({ message: `SQL injection attempt detected in body params` });
        }
      }
    }


    next();
  }
}
