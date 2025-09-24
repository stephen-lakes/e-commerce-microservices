import amqp, { Channel } from "amqplib";

let channel: amqp.Channel;

export const connectRabbitMQ = async (url: string): Promise<Channel> => {
  if (!url) {
    console.error(`RabbitMQ connection string is not defined in .env file`);
    process.exit(1);
  }

  try {
    const connection = await amqp.connect(url);
    channel = await connection.createChannel();
    console.log(`RabbitMQ Connected`);
    return channel;
  } catch (error) {
    console.log(`RabbitMQ Connection Error: ${error}`);
    throw error;
  }
};

export const getRabbitMQChannel = () => {
  if (!channel) throw new Error(`RabbitMQ channel not initialized`);
  return channel;
};

export const closeRabbitMQConnection = async (): Promise<void> => {};
