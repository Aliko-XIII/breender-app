import { ReminderType } from './reminder-type.enum';

export interface AnimalReminder {
  id: string;
  animalId: string;
  reminderType: ReminderType;
  message?: string | null;
  remindAt: string;
  createdAt: string;
}
