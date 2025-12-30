import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
export declare class AuthService {
    private usersService;
    private jwtService;
    constructor(usersService: UsersService, jwtService: JwtService);
    register(userDto: any): Promise<import("mongoose").Document<unknown, {}, import("../users/schemas/user.schema").User, {}, {}> & import("../users/schemas/user.schema").User & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }>;
    signIn(email: string, pass: string): Promise<{
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
    googleLogin(googleUser: any): Promise<{
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
    private generateToken;
}
