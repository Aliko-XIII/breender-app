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
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { AnimalsService } from './animals.service';
import { CreateAnimalDto } from './dto/create-animal.dto';
import { UpdateAnimalDto } from './dto/update-animal.dto';
import { AuthGuard } from 'src/auth/auth.guard';
import { CreateAnimalDocumentDto } from './dto/create-animal-doc.dto';
import { UpdateAnimalDocumentDto } from './dto/update-animal-doc.dto';
import { AnimalFilterDto } from './dto/animal-filter.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname, join } from 'path';

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
  async findAll(@Request() req, @Query() filter: AnimalFilterDto) {
    const authUserId = req.authUserId;
    const animals = await this.animalsService.findAllAnimals(authUserId, filter);
    // Map profilePicUrl to pictureUrl for each animal
    return animals.map((animal: any) => ({
      ...animal,
      pictureUrl: animal.profilePicUrl ?? null,
    }));
  }

  @Get('for-map')
  getAnimalsForMap(@Request() req, @Query() filter: AnimalFilterDto) {
    const authUserId = req.authUserId;
    return this.animalsService.findAnimalsNotOwnedByUser(authUserId, filter);
  }

  @Get(':id')
  async findOne(@Request() req, @Param('id') id: string) {
    const authUserId = req.authUserId;
    const animal = await this.animalsService.findAnimalById(id, authUserId);
    // Map profilePicUrl to pictureUrl for frontend compatibility
    return {
      ...animal,
      pictureUrl: animal.profilePicUrl ?? null,
    };
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

  @Post(':id/profile-pic')
  @UseInterceptors(FileInterceptor('file', {
    storage: diskStorage({
      destination: join(process.cwd(), 'uploads', 'profile-pics'),
      filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
        cb(null, `${uniqueSuffix}${extname(file.originalname)}`);
      },
    }),
  }))
  async uploadAnimalProfilePic(
    @Param('id') id: string,
    @Request() req,
    @UploadedFile() file: Express.Multer.File,
  ) {
    const authUserId = req.authUserId;
    if (!file) {
      throw new Error('No file uploaded');
    }
    const fileUrl = `/uploads/profile-pics/${file.filename}`;
    await this.animalsService.updateAnimalProfilePic(id, authUserId, fileUrl);
    return { url: fileUrl };
  }
}
