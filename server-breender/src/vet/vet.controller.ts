import { Controller, Get, Post, Body, Patch, Param, Delete, Request, UseGuards } from '@nestjs/common';
import { VetService } from './vet.service';
import { CreateVetDto } from './dto/create-vet.dto';
import { UpdateVetDto } from './dto/update-vet.dto';
import { Vet } from '@prisma/client';
import { AuthGuard } from 'src/auth/auth.guard';

@Controller('vet')
@UseGuards(AuthGuard)
export class VetController {
  constructor(private readonly vetService: VetService) { }

  /**
   * Endpoint to get a vet by userId.
   * @param {string} userId - The userId of the vet to find.
   * @returns {Promise<Vet>} - The vet associated with the given userId.
   */
  @Get('user/:userId')
  async getVetByUserId(@Request() req, @Param('userId') userId: string): Promise<Vet> {
    const authUserId = req.authUserId;
    return this.vetService.findByUserId(userId, authUserId);
  }

  @Post()
  create(@Request() req, @Body() createVetDto: CreateVetDto) {
    const authUserId = req.authUserId;
    return this.vetService.create(createVetDto, authUserId);
  }

  @Get()
  findAll(@Request() req) {
    const authUserId = req.authUserId;
    return this.vetService.findAll(authUserId);
  }

  @Get(':id')
  findOne(@Request() req, @Param('id') id: string) {
    const authUserId = req.authUserId;
    return this.vetService.findOne(id, authUserId);
  }

  @Patch(':id')
  update(@Request() req, @Param('id') id: string, @Body() updateVetDto: UpdateVetDto) {
    const authUserId = req.authUserId;
    return this.vetService.update(id, updateVetDto, authUserId);
  }

  @Delete(':id')
  remove(@Request() req, @Param('id') id: string) {
    const authUserId = req.authUserId;
    return this.vetService.remove(id, authUserId);
  }

  /**
   * Endpoint to assign a vet to an animal.
   * @param {string} animalId - The ID of the animal.
   * @param {string} vetId - The ID of the vet.
   * @returns {Promise<AnimalVet>} - The created AnimalVet record.
   */
  @Post('assign')
  async assignVetToAnimal(
    @Request() req,
    @Body('animalId') animalId: string,
    @Body('vetId') vetId: string,
  ) {
    const authUserId = req.authUserId;
    return this.vetService.assignVetToAnimal(animalId, vetId, authUserId);
  }
}
