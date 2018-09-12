import * as EventEmitter from "events";
import { NConsumer as SinekConsumer } from "sinek";

import ConfigInterface from "./interfaces/ConfigInterface";
import ConsumerContentInterface from "./interfaces/ConsumerContentInterface";
import ConsumerMessageInterface from "./interfaces/ConsumerMessageInterface";
import ProducerMessageInterface from "./interfaces/ProducerMessageInterface";

export default class Consumer extends EventEmitter {
  private consumer: SinekConsumer;

  constructor(
    private publish: (key: string, message: ProducerMessageInterface) => void,
    private config: ConfigInterface,
  ) {
    super();

    const { consumeFrom } = config;

    this.consumer = new SinekConsumer(consumeFrom, config);

    this.consume = this.consume.bind(this);
    this.handleError = this.handleError.bind(this);

    if (process.env.DEBUG === "*") {
      super.emit("info", "setup consumer done");
    }
  }

  /**
   * Initially connect to Consumer
   */
  public async connect(): Promise<void> {
    try {
      await this.consumer.connect();

      super.emit("info", "Connected consumer");
    } catch (error) {
      this.handleError(error);
    }

    // Consume as JSON with callback
    try {
      await this.consumer.consume(
        this.consume,
        true,
        true,
        this.config.consumerOptions,
      ).catch((error) => this.handleError(error));
    } catch (error) {
      this.handleError(error);
    }

    this.consumer.on("error", this.handleError);
  }

  /**
   * Handle consuming messages
   */
  private async consume(
    message: ConsumerMessageInterface,
    callback: (error: Error | null) => void,
  ): Promise<void> {
    let error: Error | null;

    try {
      await this.handleMessage(message);

      error = null;
    } catch (producedError) {
      this.handleError(producedError);

      error = producedError;
    }

    // Return this callback to receive further messages
    try {
      callback(error);
    } catch (error) {
      this.handleError(error);
    }
  }

  /**
   * Handle newly created messages
   */
  private async handleMessage(message: ConsumerMessageInterface) {
    const messageContent: ConsumerContentInterface = this.parseMessage(message);

    // Publish messages via Connector
    try {
      const content = await this.config.transformer(messageContent);

      await this.publish(message.key, {
        content,
        url: messageContent.url,
      });
    } catch (err) {
      this.handleError(err);
    }
  }

  /**
   * Parse a message from Kafka and turn it into an object
   */
  private parseMessage(message: ConsumerMessageInterface): ConsumerContentInterface {
    return {
      content: message.value.content,
      url: message.value.url,
    };
  }

  /**
   * If there is an error, please report it
   */
  private handleError(error: Error) {
    super.emit("error", error);
  }
}
