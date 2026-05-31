/*
  Warnings:

  - You are about to drop the `momentReply` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "momentReply" DROP CONSTRAINT "momentReply_authorId_fkey";

-- DropForeignKey
ALTER TABLE "momentReply" DROP CONSTRAINT "momentReply_momentId_fkey";

-- DropTable
DROP TABLE "momentReply";

-- CreateTable
CREATE TABLE "MomentReply" (
    "id" TEXT NOT NULL,
    "replyText" TEXT NOT NULL,
    "momentId" TEXT NOT NULL,
    "authorId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "MomentReply_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "MomentReply" ADD CONSTRAINT "MomentReply_momentId_fkey" FOREIGN KEY ("momentId") REFERENCES "Moment"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MomentReply" ADD CONSTRAINT "MomentReply_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
