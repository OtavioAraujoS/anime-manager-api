import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateUserDto } from './dto/create-user.dto';
import { UserDto } from './dto/user.dto';
import * as bcrypt from 'bcrypt';
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

      return users.map((user) => ({ id: user.id, name: user.name }));
    } catch (err) {
      logMessage(err.message, LogLevel.ERROR);
    }
  }

  async findByName(name: string): Promise<UserDto[] | ConflictResponse> {
    try {
      const users = await this.userModel
        .find({ name: name })
        .select('id name password')
        .exec();

      if (users.length === 0) {
        const response: ConflictResponse = {
          statusCode: HttpStatus.CONFLICT,
          message: 'Usuário nao encontrado.',
        };

        return response;
      }

      logMessage(`Usuário ${name} encontrado com sucesso`, LogLevel.INFO);

      return users.map((user) => ({
        id: user.id,
        name: user.name,
        password: user.password,
      }));
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
      const { name, password } = createUserDto;

      const passwordNotIsDefined = !password || password.trim() === '';
      if (passwordNotIsDefined) {
        logMessage(`A senha é obrigatória.`, LogLevel.ERROR);
        const response: ConflictResponse = {
          statusCode: HttpStatus.BAD_REQUEST,
          message: 'A senha é obrigatória.',
        };
        return response;
      }

      const existingUser = await this.userModel.findOne({ name }).exec();
      if (existingUser) {
        logMessage(`Já existe um usuário com o nome ${name}.`, LogLevel.ERROR);
        const response: ConflictResponse = {
          statusCode: HttpStatus.CONFLICT,
          message: 'Já existe um usuário com este nome.',
        };
        return response;
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      const createdUser = new this.userModel({
        ...createUserDto,
        password: hashedPassword,
      });

      const savedUser = await createdUser.save();

      logMessage(`Usuário "${name}" criado com sucesso`, LogLevel.INFO);

      return { id: savedUser.id, name: savedUser.name };
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
