import Notification from '../models/notification.js';

export const saveNotification = async (notificationData) => {
  const notification = new Notification(notificationData);
  return await notification.save();
};
