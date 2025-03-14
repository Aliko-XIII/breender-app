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
} from '@nestjs/common';
import { AnimalsService } from './animals.service';
import { CreateAnimalDto } from './dto/create-animal.dto';
import { UpdateAnimalDto } from './dto/update-animal.dto';
import { AuthGuard } from 'src/auth/auth.guard';
import { CreateAnimalDocumentDto } from './dto/create-animal-doc.dto';
import { UpdateAnimalDocumentDto } from './dto/update-animal-doc';

@UseGuards(AuthGuard)
@Controller('animals')
export class AnimalsController {
  constructor(private readonly animalsService: AnimalsService) {}

  /**
   * Creates a new animal document.
   * @param {CreateAnimalDocumentDto} createAnimalDocumentDto - The data required to create a new animal document.
   * @param {string} authUserId - The ID of the authenticated user.
   * @returns The created animal document.
   */
  @Post(':animalId/documents') // The endpoint is now '/animals/:animalId/documents'
  createAnimalDocument(
    @Request() req,
    @Param('animalId') animalId: string, 
    @Body() createAnimalDocumentDto: CreateAnimalDocumentDto,
  ) {
    const authUserId = req.authUserId;  // Extract authUserId from the request
    return this.animalsService.createDoc(animalId, createAnimalDocumentDto, authUserId);
  }

   /**
   * Updates an existing animal document.
   * @param {string} animalId - The ID of the animal.
   * @param {string} documentId - The ID of the document to update.
   * @param {UpdateAnimalDocumentDto} updateAnimalDocumentDto - The data required to update the animal document.
   * @param {string} authUserId - The ID of the authenticated user.
   * @returns The updated animal document.
   */
   @Patch(':animalId/documents/:documentId')
   updateAnimalDocument(
     @Request() req,
     @Param('animalId') animalId: string,
     @Param('documentId') documentId: string,
     @Body() updateAnimalDocumentDto: UpdateAnimalDocumentDto,
   ) {
     const authUserId = req.authUserId;  // Extract authUserId from the request
     return this.animalsService.updateDoc(animalId, documentId, updateAnimalDocumentDto, authUserId);
   }

  @Post()
  create(@Request() req, @Body() createAnimalDto: CreateAnimalDto) {
    const authUserId = req.authUserId;  // Extract authUserId from the request
    return this.animalsService.create(createAnimalDto, authUserId);
  }

  @Get()
  findAll(@Request() req) {
    const authUserId = req.authUserId;  // Extract authUserId from the request
    return this.animalsService.findAll(authUserId);
  }

  @Get(':id')
  findOne(@Request() req, @Param('id') id: string) {
    const authUserId = req.authUserId;  // Extract authUserId from the request
    return this.animalsService.findOne(id, authUserId);
  }

  @Patch(':id')
  update(@Request() req, @Param('id') id: string, @Body() updateAnimalDto: UpdateAnimalDto) {
    const authUserId = req.authUserId;  // Extract authUserId from the request
    return this.animalsService.update(id, updateAnimalDto, authUserId);
  }

  @Delete(':id')
  remove(@Request() req, @Param('id') id: string) {
    const authUserId = req.authUserId;  // Extract authUserId from the request
    return this.animalsService.remove(id, authUserId);
  }
}
