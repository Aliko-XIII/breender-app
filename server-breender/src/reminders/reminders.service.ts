import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common'; // Added NotFoundException for potential use later
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

        // Check if the authenticated user is an owner of the animal
        const ownerAssignment = await this.databaseService.owner.findUnique({
            where: {
                userId: authUserId,
            },
            include: {
                animals: true,
            },
        });

        if (!ownerAssignment) {
            throw new ForbiddenException("You are not assigned to this animal.");
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

        const ownerAssignment = await this.databaseService.owner.findUnique({
            where: {
                userId: authUserId,
            },
            include: {
                animals: true,
            },
        });

        if (!ownerAssignment) {
            throw new ForbiddenException("You are not assigned to this animal.");
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
        return await this.databaseService.reminder.findUnique({
            where: { id },
            include: {
                animal: {
                    select: { id: true, name: true, breed: true, species: true }
                }
            }
        });
    }

    async updateReminder(
        id: string,
        updateReminderDto: UpdateReminderDto,
        authUserId: string,
    ) {
        const existingReminder = await this.databaseService.reminder.findUnique({
            where: { id },
            include: {
                animal: {
                    include: {
                        owners: { where: { owner: { userId: authUserId } } }
                    }
                }
            },
        });

        if (!existingReminder) {
            throw new NotFoundException(`Reminder with ID ${id} not found.`);
        }

        if (!existingReminder.animal?.owners || existingReminder.animal.owners.length === 0) {
            throw new ForbiddenException(`You are not authorized to update this reminder.`);
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
            console.log(`No fields to update for reminder ${id}.`);
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
        await this.databaseService.reminder.delete({ where: { id } });
    }
}