import * as EventEmitter from "events";

import ConfigInterface from "./interfaces/ConfigInterface";
import ProducerMessageInterface from "./interfaces/ProducerMessageInterface";

import Consumer from "./Consumer";
import Producer from "./Producer";

/**
 * Initially connect to consumer and producer
 */
export default class Connector extends EventEmitter {
  private consumer?: Consumer;
  private producer?: Producer;

  constructor(private config: ConfigInterface) {
    super();

    this.publish = this.publish.bind(this);
  }

  public setup(): void {
    this.handleInfo("Connecting...");

    this.consumer = new Consumer(this.publish, this.config);
    this.producer = new Producer(this.config);

    this.consumer.on("info", this.handleInfo.bind(this));
    this.consumer.on("error", this.handleError.bind(this));
    this.producer.on("info", this.handleInfo.bind(this));
    this.producer.on("error", this.handleError.bind(this));
  }

  public async start(): Promise<void> {
    if (this.producer) {
      await this.producer.connect();
    }

    if (this.consumer) {
      await this.consumer.connect();
    }
  }

  private async publish(key: string, message: ProducerMessageInterface): Promise<void> {
    if (this.producer) {
      await this.producer.produce(key, message);
    }
  }

  private handleError(error: Error): void {
    super.emit("error", error);
  }

  private handleInfo(info: any): void {
    super.emit("info", info);
  }
}
