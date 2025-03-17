import { BadRequestException, ForbiddenException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { CreateVetDto } from './dto/create-vet.dto';
import { UpdateVetDto } from './dto/update-vet.dto';
import { DatabaseService } from 'src/database/database.service';

@Injectable()
export class VetService {
  constructor(private readonly databaseService: DatabaseService) { }

  /**
   * Finds a vet by userId.
   * @param {string} userId - The userId of the vet to find.
   * @param {string} authUserId - The ID of the authorized user making the request.
   * @returns {Promise<Vet>} - The vet associated with the given userId.
   * @throws {NotFoundException} - If no vet is found.
   */
  async findByUserId(userId: string, authUserId: string) {
    const vet = await this.databaseService.vet.findUnique({
      where: { userId },
      include: { user: true, animals: true }, // Include related entities if needed
    });

    if (!vet) {
      throw new NotFoundException(`Vet with userId ${userId} not found.`);
    }

    return vet;
  }

  /**
   * Creates a new vet.
   * @param {CreateVetDto} createVetDto - The data for creating the vet.
   * @param {string} authUserId - The ID of the authorized user making the request.
   * @returns {Promise<Vet>} - The created vet.
   */
  async create(createVetDto: CreateVetDto, authUserId: string) {
    // You can add any additional logic to check permissions for creating a vet
    return this.databaseService.vet.create({
      data: {
        ...createVetDto,
      },
    });
  }

  /**
   * Retrieves all vets.
   * @param {string} authUserId - The ID of the authorized user making the request.
   * @returns {Promise<Vet[]>} - A list of all vets.
   */
  async findAll(authUserId: string) {
    // You can add any logic to check permissions for retrieving all vets
    return this.databaseService.vet.findMany();
  }

  /**
   * Retrieves a specific vet by ID.
   * @param {string} id - The ID of the vet to retrieve.
   * @param {string} authUserId - The ID of the authorized user making the request.
   * @returns {Promise<Vet>} - The vet with the given ID.
   * @throws {NotFoundException} - If no vet is found with the given ID.
   */
  async findOne(id: string, authUserId: string) {
    const vet = await this.databaseService.vet.findUnique({
      where: { id },
    });

    if (!vet) {
      throw new NotFoundException(`Vet with ID ${id} not found.`);
    }

    return vet;
  }

  /**
   * Updates a specific vet by ID.
   * @param {string} id - The ID of the vet to update.
   * @param {UpdateVetDto} updateVetDto - The data for updating the vet.
   * @param {string} authUserId - The ID of the authorized user making the request.
   * @returns {Promise<Vet>} - The updated vet.
   */
  async update(id: string, updateVetDto: UpdateVetDto, authUserId: string) {
    const vet = await this.databaseService.vet.findUnique({
      where: { id },
      include: { user: true }, // Include the associated user to check permissions
    });

    if (!vet) {
      throw new NotFoundException('Owner not found');
    }

    // Check if the authenticated user is the owner or has an admin role
    if (vet.userId !== authUserId && !(await this.isAdmin(authUserId))) {
      throw new ForbiddenException('You are not authorized to update this owner');
    }

    return this.databaseService.vet.update({
      where: { id },
      data: updateVetDto,
    });
  }

  /**
   * Deletes a specific vet by ID.
   * @param {string} id - The ID of the vet to delete.
   * @param {string} authUserId - The ID of the authorized user making the request.
   * @returns {Promise<Vet>} - The deleted vet.
   */
  async remove(id: string, authUserId: string) {
    const vet = await this.databaseService.vet.findUnique({
      where: { id },
      include: { user: true }, // Include the associated user to check permissions
    });

    if (!vet) {
      throw new NotFoundException('Owner not found');
    }

    // Check if the authenticated user is the owner or has an admin role
    if (vet.userId !== authUserId && !(await this.isAdmin(authUserId))) {
      throw new ForbiddenException('You are not authorized to update this owner');
    }
    return this.databaseService.vet.delete({
      where: { id },
    });
  }

  /**
   * Assigns a vet to an animal, granting view/edit permissions.
   * @param {string} animalId - The ID of the animal.
   * @param {string} vetId - The ID of the vet.
   * @param {string} authUserId - The ID of the authorized user making the request.
   * @returns {Promise<AnimalVet>} - The created AnimalVet record.
   * @throws {NotFoundException} - If the animal or vet does not exist.
   * @throws {BadRequestException} - If the vet is already assigned to the animal.
   */
  async assignVetToAnimal(animalId: string, vetId: string, authUserId: string) {
    const animal = await this.databaseService.animal.findUnique({
      where: { id: animalId },
      include: {
        owners: true
      }
    });
    if (!animal) {
      throw new NotFoundException(`Animal with ID ${animalId} not found.`);
    }

    // Check if the authenticated user is the owner or admin
    const ownerIds = animal.owners.map((owner) => owner.id);
    const user = await this.databaseService.user.findUnique({
      where: { id: authUserId },
    });
    if (!user || (!ownerIds.includes(user.id) && user.role !== 'ADMIN')) {
      throw new UnauthorizedException(
        `User with ID ${authUserId} is not authorized to assign a vet to this animal.`,
      );
    }

    // Validate vet existence
    const vet = await this.databaseService.vet.findUnique({
      where: { id: vetId },
    });
    if (!vet) {
      throw new NotFoundException(`Vet with ID ${vetId} not found.`);
    }

    // Check if the vet is already assigned
    const existingAssignment = await this.databaseService.animalVet.findFirst({
      where: { animalId, vetId },
    });
    if (existingAssignment) {
      throw new BadRequestException(
        `Vet with ID ${vetId} is already assigned to animal with ID ${animalId}.`,
      );
    }

    // Assign the vet to the animal
    return this.databaseService.animalVet.create({
      data: {
        animalId,
        vetId,
      },
    });
  }

  private async isAdmin(userId: string): Promise<boolean> {
    const user = await this.databaseService.user.findUnique({
      where: { id: userId },
    });

    return user?.role === 'ADMIN';
  }
}
