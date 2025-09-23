import amqp, { Channel, Connection } from "amqplib";

let connection: Connection | null = null;
let channel: Channel | null = null;

export const connectRabbitMQ = async (url: string): Promise<Channel> => {
  connection = await amqp.connect(url);
  channel = await connection.createChannel();

  connection.on(`close`, () => {
    console.error(` RabbitMQ connection closed`);
    process.exit(1);
  });

  connection.on(`error`, (error) => {
    console.error(`RabbitMQ error:`, error);
  });

  console.log(`RabbitMQ connected`);
  return channel;
};

/**
 * Get channel instance
 */
export const getChannel = (): Channel => {
  if (!channel) throw new Error("RabbitMQ channel not initialized");
  return channel;
};
