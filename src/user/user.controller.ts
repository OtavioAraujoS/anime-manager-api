import { Controller, Get, Post, Body, Query, UseGuards } from '@nestjs/common';
import { UsersService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UserDto } from './dto/user.dto';
import { ConflictResponse } from 'src/interfaces/response';
import { JwtAuthGuard } from 'src/auth/jwt.guard';

@Controller('user')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  async findAll(
    @Query('name') name?: string
  ): Promise<UserDto[] | ConflictResponse> {
    return name
      ? this.usersService.findByName(name)
      : this.usersService.findAll();
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  async create(
    @Body() createUserDto: CreateUserDto
  ): Promise<UserDto | ConflictResponse> {
    return this.usersService.create(createUserDto);
  }
}
