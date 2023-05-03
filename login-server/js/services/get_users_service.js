"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetUsersService = void 0;
const user_schema_1 = require("../database/schemas/user_schema");
class GetUsersService {
    getUsers(req) {
        return __awaiter(this, void 0, void 0, function* () {
            const users = yield user_schema_1.UserModel.find().lean(); // get all users from the Users collection and convert to plain JS object
            return users;
        });
    }
}
exports.GetUsersService = GetUsersService;
exports.default = new GetUsersService();
