# Content Generator

Consume HTML from Kafka messages, transform in any way, produce.

## Usage

Install via yarn

    yarn install @knamp/content-generator

Then configure it and use it

```javascript
import ContentGenerator from "@knamp/content-generator";

(async () => {
  const generator = ContentGenerator({
    clientName: "generator-client",
    consumeFrom: "generator-consume",
    groupId: "generator-group",
    produceTo: "produce-topic",
    tranformer: (transformThis: ConsumerContentInterface): Promise<string> => transformThis.content
  });

  generator.on("error", console.log)
  generator.on("info", console.log)

  generator.setup();
  await generator.start();
})();
```

## Uses

* [Sinek](https://github.com/nodefluent/node-sinek), consuming and producing messages to and from Apache Kafka

## License

This project is under [MIT](./LICENSE).
