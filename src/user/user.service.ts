import { Injectable, ConflictException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateUserDto } from './dto/create-user.dto';
import { UserDto } from './dto/user.dto';
import { User, UserDocument } from './schemas/user.schema';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async findAll(): Promise<UserDto[]> {
    const users = await this.userModel.find().select('id nome').exec();
    return users.map((user) => user.toObject());
  }

  async findByName(nome: string): Promise<UserDto[]> {
    const users = await this.userModel
      .find({ nome: nome })
      .select('id nome')
      .exec();
    return users.map((user) => user.toObject());
  }

  async create(createUserDto: CreateUserDto): Promise<UserDto> {
    const { nome } = createUserDto;

    // Verificar se já existe um usuário com o mesmo nome
    const existingUser = await this.userModel.findOne({ nome }).exec();
    if (existingUser) {
      throw new ConflictException('Já existe um usuário com este nome.');
    }

    // Se não houver nenhum usuário com o mesmo nome, criar e salvar o novo usuário
    const createdUser = new this.userModel(createUserDto);
    const savedUser = await createdUser.save();
    return savedUser.toObject();
  }
}
