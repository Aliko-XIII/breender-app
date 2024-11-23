/*
  Warnings:

  - The `role` column on the `users` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - Added the required column `animal_bio` to the `animals` table without a default value. This is not possible if the table is not empty.
  - Added the required column `animal_breed` to the `animals` table without a default value. This is not possible if the table is not empty.
  - Added the required column `animal_sex` to the `animals` table without a default value. This is not possible if the table is not empty.
  - Added the required column `animal_species` to the `animals` table without a default value. This is not possible if the table is not empty.
  - Added the required column `date_of_birth` to the `animals` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "role" AS ENUM ('USER', 'OWNER', 'VET', 'ADMIN');

-- DropForeignKey
ALTER TABLE "animals" DROP CONSTRAINT "animals_owner_id_fkey";

-- DropForeignKey
ALTER TABLE "refresh_tokens" DROP CONSTRAINT "refresh_tokens_userId_fkey";

-- DropForeignKey
ALTER TABLE "user_profiles" DROP CONSTRAINT "user_profiles_user_id_fkey";

-- AlterTable
ALTER TABLE "animals" ADD COLUMN     "animal_bio" TEXT NOT NULL,
ADD COLUMN     "animal_breed" TEXT NOT NULL,
ADD COLUMN     "animal_sex" "sex" NOT NULL,
ADD COLUMN     "animal_species" TEXT NOT NULL,
ADD COLUMN     "date_of_birth" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "users" DROP COLUMN "role",
ADD COLUMN     "role" "role" NOT NULL DEFAULT 'USER';

-- DropEnum
DROP TYPE "Role";

-- CreateTable
CREATE TABLE "animal_photos" (
    "photo_id" TEXT NOT NULL,
    "animal_id" TEXT NOT NULL,
    "photo_url" TEXT NOT NULL,
    "uploaded_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "animal_photos_pkey" PRIMARY KEY ("photo_id")
);

-- CreateTable
CREATE TABLE "animal_documents" (
    "document_id" TEXT NOT NULL,
    "animal_id" TEXT NOT NULL,
    "document_name" TEXT,
    "document_url" TEXT NOT NULL,
    "uploaded_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "animal_documents_pkey" PRIMARY KEY ("document_id")
);

-- AddForeignKey
ALTER TABLE "user_profiles" ADD CONSTRAINT "user_profiles_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("user_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "refresh_tokens" ADD CONSTRAINT "refresh_tokens_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("user_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "animals" ADD CONSTRAINT "animals_owner_id_fkey" FOREIGN KEY ("owner_id") REFERENCES "users"("user_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "animal_photos" ADD CONSTRAINT "animal_photos_animal_id_fkey" FOREIGN KEY ("animal_id") REFERENCES "animals"("animal_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "animal_documents" ADD CONSTRAINT "animal_documents_animal_id_fkey" FOREIGN KEY ("animal_id") REFERENCES "animals"("animal_id") ON DELETE CASCADE ON UPDATE CASCADE;
