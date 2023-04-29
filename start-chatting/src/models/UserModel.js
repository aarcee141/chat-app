class UserModel {
  constructor(name, email, profilePicture) {
    this._name = name;
    this._email = email;
    this._profilePicture = profilePicture;
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

  get profilePicture() {
    return this._profilePicture;
  }

  set profilePicture(value) {
    this._profilePicture = value;
  }
}

export default UserModel;
