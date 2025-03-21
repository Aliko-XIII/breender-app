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
  Query,  // Importing Request from @nestjs/common
} from '@nestjs/common';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { AuthGuard } from 'src/auth/auth.guard';

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
    @Query('include_profile') includeProfile: boolean = false,
  ) {
    const authUserId = req.authUserId;
    return this.usersService.getUserById(id, authUserId, includeProfile);
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
}
