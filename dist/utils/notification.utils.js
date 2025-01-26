import amqp from 'amqplib/callback_api.js';
export const publishToQueue = notification => {
  amqp.connect('amqp://localhost', (error0, connection) => {
    if (error0) {
      console.error('Error connecting to RabbitMQ:', error0);
      return;
    }
    connection.createChannel((error1, channel) => {
      if (error1) {
        console.error('Error creating channel:', error1);
        connection.close();
        return;
      }
      const queue = 'notifications';
      const msg = JSON.stringify(notification);
      channel.assertQueue(queue, {
        durable: false
      }, (error2, ok) => {
        if (error2) {
          console.error('Error asserting queue:', error2);
          channel.close();
          connection.close();
          return;
        }
        channel.sendToQueue(queue, Buffer.from(msg), {}, (error3, ok) => {
          if (error3) {
            console.error('Error sending message to queue:', error3);
          } else {
            console.log(' [x] Sent %s', msg);
          }
          channel.close();
          connection.close();
        });
      });
    });
  });
};