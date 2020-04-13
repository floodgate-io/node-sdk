import { FloodGateClient } from "./FloodGateClient";
import { AutoUpdateConfig, IAutoUpdateConfig } from "./AutoUpdateConfig";
import { IUser, User } from "./User";

export function createClient(_sdkKey: string) {
  let config: any = {
    sdkKey: _sdkKey,
    refreshInterval: 60
  };

  return createAutoUpdateClient(_sdkKey, config);
}

export function createAutoUpdateClient(_sdkKey: string, _config: any) {
  return new FloodGateClient(new AutoUpdateConfig(_sdkKey, _config));
}

/* @deprecated */
export function createUser(_id: string, _email?: string, _customAttributes?: { [key: string] : string; }): IUser {
  // Merge email into customAttributes

  if (_email != undefined && _email != null && _email.length > 0) {
    if (_customAttributes == undefined) {
      _customAttributes = {
        Email: _email
      };
    }
    else {
      _customAttributes['email'] = _email;
    }
  }

  return new User(_id, _customAttributes);
}

export function createFloodgateUser(_id: string, _customAttributes?: { [key: string] : string; }): IUser {
  return new User(_id, _customAttributes);
}