import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
import { ConfigService } from '@nestjs/config';
import { RegisterDto, LoginDto } from './dto/auth.dto';
export declare class AuthController {
    private authService;
    private usersService;
    private configService;
    constructor(authService: AuthService, usersService: UsersService, configService: ConfigService);
    register(body: RegisterDto): Promise<import("mongoose").Document<unknown, {}, import("../users/schemas/user.schema").User, {}, {}> & import("../users/schemas/user.schema").User & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }>;
    getProfile(req: any): Promise<import("mongoose").Document<unknown, {}, import("../users/schemas/user.schema").User, {}, {}> & import("../users/schemas/user.schema").User & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }>;
    login(body: LoginDto): Promise<{
        access_token: string;
        user: {
            id: any;
            name: any;
            email: any;
            status: any;
            role: any;
            hallName: any;
        };
    }>;
    googleAuth(req: any): Promise<void>;
    googleAuthRedirect(req: any, res: any): Promise<any>;
    seedAdmin(): Promise<{
        message: string;
        admin?: undefined;
    } | {
        message: string;
        admin: import("mongoose").Document<unknown, {}, import("../users/schemas/user.schema").User, {}, {}> & import("../users/schemas/user.schema").User & {
            _id: import("mongoose").Types.ObjectId;
        } & {
            __v: number;
        };
    }>;
    googleAuthSuccess(req: any): Promise<{
        message: string;
        access_token: any;
    }>;
}
