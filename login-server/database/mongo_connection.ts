import mongoose, { Mongoose } from "mongoose";

class MongoDbClient {
  async connect(dbUri: string | undefined): Promise<Mongoose> {
    if (!dbUri) {
      throw new Error("Please provide mongoDB url.");
    }

    var options = {
      useNewUrlParser: true,
      autoIndex: false,
      useUnifiedTopology: true,
    };

    mongoose.Promise = global.Promise;
    return mongoose.connect(dbUri, options);
  }
}

export default new MongoDbClient();
