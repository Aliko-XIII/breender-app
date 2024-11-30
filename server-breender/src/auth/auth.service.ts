import { BadRequestException, Injectable } from '@nestjs/common';
import { LoginUserDto } from './dto/login-user.dto';
import { UsersService } from 'src/users/users.service';
import { ResponseUserDto } from 'src/users/dto/response-user.dto';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { DatabaseService } from 'src/database/database.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class AuthService {
    private jwtSecret: string;
    private accessExp: string;
    private refreshExp: string;

    constructor(
        private usersService: UsersService,
        private jwtService: JwtService,
        private configService: ConfigService,
        private databaseService: DatabaseService) {
        this.jwtSecret = this.configService.get<string>('JWT_SECRET');
        this.accessExp = this.configService.get<string>('ACCESS_EXP');
        this.refreshExp = this.configService.get<string>('REFRESH_EXP');
    }

    async login(loginUserDto: LoginUserDto) {
        const { email, pass } = loginUserDto;
        const responseUserDto: ResponseUserDto = await this.usersService.checkAuth(email, pass);

        const accessToken = this.generateAccessToken(responseUserDto.id);
        const refreshToken = await this.generateAndSaveRefreshToken(responseUserDto.id);

        return {
            message: 'User logged in successfully.',
            data: {
                access_token: accessToken,
                refresh_token: refreshToken,
            },
        };
    }

    // async refresh(refreshTokenDto: RefreshTokenDto): Promise<{
    //     message: string;
    //     data: {
    //       access_token: string;
    //     };
    //   }> {
    //     const { refreshToken } = refreshTokenDto;
    
    //     const payload = await this.validateRefreshToken(refreshToken);
    //     const userId = payload.userId;
    
    //     const accessToken = this.generateAccessToken(userId);
    //     return {
    //       message: 'Access token updated successfully.',
    //       data: {
    //         access_token: accessToken,
    //       },
    //     };
    //   }

    async generateAccessToken(userId: string) {
        return this.jwtService.sign(
            {
                id: userId
            },
            {
                secret: this.jwtSecret,
                expiresIn: this.accessExp
            },
        );
    }

    async generateAndSaveRefreshToken(userId: string) {
        const refreshToken = this.jwtService.sign(
            { id: userId },
            {
                secret: this.jwtSecret,
                expiresIn: this.refreshExp
            },
        );

        const daysToAdd = parseInt(this.refreshExp.replace('d', ''), 10);
        const expiresAt = new Date();
        expiresAt.setDate(expiresAt.getDate() + daysToAdd);

        const tokenRecord: Prisma.RefreshTokenUpsertArgs = {
            where: { userId },
            create: {
                refreshToken,
                userId,
                expiresAt
            },
            update: {
                refreshToken,
                expiresAt
            }
        };

        await this.databaseService.refreshToken.upsert(tokenRecord);

        return refreshToken;
    }

    private async validateRefreshToken(
        refreshToken: string,
    ): Promise<ResponseUserDto> {
        const decoded = this.jwtService.verify(refreshToken, {
            secret: this.jwtSecret,
        });
        const authRecord = await this.databaseService.refreshToken.findUnique(
            {
                where: {
                    userId: decoded.userId
                }
            });

        if (!authRecord || authRecord.refreshToken !== refreshToken) {
            throw new BadRequestException('Invalid refresh token');
        }

        const user: ResponseUserDto = {
            id: decoded.userId,
        }

        return user;
    }
}
