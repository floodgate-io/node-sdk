import { FloodGateClient } from "./FloodGateClient";
import { AutoUpdateConfig, IAutoUpdateConfig } from "./AutoUpdateConfig";
import { User } from "./User";

export function createClient(_sdkKey: string) {
  let config: any = {
    sdkKey: _sdkKey,
    refreshInterval: 60
  };

  return createAutoUpdateClient(_sdkKey, config);
}

export function createAutoUpdateClient(_sdkKey: string, _config: IAutoUpdateConfig) {
  return new FloodGateClient(new AutoUpdateConfig(_sdkKey, _config));
}

// _id: string, _email?: string, _customAttributes?: { [key: string] : string; }
export function createUser(_id: string, _email?: string, _customAttributes?: { [key: string] : string; }): User {
  return new User(_id, _email, _customAttributes);
}