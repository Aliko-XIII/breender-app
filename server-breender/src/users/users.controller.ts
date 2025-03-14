import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Request,  // Importing Request from @nestjs/common
} from '@nestjs/common';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { AuthGuard } from 'src/auth/auth.guard';

@UseGuards(AuthGuard)
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  findAll(@Request() req) {
    const authUserId = req.authUserId;
    return this.usersService.findAll(authUserId);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @Request() req) {
    const authUserId = req.authUserId;
    return this.usersService.findOne(id, authUserId);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
    @Request() req,
  ) {
    const authUserId = req.authUserId;
    return this.usersService.update(id, updateUserDto, authUserId);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @Request() req) {
    const authUserId = req.authUserId;
    return this.usersService.remove(id, authUserId);
  }
}
