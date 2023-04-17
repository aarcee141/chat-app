import { createUserRoute, getUsersRoute } from "./routes";
import MongoDbClient from "./database/mongo_connection";
import { ENV } from "./config/constants";

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config({ path: ENV.FILE });

const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// const dbUri = process.env.DB;
const dbUri = ("mongodb://ec2-54-185-192-156.us-west-2.compute.amazonaws.com:27017")
console.log("dbUri" + dbUri);
/**
 * Connect to mongodb and if successful then start application
 */
MongoDbClient.connect(dbUri)
  .then(() => {
    // Routes
    app.use("/api", createUserRoute);
    app.use("/api", getUsersRoute);

    // Start server
    const PORT = process.env.PORT || 5000;

    app.listen(PORT, () => {
      console.log(`Server started on port ${PORT}`);
    });
  })
  .catch((error: any) => {
    console.error(`Failed to connect to MongoDB: ${error}`);
  });
