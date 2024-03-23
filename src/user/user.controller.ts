import { Controller, Get, Post, Body, Query } from '@nestjs/common';
import { UsersService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UserDto } from './dto/user.dto';
import { ConflictResponse } from 'src/interfaces/response';

@Controller('user')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  async findAll(
    @Query('nome') name?: string
  ): Promise<UserDto[] | ConflictResponse> {
    return name
      ? this.usersService.findByName(name)
      : this.usersService.findAll();
  }

  @Post()
  async create(
    @Body() createUserDto: CreateUserDto
  ): Promise<UserDto | ConflictResponse> {
    return this.usersService.create(createUserDto);
  }
}
