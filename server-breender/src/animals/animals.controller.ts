import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Request,
  Query,
} from '@nestjs/common';
import { AnimalsService } from './animals.service';
import { CreateAnimalDto } from './dto/create-animal.dto';
import { UpdateAnimalDto } from './dto/update-animal.dto';
import { AuthGuard } from 'src/auth/auth.guard';
import { CreateAnimalDocumentDto } from './dto/create-animal-doc.dto';
import { UpdateAnimalDocumentDto } from './dto/update-animal-doc.dto';
import { AnimalFilterDto } from './dto/animal-filter.dto';

@UseGuards(AuthGuard)
@Controller('animals')
export class AnimalsController {
  constructor(private readonly animalsService: AnimalsService) { }

  @Post(':animalId/documents')
  createAnimalDocument(
    @Request() req,
    @Param('animalId') animalId: string,
    @Body() createAnimalDocumentDto: CreateAnimalDocumentDto,
  ) {
    const authUserId = req.authUserId;
    return this.animalsService.createAnimalDocument(
      animalId,
      createAnimalDocumentDto,
      authUserId);
  }

  @Patch(':animalId/documents/:documentId')
  updateAnimalDocument(
    @Request() req,
    @Param('animalId') animalId: string,
    @Param('documentId') documentId: string,
    @Body() updateAnimalDocumentDto: UpdateAnimalDocumentDto,
  ) {
    const authUserId = req.authUserId;
    return this.animalsService.updateDocument(animalId, documentId, updateAnimalDocumentDto, authUserId);
  }

  @Post()
  create(@Request() req, @Body() createAnimalDto: CreateAnimalDto) {
    const authUserId = req.authUserId;
    return this.animalsService.createAnimal(createAnimalDto, authUserId);
  }

  @Get()
  findAll(@Request() req, @Query() filter: AnimalFilterDto) {
    const authUserId = req.authUserId;
    return this.animalsService.findAllAnimals(authUserId, filter);
  }

  @Get(':id')
  findOne(@Request() req, @Param('id') id: string) {
    const authUserId = req.authUserId;
    return this.animalsService.findAnimalById(id, authUserId);
  }

  @Patch(':id')
  update(@Request() req, @Param('id') id: string, @Body() updateAnimalDto: UpdateAnimalDto) {
    const authUserId = req.authUserId;
    return this.animalsService.updateAnimal(id, updateAnimalDto, authUserId);
  }

  @Delete(':id')
  remove(@Request() req, @Param('id') id: string) {
    const authUserId = req.authUserId;
    return this.animalsService.removeAnimal(id, authUserId);
  }
}
