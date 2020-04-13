import { EventEmitter } from "events";
import { AutoUpdateConfig, IAutoUpdateConfig } from "./AutoUpdateConfig";
import { AutoUpdateService, IAutoUpdateService } from "./AutoUpdateService";
import { Evaluator } from "./Evaluator";
import * as Const from "./Consts";
import { IUser, User } from "./User";

export interface IFloodGateClient {
  IsReady(): boolean;
  FetchValue(key: string, defaultValue: any, callback: (value: any) => void, user?: IUser): any;
  GetValue(key: string, defaultValue: any, user?: IUser): any;
}

export class FloodGateClient extends EventEmitter implements IFloodGateClient {
  private isReady = false;

  config: IAutoUpdateConfig;
  service: AutoUpdateService;
  user?: IUser;

  constructor(_config: IAutoUpdateConfig) {
    super();

    const self = this;
    
    this.config = _config;

    if (_config && _config instanceof AutoUpdateConfig) {
      this.service = new AutoUpdateService(_config);
      this.config.logger.Log(`Setting service to AutoUpdateService`);
    }
    // elseif additional services...

    else {
      throw new Error("Invalid service");
    }

    this.service.on('ready', function() {
      self.isReady = true;

      self.config.logger.Log(`FloodGateClient() Ready`);

      self.emit(Const.EVENT_SDK_READY);
    }).Start();
  }

  public IsReady() {
    return this.isReady;
  }

  /**
   * Return a value of the requested flag or the default value
   * Fetch data from remote server if not available in cache
   * @param {string} _key - Flag key
   * @param {string} _defaultValue - Default value to return to the client if no flag is found
   * @param callback - Client callback method
   * @param _user - User to evaluate against
   */
  FetchValue(_key: string, _defaultValue: any, callback: (value: any) => void, _user?: IUser): any {
    this.user = _user;
    
    try {
      this.service.GetFlags((value) => {
        if (value) {
          const evaluator = new Evaluator(this.config.logger);
          const result = evaluator.Evaluate(_key, value, _defaultValue, _user);

          // Return flag value to caller
          callback(result);
        }
        else {
          callback(_defaultValue);
        }
      });
    }
    catch (error) {
      callback(_defaultValue);
    }
  }

  /**
   * Return a value of the requested flag or the default value.
   * 
   * This method does not use callbacks, if the value is not present in the cache then the
   * default value is returned or if the client is not ready an error is thrown.
   * @param {string} _key - Flag key
   * @param {string} _defaultValue - Default value to return to the client if no flag is found
   * @param _user - User to evaluate against
   */
  GetValue(_key: string, _defaultValue: any, _user?: IUser): any {

    if (!this.isReady) {
      throw "Client is not ready! Try using FetchValue()";
    }

    this.user = _user;
    
    try {
      const flags: any = this.service.GetFlagsLocal();
      
      if (flags) {
        const evaluator = new Evaluator(this.config.logger);
        
        const result = evaluator.Evaluate(_key, flags, _defaultValue, _user);
        
        return result;
      }
      return _defaultValue;
    }
    catch (error) {
      return _defaultValue;
    }
  }
}