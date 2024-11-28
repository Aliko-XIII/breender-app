import { Injectable } from '@nestjs/common';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import { Connection, Model } from 'mongoose';
import { ReqLog } from './schemas/req-log.schema';

@Injectable()
export class LogsDatabaseService {
  constructor(
    @InjectConnection() private readonly connection: Connection,
    @InjectModel(ReqLog.name) private readonly reqLogModel: Model<ReqLog>,
  ) {}

  async saveReqLog(logData: Partial<ReqLog>) {
    const log = new this.reqLogModel(logData);
    await log.save();
  }

  getDbHandle(): Connection {
    return this.connection;
  }
}
