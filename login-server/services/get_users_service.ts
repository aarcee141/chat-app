import { UserModel } from "../database/schemas/user_schema";
import { Constants } from "../config/constants";

export class GetUsersService {
  public async getUsers(req: any): Promise<any> {
    const users = await UserModel.find().lean(); // get all users from the Users collection and convert to plain JS object
    return users;
  }
}

export default new GetUsersService();
