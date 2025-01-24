import { sendNotification } from '../services/notification-service.js';

export const notifyUser = async (req, res) => {
  const { userId, message } = req.body;
  try {
    await sendNotification(userId, 'Custom Notification', message);
    res.status(200).send('Notification sent successfully');
  } catch (error) {
    res.status(500).send('Error sending notification');
  }
};
