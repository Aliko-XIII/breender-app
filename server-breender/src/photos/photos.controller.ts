import { Controller, Delete, Get, Patch, Post, UseGuards, Request, Body, Param, NotFoundException, ForbiddenException } from '@nestjs/common';
import { AuthGuard } from 'src/auth/auth.guard'; // Assuming AuthGuard is in this location
import { PhotosService } from './photos.service';
// Assuming DTOs are in a ./dto subfolder relative to this controller/service
import { CreatePhotoDto } from './dto/createPhoto.dto';
import { UpdatePhotoDto } from './dto/updatePhoto.dto';

@UseGuards(AuthGuard) // Apply authentication guard to all routes in this controller
@Controller('photos') // Base path for routes is '/photos'
export class PhotosController {
  constructor(private readonly photosService: PhotosService) {}

  /**
   * POST /photos
   * Creates a new photo.
   * The user ID is taken from the authenticated user's context (req.authUserId).
   */
  @Post()
  async create(@Request() req, @Body() createPhotoDto: CreatePhotoDto) {
    const authUserId = req.authUserId;
    try {
      return await this.photosService.createPhoto(createPhotoDto, authUserId);
    } catch (error) {
      // Handle potential errors from the service (e.g., database issues)
      throw error;
    }
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
   * GET /photos/album/:id
   * Finds all photos associated with a specific album ID.
   * Requires authorization check using the authenticated user's ID.
   */
  @Get('/album/:id')
  async findByAlbum(@Request() req, @Param('id') albumId: string) {
    const authUserId = req.authUserId;
    try {
      return await this.photosService.findAllPhotosByAnimalId(albumId, authUserId); // Assuming albumId maps to animalId in your service for now
    } catch (error) {
      // Handle potential errors (e.g., forbidden access, not found)
      if (error instanceof ForbiddenException) {
        throw error;
      }
      throw new NotFoundException(`Could not find photos for album ID: ${albumId}`);
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
   * PATCH /photos/:id
   * Updates an existing photo by its ID.
   * Requires authorization check using the authenticated user's ID.
   */
  @Patch(':id')
  async update(@Request() req, @Param('id') id: string, @Body() updatePhotoDto: UpdatePhotoDto) {
    const authUserId = req.authUserId;
    try {
      return await this.photosService.updatePhoto(id, updatePhotoDto, authUserId);
    } catch (error) {
      // Handle potential errors (e.g., not found, forbidden access, database issues)
      if (error instanceof NotFoundException || error instanceof ForbiddenException) {
        throw error;
      }
      throw error;
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