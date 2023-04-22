import express from "express";
import { Constants } from "../config/constants";
import GetUserMessagesService from "../services/get_user_messages_service";

const router = express.Router();

router.get(
  "/getUserMessages/:userEmail",
  async (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    try {
      console.log(req.params)
      const resp = await GetUserMessagesService.getMessages(req.params.userEmail);
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
