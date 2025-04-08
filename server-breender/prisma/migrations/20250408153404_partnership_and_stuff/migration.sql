-- CreateEnum
CREATE TYPE "PartnershipStatus" AS ENUM ('PENDING', 'ACCEPTED', 'REJECTED');

-- DropForeignKey
ALTER TABLE "user_profiles" DROP CONSTRAINT "user_profiles_user_id_fkey";

-- AlterTable
ALTER TABLE "animal_records" ADD COLUMN     "details" JSONB;

-- CreateTable
CREATE TABLE "owner_partnerships" (
    "id" TEXT NOT NULL,
    "requester_id" TEXT NOT NULL,
    "recipient_id" TEXT NOT NULL,
    "status" "PartnershipStatus" NOT NULL DEFAULT 'PENDING',
    "requested_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "responded_at" TIMESTAMP(3),

    CONSTRAINT "owner_partnerships_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "animal_record_photos" (
    "id" TEXT NOT NULL,
    "record_id" TEXT NOT NULL,
    "photo_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "animal_record_photos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "animal_record_documents" (
    "id" TEXT NOT NULL,
    "record_id" TEXT NOT NULL,
    "document_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "animal_record_documents_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "owner_partnerships_requester_id_recipient_id_key" ON "owner_partnerships"("requester_id", "recipient_id");

-- CreateIndex
CREATE UNIQUE INDEX "animal_record_photos_record_id_photo_id_key" ON "animal_record_photos"("record_id", "photo_id");

-- CreateIndex
CREATE UNIQUE INDEX "animal_record_documents_record_id_document_id_key" ON "animal_record_documents"("record_id", "document_id");

-- AddForeignKey
ALTER TABLE "owner_partnerships" ADD CONSTRAINT "owner_partnerships_requester_id_fkey" FOREIGN KEY ("requester_id") REFERENCES "owners"("owner_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "owner_partnerships" ADD CONSTRAINT "owner_partnerships_recipient_id_fkey" FOREIGN KEY ("recipient_id") REFERENCES "owners"("owner_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_profiles" ADD CONSTRAINT "user_profiles_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("user_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "animal_record_photos" ADD CONSTRAINT "animal_record_photos_record_id_fkey" FOREIGN KEY ("record_id") REFERENCES "animal_records"("record_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "animal_record_photos" ADD CONSTRAINT "animal_record_photos_photo_id_fkey" FOREIGN KEY ("photo_id") REFERENCES "animal_photos"("photo_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "animal_record_documents" ADD CONSTRAINT "animal_record_documents_record_id_fkey" FOREIGN KEY ("record_id") REFERENCES "animal_records"("record_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "animal_record_documents" ADD CONSTRAINT "animal_record_documents_document_id_fkey" FOREIGN KEY ("document_id") REFERENCES "animal_documents"("document_id") ON DELETE CASCADE ON UPDATE CASCADE;
