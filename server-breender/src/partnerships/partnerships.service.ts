import { Injectable } from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';
import { Partnership, PartnershipStatus } from '@prisma/client';
import { CreatePartnershipDto } from './dto/create-partnership.dto';
import { UpdatePartnershipDto } from './dto/update-partnership.dto';

@Injectable()
export class PartnershipsService {
    constructor(private databaseService: DatabaseService) { }

    async create(data: CreatePartnershipDto): Promise<Partnership> {
        return this.databaseService.partnership.create({
            data: {
                requesterAnimalId: data.requesterAnimalId,
                recipientAnimalId: data.recipientAnimalId,
                status: PartnershipStatus.PENDING,
                requestedAt: new Date(),
            },
        });
    }

    async findAll(): Promise<Partnership[]> {
        return this.databaseService.partnership.findMany();
    }

    async findOne(id: string): Promise<Partnership | null> {
        return this.databaseService.partnership.findUnique({ where: { id } });
    }

    async update(id: string, data: UpdatePartnershipDto): Promise<Partnership> {
        return this.databaseService.partnership.update({ where: { id }, data });
    }

    async remove(id: string): Promise<Partnership> {
        return this.databaseService.partnership.delete({ where: { id } });
    }
}
