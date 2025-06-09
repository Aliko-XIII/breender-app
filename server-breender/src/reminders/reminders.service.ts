import { ForbiddenException, Injectable, Logger, NotFoundException } from '@nestjs/common'; // Added NotFoundException for potential use later
import { DatabaseService } from 'src/database/database.service'; // Assuming same path
// Assuming DTOs exist in a ./dto subfolder relative to this service
import { CreateReminderDto } from './dto/createReminder.dto';
import { UpdateReminderDto } from './dto/updateReminder.dto';
import { Prisma } from '@prisma/client';
// import { Prisma } from '@prisma/client;

@Injectable()
export class RemindersService {
    constructor(private readonly databaseService: DatabaseService) { }

    async createReminder(
        createReminderDto: CreateReminderDto,
        authUserId: string,
    ) {
        const { animalId, reminderType, message, remindAt } = createReminderDto;
        const animal = await this.databaseService.animal.findUnique({
            where: { id: animalId },
        });
        if (!animal) {
            throw new NotFoundException(`Animal with ID ${animalId} not found.`);
        }
        const hasAccess = await this.hasAnimalAccess(authUserId, animalId);
        if (!hasAccess) {
            throw new ForbiddenException('You do not have access to this animal.');
        }
        // Create and store the animal document
        return this.databaseService.reminder.create({
            data: {
                userId: authUserId,
                animalId, reminderType, remindAt, message
            },
        });
    }

    async findAllRemindersByUserId(
        userId: string,
        authUserId: string,
    ) {
        if (userId !== authUserId) {
            throw new ForbiddenException("You can only access your own reminders.");
        }
        // No animal access check needed here, as reminders are filtered by userId
        const reminders = await this.databaseService.reminder.findMany({
            where: { userId },
            orderBy: {
                createdAt: 'desc',
            },
            include: {
                animal: {
                    select: { id: true, name: true, breed: true, species: true }
                }
            }
        });
        return reminders;
    }

    async findAllRemindersByAnimalId(
        animalId: string,
        authUserId: string,
    ) {
        const animal = await this.databaseService.animal.findUnique({
            where: { id: animalId },
        });
        if (!animal) {
            throw new NotFoundException(`Animal with ID ${animalId} not found.`);
        }
        const hasAccess = await this.hasAnimalAccess(authUserId, animalId);
        if (!hasAccess) {
            throw new ForbiddenException('You do not have access to this animal.');
        }
        const reminders = await this.databaseService.reminder.findMany({
            where: { animalId },
            orderBy: {
                createdAt: 'desc',
            },
            include: {
                animal: {
                    select: { id: true, name: true, breed: true, species: true }
                }
            }
        });
        return reminders;
    }

    async findReminderById(id: string, authUserId: any) {
        const reminder = await this.databaseService.reminder.findUnique({
            where: { id },
            include: {
                animal: {
                    select: { id: true, name: true, breed: true, species: true }
                }
            }
        });
        if (!reminder) {
            throw new NotFoundException(`Reminder with ID ${id} not found.`);
        }
        const hasAccess = await this.hasAnimalAccess(authUserId, reminder?.animalId || '');
        Logger.log(`User ${authUserId} access to reminder ${id}: ${hasAccess}`);
        if (!hasAccess) {
            throw new ForbiddenException(`You do not have access to this reminder.`);
        }
        return reminder;
    }

