import { Injectable } from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';
import { Prisma } from '@prisma/client';
import { CreateRecordDto } from './dto/createRecord.dto';
import { UpdateRecordDto } from './dto/updateRecord.dto';

@Injectable()
export class RecordsService {
    constructor(private readonly databaseService: DatabaseService) { }

    async createRecord(
        createRecordDto: CreateRecordDto,
        userId: string,
    ) {

    }

    async findAllRecordsByUserId(
        userId: string,
        authUserId: string,
    ) {

    }

    async findAllRecordsByAnimalId(
        animalId: string,
        authUserId: string,
    ) {

    }

    async findRecordById(id: string, authUserId: any) {
        throw new Error('Method not implemented.');
    }

    async updateRecord(
        id: string,
        UpdateRecordDto: UpdateRecordDto,
        authUserId: any) {
        throw new Error('Method not implemented.');
    }

    async removeRecord(
        id: string,
        authUserId: any) {
        throw new Error('Method not implemented.');
    }

}
