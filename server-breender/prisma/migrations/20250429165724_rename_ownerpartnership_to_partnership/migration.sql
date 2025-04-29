/*
  Warnings:

  - You are about to drop the `owner_partnerships` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "owner_partnerships" DROP CONSTRAINT "owner_partnerships_recipient_id_fkey";

-- DropForeignKey
ALTER TABLE "owner_partnerships" DROP CONSTRAINT "owner_partnerships_requester_id_fkey";

-- DropTable
DROP TABLE "owner_partnerships";

-- CreateTable
CREATE TABLE "partnerships" (
    "id" TEXT NOT NULL,
    "requester_animal_id" TEXT NOT NULL,
    "recipient_animal_id" TEXT NOT NULL,
    "status" "PartnershipStatus" NOT NULL DEFAULT 'PENDING',
    "requested_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "responded_at" TIMESTAMP(3),

    CONSTRAINT "partnerships_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "partnerships_requester_animal_id_recipient_animal_id_key" ON "partnerships"("requester_animal_id", "recipient_animal_id");

-- AddForeignKey
ALTER TABLE "partnerships" ADD CONSTRAINT "partnerships_requester_animal_id_fkey" FOREIGN KEY ("requester_animal_id") REFERENCES "animals"("animal_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "partnerships" ADD CONSTRAINT "partnerships_recipient_animal_id_fkey" FOREIGN KEY ("recipient_animal_id") REFERENCES "animals"("animal_id") ON DELETE CASCADE ON UPDATE CASCADE;
