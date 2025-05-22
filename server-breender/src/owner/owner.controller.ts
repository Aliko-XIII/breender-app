import { Controller, Get, Post, Body, Patch, Param, Delete, Request, UseGuards } from '@nestjs/common';
import { OwnerService } from './owner.service';
import { CreateOwnerDto } from './dto/create-owner.dto';
import { UpdateOwnerDto } from './dto/update-owner.dto';
import { Owner } from '@prisma/client';
import { AuthGuard } from 'src/auth/auth.guard';

@Controller('owner')
@UseGuards(AuthGuard)
export class OwnerController {
  constructor(private readonly ownerService: OwnerService) { }

  /**
   * Endpoint to get an owner by userId.
   * @param {string} userId - The userId of the owner to find.
   * @returns {Promise<Owner>} - The owner associated with the given userId.
   */
  @Get('user/:userId')
  async getOwnerByUserId(@Request() req, @Param('userId') userId: string): Promise<Owner> {
    const authUserId = req.authUserId;
    return this.ownerService.findByUserId(userId, authUserId);
  }

  @Post()
  create(@Request() req, @Body() createOwnerDto: CreateOwnerDto) {
    const authUserId = req.authUserId;
    return this.ownerService.create(createOwnerDto, authUserId);
  }

  @Get()
  findAll(@Request() req) {
    const authUserId = req.authUserId;
    return this.ownerService.findAll(authUserId);
  }

  @Get(':id')
  findOne(@Request() req, @Param('id') id: string) {
    const authUserId = req.authUserId;
    return this.ownerService.findOne(id, authUserId);
  }

  @Patch(':id')
  update(@Request() req, @Param('id') id: string, @Body() updateOwnerDto: UpdateOwnerDto) {
    const authUserId = req.authUserId;
    return this.ownerService.update(id, updateOwnerDto, authUserId);
  }

  /**
   * Endpoint to switch the availability status of the owner (is_available).
   * @param {string} id - The owner id.
   * @param {{ isAvailable: boolean }} body - The new availability status.
   * @returns {Promise<Owner>} - The updated owner.
   */
  @Patch(':id/switch-availability')
  async switchAvailability(
    @Request() req,
    @Param('id') id: string,
    @Body() body: { isAvailable: boolean }
  ): Promise<Owner> {
    const authUserId = req.authUserId;
    return this.ownerService.switchAvailability(id, body.isAvailable, authUserId);
  }

  @Delete(':id')
  remove(@Request() req, @Param('id') id: string) {
    const authUserId = req.authUserId;
    return this.ownerService.remove(id, authUserId);
  }
}
