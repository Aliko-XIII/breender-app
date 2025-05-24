import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import { CreateOwnerDto } from './dto/create-owner.dto';
import { UpdateOwnerDto } from './dto/update-owner.dto';
import { OwnerTag } from '@prisma/client';

@Injectable()
export class OwnerService {
  constructor(private databaseService: DatabaseService) { }

  async create(createOwnerDto: CreateOwnerDto, authUserId: string) {
    const { userId } = createOwnerDto;
    return this.databaseService.owner.create({
      data: {
        userId,
      },
    });
  }

  async findAll(authUserId: string) {
    return this.databaseService.owner.findMany();
  }

  async findOne(id: string, authUserId: string) {
    return this.databaseService.owner.findUnique({
      where: { id },
    });
  }

  async update(id: string, updateOwnerDto: UpdateOwnerDto, authUserId: string) {
    const owner = await this.databaseService.owner.findUnique({
      where: { id },
      include: { user: true }, // Include the associated user to check permissions
    });

    if (!owner) {
      throw new NotFoundException('Owner not found');
    }

    // Check if the authenticated user is the owner or has an admin role
    if (owner.userId !== authUserId && !(await this.isAdmin(authUserId))) {
      throw new ForbiddenException('You are not authorized to update this owner');
    }

    // Only update provided fields
    const updateData: any = { ...updateOwnerDto };
    if (updateOwnerDto.tags !== undefined) {
      updateData.tags = (updateOwnerDto.tags as string[])
        .map((tag) => {
          if (Object.values(OwnerTag).includes(tag as OwnerTag)) {
            return tag as OwnerTag;
          }
          return undefined;
        })
        .filter((t): t is OwnerTag => !!t);
    }
    if (updateOwnerDto.customData !== undefined) updateData.customData = updateOwnerDto.customData;

    return this.databaseService.owner.update({
      where: { id },
      data: updateData,
    });
  }

  async remove(id: string, authUserId: string) {
    const owner = await this.databaseService.owner.findUnique({
      where: { id },
      include: { user: true }, // Include the associated user to check permissions
    });

    if (!owner) {
      throw new NotFoundException('Owner not found');
    }

    // Check if the authenticated user is the owner or has an admin role
    if (owner.userId !== authUserId && !(await this.isAdmin(authUserId))) {
      throw new ForbiddenException('You are not authorized to update this owner');
    }
    
    return this.databaseService.owner.delete({
      where: { id },
    });
  }


  /**
   * Finds an owner by userId.
   * @param {string} userId - The userId of the owner to find.
   * @returns {Promise<Owner>} - The owner associated with the given userId.
   * @throws {NotFoundException} - If no owner is found.
   */
  async findByUserId(userId: string, authUserId: string) {
    const owner = await this.databaseService.owner.findUnique({
      where: { userId },
      include: { user: true, animals: true }, // Include related entities if needed
    });

    if (!owner) {
      throw new NotFoundException(`Owner with userId ${userId} not found.`);
    }

    return owner;
  }

  /**
   * Switches the availability status of the owner (is_available).
   * @param {string} id - The owner id.
   * @param {string} authUserId - The authenticated user id.
   * @param {boolean} isAvailable - The new availability status.
   * @returns {Promise<Owner>} - The updated owner.
   */
  async switchAvailability(id: string, isAvailable: boolean, authUserId: string) {
    const owner = await this.databaseService.owner.findUnique({
      where: { id },
      include: { user: true },
    });

    if (!owner) {
      throw new NotFoundException('Owner not found');
    }

    if (owner.userId !== authUserId && !(await this.isAdmin(authUserId))) {
      throw new ForbiddenException('You are not authorized to update this owner');
    }

    return this.databaseService.owner.update({
      where: { id },
      data: { is_available: isAvailable },
    });
  }

  private async isAdmin(userId: string): Promise<boolean> {
    const user = await this.databaseService.user.findUnique({
      where: { id: userId },
    });

    return user?.role === 'ADMIN';
  }
}