import { UserModel } from "../database/schemas/user_schema";
export class CreateUserService {
  public async createUser(req: any): Promise<any> {
    // Check if the user already exists in the database
    const user = req.body;
    const existingUser = await UserModel.findOne({ emailId: user.email });

    if (existingUser) {
      return {
        status: "success",
        message: "User already exists",
        emailId: user.email,
      };
    }

    // Create a new user object
    const newUser = new UserModel({
      emailId: user.email,
      displayName: user.name,
      profilePicture: user.photoUrl,
    });

    // Save the user object to the database
    await newUser.save();

    return {
      status: "success",
      message: "User created successfully",
      emailId: user.email,
    };
  }
}

export default new CreateUserService();
