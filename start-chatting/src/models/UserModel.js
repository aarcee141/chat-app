class UserModel {
  constructor(name, email) {
    this._name = name;
    this._email = email;
  }

  get name() {
    return this._name;
  }

  set name(value) {
    this._name = value;
  }

  get email() {
    return this._email;
  }

  set email(value) {
    this._email = value;
  }

  get status() {
    return this._status;
  }

  set status(value) {
    this._status = value;
  }
}

export default UserModel;
