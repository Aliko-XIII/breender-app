/*
  Warnings:

  - Added the required column `reminder_type` to the `reminders` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "reminders" ADD COLUMN     "reminder_type" "reminder_type" NOT NULL;
