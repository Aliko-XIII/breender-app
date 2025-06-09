import { Controller, UseGuards, Body, Delete, Get, Param, Post, Patch, HttpCode, Query, Req, Request } from '@nestjs/common';
import { AuthGuard } from 'src/auth/auth.guard';
import { PartnershipsService } from './partnerships.service';
import { Partnership } from '@prisma/client';
import { CreatePartnershipDto } from './dto/create-partnership.dto';

@Controller('partnerships')
@UseGuards(AuthGuard)
export class PartnershipsController {
  constructor(private readonly partnershipsService: PartnershipsService) { }

  @Post()
  async create(@Body() data: CreatePartnershipDto): Promise<Partnership> {
    return this.partnershipsService.create(data);
  }

  @Get()
  async findAll(@Request() req): Promise<Partnership[]> {
    const authUserId = req.authUserId;
    if (authUserId) {
      return this.partnershipsService.findAllForUser(authUserId);
    }
    return [];
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<Partnership | null> {
    return this.partnershipsService.findOne(id);
  }

  @Delete(':id')
  async remove(@Param('id') id: string): Promise<Partnership> {
    return this.partnershipsService.remove(id);
  }

  @Patch(':id/accept')
  @HttpCode(200)
  async accept(@Param('id') id: string): Promise<Partnership> {
    return this.partnershipsService.accept(id);
  }

  @Patch(':id/reject')
  @HttpCode(200)
  async reject(@Param('id') id: string): Promise<Partnership> {
    return this.partnershipsService.reject(id);
  }

  @Patch(':id/cancel')
  @HttpCode(200)
  async cancel(@Param('id') id: string): Promise<Partnership> {
    return this.partnershipsService.cancel(id);
  }

  @Patch(':id/reopen')
  @HttpCode(200)
  async reopen(@Param('id') id: string): Promise<Partnership> {
    return this.partnershipsService.reopen(id);
  }
}
