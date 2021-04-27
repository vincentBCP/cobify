import { v4 as uuidv4 } from 'uuid';

import NotificationDTO from '../models/dto/NotificationDTO';
import Notification from '../models/types/Notification';

import API from './API';

class NotificationAPI extends API<Notification> {
    constructor() {
        super("notifications");
    }

    public getNotifications(): Promise<Notification[]> {
        return super.getRecords();
    };

    public createNotification(dto: NotificationDTO): Promise<Notification> {
        const notificationID = uuidv4();

        const d: any = {...dto};

        const newNotification: Notification = {
            id: notificationID,
            ...d
        }

        return super.create(notificationID, newNotification);
    };

    public updateNotification(notification: Notification): Promise<Notification> {
        return super.update(notification.id, notification);
    }

    public deleteNotification(id: string): Promise<string> {
        return super.delete(id);
    };
};

export default new NotificationAPI();