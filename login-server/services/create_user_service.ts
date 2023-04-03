import { userData } from "../config/constants";
import fs from "fs";

class CreateUserService {
  async createUser(req: any): Promise<any> {
    const { email, name } = req.body;

    // Store data in local JSON storage.
    const filePath = "./data/users.json";
    const jsonData = fs.readFileSync(filePath, { encoding: "utf-8" });
    const parsedData = JSON.parse(jsonData) as userData[];

    const newData: userData = {
      name: name,
      email: email,
    };

    let isNewData = true;
    for (let i = 0; i < parsedData.length; i++) {
      if (parsedData[i].email === newData.email) {
        isNewData = false;
      }
    }
    if (isNewData) {
      parsedData.push(newData);
      fs.writeFileSync(filePath, JSON.stringify(parsedData));
    }

    // Log and return data for debugging.
    console.log(JSON.stringify(parsedData));
    return JSON.stringify(JSON.stringify(parsedData));
  }
}

export default new CreateUserService();
