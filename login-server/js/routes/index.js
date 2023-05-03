"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploadProfilePictureRoute = exports.getUserMessagesRoute = exports.getUsersRoute = exports.createUserRoute = void 0;
var create_user_route_1 = require("./create_user_route");
Object.defineProperty(exports, "createUserRoute", { enumerable: true, get: function () { return __importDefault(create_user_route_1).default; } });
var get_users_route_1 = require("./get_users_route");
Object.defineProperty(exports, "getUsersRoute", { enumerable: true, get: function () { return __importDefault(get_users_route_1).default; } });
var get_user_messages_route_1 = require("./get_user_messages_route");
Object.defineProperty(exports, "getUserMessagesRoute", { enumerable: true, get: function () { return __importDefault(get_user_messages_route_1).default; } });
var upload_profile_picture_route_1 = require("./upload_profile_picture_route");
Object.defineProperty(exports, "uploadProfilePictureRoute", { enumerable: true, get: function () { return __importDefault(upload_profile_picture_route_1).default; } });
