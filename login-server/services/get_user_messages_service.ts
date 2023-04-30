import { UnicastMessagesModel } from "../database/schemas/unicast_messages_schema";

export class GetUsersMessagesService {
  public async getMessages(userEmail: string): Promise<any> {

    const toUserFilter = { receiver: userEmail };
    const messagesToUser = await UnicastMessagesModel.find(toUserFilter).lean();
    const fromUserFilter = { sender: userEmail };
    const messagesFromUser = await UnicastMessagesModel.find(fromUserFilter).lean();
    return {
        status: "success",
        messagesToUser: messagesToUser,
        messagesFromUser: messagesFromUser
    };
  }
}

export default new GetUsersMessagesService();
