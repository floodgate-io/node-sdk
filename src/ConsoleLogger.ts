import ILogger from "./ILogger";

export default class ConsoleLogger implements ILogger
{
  private readonly logPrefix: string = "FloodgateSDK";

  public Log(message: string): void {
    console.log(`${this.logPrefix}: ${message}`);
  }
}