-- CreateTable
CREATE TABLE "Connection" (
    "id" SERIAL NOT NULL,
    "user1Id" INTEGER NOT NULL,
    "user2Id" INTEGER NOT NULL,
    "connectedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "status" "ConnectionStatus" NOT NULL DEFAULT 'ACTIVE',

    CONSTRAINT "Connection_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Connection_user1Id_key" ON "Connection"("user1Id");

-- CreateIndex
CREATE UNIQUE INDEX "Connection_user2Id_key" ON "Connection"("user2Id");

-- AddForeignKey
ALTER TABLE "Connection" ADD CONSTRAINT "Connection_user1Id_fkey" FOREIGN KEY ("user1Id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Connection" ADD CONSTRAINT "Connection_user2Id_fkey" FOREIGN KEY ("user2Id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
