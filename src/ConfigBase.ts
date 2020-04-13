import * as Cache from "./Cache";
import ILogger from "./ILogger";
import DefaultLogger from "./DefaultLogger";
import ConsoleLogger from "./ConsoleLogger";

const pckg = require('../package.json');

export interface IConfigBase {
  sdkKey: string;

  baseUrl?: string;

  configUrl?: string;

  cache?: Cache.ICache;

  logger: ILogger;

  consoleLog: boolean;

  localConfigData?: string;

  Version: string;

  buildUrl(): string;
}

export abstract class ConfigBase implements IConfigBase {
  public sdkKey: string;

  public Version: string;

  public cache?: Cache.ICache;

  public logger: ILogger;

  public consoleLog: boolean = false;

  public readonly baseUrl: string = "https://cdn.floodgate.io";

  public configUrl?: string;

  public localConfigData?: string;

  private readonly API_VERSION: string = "v1";

  constructor(_sdkKey: string, _options: IConfigBase) {
    if (!_sdkKey) {
      throw new Error("Invalid SDK Key");
    }

    this.sdkKey = _sdkKey;

    this.logger = new DefaultLogger();

    this.Version = pckg.version;

    if (_options) {
      if (_options.consoleLog) {
        this.logger = new ConsoleLogger();
        this.logger.Log('Enabling console logging');
      }

      if (!_options.cache) {
        this.cache = new Cache.NodejsCache();
      }

      if (_options.configUrl) {
        this.configUrl = _options.configUrl;
      }

      if (_options.localConfigData) {
        this.localConfigData = _options.localConfigData;
      }
    }

    this.logger.Log(`SDK Version = ${this.Version}`);
  }

  public buildUrl(): string {
    let url = `${this.baseUrl}/environment-files/${this.sdkKey}/${this.API_VERSION}/flags-config.json`;

    if (this.configUrl) {
      url = this.configUrl;
    }

    this.logger.Log(`url = ${url}`);
    return url;
  }
}