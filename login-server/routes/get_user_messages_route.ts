import express from "express";
import { Constants } from "../config/constants";
import GetUserMessagesService from "../services/get_user_messages_service";

const router = express.Router();

/**
 * @swagger
 * /api/getUserMessages:
 *   get:
 *     summary: Fetches current user's previous messages [Needs Auth token in header].
 *     description: Fetches current user's previous to/from messages from the database.
 *     responses:
 *       200:
 *         description: User created successfully
 */
router.get(
  "/",
  async (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    try {
      if (req.body.user) {
        const resp = await GetUserMessagesService.getMessages(req.body.user.email);
        res.status(200).send(resp);
        return next();
      }
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
