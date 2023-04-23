import express from "express";
import { Constants } from "../config/constants";
import GetUsersService from "../services/get_users_service";

const router = express.Router();

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
router.get(
  "/getUsers",
  async (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    try {
      const resp = await GetUsersService.getUsers(req);
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
