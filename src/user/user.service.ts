import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateUserDto } from './dto/create-user.dto';
import { UserDto } from './dto/user.dto';
import { User, UserDocument } from './schemas/user.schema';
import { LogLevel, logMessage } from 'src/utils/logMessage';
import { ConflictResponse } from 'src/interfaces/response';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async findAll(): Promise<UserDto[]> {
    try {
      const users = await this.userModel.find().select('id nome').exec();

      logMessage('Usuários encontrados com exito', LogLevel.INFO);

      return users.map((user) => ({ id: user.id, nome: user.nome }));
    } catch (err) {
      logMessage(err.message, LogLevel.ERROR);
    }
  }

  async findByName(nome: string): Promise<UserDto[] | ConflictResponse> {
    try {
      const users = await this.userModel
        .find({ nome: nome })
        .select('id nome')
        .exec();

      if (users.length === 0) {
        const response: ConflictResponse = {
          statusCode: HttpStatus.CONFLICT,
          message: 'Usuário nao encontrado.',
        };

        return response;
      }

      logMessage(`Usuário ${nome} encontrado com sucesso`, LogLevel.INFO);

      return users.map((user) => ({ id: user.id, nome: user.nome }));
    } catch (err) {
      logMessage(err.message, LogLevel.ERROR);

      const response: ConflictResponse = {
        statusCode: HttpStatus.BAD_REQUEST,
        message: err.message,
      };

      return response;
    }
  }

  async create(
    createUserDto: CreateUserDto
  ): Promise<UserDto | ConflictResponse> {
    try {
      const { nome } = createUserDto;

      const existingUser = await this.userModel.findOne({ nome }).exec();
      if (existingUser) {
        const response: ConflictResponse = {
          statusCode: HttpStatus.CONFLICT,
          message: 'Já existe um usuário com este nome.',
        };

        return response;
      }

      const createdUser = new this.userModel(createUserDto);
      const savedUser = await createdUser.save();

      logMessage(`Usuário criado com sucesso`, LogLevel.INFO);

      return { id: savedUser.id, nome: savedUser.nome };
    } catch (err) {
      logMessage(err.message, LogLevel.ERROR);

      const response: ConflictResponse = {
        statusCode: HttpStatus.BAD_REQUEST,
        message: err.message,
      };

      return response;
    }
  }
}
