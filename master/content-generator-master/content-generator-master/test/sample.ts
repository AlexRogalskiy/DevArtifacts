import ContentGenerator from "../";
import ConsumerContentInterface from "../lib/interfaces/ConsumerContentInterface";

(async () => {
  try {
    const generator = ContentGenerator({
      clientName: "generator-client",
      consumeFrom: "generator-consume",
      groupId: "generator-group2",
      produceTo: "produce-topic",
      transformer: async (message: ConsumerContentInterface) => await message.content,
    });

    // tslint:disable-next-line
    generator.on("info", (message) => console.log("info", message));
    // tslint:disable-next-line
    generator.on("error", (message) => console.error("error", message));

    generator.setup();
    await generator.start();

  } catch (error) {
    // tslint:disable-next-line
    console.error(error);
  }
})();
