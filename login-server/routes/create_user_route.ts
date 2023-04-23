import express from "express";
import { Constants } from "../config/constants";
import CreateUserService from "../services/create_user_service";

const router = express.Router();

/**
 * @swagger
 * /api/createUser:
 *   get:
 *     summary: Create a user [Needs Auth token in header].
 *     description: Creates a new user and adds them to the database if the user doesn't already exist.
 *     responses:
 *       200:
 *         description: User created successfully
 */
router.post(
  "/",
  async (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    try {
      const resp = await CreateUserService.createUser(req);
      res.status(200).send(resp);
      return next();
    } catch (error) {
      res.status(500).send({
        status: Constants.FAILED.toString(),
        message: Constants.SERVER_ERROR_MESSAGE.toString(),
      });
      next(error);
    }
  }
);

export default router;
