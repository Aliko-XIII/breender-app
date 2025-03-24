import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { DatabaseService } from 'src/database/database.service';
import { Prisma, User, UserProfile } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { ResponseUserDto } from './dto/response-user.dto';
import { TokenPayloadDto } from 'src/auth/dto/token-payload.dto';

@Injectable()
export class UsersService {
  constructor(private databaseService: DatabaseService) { }

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

  public async checkAuth(email: string, password: string): Promise<TokenPayloadDto> {
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

    return { id: user.id, email: user.email };
  }

  async createUser(createUserDto: CreateUserDto) {
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

  async getAllUsers(authUserId: string) {
    // You can add logic to filter or log actions based on authUserId
    return await this.databaseService.user.findMany({});
  }

  private toResponseUserDto(user: User & { userProfile?: UserProfile }): ResponseUserDto {
    return {
      id: user.id,
      email: user.email,
      role: user.role,
      profile: user.userProfile
        ? {
          name: user.userProfile.name,
          bio: user.userProfile.bio,
          pictureUrl: user.userProfile.pictureUrl,
          phone: user.userProfile.phone
        }
        : undefined
    };
  }

  async getUserById(
    id: string,
    authUserId: string,
    includeProfile: boolean = false) {
    const user = await this.databaseService.user.findUnique(
      {
        where: { id },
        include: includeProfile ? { userProfile: true } : undefined
      },);
    console.log(user);
    return this.toResponseUserDto(user);
  }

  async updateUser(id: string, authUserId: string, updateUserDto: UpdateUserDto) {
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
    if (updateUserDto.phone) {
      updatedProfile.phone = updateUserDto.phone;
    }

    try {
      await this.databaseService.userProfile.upsert({
        create: {
          user: { connect: { id } },
          name: updateUserDto.name || '',
          bio: updateUserDto.bio || '',
          pictureUrl: updateUserDto.pictureUrl || null,
          phone: updateUserDto.phone || null,
        },
        update: updatedProfile,
        where: { userId: id },
      });
    } catch (error) {
      console.error(`Failed to upsert profile for user with ID ${id}:`, error);
      throw new Error(`Could not upsert profile for user.`);
    }
  }

  async removeUserById(id: string, authUserId: string) {
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