    async updateReminder(
        id: string,
        updateReminderDto: UpdateReminderDto,
        authUserId: string,
    ) {
        const existingReminder = await this.databaseService.reminder.findUnique({
            where: { id },
        });
        if (!existingReminder) {
            throw new NotFoundException(`Reminder with ID ${id} not found.`);
        }
        const hasAccess = await this.hasAnimalAccess(authUserId, existingReminder.animalId);
        if (!hasAccess) {
            throw new ForbiddenException('You do not have access to this reminder.');
        }
        const dataToUpdate: Prisma.ReminderUpdateInput = {};
        if (updateReminderDto.reminderType !== undefined) {
            dataToUpdate.reminderType = updateReminderDto.reminderType;
        }
        if (updateReminderDto.message !== undefined) {
            dataToUpdate.message = updateReminderDto.message;
        }
        if (updateReminderDto.remindAt !== undefined) {
            dataToUpdate.remindAt = updateReminderDto.remindAt;
        }
        if (Object.keys(dataToUpdate).length === 0) {
            Logger.log(`No fields to update for reminder ${id}.`);
            return existingReminder;
        }
        return this.databaseService.reminder.update({
            where: { id: id },
            data: dataToUpdate,
            include: {
                animal: {
                    select: { id: true, name: true }
                }
            }
        });
    }

    async removeReminder(
        id: string,
        authUserId: any
    ) {
        const reminder = await this.databaseService.reminder.findUnique({ where: { id } });
        if (!reminder) throw new NotFoundException(`Reminder with ID ${id} not found`);
        const hasAccess = await this.hasAnimalAccess(authUserId, reminder.animalId);
        if (!hasAccess) {
            throw new ForbiddenException('You do not have access to this reminder.');
        }
        await this.databaseService.reminder.delete({ where: { id } });
    }

    /**
     * Unified reminders query with filters.
     */
    async getReminders(filters: {
        userId?: string;
        animalId?: string;
        reminderType?: string;
        message?: string;
        remindAtFrom?: string;
        remindAtTo?: string;
        authUserId: string;
    }) {
        const { userId, animalId, reminderType, message, remindAtFrom, remindAtTo, authUserId } = filters;
        if (userId && userId !== authUserId) {
            throw new ForbiddenException('You can only access your own reminders.');
        }
        const where: any = {};
        if (userId) where.userId = userId;
        if (animalId) where.animalId = animalId;
        if (reminderType) where.reminderType = reminderType;
        if (message) where.message = { contains: message, mode: 'insensitive' };
        if (remindAtFrom || remindAtTo) {
            where.remindAt = {};
            if (remindAtFrom) where.remindAt.gte = new Date(remindAtFrom);
            if (remindAtTo) where.remindAt.lte = new Date(remindAtTo);
        }
        if (animalId) {
            const animal = await this.databaseService.animal.findUnique({ where: { id: animalId } });
            if (!animal) throw new NotFoundException(`Animal with ID ${animalId} not found.`);
            const hasAccess = await this.hasAnimalAccess(authUserId, animalId);
            if (!hasAccess) throw new ForbiddenException('You do not have access to this animal.');
        }
        return this.databaseService.reminder.findMany({
            where,
            orderBy: { createdAt: 'desc' },
            include: {
                animal: { select: { id: true, name: true, breed: true, species: true } }
            }
        });
    }

    /**
     * Checks if the user is the owner of the animal or has access via partnership.
     * @param userId - The user's id (not owner id)
     * @param animalId - The animal's id
     * @returns true if user is owner or has partnership access, false otherwise
     */
    async hasAnimalAccess(userId: string, animalId: string): Promise<boolean> {
        // Find the owner record for the user
        const owner = await this.databaseService.owner.findUnique({
            where: { userId },
            include: { animals: true },
        });
        if (!owner) return false;

        // Check if user is direct owner of the animal
        const isOwner = owner.animals.some((ao: any) => ao.animalId === animalId);
        if (isOwner) return true;

        // Get all animalIds owned by this owner
        const userAnimalIds = owner.animals.map((ao: any) => ao.animalId);
        if (userAnimalIds.length === 0) return false;

        // Check for partnership where user's animal is requester or recipient with the target animal
        const partnership = await this.databaseService.partnership.findFirst({
            where: {
                OR: [
                    { requesterAnimalId: { in: userAnimalIds }, recipientAnimalId: animalId },
                    { recipientAnimalId: { in: userAnimalIds }, requesterAnimalId: animalId },
                ],
                status: 'ACCEPTED',
            },
        });
        return !!partnership;
    }
}