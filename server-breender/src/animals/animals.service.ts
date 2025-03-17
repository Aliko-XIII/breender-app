import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateAnimalDto } from './dto/create-animal.dto';
import { UpdateAnimalDto } from './dto/update-animal.dto';
import { DatabaseService } from 'src/database/database.service';
import { AssignmentStatus, Prisma } from '@prisma/client';
import { CreateAnimalDocumentDto } from './dto/create-animal-doc.dto';
import { UpdateAnimalDocumentDto } from './dto/update-animal-doc.dto';

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

    // Check if the authenticated user is a vet and is assigned to the animal
    const vetAssignment = await this.databaseService.animalVet.findFirst({
      where: {
        animalId,
        vetId: authUserId,
        status: AssignmentStatus.ACTIVE, // You can adjust this status if needed
      },
    });

    if (!vetAssignment && !ownerAssignment) {
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

    // Check if the authenticated user is a vet and is assigned to the animal
    const vetAssignment = await this.databaseService.animalVet.findFirst({
      where: {
        animalId,
        vetId: authUserId,
        status: AssignmentStatus.ACTIVE, // You can adjust this status if needed
      },
    });

    if (!vetAssignment && !ownerAssignment) {
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

    const createdAnimal: Prisma.AnimalCreateInput = {
      name: createAnimalDto.name,
      sex: createAnimalDto.sex,
      breed: createAnimalDto.breed,
      species: createAnimalDto.species,
      bio: createAnimalDto.bio,
      birthDate: createAnimalDto.birthDate,
      owners: {
        connect: { id: createAnimalDto.ownerId },
      },
    };
    try {
      return await this.databaseService.animal.create({ data: createdAnimal });
    } catch (error) {
      console.error(`Failed to create animal:`, error);
      throw new Error(`Could not create animal.`);
    }
  }

  async findAllAnimals(authUserId: string) {
    return await this.databaseService.animal.findMany();
  }

  async findAnimalById(id: string, authUserId: string) {
    return await this.databaseService.animal.findUnique({ where: { id } });
  }

  async updateAnimal(id: string, updateAnimalDto: UpdateAnimalDto, authUserId: string) {

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
    if (updateAnimalDto.ownerId) {
      updatedAnimal.owners = { connect: { id: updateAnimalDto.ownerId } };
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
}
