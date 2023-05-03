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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const firebase_config_1 = __importDefault(require("../config/firebase/firebase-config"));
class Middleware {
    decodeToken(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // Token should be defined as "Bearer ${tokenData}"
                if (req.headers.authorization &&
                    req.headers.authorization.startsWith("Bearer")) {
                    const token = req.headers.authorization.split(" ")[1];
                    req.params.token = token;
                }
                const decodeValue = yield firebase_config_1.default.auth().verifyIdToken(req.params.token);
                if (decodeValue) {
                    req.body.user = decodeValue;
                    // console.log("Auth successful");
                    return next();
                }
                return res.status(400).json({ message: "Un authorize" });
            }
            catch (e) {
                return res.json({ message: "Internal Error: " + e });
            }
        });
    }
}
exports.default = new Middleware();
