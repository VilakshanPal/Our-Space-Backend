/*
  Warnings:

  - You are about to drop the column `user1Id` on the `Connection` table. All the data in the column will be lost.
  - You are about to drop the column `user2Id` on the `Connection` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[senderId,receiverId]` on the table `ConnectionRequest` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `updatedAt` to the `Connection` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `ConnectionRequest` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Connection" DROP CONSTRAINT "Connection_user1Id_fkey";

-- DropForeignKey
ALTER TABLE "Connection" DROP CONSTRAINT "Connection_user2Id_fkey";

-- DropIndex
DROP INDEX "Connection_user1Id_key";

-- DropIndex
DROP INDEX "Connection_user2Id_key";

-- AlterTable
ALTER TABLE "Connection" DROP COLUMN "user1Id",
DROP COLUMN "user2Id",
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "ConnectionRequest" ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "connectionId" INTEGER;

-- CreateTable
CREATE TABLE "DayBook" (
    "id" TEXT NOT NULL,
    "connectionId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "DayBook_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Moment" (
    "id" TEXT NOT NULL,
    "dayBookId" TEXT NOT NULL,
    "authorId" INTEGER NOT NULL,
    "imgUrl" TEXT,
    "textMessage" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Moment_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "DayBook_connectionId_key" ON "DayBook"("connectionId");

-- CreateIndex
CREATE UNIQUE INDEX "ConnectionRequest_senderId_receiverId_key" ON "ConnectionRequest"("senderId", "receiverId");

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_connectionId_fkey" FOREIGN KEY ("connectionId") REFERENCES "Connection"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DayBook" ADD CONSTRAINT "DayBook_connectionId_fkey" FOREIGN KEY ("connectionId") REFERENCES "Connection"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Moment" ADD CONSTRAINT "Moment_dayBookId_fkey" FOREIGN KEY ("dayBookId") REFERENCES "DayBook"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Moment" ADD CONSTRAINT "Moment_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
