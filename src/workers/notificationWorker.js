// notification-workers.js
import amqp from 'amqplib/callback_api';
import Notification from '../models/notification.js';
import User from '../models/user.js';

amqp.connect('amqp://localhost', (error0, connection) => {
  if (error0) {
    console.error("Error connecting to RabbitMQ:", error0);
    return;
  }
  connection.createChannel((error1, channel) => {
    if (error1) {
      console.error("Error creating channel:", error1);
      return;
    }
    const queue = 'notifications';

    channel.assertQueue(queue, { durable: true });

    channel.consume(queue, async (msg) => {
      try {
        const { userId, type, message } = JSON.parse(msg.content.toString());
        const user = await User.findById(userId);
        if (!user) throw new Error(`User with ID ${userId} not found`);

        console.log(`Sending ${type} notification to ${user.email}: ${message}`);
        // Here you would integrate with an email/SMS service to send the notification.
        channel.ack(msg);
      } catch (error) {
        console.error("Error processing message:", error);
        channel.nack(msg, false, true); // Requeue the message
      }
    }, { noAck: false });
  });
});
