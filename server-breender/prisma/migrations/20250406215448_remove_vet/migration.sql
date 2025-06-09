/*
  Warnings:

  - The values [VET] on the enum `role` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the `animal_vets` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `vets` table. If the table is not empty, all the data it contains will be lost.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "role_new" AS ENUM ('OWNER', 'ADMIN');
ALTER TABLE "users" ALTER COLUMN "role" DROP DEFAULT;
ALTER TABLE "users" ALTER COLUMN "role" TYPE "role_new" USING ("role"::text::"role_new");
ALTER TYPE "role" RENAME TO "role_old";
ALTER TYPE "role_new" RENAME TO "role";
DROP TYPE "role_old";
ALTER TABLE "users" ALTER COLUMN "role" SET DEFAULT 'OWNER';
COMMIT;

-- DropForeignKey
ALTER TABLE "animal_vets" DROP CONSTRAINT "animal_vets_animal_id_fkey";

-- DropForeignKey
ALTER TABLE "animal_vets" DROP CONSTRAINT "animal_vets_vet_id_fkey";

-- DropForeignKey
ALTER TABLE "vets" DROP CONSTRAINT "vets_user_id_fkey";

-- DropTable
DROP TABLE "animal_vets";

-- DropTable
DROP TABLE "vets";
