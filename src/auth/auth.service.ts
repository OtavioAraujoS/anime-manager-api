import { HttpStatus, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { LogLevel, logMessage } from 'src/utils/logMessage';
import { UsersService } from 'src/user/user.service';
import { ConflictResponse } from 'src/interfaces/response';
import { UserDto } from 'src/user/dto/user.dto';
import { LoginDTO } from './dto/login-dto';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService
  ) {}

  async validateUser(
    username: string,
    pass: string
  ): Promise<UserDto | ConflictResponse> {
    try {
      if (!username || !pass) {
        const response: ConflictResponse = {
          statusCode: HttpStatus.BAD_REQUEST,
          message: 'Usuário inválido.',
        };
        return response;
      }
      const user = await this.usersService.findByName(username);
      if (user && (await bcrypt.compare(pass, user?.[0]?.password || ''))) {
        const { ...result } = user[0];
        return result;
      }
      throw new UnauthorizedException('Usuário ou senha inválidos');
    } catch (error) {
      logMessage(error.message, LogLevel.ERROR);
      const response: ConflictResponse = {
        statusCode: HttpStatus.BAD_REQUEST,
        message: error.message,
      };

      return response;
    }
  }

  async login(user: UserDto): Promise<LoginDTO | ConflictResponse> {
    try {
      if (!user.name || !user.password) {
        const response: ConflictResponse = {
          statusCode: HttpStatus.BAD_REQUEST,
          message: 'Usuário inválido.',
        };
        return response;
      }
      const payload = { username: user.name, sub: user.id };
      return {
        access_token: this.jwtService.sign(payload),
      };
    } catch (error) {
      logMessage(error.message, LogLevel.ERROR);

      const response: ConflictResponse = {
        statusCode: HttpStatus.BAD_REQUEST,
        message: error.message,
      };

      return response;
    }
  }

  async register(
    username: string,
    password: string
  ): Promise<UserDto | ConflictResponse> {
    try {
      if (!password || !username) {
        logMessage('Usuário ou senha são obrigatórios', LogLevel.ERROR);
        throw new UnauthorizedException('Usuário ou senha são obrigatórios');
      }
      return this.usersService.create({ name: username, password });
    } catch (error) {
      logMessage(error.message, LogLevel.ERROR);

      const response: ConflictResponse = {
        statusCode: HttpStatus.BAD_REQUEST,
        message: error.message,
      };

      return response;
    }
  }
}
