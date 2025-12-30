"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DiningTokenModule = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const dining_token_schema_1 = require("./schemas/dining-token.schema");
const dining_token_service_1 = require("./dining-token.service");
const dining_token_controller_1 = require("./dining-token.controller");
const auth_module_1 = require("../auth/auth.module");
let DiningTokenModule = class DiningTokenModule {
};
exports.DiningTokenModule = DiningTokenModule;
exports.DiningTokenModule = DiningTokenModule = __decorate([
    (0, common_1.Module)({
        imports: [
            mongoose_1.MongooseModule.forFeature([
                { name: dining_token_schema_1.DiningToken.name, schema: dining_token_schema_1.DiningTokenSchema },
            ]),
            auth_module_1.AuthModule,
        ],
        controllers: [dining_token_controller_1.DiningTokenController],
        providers: [dining_token_service_1.DiningTokenService],
        exports: [dining_token_service_1.DiningTokenService],
    })
], DiningTokenModule);
//# sourceMappingURL=dining-token.module.js.map