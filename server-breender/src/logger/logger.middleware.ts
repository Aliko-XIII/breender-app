import { Injectable, Logger, NestMiddleware } from '@nestjs/common';
import { LogsDatabaseService } from 'src/logs-database/logs-database.service';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  constructor(private readonly logsDatabaseService: LogsDatabaseService) { }

  private logger = new Logger(`HTTP`);
  async use(req: any, res: any, next: () => void) {
    const method = req.method;
    const url = req.url;
    const statusCode = res.statusCode;

    this.logger.log(
      `req: ${method}; url: ${url}; res: ${statusCode}`,
    );
    await this.logsDatabaseService.saveReqLog({
      method,
      url,
      statusCode,
      timestamp: new Date(),
    });
    next();
  }
}
