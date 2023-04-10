import { Body, Controller, Get, HttpCode, HttpStatus, Post, Request, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignInDto } from './auth.dto';
import { Public } from './isPublic';

@Controller('auth')
export class AuthController {
	constructor(private authService: AuthService) {}

	@HttpCode(HttpStatus.OK)
    @Public()
	@Post('login')
	signInUser(@Body() signInDto: SignInDto) {
		return this.authService.signIn(signInDto.username, signInDto.password);
	}

	@Get('photos')
	getProfile(@Request() req) {
		return req.user
	}
}
