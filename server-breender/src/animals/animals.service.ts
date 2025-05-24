import { ForbiddenException, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { CreateAnimalDto } from './dto/create-animal.dto';
import { UpdateAnimalDto } from './dto/update-animal.dto';
import { DatabaseService } from 'src/database/database.service';
import { Prisma } from '@prisma/client';
import { CreateAnimalDocumentDto } from './dto/create-animal-doc.dto';
import { UpdateAnimalDocumentDto } from './dto/update-animal-doc.dto';
import { AnimalFilterDto } from './dto/animal-filter.dto';
import * as fs from 'fs';
import { join } from 'path';

@Injectable()
export class AnimalsService {
  constructor(private readonly databaseService: DatabaseService) { }

  /**
   * Creates a new animal document.
   * @param {string} animalId - The ID of the animal to which the document is related.
   * @param {CreateAnimalDocumentDto} createAnimalDocumentDto - The data required to create a new animal document.
   * @param {string} authUserId - The ID of the authenticated user.
   * @returns The created animal document.
   */
  async createAnimalDocument(
    animalId: string,
    createAnimalDocumentDto: CreateAnimalDocumentDto,
    authUserId: string) {
    // Validate the animal existence
    const animal = await this.databaseService.animal.findUnique({
      where: { id: animalId },
    });
    if (!animal) {
      throw new NotFoundException(`Animal with ID ${animalId} not found.`);
    }

    // Check if the authenticated user is an owner of the animal
    const ownerAssignment = await this.databaseService.owner.findUnique({
      where: {
        userId: authUserId,
      },
      include: {
        animals: true, // Include the animals owned by this owner
      },
    });

    if (!ownerAssignment) {
      throw new ForbiddenException("You are not assigned to this animal.");
    }

    // Create and store the animal document
    return this.databaseService.animalDocument.create({
      data: {
        animalId,
        documentName: createAnimalDocumentDto.documentName,
        documentUrl: createAnimalDocumentDto.documentUrl,
        uploadedAt: createAnimalDocumentDto.uploadedAt || new Date(),
      },
    });
  }

  /**
   * Updates an existing animal document.
   * @param {string} animalId - The ID of the animal.
   * @param {string} documentId - The ID of the document to update.
   * @param {UpdateAnimalDocumentDto} updateAnimalDocumentDto - The data required to update the document.
   * @param {string} authUserId - The ID of the authenticated user.
   * @returns The updated animal document.
   */
  async updateDocument(
    animalId: string,
    documentId: string,
    updateAnimalDocumentDto: UpdateAnimalDocumentDto,
    authUserId: string) {
    // Validate the animal existence
    const animal = await this.databaseService.animal.findUnique({
      where: { id: animalId },
    });
    if (!animal) {
      throw new NotFoundException(`Animal with ID ${animalId} not found.`);
    }

    const ownerAssignment = await this.databaseService.owner.findUnique({
      where: {
        userId: authUserId,
      },
      include: {
        animals: true, // Include the animals owned by this owner
      },
    });

    if (!ownerAssignment) {
      throw new ForbiddenException("You are not assigned to this animal.");
    }

    // Validate if the document exists
    const document = await this.databaseService.animalDocument.findUnique({
      where: { id: documentId },
    });
    if (!document) {
      throw new NotFoundException(`Document with ID ${documentId} not found.`);
    }

    // Check if the document is linked to the specified animal
    if (document.animalId !== animalId) {
      throw new NotFoundException(`Document with ID ${documentId} does not belong to animal with ID ${animalId}.`);
    }

    // Update the animal document
    return this.databaseService.animalDocument.update({
      where: { id: documentId },
      data: updateAnimalDocumentDto,
    });
  }

  async createAnimal(createAnimalDto: CreateAnimalDto, authUserId: string) {
    const user = await this.databaseService.user.findUnique({
      where: { id: authUserId },
    });

    if (!user) {
      throw new NotFoundException("User not found.");
    }

    // Ensure the user has the OWNER or ADMIN role
    if (user.role !== "OWNER" && user.role !== "ADMIN") {
      throw new ForbiddenException("You do not have permission to create an animal.");
    }

    let owner = await this.databaseService.owner.findUnique({
      where: { userId: authUserId },
    });

    if (!owner) {
      owner = await this.databaseService.owner.create({
        data: { userId: authUserId },
      });
    }    const createdAnimal: Prisma.AnimalCreateInput = {
      name: createAnimalDto.name,
      sex: createAnimalDto.sex,
      breed: createAnimalDto.breed,
      species: createAnimalDto.species,
      bio: createAnimalDto.bio,
      birthDate: new Date(createAnimalDto.birthDate).toISOString(),
      latitude: createAnimalDto.latitude,
      longitude: createAnimalDto.longitude,
      profilePicUrl: createAnimalDto.profilePicUrl,
      isSterilized: createAnimalDto.isSterilized,
      isAvailable: createAnimalDto.isAvailable,
      customData: createAnimalDto.customData,
      tags: createAnimalDto.tags,
      owners: {
        create: {
          owner: { connect: { id: owner.id } },
        },
      },
    };
    try {
      return await this.databaseService.animal.create({ data: createdAnimal });
    } catch (error) {
      console.error(`Failed to create animal:`, error);
      throw new Error(`Could not create animal.`);
    }
  }
  async findAllAnimals(authUserId: string, filter?: AnimalFilterDto) {
    const where: any = {};
    let locationFilter = null;
    // Debug log for filter values
    Logger.log('AnimalFilterDto:', JSON.stringify(filter));
    if (filter) {
      if (filter.name) where.name = { contains: filter.name, mode: 'insensitive' };
      if (filter.species) where.species = { contains: filter.species, mode: 'insensitive' };
      if (filter.breed) where.breed = { contains: filter.breed, mode: 'insensitive' };
      if (filter.sex) where.sex = filter.sex;
      if (filter.bio) where.bio = { contains: filter.bio, mode: 'insensitive' };
      if (typeof filter.isSterilized === 'boolean') where.isSterilized = filter.isSterilized;      if (typeof filter.isAvailable === 'boolean') where.isAvailable = filter.isAvailable;
      if (filter.tags && filter.tags.length > 0) {
        where.tags = {
          hasSome: filter.tags
        };
      }
      if (filter.birthdateFrom || filter.birthdateTo) {
        where.birthDate = {};
        if (filter.birthdateFrom) {
          where.birthDate.gte = new Date(filter.birthdateFrom);
        }
        if (filter.birthdateTo) {
          where.birthDate.lte = new Date(filter.birthdateTo);
        }
      }
      if (filter.userId) {
        // Find owner by userId
        const owner = await this.databaseService.owner.findUnique({ where: { userId: filter.userId } });
        if (owner) {
          const animalOwnerRecords = await this.databaseService.animalOwner.findMany({
            where: { ownerId: owner.id },
            select: { animalId: true },
          });
          const animalIds = animalOwnerRecords.map((ao) => ao.animalId);
          if (animalIds.length > 0) {
            where.id = { in: animalIds };
          } else {
            // No animals for this owner, return empty
            return [];
          }
        } else {
          // No such owner, return empty
          return [];
        }
      }
      if (
        typeof filter.latitude === 'number' &&
        typeof filter.longitude === 'number' &&
        typeof filter.radius === 'number'
      ) {
        locationFilter = {
          latitude: filter.latitude,
          longitude: filter.longitude,
          radius: filter.radius,
        };
      }
    }
    Logger.log('Prisma where:', JSON.stringify(where));
    let animals = await this.databaseService.animal.findMany({ where });
    if (locationFilter) {
      // Haversine formula for distance filtering
      const toRad = (value: number) => (value * Math.PI) / 180;
      animals = animals.filter((animal) => {
        if (typeof animal.latitude !== 'number' || typeof animal.longitude !== 'number') return false;
        const R = 6371; // Earth radius in km
        const dLat = toRad(animal.latitude - locationFilter.latitude);
        const dLon = toRad(animal.longitude - locationFilter.longitude);
        const lat1 = toRad(locationFilter.latitude);
        const lat2 = toRad(animal.latitude);
        const a =
          Math.sin(dLat / 2) * Math.sin(dLat / 2) +
          Math.sin(dLon / 2) * Math.sin(dLon / 2) * Math.cos(lat1) * Math.cos(lat2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        const distance = R * c;
        return distance <= locationFilter.radius;
      });
    }
    return animals;
  }

  async findAnimalsNotOwnedByUser(authUserId: string, filter?: AnimalFilterDto) {
    // Get all animal IDs owned by the user
    const owner = await this.databaseService.owner.findUnique({ where: { userId: authUserId } });
    let ownedAnimalIds: string[] = [];
    if (owner) {
      const animalOwnerRecords = await this.databaseService.animalOwner.findMany({
        where: { ownerId: owner.id },
        select: { animalId: true },
      });
      ownedAnimalIds = animalOwnerRecords.map((ao) => ao.animalId);
    }    // Build filter for animals NOT owned by user
    const where: any = { id: { notIn: ownedAnimalIds } };
    if (filter) {
      if (filter.name) where.name = { contains: filter.name, mode: 'insensitive' };
      if (filter.species) where.species = { contains: filter.species, mode: 'insensitive' };
      if (filter.breed) where.breed = { contains: filter.breed, mode: 'insensitive' };
      if (filter.sex) where.sex = filter.sex;
      if (filter.bio) where.bio = { contains: filter.bio, mode: 'insensitive' };
      if (typeof filter.isSterilized === 'boolean') where.isSterilized = filter.isSterilized;      if (typeof filter.isAvailable === 'boolean') where.isAvailable = filter.isAvailable;
      if (filter.tags && filter.tags.length > 0) {
        where.tags = {
          hasSome: filter.tags
        };
      }
      if (filter.birthdateFrom || filter.birthdateTo) {
        where.birthDate = {};
        if (filter.birthdateFrom) {
          where.birthDate.gte = new Date(filter.birthdateFrom);
        }
        if (filter.birthdateTo) {
          where.birthDate.lte = new Date(filter.birthdateTo);
        }
      }
      if (
        typeof filter.latitude === 'number' &&
        typeof filter.longitude === 'number' &&
        typeof filter.radius === 'number'
      ) {
        // We'll filter by location after fetching
      }
    }
    let animals = await this.databaseService.animal.findMany({ where });
    // Location filter (if needed)
    if (filter && typeof filter.latitude === 'number' && typeof filter.longitude === 'number' && typeof filter.radius === 'number') {
      const toRad = (value: number) => (value * Math.PI) / 180;
      animals = animals.filter((animal) => {
        if (typeof animal.latitude !== 'number' || typeof animal.longitude !== 'number') return false;
        const R = 6371;
        const dLat = toRad(animal.latitude - filter.latitude);
        const dLon = toRad(animal.longitude - filter.longitude);
        const lat1 = toRad(filter.latitude);
        const lat2 = toRad(animal.latitude);
        const a =
          Math.sin(dLat / 2) * Math.sin(dLat / 2) +
          Math.sin(dLon / 2) * Math.sin(dLon / 2) * Math.cos(lat1) * Math.cos(lat2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        const distance = R * c;
        return distance <= filter.radius;
      });
    }
    return animals;
  }

  async findAnimalById(id: string, authUserId: string) {
    const animal = await this.databaseService.animal.findUnique(
      {
        where: { id },
        include: {
          owners: {
            include: {
              owner: {
                include: {
                  user: {
                    include: { userProfile: true }
                  }
                }
              }
            },
          },
        },
      });
    if (!animal) {
      throw new NotFoundException(`Animal with ID ${id} not found.`);
    }
    return animal;
  }

  async updateAnimal(id: string, updateAnimalDto: UpdateAnimalDto, authUserId: string) {
    const animal = await this.databaseService.animal.findUnique({
      where: { id },
      include: { owners: true },
    });
    if (!animal) {
      throw new NotFoundException(`Animal with ID ${id} not found.`);
    }
    const ownerIds = animal.owners.map((owner) => owner.ownerId);
    const owner = await this.databaseService.owner.findUnique({
      where: { userId: authUserId },
    });
    if (!owner) {
      throw new NotFoundException(`Owner with user ID ${authUserId} not found.`);
    }
    if (!ownerIds.includes(owner.id) && !(await this.isAdmin(authUserId))) {
      throw new ForbiddenException("You do not have permission to update this animal.");
    }

    const updatedAnimal: Prisma.AnimalUpdateInput = {};

    if (updateAnimalDto.name) {
      updatedAnimal.name = updateAnimalDto.name;
    }
    if (updateAnimalDto.sex) {
      updatedAnimal.sex = updateAnimalDto.sex;
    }
    if (updateAnimalDto.breed) {
      updatedAnimal.breed = updateAnimalDto.breed;
    }
    if (updateAnimalDto.species) {
      updatedAnimal.species = updateAnimalDto.species;
    }
    if (updateAnimalDto.bio) {
      updatedAnimal.bio = updateAnimalDto.bio;
    }
    if (updateAnimalDto.birthDate) {
      updatedAnimal.birthDate = updateAnimalDto.birthDate;
    }
    if (updateAnimalDto.latitude !== undefined) {
      updatedAnimal.latitude = updateAnimalDto.latitude;
    }
    if (updateAnimalDto.longitude !== undefined) {
      updatedAnimal.longitude = updateAnimalDto.longitude;
    }
    if (updateAnimalDto.profilePicUrl !== undefined) {
      updatedAnimal.profilePicUrl = updateAnimalDto.profilePicUrl;
    }    if (updateAnimalDto.isSterilized !== undefined) {
      updatedAnimal.isSterilized = updateAnimalDto.isSterilized;
    }
    if (updateAnimalDto.isAvailable !== undefined) {
      updatedAnimal.isAvailable = updateAnimalDto.isAvailable;
    }
    if (updateAnimalDto.customData !== undefined) {
      updatedAnimal.customData = updateAnimalDto.customData;
    }
    if (updateAnimalDto.tags !== undefined) {
      updatedAnimal.tags = updateAnimalDto.tags;
    }

    try {
      return await this.databaseService.animal.update({
        data: updatedAnimal,
        where: { id },
      });
    } catch (error) {
      console.error(`Failed to update animal with ID ${id}:`, error);
      throw new Error(`Could not update animal.`);
    }
  }

  async updateAnimalProfilePic(animalId: string, authUserId: string, fileUrl: string) {
    const animal = await this.databaseService.animal.findUnique({
      where: { id: animalId },
      include: { owners: true },
    });
    if (!animal) {
      throw new NotFoundException(`Animal with ID ${animalId} not found.`);
    }
    // Check ownership or admin
    const owner = await this.databaseService.owner.findUnique({ where: { userId: authUserId } });
    const ownerIds = animal.owners.map((o) => o.ownerId);
    if (!owner || (!ownerIds.includes(owner.id) && !(await this.isAdmin(authUserId)))) {
      throw new ForbiddenException('You do not have permission to update this animal.');
    }
    // Remove old profile pic if exists and is different
    if (animal.profilePicUrl && animal.profilePicUrl.startsWith('/uploads/profile-pics/') && animal.profilePicUrl !== fileUrl) {
      const oldPicPath = join(process.cwd(), animal.profilePicUrl);
      fs.unlink(oldPicPath, () => {});
    }
    await this.databaseService.animal.update({
      where: { id: animalId },
      data: { profilePicUrl: fileUrl },
    });
  }

  async removeAnimal(id: string, authUserId: string) {

    const animal = await this.databaseService.animal.findUnique({
      where: { id },
      include: { owners: true },
    });

    if (!animal) {
      throw new NotFoundException(`Animal with ID ${id} not found.`);
    }
    const ownerIds = animal.owners.map((owner) => owner.id);

    if (!ownerIds.includes(authUserId) && !(await this.isAdmin(authUserId))) {
      throw new ForbiddenException("You do not have permission to update this animal.");
    }

    return await this.databaseService.animal.delete({ where: { id } });
  }

  private async isAdmin(userId: string): Promise<boolean> {
    const user = await this.databaseService.user.findUnique({
      where: { id: userId },
    });

    return user?.role === 'ADMIN';
  }

  /**
   * Get all owners' user records by animal ID
   */
  async getOwnerRecordsByAnimalId(animalId: string, authUserId: string) {
    const animal = await this.databaseService.animal.findUnique({
      where: { id: animalId },
      include: {
        owners: {
          include: {
            owner: {
              include: { user: true }
            }
          }
        }
      }
    });
    if (!animal) {
      throw new NotFoundException(`Animal with ID ${animalId} not found.`);
    }
    // Return all owners' user records
    const ownerUsers = animal.owners.map((ao) => ao.owner?.user).filter(Boolean);
    if (!ownerUsers.length) {
      throw new NotFoundException('No owner users found for this animal.');
    }
    return ownerUsers;
  }
}
