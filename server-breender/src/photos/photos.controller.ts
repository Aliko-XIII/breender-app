import { Controller, Delete, Get, Patch, Post, UploadedFile, UseGuards, Request, Body, Param, NotFoundException, ForbiddenException, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { AuthGuard } from 'src/auth/auth.guard';
import { PhotosService } from './photos.service';
import { UploadPhotoDto } from './dto/createPhoto.dto';
import { extname } from 'path';

@UseGuards(AuthGuard) // Apply authentication guard to all routes in this controller
@Controller('photos') // Base path for routes is '/photos'
export class PhotosController {
  constructor(private readonly photosService: PhotosService) { }

  /**
   * POST /photos
   * Creates a new photo.
   * The user ID is taken from the authenticated user's context (req.authUserId).
   */
  @Post()
  @UseInterceptors(FileInterceptor('file', {
    storage: diskStorage({
      destination: './uploads/photos',
      filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
        cb(null, `${uniqueSuffix}${extname(file.originalname)}`);
      },
    }),
  }))
  async uploadPhoto(
    @Request() req,
    @UploadedFile() file: Express.Multer.File,
    @Body() createPhotoDto: UploadPhotoDto,
  ) {
    const authUserId = req.authUserId;
    const fileUrl = `/uploads/photos/${file.filename}`;
    return this.photosService.createPhoto(
      { ...createPhotoDto, url: fileUrl },
      authUserId
    );
  }

  /**
   * GET /photos/user/:id
   * Finds all photos belonging to a specific user ID.
   * Requires authorization check using the authenticated user's ID.
   */
  @Get('/user/:id')
  async findByUser(@Request() req, @Param('id') userId: string) {
    const authUserId = req.authUserId;
    try {
      return await this.photosService.findAllPhotosByUserId(userId, authUserId);
    } catch (error) {
      // Handle potential errors (e.g., forbidden access)
      if (error instanceof ForbiddenException) {
        throw error;
      }
      throw new NotFoundException(`Could not find photos for user ID: ${userId}`);
    }
  }

  /**
   * GET /photos/:id
   * Finds a single photo by its ID.
   * Requires authorization check using the authenticated user's ID.
   */
  @Get(':id')
  async findOne(@Request() req, @Param('id') id: string) {
    const authUserId = req.authUserId;
    try {
      return await this.photosService.findPhotoById(id, authUserId);
    } catch (error) {
      // Handle potential errors (e.g., not found, forbidden access)
      if (error instanceof NotFoundException || error instanceof ForbiddenException) {
        throw error;
      }
      throw new NotFoundException(`Photo with ID ${id} not found`);
    }
  }

  /**
   * DELETE /photos/:id
   * Removes a photo by its ID.
   * Requires authorization check using the authenticated user's ID.
   */
  @Delete(':id')
  async remove(@Request() req, @Param('id') id: string) {
    const authUserId = req.authUserId;
    try {
      return await this.photosService.removePhoto(id, authUserId);
    } catch (error) {
      // Handle potential errors (e.g., not found, forbidden access, database/storage issues)
      if (error instanceof NotFoundException || error instanceof ForbiddenException) {
        throw error;
      }
      throw error;
    }
  }
}