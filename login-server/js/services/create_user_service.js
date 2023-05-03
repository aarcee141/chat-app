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
exports.CreateUserService = void 0;
const user_schema_1 = require("../database/schemas/user_schema");
class CreateUserService {
    createUser(req) {
        return __awaiter(this, void 0, void 0, function* () {
            // Check if the user already exists in the database
            const user = req.body;
            const existingUser = yield user_schema_1.UserModel.findOne({ emailId: user.email });
            if (existingUser) {
                return {
                    status: "success",
                    message: "User already exists",
                    emailId: user.email,
                };
            }
            // Create a new user object
            const newUser = new user_schema_1.UserModel({
                emailId: user.email,
                displayName: user.name,
                profilePicture: user.photoUrl,
            });
            // Save the user object to the database
            yield newUser.save();
            return {
                status: "success",
                message: "User created successfully",
                emailId: user.email,
            };
        });
    }
}
exports.CreateUserService = CreateUserService;
exports.default = new CreateUserService();
