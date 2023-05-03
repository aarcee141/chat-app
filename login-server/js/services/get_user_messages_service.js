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
exports.GetUsersMessagesService = void 0;
const unicast_messages_schema_1 = require("../database/schemas/unicast_messages_schema");
class GetUsersMessagesService {
    getMessages(userEmail) {
        return __awaiter(this, void 0, void 0, function* () {
            const toUserFilter = { receiver: userEmail };
            const messagesToUser = yield unicast_messages_schema_1.UnicastMessagesModel.find(toUserFilter).lean();
            const fromUserFilter = { sender: userEmail };
            const messagesFromUser = yield unicast_messages_schema_1.UnicastMessagesModel.find(fromUserFilter).lean();
            return {
                status: "success",
                messagesToUser: messagesToUser,
                messagesFromUser: messagesFromUser
            };
        });
    }
}
exports.GetUsersMessagesService = GetUsersMessagesService;
exports.default = new GetUsersMessagesService();
