"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ENV = exports.Constants = void 0;
var Constants;
(function (Constants) {
    Constants["STATUS"] = "status";
    Constants["ERROR"] = "error";
    Constants["MESSAGE"] = "message";
    Constants["TYPE"] = "type";
    Constants["DATA"] = "data";
    Constants["SUCCESS"] = "success";
    Constants["FAILED"] = "failed";
    Constants["SERVER_ERROR_MESSAGE"] = "Error occured at server side";
    Constants["USER_ALREADY_EXISTS"] = "User already signed up";
    Constants["USER_CREATED_SUCCESSFULLY"] = "User created successfully";
    Constants["SUCCESS_MESSAGE"] = "Successful bruh";
})(Constants || (Constants = {}));
exports.Constants = Constants;
var ENV;
(function (ENV) {
    ENV["FILE"] = "/home/ubuntu/chat-app/login-server/.env";
    // FILE = "/home/nikhil/git_nik/randup/aws/node-server/.env",
    // FILE = "/Users/aarcee/Documents/chat-app/login-server/.env",
})(ENV || (ENV = {}));
exports.ENV = ENV;
