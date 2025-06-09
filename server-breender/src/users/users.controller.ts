import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Request,
  Query,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { AuthGuard } from 'src/auth/auth.guard';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname, join } from 'path';

@UseGuards(AuthGuard)
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) { }

  @Get()
  getAllUsers(@Request() req) {
    const authUserId = req.authUserId;
    return this.usersService.getAllUsers(authUserId);
  }

  @Get(':id')
  getUserById(
    @Param('id') id: string,
    @Request() req,
    @Query('include_profile') includeProfile: boolean,
  ) {
    const authUserId = req.authUserId;
    return this.usersService.getUserById(id, authUserId, includeProfile);
  }

  @Get(':id/animals')
  getUserAnimals(@Param('id') id: string) {
    return this.usersService.getAnimalsByUserId(id);
  }

  @Patch(':id')
  updateUser(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
    @Request() req,
  ) {
    const authUserId = req.authUserId;
    return this.usersService.updateUser(id, authUserId, updateUserDto);
  }

  @Delete(':id')
  removeUserById(@Param('id') id: string, @Request() req) {
    const authUserId = req.authUserId;
    return this.usersService.removeUserById(id, authUserId);
  }

  @Post(':id/profile-pic')
  @UseInterceptors(FileInterceptor('file', {
    storage: diskStorage({
      destination: join(process.cwd(), 'uploads', 'profile-pics'),
      filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
        cb(null, `${uniqueSuffix}${extname(file.originalname)}`);
      },
    }),
  }))
  async uploadProfilePic(
    @Param('id') id: string,
    @Request() req,
    @Body() body: any,
    @UploadedFile() file: Express.Multer.File,
  ) {
    const authUserId = req.authUserId;
    if (!file) {
      throw new Error('No file uploaded');
    }
    const fileUrl = `/uploads/profile-pics/${file.filename}`;
    // Update user's profile picture URL
    await this.usersService.updateUser(id, authUserId, { pictureUrl: fileUrl });
    return { url: fileUrl };
  }
}
