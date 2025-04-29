import { Controller, UseGuards, Body, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { AuthGuard } from 'src/auth/auth.guard';
import { PartnershipsService } from './partnerships.service';
import { Partnership } from '@prisma/client';
import { CreatePartnershipDto } from './dto/create-partnership.dto';
import { UpdatePartnershipDto } from './dto/update-partnership.dto';

@Controller('partnerships')
@UseGuards(AuthGuard)
export class PartnershipsController {
  constructor(private readonly partnershipsService: PartnershipsService) { }

  @Post()
  async create(@Body() data: CreatePartnershipDto): Promise<Partnership> {
    return this.partnershipsService.create(data);
  }

  @Get()
  async findAll(): Promise<Partnership[]> {
    return this.partnershipsService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<Partnership | null> {
    return this.partnershipsService.findOne(id);
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() data: UpdatePartnershipDto): Promise<Partnership> {
    return this.partnershipsService.update(id, data);
  }

  @Delete(':id')
  async remove(@Param('id') id: string): Promise<Partnership> {
    return this.partnershipsService.remove(id);
  }
}
