import { ConfigBase, IConfigBase } from "./ConfigBase";

export interface IAutoUpdateConfig extends IConfigBase {
  refreshInterval: number;
}

export class AutoUpdateConfig extends ConfigBase implements IAutoUpdateConfig {
  refreshInterval: number = 60;

  constructor(_sdkKey: string, _options: IAutoUpdateConfig) {
    super(_sdkKey, _options);

    this.logger.Log('Loading AutoUpdateConfig');    

    if (_options) {
      if (_options.refreshInterval) {
        this.refreshInterval = _options.refreshInterval;
        this.logger.Log(`Setting refreshInterval = ${this.refreshInterval}`);
      }
    }
  }
}