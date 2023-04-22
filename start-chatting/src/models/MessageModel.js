class MessageModel {
  constructor(content, sender, receiver, sentTime, receivedTime) {
    this._content = content;
    this._sender = sender;
    this._receiver = receiver;
    this._sentTime = sentTime;
    this._receivedTime = receivedTime;
  }

  get content() {
    return this._content;
  }

  set content(value) {
    this._content = value;
  }

  get sender() {
    return this._sender;
  }

  set sender(value) {
    this._sender = value;
  }

  get receiver() {
    return this._receiver;
  }

  set receiver(value) {
    this._receiver = value;
  }

  get sentTime() {
    return this._sentTime;
  }

  set sentTime(value) {
    this._sentTime = value;
  }

  get receivedTime() {
    return this._receivedTime;
  }

  set receivedTime(value) {
    this._receivedTime = value;
  }
}

export default MessageModel;
