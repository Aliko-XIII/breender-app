import { ReminderType } from './reminder-type.enum';

export interface AnimalReminder {
  id: string;
  animalId: string;
  reminderType: ReminderType;
  message?: string | null;
  remindAt: string;
  createdAt: string;
  animal?: {
    id: string;
    name: string;
    breed?: string;
    species?: string;
  };
}
