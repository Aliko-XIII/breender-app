import { Injectable, Logger, NestMiddleware } from '@nestjs/common';
import { LogsDatabaseService } from 'src/logs-database/logs-database.service';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  constructor(private readonly logsDatabaseService: LogsDatabaseService) {}

  private logger = new Logger(`HTTP`);

  async use(req: any, res: any, next: () => void) {
    const method = req.method;
    const url = req.originalUrl;
    const requestBody = req.body;
    let responseBody: any;

    // Intercept the res.send method to capture the response body
    const originalSend = res.send;
    res.send = (body: any) => {
      responseBody = body;
      res.send = originalSend; // restore the original send method
      return res.send(body); // send the response
    };

    // Log request details
    this.logger.log(`req: ${method}; url: ${url}; body: ${JSON.stringify(requestBody)}`);

    // Continue the request-response cycle
    await next();

    // Wait for the response to finish, then log the response
    const statusCode = res.statusCode;
    this.logger.log(`res: ${statusCode}; body: ${JSON.stringify(responseBody)}`);

    // Save logs to the database
    await this.logsDatabaseService.saveReqLog({
      method,
      url,
      statusCode,
      requestBody,
      responseBody,
      timestamp: new Date(),
    });
  }
}
