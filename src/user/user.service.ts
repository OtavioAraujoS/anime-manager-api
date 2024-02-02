import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateUserDto } from './dto/create-user.dto';
import { UserDto } from './dto/user.dto';
import { User, UserDocument } from './schemas/user.schema';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async create(createUserDto: CreateUserDto): Promise<UserDto> {
    const createdUser = new this.userModel(createUserDto);
    const savedUser = await createdUser.save();
    return savedUser.toObject();
  }

  async findAll(): Promise<UserDto[]> {
    const users = await this.userModel.find().select('id nome').exec();
    return users.map((user) => user.toObject());
  }
}
