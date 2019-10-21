export interface IUser {
  Id: string;
  Email: string;
  CustomAttributes: { [key: string] : string; };
}

export class User {
  private id: string;
  private email?: string;
  private customAttributes?: { [key: string] : string; } = {};

  constructor(_id: string, _email?: string, _customAttributes?: { [key: string] : string; }) {
    if (_id == undefined) {
      throw "User must be created with a unique id";
    }
    
    this.id = _id;
    this.email = _email;
    this.customAttributes = _customAttributes
  }

  get Id() {
    return this.id;
  }

  get Email() {
    return this.email;
  }

  set Email(value) {
    this.email = value;
  }

  get CustomAttributes() {
    return this.customAttributes;
  }
}