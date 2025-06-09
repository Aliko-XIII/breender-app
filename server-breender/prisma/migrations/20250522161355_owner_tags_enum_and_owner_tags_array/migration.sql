/*
  Warnings:

  - The values [OTHER] on the enum `animal_tag` will be removed. If these variants are still used in the database, this will fail.

*/
-- CreateEnum
CREATE TYPE "owner_tag" AS ENUM ('RESPONSIBLE', 'EXPERIENCED', 'FRIENDLY', 'COMMUNICATIVE', 'CARING', 'ORGANIZED', 'TRUSTWORTHY', 'PATIENT', 'KNOWLEDGEABLE', 'ACTIVE', 'SUPPORTIVE', 'FLEXIBLE', 'DEDICATED', 'PUNCTUAL', 'EDUCATED', 'SOCIAL', 'CALM', 'ENTHUSIASTIC', 'ADAPTIVE', 'HELPFUL');

-- AlterEnum
BEGIN;
CREATE TYPE "animal_tag_new" AS ENUM ('FRIENDLY', 'AGGRESSIVE', 'PLAYFUL', 'SHY', 'ENERGETIC', 'CALM', 'INTELLIGENT', 'TRAINED', 'VOCAL', 'QUIET', 'CURIOUS', 'INDEPENDENT', 'SOCIAL', 'PROTECTIVE', 'AFFECTIONATE', 'HUNTER', 'LAZY');
ALTER TABLE "animals" ALTER COLUMN "tags" DROP DEFAULT;
ALTER TABLE "animals" ALTER COLUMN "tags" TYPE "animal_tag_new"[] USING ("tags"::text::"animal_tag_new"[]);
ALTER TYPE "animal_tag" RENAME TO "animal_tag_old";
ALTER TYPE "animal_tag_new" RENAME TO "animal_tag";
DROP TYPE "animal_tag_old";
ALTER TABLE "animals" ALTER COLUMN "tags" SET DEFAULT ARRAY[]::"animal_tag"[];
COMMIT;

-- AlterTable
ALTER TABLE "owners" ADD COLUMN     "tags" "owner_tag"[] DEFAULT ARRAY[]::"owner_tag"[];
