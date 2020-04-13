import NodeCache from 'node-cache';
import ILogger from "./ILogger";

export interface ICache {
  Get(key: string): any;

  Set(key: string, value: any): void;
}

export class NodejsCache implements ICache {
  
  cache: NodeCache.NodeCache;

  constructor() {
    // console.log(`NodejsCache`);
    this.cache = new NodeCache();
  }

  Get(key: string): any {
    // console.log(`NodejsCache Get()`);

    const value = this.cache.get(key);
    if ( value == undefined ){
      return;
    }
    return value;
  }
  
  Set(key: string, value: string): void {
    // console.log(`NodejsCache Set()`);

    const success = this.cache.set(key, value, 10000);
  }
}

export class InMemoryCache implements ICache {
  cache: { [key: string] : string; } = {};

  constructor() {
    // console.log(`InMemoryCache`);
  }

  Get(key: string): any {
    // console.log(`InMemoryCache Set()`);

    return this.cache[key];
  }
  
  Set(key: string, value: string): void {
    // console.log(`InMemoryCache Set()`);

    this.cache[key] = value;
  }
}

export class LocalStorageCache implements ICache {
  constructor() {
    // console.log(`LocalStorageCache`);
  }

  Get(key: string): any {
    // console.log(`LocalStorageCache Set()`);

    if (localStorage.getItem(key) !== null) {
      // @ts-ignore <ts(2322)>
      const value:string = localStorage.getItem(key);
      const result = JSON.parse(value);
      return result;
    }
    return;
  }
  
  Set(key: string, value: any): void {
    // console.log(`LocalStorageCache Set()`);

    const encoded = JSON.stringify(value);
    localStorage.setItem(key, encoded);
  }
}