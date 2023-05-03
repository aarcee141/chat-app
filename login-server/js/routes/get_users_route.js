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
const express_1 = __importDefault(require("express"));
const constants_1 = require("../config/constants");
const get_users_service_1 = __importDefault(require("../services/get_users_service"));
const router = express_1.default.Router();
/**
 * @swagger
 * /api/getUsers:
 *   get:
 *     summary: Returns a list of all the users.
 *     description: Retrieve a list of all the users from the database.
 *     responses:
 *       200:
 *         description: A list of users
 */
router.get("/", (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const resp = yield get_users_service_1.default.getUsers(req);
        res.status(200).send(resp);
        return next();
    }
    catch (error) {
        res.status(500).send({
            status: constants_1.Constants.FAILED.toString(),
            message: constants_1.Constants.SERVER_ERROR_MESSAGE.toString(),
        });
        next(error);
    }
}));
exports.default = router;
