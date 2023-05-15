import { UserModel } from "../database/schemas/user_schema";
import { uploadFileToS3 } from "../s3/s3";

interface MyResponse extends Record<string, any> {

}

export class UploadImageService {
  public async uploadProfilePicture(req: any): Promise<any> {
    // Check if the user already exists in the database
    const user = req.body.user;
    const existingUser = await UserModel.findOne({ emailId: user.email });

    const file = req.files.file;
    const isImage = file.mimetype === "image/jpeg" || file.mimetype === "image/png";

    console.log(file)

    if (existingUser == null) {
      console.error("User not found");
    } else if (!isImage) {
      console.error("File uploaded is not of type JPEG or PNG.");
      return {
        status: "failure",
        message: "File uploaded is not of type JPEG or PNG.",
        emailId: user.email,
      };
    } else if (file.size > 200000) {
      return {
        status: "failure",
        message: "Image size greater than 200KB. Please select a smaller image.",
        emailId: user.email,
      };
    } else {

      file.filename = user.uid + "-" + Date.now() + "-" + file.name
      const s3_upload_metadata = await uploadFileToS3(file)


      const s3_metadata: MyResponse = s3_upload_metadata

      existingUser.profilePicture = s3_metadata.Location;
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
