enum Constants {
  STATUS = "status",
  ERROR = "error",
  MESSAGE = "message",
  TYPE = "type",
  DATA = "data",
  SUCCESS = "success",
  FAILED = "failed",
  SERVER_ERROR_MESSAGE = "Error occured at server side",
  USER_ALREADY_EXISTS = "User already signed up",
  USER_CREATED_SUCCESSFULLY = "User created successfully",
  SUCCESS_MESSAGE = "Successful bruh",
}

type userData = {
  name: string;
  email: string;
};

enum ENV {
  // FILE = "/home/ubuntu/server/.env",
  // FILE = "/home/nikhil/git_nik/randup/aws/node-server/.env",
  FILE = "/Users/aarcee/Documents/chat-app/login-server/.env",
}

export { Constants, userData, ENV };
