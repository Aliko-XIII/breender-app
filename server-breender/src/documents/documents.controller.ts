import { Controller, Delete, Get, Patch, Post, UploadedFile, UseGuards, Request, Body, Param, NotFoundException, ForbiddenException, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { AuthGuard } from 'src/auth/auth.guard';
import { DocumentsService } from './documents.service';
import { UploadDocumentDto } from './dto/createDocument.dto';
import { extname, join } from 'path';

@UseGuards(AuthGuard)
@Controller('documents')
export class DocumentsController {
  constructor(private readonly documentsService: DocumentsService) { }

  /**
   * POST /documents
   * Creates a new document.
   * The user ID is taken from the authenticated user's context (req.authUserId).
   */
  @Post()
  @UseInterceptors(FileInterceptor('file', {
    storage: diskStorage({
      destination: join(__dirname, '..', '..', 'uploads', 'documents'),
      filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
        cb(null, `${uniqueSuffix}${extname(file.originalname)}`);
      },
    }),
  }))
  async uploadDocument(
    @Request() req,
    @UploadedFile() file: Express.Multer.File,
    @Body() body: any,
  ) {
    const authUserId = req.authUserId;
    const fileUrl = `/uploads/documents/${file.filename}`;
    return this.documentsService.createDocument(
      { ...body, url: fileUrl },
      authUserId
    );
  }

  /**
   * GET /documents/user/:id
   * Finds all documents belonging to a specific user ID.
   * Requires authorization check using the authenticated user's ID.
   */
  @Get('/user/:id')
  async findByUser(@Request() req, @Param('id') userId: string) {
    const authUserId = req.authUserId;
    try {
      return await this.documentsService.findAllDocumentsByUserId(userId, authUserId);
    } catch (error) {
      if (error instanceof ForbiddenException) {
        throw error;
      }
      throw new NotFoundException(`Could not find documents for user ID: ${userId}`);
    }
  }

  /**
   * GET /documents/:id
   * Finds a single document by its ID.
   * Requires authorization check using the authenticated user's ID.
   */
  @Get(':id')
  async findOne(@Request() req, @Param('id') id: string) {
    const authUserId = req.authUserId;
    try {
      return await this.documentsService.findDocumentById(id, authUserId);
    } catch (error) {
      if (error instanceof NotFoundException || error instanceof ForbiddenException) {
        throw error;
      }
      throw new NotFoundException(`Document with ID ${id} not found`);
    }
  }

  /**
   * GET /documents/animal/:animalId
   * Fetches all documents for a specific animal.
   */
  @Get('/animal/:animalId')
  async findByAnimal(
    @Request() req,
    @Param('animalId') animalId: string
  ) {
    const authUserId = req.authUserId;
    return this.documentsService.findAllDocumentsByAnimalId(animalId, authUserId);
  }

  /**
   * DELETE /documents/:id
   * Removes a document by its ID.
   * Requires authorization check using the authenticated user's ID.
   */
  @Delete(':id')
  async remove(@Request() req, @Param('id') id: string) {
    const authUserId = req.authUserId;
    try {
      return await this.documentsService.removeDocument(id, authUserId);
    } catch (error) {
      if (error instanceof NotFoundException || error instanceof ForbiddenException) {
        throw error;
      }
      throw error;
    }
  }
}
