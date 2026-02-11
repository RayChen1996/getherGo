export type InboxItemType = "reminder" | "system";

export interface InboxItem {
  id: string;
  title: string;
  body: string;
  createdAt: number;
  read: boolean;
  type: InboxItemType;
  eventId?: string;
}

export interface NotificationSettings {
  enabled: boolean;
  /** 收藏活動後自動建立提醒 */
  autoScheduleOnFavorite: boolean;

  /** 報名提醒：在活動開始前 N 天 */
  signupReminderEnabled: boolean;
  signupLeadDays: number;

  /** 活動前一天提醒：在活動開始前 1 天的指定小時 */
  dayBeforeEnabled: boolean;
  dayBeforeHour: number;

  /** 活動前 X 分鐘提醒 */
  minutesBeforeEnabled: boolean;
  minutesBefore: number;
}

export const defaultNotificationSettings: NotificationSettings = {
  enabled: true,
  autoScheduleOnFavorite: true,
  signupReminderEnabled: true,
  signupLeadDays: 7,
  dayBeforeEnabled: true,
  dayBeforeHour: 9,
  minutesBeforeEnabled: true,
  minutesBefore: 60,
};
