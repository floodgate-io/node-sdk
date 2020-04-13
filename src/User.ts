export interface IUser {
  Id: string;
  Email?: string;
  Name?: string;
  CustomAttributes: { [key: string] : string | number; } | undefined;
}

export class User implements IUser {
  private id: string;
  private email?: string;
  private name?: string;
  private customAttributes?: { [key: string] : string | number; } = {};

  constructor(_id: string, _customAttributes?: { [key: string] : string | number; } | undefined) {
    if (_id === undefined || _id === null || _id === "" || typeof(_id) != "string") {
      throw new Error("User must be created with a unique id");
    }
    
    this.id = _id;

    if (_customAttributes != undefined) {

      // Convert attribute keys to lowercase
      const customAttributes: { [key: string] : string | number; } = Object.keys(_customAttributes)
      .reduce((destination: any, key: string) => {
        destination[key.toLowerCase()] = _customAttributes[key];
        return destination;
      }, {});

      if (customAttributes['email'] != undefined && customAttributes['email'] != null && typeof customAttributes['email'] === "string") {
        this.email = customAttributes['email'];
      }

      if (customAttributes['name'] != undefined && customAttributes['name'] != null && typeof customAttributes['name'] === "string") {
        this.name = customAttributes['name'];
      }

      this.customAttributes = customAttributes
    }
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

  get Name() {
    return this.name;
  }

  get CustomAttributes() {
    return this.customAttributes;
  }
}