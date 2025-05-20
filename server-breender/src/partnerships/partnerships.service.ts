import { Injectable } from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';
import { Partnership, PartnershipStatus } from '@prisma/client';
import { CreatePartnershipDto } from './dto/create-partnership.dto';

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

    async findAllForUser(userId: string): Promise<Partnership[]> {
        // Step 1: Find the Owner record for this user
        const owner = await this.databaseService.owner.findUnique({
            where: { userId },
            select: { id: true },
        });
        if (!owner) return [];
        // Step 2: Get all animal IDs for this owner
        const animalOwners = await this.databaseService.animalOwner.findMany({
            where: { ownerId: owner.id },
            select: { animalId: true },
        });
        const animalIds = animalOwners.map((ao) => ao.animalId);
        if (animalIds.length === 0) return [];
        // Step 3: Return partnerships where user is owner of either animal
        return this.databaseService.partnership.findMany({
            where: {
                OR: [
                    { requesterAnimalId: { in: animalIds } },
                    { recipientAnimalId: { in: animalIds } },
                ],
            },
        });
    }

    async findOne(id: string): Promise<Partnership | null> {
        return this.databaseService.partnership.findUnique({ where: { id } });
    }

    async remove(id: string): Promise<Partnership> {
        return this.databaseService.partnership.delete({ where: { id } });
    }

    async accept(id: string): Promise<Partnership> {
        return this.databaseService.partnership.update({
            where: { id },
            data: {
                status: PartnershipStatus.ACCEPTED,
                respondedAt: new Date(),
            },
        });
    }

    async reject(id: string): Promise<Partnership> {
        return this.databaseService.partnership.update({
            where: { id },
            data: {
                status: PartnershipStatus.REJECTED,
                respondedAt: new Date(),
            },
        });
    }

    async cancel(id: string): Promise<Partnership> {
        return this.databaseService.partnership.update({
            where: { id },
            data: {
                status: PartnershipStatus.CANCELED,
                respondedAt: new Date(),
            },
        });
    }

    async reopen(id: string): Promise<Partnership> {
        return this.databaseService.partnership.update({
            where: { id },
            data: {
                status: PartnershipStatus.PENDING,
                respondedAt: null,
            },
        });
    }
}
