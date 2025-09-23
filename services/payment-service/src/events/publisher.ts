import { getRabbitMQChannel } from "../config/rabbitmq";
import { publishEventOption } from "../interfaces/publisher";

export const publishEvent = async ({ queue, data }: publishEventOption) => {
  try {
    const channel = getRabbitMQChannel();
    await channel.assertQueue(queue, { durable: true });
    const success = channel.sendToQueue(
      queue,
      Buffer.from(JSON.stringify(data)),
      {
        persistent: true,
      }
    );

    if (success) console.log(`Message sent to queue ${queue}`);
    else console.log(`Failed to publish to queue ${queue}`);
  } catch (error) {
    console.log(`Error publishing event to queue "${queue}" `, error);
  }
};
