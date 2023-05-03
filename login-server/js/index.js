"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const routes_1 = require("./routes");
const mongo_connection_1 = __importDefault(require("./database/mongo_connection"));
const constants_1 = require("./config/constants");
const index_1 = __importDefault(require("./middleware/index"));
const fs_1 = __importDefault(require("fs"));
const swaggerJSDoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const fileUpload = require('express-fileupload');
require("dotenv").config({ path: constants_1.ENV.FILE });
const app = express();
// Middleware
app.use(fileUpload());
app.use(express.json());
app.use(cors());
// Swagger documentation
const swaggerOptions = {
    definition: {
        openapi: "3.0.0",
        info: {
            title: "My API",
            version: "1.0.0",
            description: "My API documentation",
        },
    },
    apis: ["./routes/*.ts"], // Path to the API routes
};
const swaggerSpec = swaggerJSDoc(swaggerOptions);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
const configPath = './mongodb_config.json';
const configJson = fs_1.default.readFileSync(configPath, 'utf-8');
const config = JSON.parse(configJson);
const dbUri = config.url;
/**
 * Connect to mongodb and if successful then start application
 */
mongo_connection_1.default.connect(dbUri)
    .then(() => {
    // Routes
    app.use("/api/createUser", [index_1.default.decodeToken], routes_1.createUserRoute);
    app.use("/api/getUsers", routes_1.getUsersRoute);
    app.use("/api/getUserMessages", [index_1.default.decodeToken], routes_1.getUserMessagesRoute);
    // Upload and update profile picture.
    app.use("/api/uploadProfilePicture", [index_1.default.decodeToken], routes_1.uploadProfilePictureRoute);
    // Start server.
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
        console.log(`Server started on port ${PORT}`);
    });
})
    .catch((error) => {
    console.error(`Failed to connect to MongoDB: ${error}`);
});
