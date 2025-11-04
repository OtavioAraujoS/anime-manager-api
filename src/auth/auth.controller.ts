import { Body, Controller, Post, UseGuards, Request } from '@nestjs/common';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './jwt.guard';
import { UserDto } from 'src/user/dto/user.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register')
  async register(@Body() body: { username: string; password: string }) {
    return this.authService.register(body.username, body.password);
  }

  @Post('login')
  async login(@Body() body: { name: string; password: string }) {
    const user = await this.authService.validateUser(body.name, body.password);

    return this.authService.login(user as UserDto);
  }

  @UseGuards(JwtAuthGuard)
  @Post('protected')
  getProtected(@Request() req) {
    return { message: `Bem-vindo, ${req.user.username}` };
  }
}
