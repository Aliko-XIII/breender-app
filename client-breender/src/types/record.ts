import { AnimalRecordType } from './record-type.enum'; // Assuming you have this enum defined

export interface AnimalRecord {
  id: string;
  animalId: string;
  recordType: AnimalRecordType;
  name: string; // Added this field based on your CreateRecordForm context - ensure your API returns it!
  description?: string | null;
  createdAt: string; // API typically sends dates as ISO strings
  details?: any | null; // JSON can be represented as 'any' or a more specific union type if needed
  animal?: {
    id: string;
    name: string;
    breed?: string;
    species?: string;
  };
}