import { Injectable } from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';

@Injectable()
export class PartnershipsService {
    constructor(private databaseService: DatabaseService) { }

}
