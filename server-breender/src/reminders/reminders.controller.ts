import { Controller, Delete, Get, Patch, Post, UseGuards, Request, Body, Param, Query } from '@nestjs/common';
import { AuthGuard } from 'src/auth/auth.guard'; // Assuming AuthGuard is in this location
import { RemindersService } from './reminders.service';
// Assuming DTOs are in a ./dto subfolder relative to this controller/service
import { CreateReminderDto } from './dto/createReminder.dto';
import { UpdateReminderDto } from './dto/updateReminder.dto';

@UseGuards(AuthGuard) // Apply authentication guard to all routes in this controller
@Controller('reminders') // Base path for routes is '/reminders'
export class RemindersController {
    constructor(private readonly remindersService: RemindersService) {}

    /**
     * POST /reminders
     * Creates a new reminder.
     * The user ID is taken from the authenticated user's context (req.authUserId).
     */
    @Post()
    create(@Request() req, @Body() createReminderDto: CreateReminderDto) {
        // Assumes AuthGuard adds authUserId to the request object
        const authUserId = req.authUserId;
        // Ensure remindAt is a Date instance
        if (createReminderDto.remindAt && typeof createReminderDto.remindAt === 'string') {
            createReminderDto.remindAt = new Date(createReminderDto.remindAt) as any;
        }
        // Pass authUserId as the userId creating the reminder
        return this.remindersService.createReminder(createReminderDto, authUserId);
    }

    /**
     * GET /reminders
     * Unified endpoint for filtering reminders by user, animal, type, message, and time period.
     * Query params: userId, animalId, reminderType, message, remindAtFrom, remindAtTo
     */
    @Get()
    async getReminders(
        @Request() req,
        @Query('userId') userId?: string,
        @Query('animalId') animalId?: string,
        @Query('reminderType') reminderType?: string,
        @Query('message') message?: string,
        @Query('remindAtFrom') remindAtFrom?: string,
        @Query('remindAtTo') remindAtTo?: string
    ) {
        const authUserId = req.authUserId;
        return this.remindersService.getReminders({
            userId,
            animalId,
            reminderType,
            message,
            remindAtFrom,
            remindAtTo,
            authUserId
        });
    }

    /**
     * GET /reminders/:id
     * Finds a single reminder by its ID.
     * Requires auth check using the authenticated user's ID.
     */
    @Get(':id')
    findOne(@Request() req, @Param('id') id: string) {
        const authUserId = req.authUserId;
        return this.remindersService.findReminderById(id, authUserId);
    }

    /**
     * PATCH /reminders/:id
     * Updates an existing reminder by its ID.
     * Requires auth check using the authenticated user's ID.
     */
    @Patch(':id')
    update(@Request() req, @Param('id') id: string, @Body() updateReminderDto: UpdateReminderDto) { // Corrected variable name from original example
        const authUserId = req.authUserId;
        return this.remindersService.updateReminder(id, updateReminderDto, authUserId);
    }

    /**
     * DELETE /reminders/:id
     * Removes a reminder by its ID.
     * Requires auth check using the authenticated user's ID.
     */
    @Delete(':id')
    remove(@Request() req, @Param('id') id: string) {
        const authUserId = req.authUserId;
        return this.remindersService.removeReminder(id, authUserId);
    }
}