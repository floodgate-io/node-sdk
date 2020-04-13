import { ServiceBase } from "./ServiceBase";
import { IAutoUpdateConfig } from "./AutoUpdateConfig";
import * as Const from "./Consts";

export interface IAutoUpdateService {
  GetFlags(callback: (value: any) => void): void;
}

export class AutoUpdateService extends ServiceBase implements IAutoUpdateService {
  private timer: number;

  constructor(_config: IAutoUpdateConfig) {
    super(_config);

    // @ts-ignore <ts(2322)>
    this.timer = setInterval(() => this.refresh(), _config.refreshInterval * 1000);
  }

  public Start(): void {
    super.FetchRemote(() => {
      this.emit(Const.EVENT_SDK_READY);
    });
  }

  private refresh(): void {
    super.FetchRemote(() => {});
  }

  GetFlags(callback: (_value: any) => void): void {
    super.FetchRemote((_value) => {
      callback(_value);
    });
  }

  GetFlagsLocal(): void {
    return super.FetchLocal();
  }
}