export default interface ConsumerMessageInterface {
  topic: string;
  key: string;
  value: {
    content: string;
    url: string;
  };
}
