import { ConfigBase, IConfigBase } from "./ConfigBase";

export interface IAutoUpdateConfig extends IConfigBase {
  refreshInterval: number;
}

export class AutoUpdateConfig extends ConfigBase implements IAutoUpdateConfig {
  refreshInterval: number = 60;

  constructor(_sdkKey: string, _options: IAutoUpdateConfig) {
    super(_sdkKey, _options);

    if (_options) {
      if (_options.refreshInterval) {
        this.refreshInterval = _options.refreshInterval;
      }
    }
  }
}