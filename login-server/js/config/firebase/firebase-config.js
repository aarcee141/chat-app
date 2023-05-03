"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var admin = require("firebase-admin");
const serviceAccount_json_1 = __importDefault(require("./serviceAccount.json"));
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount_json_1.default)
});
exports.default = admin;
