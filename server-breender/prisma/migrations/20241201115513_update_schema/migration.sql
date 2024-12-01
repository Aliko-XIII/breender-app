/*
  Warnings:

  - The values [USER] on the enum `role` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "role_new" AS ENUM ('OWNER', 'VET', 'ADMIN');
ALTER TABLE "users" ALTER COLUMN "role" DROP DEFAULT;
ALTER TABLE "users" ALTER COLUMN "role" TYPE "role_new" USING ("role"::text::"role_new");
ALTER TYPE "role" RENAME TO "role_old";
ALTER TYPE "role_new" RENAME TO "role";
DROP TYPE "role_old";
ALTER TABLE "users" ALTER COLUMN "role" SET DEFAULT 'OWNER';
COMMIT;

-- DropForeignKey
ALTER TABLE "animals" DROP CONSTRAINT "animals_owner_id_fkey";

-- DropIndex
DROP INDEX "animals_owner_id_key";

-- AlterTable
ALTER TABLE "users" ALTER COLUMN "role" SET DEFAULT 'OWNER';

-- CreateTable
CREATE TABLE "owners" (
    "owner_id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,

    CONSTRAINT "owners_pkey" PRIMARY KEY ("owner_id")
);

-- CreateTable
CREATE TABLE "vets" (
    "vet_id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,

    CONSTRAINT "vets_pkey" PRIMARY KEY ("vet_id")
);

-- CreateTable
CREATE TABLE "animal_vets" (
    "assignment_id" TEXT NOT NULL,
    "animal_id" TEXT NOT NULL,
    "vet_id" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'active',
    "assigned_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "animal_vets_pkey" PRIMARY KEY ("assignment_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "owners_user_id_key" ON "owners"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "vets_user_id_key" ON "vets"("user_id");

-- AddForeignKey
ALTER TABLE "owners" ADD CONSTRAINT "owners_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("user_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "vets" ADD CONSTRAINT "vets_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("user_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "animals" ADD CONSTRAINT "animals_owner_id_fkey" FOREIGN KEY ("owner_id") REFERENCES "owners"("owner_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "animal_vets" ADD CONSTRAINT "animal_vets_animal_id_fkey" FOREIGN KEY ("animal_id") REFERENCES "animals"("animal_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "animal_vets" ADD CONSTRAINT "animal_vets_vet_id_fkey" FOREIGN KEY ("vet_id") REFERENCES "vets"("vet_id") ON DELETE CASCADE ON UPDATE CASCADE;
