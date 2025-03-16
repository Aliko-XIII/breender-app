/*
  Warnings:

  - The `status` column on the `animal_vets` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - Added the required column `latitude` to the `animals` table without a default value. This is not possible if the table is not empty.
  - Added the required column `longitude` to the `animals` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "status" AS ENUM ('ACTIVE', 'PENDING', 'REVOKED');

-- CreateEnum
CREATE TYPE "PermissionType" AS ENUM ('VIEW', 'EDIT', 'MANAGE');

-- CreateEnum
CREATE TYPE "record_type" AS ENUM ('CHECKUP', 'SURGERY', 'DIAGNOSIS', 'PRESCRIPTION', 'MEDICATION', 'VACCINATION', 'DEWORMING', 'DEFLEAING', 'BATHING', 'GROOMING', 'NAILS', 'INJURY', 'TEMPERATURE', 'ILLNESS', 'BEHAVIOR', 'SLEEPING', 'FECES', 'URINE', 'VOMIT', 'WEIGHT', 'FOOD', 'WATER', 'HEAT', 'MATING', 'PREGNANCY', 'BIRTH', 'ESTROUS', 'SELLING', 'BUYING', 'NOTES', 'OTHER');

-- CreateEnum
CREATE TYPE "reminder_type" AS ENUM ('CHECKUP', 'SURGERY', 'MEDICATION', 'VACCINATION', 'DEWORMING', 'DEFLEAING', 'BATHING', 'GROOMING', 'NAILS', 'TEMPERATURE', 'WEIGHT', 'FOOD', 'WATER', 'MATING', 'PREGNANCY', 'BIRTH', 'SELLING', 'BUYING', 'OTHER');

-- DropForeignKey
ALTER TABLE "animals" DROP CONSTRAINT "animals_owner_id_fkey";

-- AlterTable
ALTER TABLE "animal_vets" DROP COLUMN "status",
ADD COLUMN     "status" "status" NOT NULL DEFAULT 'PENDING';

-- AlterTable
ALTER TABLE "animals" ADD COLUMN     "latitude" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "longitude" DOUBLE PRECISION NOT NULL;

-- AlterTable
ALTER TABLE "user_profiles" ADD COLUMN     "phone_number" TEXT;

-- CreateTable
CREATE TABLE "animal_owners" (
    "id" TEXT NOT NULL,
    "animalId" TEXT NOT NULL,
    "ownerId" TEXT NOT NULL,

    CONSTRAINT "animal_owners_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "animal_permissions" (
    "id" TEXT NOT NULL,
    "animal_id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "permission_type" "PermissionType" NOT NULL,
    "granted_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "animal_permissions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "animal_records" (
    "record_id" TEXT NOT NULL,
    "animal_id" TEXT NOT NULL,
    "record_type" "record_type" NOT NULL,
    "description" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "animal_records_pkey" PRIMARY KEY ("record_id")
);

-- CreateTable
CREATE TABLE "reminders" (
    "reminder_id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "animal_id" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "remind_at" TIMESTAMP(3) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "reminders_pkey" PRIMARY KEY ("reminder_id")
);

-- AddForeignKey
ALTER TABLE "animal_owners" ADD CONSTRAINT "animal_owners_animalId_fkey" FOREIGN KEY ("animalId") REFERENCES "animals"("animal_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "animal_owners" ADD CONSTRAINT "animal_owners_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "owners"("owner_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "animal_permissions" ADD CONSTRAINT "animal_permissions_animal_id_fkey" FOREIGN KEY ("animal_id") REFERENCES "animals"("animal_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "animal_permissions" ADD CONSTRAINT "animal_permissions_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("user_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "animal_records" ADD CONSTRAINT "animal_records_animal_id_fkey" FOREIGN KEY ("animal_id") REFERENCES "animals"("animal_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reminders" ADD CONSTRAINT "reminders_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("user_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reminders" ADD CONSTRAINT "reminders_animal_id_fkey" FOREIGN KEY ("animal_id") REFERENCES "animals"("animal_id") ON DELETE CASCADE ON UPDATE CASCADE;
