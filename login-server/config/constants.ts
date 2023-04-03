enum Constants {
  STATUS = "status",
  ERROR = "error",
  MESSAGE = "message",
  TYPE = "type",
  DATA = "data",
  SUCCESS = "success",
  FAILED = "failed",
  SERVER_ERROR_MESSAGE = "Error occured at server side",
}

type userData = {
  name: string;
  email: string;
};

export { Constants, userData };
