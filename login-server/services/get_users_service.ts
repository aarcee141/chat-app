import { userData } from "../config/constants";
import fs from "fs";

class GetUsersService {
  async getUsers(req: any): Promise<any> {
    // Read data from local JSON storage.
    const filePath = "./data/users.json";
    const jsonData = fs.readFileSync(filePath, { encoding: "utf-8" });
    const parsedData = JSON.parse(jsonData) as userData[];

    return parsedData;
  }
}

export default new GetUsersService();
