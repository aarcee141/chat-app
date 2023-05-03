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
exports.UploadImageService = void 0;
const user_schema_1 = require("../database/schemas/user_schema");
const s3_1 = require("../s3/s3");
class UploadImageService {
    uploadProfilePicture(req) {
        return __awaiter(this, void 0, void 0, function* () {
            // Check if the user already exists in the database
            const user = req.body.user;
            const existingUser = yield user_schema_1.UserModel.findOne({ emailId: user.email });
            const file = req.files.file;
            const isImage = file.mimetype === "image/jpeg" || file.mimetype === "image/png";
            if (existingUser == null) {
                console.error("User not found");
            }
            else if (!isImage) {
                console.error("File uploaded is not of type JPEG or PNG.");
            }
            else {
                file.filename = user.uid + "-" + Date.now() + "-" + file.name;
                const s3_upload_metadata = yield (0, s3_1.uploadFileToS3)(file);
                const s3_metadata = s3_upload_metadata;
                existingUser.profilePicture = s3_metadata.Location;
                yield existingUser.save();
                return {
                    status: "success",
                    message: "Image updated successfully",
                    emailId: user.email,
                };
            }
        });
    }
}
exports.UploadImageService = UploadImageService;
exports.default = new UploadImageService();
