import { UserModel } from "../database/schemas/user_schema";
import { uploadFileToS3 } from "../s3/s3";

export class UploadImageService {
  public async uploadProfilePicture(req: any): Promise<any> {
    // Check if the user already exists in the database
    const user = req.body.user;
    const existingUser = await UserModel.findOne({ emailId: user.email });
    console.log(user.user, existingUser)

    const file = req.files.file;
    const isImage = file.mimetype === "image/jpeg" || file.mimetype === "image/png";

    if (existingUser == null) {
      console.error("User not found");
    } else if (!isImage) {
      console.error("File uploaded is not of type JPEG or PNG.");
    } else {

      file.filename = user.uid + "-" + Date.now() + "-" + file.name
      const s3_upload_metadata = await uploadFileToS3(file)

      existingUser.profilePicture = s3_upload_metadata.Location;
      await existingUser.save();

      return {
        status: "success",
        message: "Image updated successfully",
        emailId: user.email,
      };
    }
  }
}

export default new UploadImageService();
