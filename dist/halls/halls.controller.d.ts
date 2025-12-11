import { HallsService } from './halls.service';
export declare class HallsController {
    private readonly hallsService;
    constructor(hallsService: HallsService);
    getAllHalls(): Promise<(import("mongoose").Document<unknown, {}, import("./schemas/hall.schema").HallDocument, {}, {}> & import("./schemas/hall.schema").Hall & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    })[]>;
    createHallAndAdmin(req: any, body: {
        name: string;
        email: string;
        password: string;
        capacity: number;
    }): Promise<{
        success: boolean;
        message: string;
        hall: import("mongoose").Document<unknown, {}, import("./schemas/hall.schema").HallDocument, {}, {}> & import("./schemas/hall.schema").Hall & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
            _id: import("mongoose").Types.ObjectId;
        }> & {
            __v: number;
        };
        admin: {
            id: import("mongoose").Types.ObjectId;
            email: string;
            role: string;
        };
    }>;
    getMyHall(req: any): Promise<import("mongoose").Document<unknown, {}, import("./schemas/hall.schema").HallDocument, {}, {}> & import("./schemas/hall.schema").Hall & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }>;
    updateHallInfo(req: any, body: {
        notice: string;
    }): Promise<import("mongoose").Document<unknown, {}, import("./schemas/hall.schema").HallDocument, {}, {}> & import("./schemas/hall.schema").Hall & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }>;
}
