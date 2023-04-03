import express from "express";
import { Constants } from "../config/constants";
import CreateUserService from "../services/create_user_service";

const router = express.Router();

router.post(
  "/createUser",
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
