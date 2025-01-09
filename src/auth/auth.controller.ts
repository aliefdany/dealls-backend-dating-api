import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ApiBody, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { AuthEntity } from './entities/auth.entity';
import { SignInDto } from './dto/signin.auth.dto';
import { SignUpDto } from './dto/signup.auth.dto';

@Controller({ version: '1', path: 'auth' })
@ApiTags('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signin')
  @ApiBody({
    type: SignInDto,
    examples: {
      example1: {
        summary: "Authenticate an account with 'admin' role",
        value: {
          username: 'alief',
          password: 'random123',
        },
      },
      example2: {
        summary: "Authenticate an account with 'user' role",
        value: {
          username: 'dany',
          password: 'random123',
        },
      },
    },
  })
  @ApiOkResponse({ type: AuthEntity })
  signIn(@Body() { username, password }: SignInDto) {
    return this.authService.signin(username, password);
  }

  @Post('signup')
  @ApiBody({
    type: SignUpDto,
    examples: {
      example1: {
        summary: "Authenticate an user with 'admin' role",
        value: {
          email: 'alief@gmail.io',
          username: 'alief',
          password: 'random123',
        },
      },
      example2: {
        summary: "Authenticate an user with 'user' role",
        value: {
          email: 'dany@gmail.io',
          username: 'dany',
          password: 'random123',
        },
      },
    },
  })
  @ApiOkResponse({ type: AuthEntity })
  signUp(@Body() { username, password }: SignUpDto) {
    return this.authService.signUp(username, password);
  }
}
