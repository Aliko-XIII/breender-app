import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type ReqLogDocument = HydratedDocument<ReqLog>;

@Schema()
export class ReqLog {
  @Prop({ type: String, required: true })
  method: string;

  @Prop({ type: String, required: true })
  url: string;

  @Prop({ type: String, required: true })
  statusCode: number;

  @Prop({ type: Date, default: Date.now })
  timestamp: Date;

  @Prop({ type: Object, default: {} })
  requestBody: Record<string, any>;

  @Prop({ type: Object, default: {} })
  responseBody: Record<string, any>;
}

export const ReqLogSchema = SchemaFactory.createForClass(ReqLog);
