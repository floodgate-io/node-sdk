import * as Cache from "./Cache";

export interface IConfigBase {
  sdkKey: string;
  baseUrl?: string;
  configUrl?: string;
  cache?: Cache.ICache;
  buildUrl(): string;
}

export abstract class ConfigBase implements IConfigBase {
  public sdkKey: string;

  public cache?: Cache.ICache;

  public readonly baseUrl: string = "https://cdn.floodgate.io";

  public configUrl: string = "";

  private readonly API_VERSION: string = "v1";

  constructor(_sdkKey: string, _options: IConfigBase) {
    if (!_sdkKey) {
      throw new Error("Invalid SDK Key");
    }

    this.sdkKey = _sdkKey;
    this.configUrl = this.baseUrl;

    if (_options) {
      if (!_options.cache) {
        // this.cache = new Cache.InMemoryCache();
        this.cache = new Cache.NodejsCache();
      }

      if (_options.configUrl) {
        this.configUrl = _options.configUrl;
      }
    }
  }

  public buildUrl(): string {
    const url = `${this.configUrl}/environment-files/${this.sdkKey}/${this.API_VERSION}/flags-config.json`;
    return url;
  }
}