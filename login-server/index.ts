import { createUserRoute, getUserMessagesRoute, getUsersRoute, uploadProfilePictureRoute } from "./routes";
import MongoDbClient from "./database/mongo_connection";
import { ENV } from "./config/constants";
import Middleware from "./middleware/index";
import fs from 'fs';



const swaggerJSDoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const fileUpload = require('express-fileupload');
require("dotenv").config({ path: ENV.FILE });

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

interface Config {
  url: string;
}

const configPath = './mongodb_config.json';
const configJson = fs.readFileSync(configPath, 'utf-8');
const config: Config = JSON.parse(configJson);

const dbUri = config.url;
console.log("dbUri" + dbUri);


/**
 * Connect to mongodb and if successful then start application
 */
MongoDbClient.connect(dbUri)
  .then(() => {
    // Routes
    app.use("/api/createUser", [Middleware.decodeToken], createUserRoute);
    app.use("/api/getUsers", getUsersRoute);
    app.use(
      "/api/getUserMessages",
      [Middleware.decodeToken],
      getUserMessagesRoute
    );

    // Upload and update profile picture.
    app.use(
      "/api/uploadProfilePicture",
      [Middleware.decodeToken],
      uploadProfilePictureRoute
    );

    // Start server.
    const PORT = process.env.PORT || 5000;

    app.listen(PORT, () => {
      console.log(`Server started on port ${PORT}`);
    });
  })
  .catch((error: any) => {
    console.error(`Failed to connect to MongoDB: ${error}`);
  });
