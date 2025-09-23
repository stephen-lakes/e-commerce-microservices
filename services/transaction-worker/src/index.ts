import mongoose from "mongoose";
import Transaction, { ITransaction } from "./models/Transaction";
import { connectRabbitMQ } from "./rabbitmq";

const RABBIT_URL = process.env.RABBITMQ_URL || `amqp://localhost`;
const QUEUE = `transactions`;
const MONGO_URI = process.env.MONGO_URI || `mongodb://mongo:27017/ecom`;

async function startWorker(): Promise<void> {
  try {
    await mongoose.connect(MONGO_URI);
    console.log(`MongoDB connected => transaction-worker`);

    const channel = await connectRabbitMQ(RABBIT_URL);
    await channel.assertQueue(QUEUE, { durable: true });
    console.log(`Listening for messages in queue: ${QUEUE}`);

    // Consume messages
    channel.consume(
      QUEUE,
      async (msg: any) => {
        if (!msg) return;

        try {
          const data: Partial<ITransaction> = JSON.parse(
            msg.content.toString()
          );
          console.log(`Received transaction:`, data);

          const transaction = new Transaction(data);
          await transaction.save();

          console.log(`Transaction saved:`, transaction._id.toString());
          channel.ack(msg);
        } catch (err) {
          console.error(`Failed to process message:`, err);
          channel.nack(msg, false, true);
        }
      },
      { noAck: false }
    );
  } catch (error) {
    console.log(`Worker startup error:`, error);
    process.exit(1);
  }
}

startWorker();
