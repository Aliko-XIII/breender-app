import { Injectable } from '@nestjs/common';
import { CreateAnimalDto } from './dto/create-animal.dto';
import { UpdateAnimalDto } from './dto/update-animal.dto';
import { DatabaseService } from 'src/database/database.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class AnimalsService {
  constructor(private readonly databaseService: DatabaseService) {}

  async create(createAnimalDto: CreateAnimalDto) {
    const createdAnimal: Prisma.AnimalCreateInput = {
      name: createAnimalDto.name,
      sex: createAnimalDto.sex,
      breed: createAnimalDto.breed,
      species: createAnimalDto.species,
      bio: createAnimalDto.bio,
      birthDate: createAnimalDto.birthDate,
      user: {
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

  async findAll() {
    return await this.databaseService.animal.findMany();
  }

  async findOne(id: string) {
    return await this.databaseService.animal.findUnique({ where: { id } });
  }

  async update(id: string, updateAnimalDto: UpdateAnimalDto) {
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
      updatedAnimal.user = { connect: { id: updateAnimalDto.ownerId } };
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

  async remove(id: string) {
    return await this.databaseService.animal.delete({ where: { id } });
  }
}
