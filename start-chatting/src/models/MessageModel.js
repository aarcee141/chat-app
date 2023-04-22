class MessageModel {
  constructor(content, time, toUser, fromUser) {
    this._content = content;
    this._time = time;
    this._toUser = toUser;
    this._fromUser = fromUser;
  }

  get content() {
    return this._content;
  }

  set content(value) {
    this._content = value;
  }

  get time() {
    return this._time;
  }

  set time(value) {
    this._time = value;
  }

  get toUser() {
    return this._toUser;
  }

  set toUser(value) {
    this._toUser = value;
  }

  get fromUser() {
    return this._fromUser;
  }

  set fromUser(value) {
    this._fromUser = value;
  }
}

export default MessageModel;
