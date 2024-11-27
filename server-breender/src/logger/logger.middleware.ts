import { Injectable, Logger, NestMiddleware } from '@nestjs/common';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  private logger = new Logger(`HTTP`);
  use(req: any, res: any, next: () => void) {
    this.logger.log(`req: ${req.method}; url: ${req.url}; res: ${res.statusCode}`,);
    next();
  }
}
