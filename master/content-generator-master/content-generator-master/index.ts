import * as merge from "lodash/merge";

import ConfigInterface from "./lib/interfaces/ConfigInterface";
import ProducerMessageInterface from "./lib/interfaces/ProducerMessageInterface";

import Connector from "./lib/Connector";

const defaultOptions = {
  "batch.num.messages": 1000000,
  "compression.codec": "snappy",
  "consumeWithBackpressure": true,
  "dr_cb": true,
  "event_cb": true,
  "kafkaHost": "127.0.0.1:9092",
  "message.send.max.retries": 10,
  "options": {
    ackTimeoutMs: 100,
    autoCommit: true,
    autoCommitIntervalMs: 1000,
    fetchMaxBytes: 1024 * 1024,
    fetchMaxWaitMs: 10,
    fetchMinBytes: 1,
    fromOffset: "earliest",
    heartbeatInterval: 250,
    partitionerType: 3,
    protocol: ["roundrobin"],
    requireAcks: 1,
    retryMinTimeout: 250,
    sessionTimeout: 8000,
    ssl: false,
  },
  "produceFlushEveryMs": 1000,
  "producerPartitionCount": 1,
  "queue.buffering.max.messages": 100000,
  "queue.buffering.max.ms": 1000,
  "retry.backoff.ms": 200,
  "socket.keepalive.enable": true,
  "workerPerPartition": 1,

  "getPath": (message: ProducerMessageInterface): string => message.url,
};

export default (options: ConfigInterface) => {
  const config: ConfigInterface = merge(defaultOptions, options);

  return new Connector(config);
};
