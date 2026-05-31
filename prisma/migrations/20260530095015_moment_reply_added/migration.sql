-- CreateTable
CREATE TABLE "momentReply" (
    "id" TEXT NOT NULL,
    "replyText" TEXT NOT NULL,
    "momentId" TEXT NOT NULL,
    "authorId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "momentReply_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "momentReply" ADD CONSTRAINT "momentReply_momentId_fkey" FOREIGN KEY ("momentId") REFERENCES "Moment"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "momentReply" ADD CONSTRAINT "momentReply_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
