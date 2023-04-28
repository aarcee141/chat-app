import express from "express";
import { Constants } from "../config/constants";
import UploadImageService from "../services/upload_image_service";

const router = express.Router();

/**
 * @swagger
 * /api/uploadProfilePicture:
 *   get:
 *     summary: Upload profile picture for a user [Needs Auth token in header].
 *     description: Uploads and updates the profile picture for a user.
 *     responses:
 *       200:
 *         description: Image updated successfully.
 */
router.post(
  "/",
  async (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    try {
      const resp = await UploadImageService.uploadProfilePicture(req);
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
