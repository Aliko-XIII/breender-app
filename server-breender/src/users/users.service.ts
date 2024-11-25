import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { DatabaseService } from 'src/database/database.service';
import { Prisma } from '@prisma/client';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(private databaseService: DatabaseService) { }

  /**
   * Generates a bcrypt hash of the provided password.
   * @param {string} password - The plain text password to hash.
   * @returns {Promise<string>} - A promise that resolves to the hashed password using bcrypt.
   */
  private async hashPassword(password: string): Promise<string> {
    const saltRounds = 10;
    const salt = await bcrypt.genSalt(saltRounds);
    return bcrypt.hash(password, salt);
  }

  /**
   * Compares a plain text password with a bcrypt-hashed password.
   * @param {string} password - The plain text password to compare.
   * @param {string} hashedPassword - The previously hashed password for comparison.
   * @returns {Promise<boolean>} - A promise that resolves to true if passwords match, otherwise false.
   */
  private async comparePasswords(
    password: string,
    hashedPassword: string,
  ): Promise<boolean> {
    return bcrypt.compare(password, hashedPassword);
  }

  /**
   * Validates user credentials.
   * @param {string} email - The email of the user attempting to authenticate.
   * @param {string} password - The plain text password to validate against the stored hash.
   * @returns {Promise<UserSafeDto>} - A promise that resolves to the updated user's safe DTO.
   * @throws {NotFoundException} - If no user is found with the given username.
   * @throws {BadRequestException} - If the provided password is invalid.
   */
  public async checkAuth(email: string, password: string): Promise<boolean> {
    const user = await this.databaseService.user.findUnique({
      where: { email: email },
    });

    if (!user) {
      throw new NotFoundException('User not found.');
    }

    const isPasswordValid = await this.comparePasswords(
      password,
      user.hashedPass,
    );
    if (!isPasswordValid) {
      throw new BadRequestException('Invalid password.');
    }

    return true;
  }

  async create(createUserDto: CreateUserDto) {
    const existingUser = await this.databaseService.user.findUnique({
      where: { email: createUserDto.email },
    });

    if (existingUser) {
      throw new Error('Email is already in use');
    }

    const hashedPass = await this.hashPassword(createUserDto.pass);

    const registeredUser: Prisma.UserCreateInput = {
      email: createUserDto.email,
      hashedPass: hashedPass,
    };

    return await this.databaseService.user.create({ data: registeredUser });
  }

  async findAll() {
    return await this.databaseService.user.findMany({});
  }

  async findOne(id: string) {
    return await this.databaseService.user.findUnique({ where: { id } });
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    const updatedUser: Prisma.UserUpdateInput = {};
    if (updateUserDto.email) {
      updatedUser.email = updateUserDto.email;
    }
    if (updateUserDto.pass) {
      const hashedPass = await this.hashPassword(updateUserDto.pass);
      updatedUser.hashedPass = hashedPass;
    }

    try {
      await this.databaseService.user.update({
        data: updatedUser,
        where: { id },
      });
    } catch (error) {
      console.error(`Failed to update user login data with ID ${id}:`, error);
      throw new Error(`Could not update user login data.`);
    }

    const updatedProfile: Prisma.UserProfileUpdateInput = {};
    if (updateUserDto.bio) {
      updatedProfile.bio = updateUserDto.bio;
    }
    if (updateUserDto.name) {
      updatedProfile.name = updateUserDto.name;
    }
    if (updateUserDto.pictureUrl) {
      updatedProfile.pictureUrl = updateUserDto.pictureUrl;
    }

    try {
      await this.databaseService.userProfile.update({
        data: updatedProfile,
        where: { userId: id },
      });
    } catch (error) {
      console.error(`Failed to update profile for user with ID ${id}:`, error);
      throw new Error(`Could not update profile for user.`);
    }
  }

  async remove(id: string) {
    return await this.databaseService.user.delete({ where: { id } });
  }
}
