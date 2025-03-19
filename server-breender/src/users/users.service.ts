import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { DatabaseService } from 'src/database/database.service';
import { Prisma } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { ResponseUserDto } from './dto/response-user.dto';

@Injectable()
export class UsersService {
  constructor(private databaseService: DatabaseService) {}

  private async hashPassword(password: string): Promise<string> {
    const saltRounds = 10;
    const salt = await bcrypt.genSalt(saltRounds);
    return bcrypt.hash(password, salt);
  }

  private async comparePasswords(
    password: string,
    hashedPassword: string,
  ): Promise<boolean> {
    return bcrypt.compare(password, hashedPassword);
  }

  public async checkAuth(email: string, password: string): Promise<ResponseUserDto> {
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

    const responseUserDto: ResponseUserDto = {
      id: user.id
    };

    return responseUserDto;
  }

  async create(createUserDto: CreateUserDto) {
    const existingUser = await this.databaseService.user.findUnique({
      where: { email: createUserDto.email },
    });

    if (existingUser) {
      throw new BadRequestException('Email is already in use');
    }

    const hashedPass = await this.hashPassword(createUserDto.pass);

    const registeredUser: Prisma.UserCreateInput = {
      email: createUserDto.email,
      hashedPass: hashedPass,
      role: createUserDto.role ? createUserDto.role : 'OWNER',
    };

    const user = await this.databaseService.user.create({ data: registeredUser });

    if (createUserDto.role === 'OWNER') {
      await this.databaseService.owner.create({
        data: {
          userId: user.id,
        },
      });
    } else if (createUserDto.role === 'VET') {
      await this.databaseService.vet.create({
        data: {
          userId: user.id,
        },
      });
    }

    return user;
  }

  async findAll(authUserId: string) {
    // You can add logic to filter or log actions based on authUserId
    return await this.databaseService.user.findMany({});
  }

  async findOne(id: string, authUserId: string) {
    // Optionally check if the user has permission based on authUserId
    return await this.databaseService.user.findUnique({ where: { id } });
  }

  async update(id: string, updateUserDto: UpdateUserDto, authUserId: string) {
    const user = await this.databaseService.user.findUnique({
      where: { id },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    // Check if the authorized user is the one being updated, or if the user is an admin
    if (user.id !== authUserId && !(await this.isAdmin(authUserId))) {
      throw new ForbiddenException('You are not authorized to update this user');
    }

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

  async remove(id: string, authUserId: string) {
    const user = await this.databaseService.user.findUnique({
      where: { id },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    // Check if the authorized user is the one being updated, or if the user is an admin
    if (user.id !== authUserId && !(await this.isAdmin(authUserId))) {
      throw new ForbiddenException('You are not authorized to update this user');
    }
    return await this.databaseService.user.delete({ where: { id } });
  }

  private async isAdmin(userId: string): Promise<boolean> {
    const user = await this.databaseService.user.findUnique({
      where: { id: userId },
    });

    return user?.role === 'ADMIN';
  }
}
