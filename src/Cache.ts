import NodeCache from 'node-cache';

export interface ICache {
  Get(key: string): any;

  Set(key: string, value: any): void;
}

export class NodejsCache implements ICache {
  
  cache: NodeCache.NodeCache;

  constructor(ttl?: number) {
    this.cache = new NodeCache();
  }

  Get(key: string): any {
    const value = this.cache.get(key);
    if ( value == undefined ){
      return;
    }
    return value;
  }
  
  Set(key: string, value: string): void {
    const success = this.cache.set(key, value, 10000);
  }
}

export class InMemoryCache implements ICache {
  cache: { [key: string] : string; } = {};

  Get(key: string): any {
    console.log(`Get ${key}`);
    return this.cache[key];
  }
  
  Set(key: string, value: string): void {
    console.log(`Set ${key}`);
    this.cache[key] = value;
  }
}

export class LocalStorageCache implements ICache {
  Get(key: string): any {
    if (localStorage.getItem(key) !== null) {
      // @ts-ignore <ts(2322)>
      const value:string = localStorage.getItem(key);
      const result = JSON.parse(value);
      return result;
    }
    return;
  }
  
  Set(key: string, value: any): void {
    const encoded = JSON.stringify(value);
    localStorage.setItem(key, encoded);
  }
}