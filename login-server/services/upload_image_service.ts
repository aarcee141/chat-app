import { UserModel } from "../database/schemas/user_schema";
import { uploadFileToS3 } from "../s3/s3";

export class UploadImageService {
  public async uploadProfilePicture(req: any): Promise<any> {
    // Check if the user already exists in the database
    const user = req.body;
    const existingUser = await UserModel.findOne({ emailId: user.email });

    if (existingUser == null) {
      console.error("User not found");
    } else {

      const file = req.files.file;
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
