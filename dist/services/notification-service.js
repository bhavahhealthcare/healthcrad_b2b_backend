import { saveNotification } from '../repository/notification-repository.js';
import { publishToQueue } from '../utils/notification.utils.js';
export const sendNotification = async (userId, type, message) => {
  const notification = await saveNotification({
    userId,
    type,
    message
  });
  publishToQueue(notification);
};