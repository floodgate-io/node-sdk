import { EventEmitter } from "events";
import { ICache, InMemoryCache } from "./Cache";
import { IConfigBase } from "./ConfigBase";
import { ApiService } from "./ApiService";
import * as Types from "./Types";
import * as Consts from "./Consts";

export abstract class ServiceBase extends EventEmitter {
  protected config: IConfigBase;
  protected cache: ICache;

  constructor(_config: IConfigBase) {
    super();

    this.config = _config;

    this.cache = new InMemoryCache();
    if (_config.cache) {
      this.cache = _config.cache;
    }
  }

  /**
   * Fetch environment data from the server
   * Check if the data has been modified and if not return from cache
   * @param callback 
   */
  public FetchRemote(callback: (value: any) => void): void {
    const requestHeaders: Types.KeyValue<string, string>[] = [
      {
        key: "Accept",
        value: "application/json"
      },
      {
        key: "Content-Type",
        value: "application/json"
      },
      {
        key: "FloodGate-SDK-Agent",
        value: `js-v${Consts.SDK_VERSION}`
      }
    ];

    const api = new ApiService().setHeaders(requestHeaders);
  
    const url = this.config.buildUrl();

    const etagCacheKey = `${this.config.sdkKey}_${Consts.CACHE_ETAG}`;

    // Check to see if we have a current ETag
    let etag: string | null = this.cache.Get(etagCacheKey);
    if (etag) {
      api.setHeaders([{ key: "If-None-Match", value: `${etag}`}]);
    }

    // Check to see if we have a last modified
    // let lastModified: string | null = this.cache.Get("Last-Modified");

    api.get(url)
    .then((response) => {
      // if (response.status == 304) { // Read cache
      //   const json: any = this.cache.Get(this.config.sdkKey);
      //   callback(json);
      //   return;
      // }

      const responseHeaders = response.headers;

      etag = responseHeaders.get("ETag");
      if (typeof(etag) === "string") {
        etag = etag.replace(/['"]+/g, '');
      }
      
      // Check current etag vs cached etag, return cached data if matched
      if (etag == this.cache.Get(etagCacheKey)) {
        const json: any = this.cache.Get(this.config.sdkKey);
        callback(json);
        return;
      }

      this.cache.Set(etagCacheKey, etag);

      const json = response.parsedBody;

      if (this.validateJson(json)) {
        this.cache.Set(this.config.sdkKey, json);
        callback(json);
      }
    })
    .catch((error) => {
      // Return cache if available
      const json: any = this.cache.Get(this.config.sdkKey);

      if (json) {
        callback(json);
      }

      callback(null);
      // throw error;
    });
  }

  public FetchLocal() {
    // const etagCacheKey = `${this.config.sdkKey}_${Consts.CACHE_ETAG}`;

    const json: any = this.cache.Get(this.config.sdkKey);

    if (json) {
      return json;
    }

    return;
  }

  private validateJson(json: string): boolean {
    return true;
  }
}