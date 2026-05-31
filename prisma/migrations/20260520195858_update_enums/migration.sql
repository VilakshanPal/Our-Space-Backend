/*
  Warnings:

  - The values [PENDING,ACCEPTED,REJECTED] on the enum `ConnectionRequestStatus` will be removed. If these variants are still used in the database, this will fail.
  - The values [ACTIVE,DISCONNECTED,BLOCKED] on the enum `ConnectionStatus` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "ConnectionRequestStatus_new" AS ENUM ('pending', 'accepted', 'rejected');
ALTER TABLE "public"."ConnectionRequest" ALTER COLUMN "connectionStatus" DROP DEFAULT;
ALTER TABLE "ConnectionRequest" ALTER COLUMN "connectionStatus" TYPE "ConnectionRequestStatus_new" USING ("connectionStatus"::text::"ConnectionRequestStatus_new");
ALTER TYPE "ConnectionRequestStatus" RENAME TO "ConnectionRequestStatus_old";
ALTER TYPE "ConnectionRequestStatus_new" RENAME TO "ConnectionRequestStatus";
DROP TYPE "public"."ConnectionRequestStatus_old";
ALTER TABLE "ConnectionRequest" ALTER COLUMN "connectionStatus" SET DEFAULT 'pending';
COMMIT;

-- AlterEnum
BEGIN;
CREATE TYPE "ConnectionStatus_new" AS ENUM ('active', 'disconnected', 'blocked');
ALTER TABLE "public"."Connection" ALTER COLUMN "status" DROP DEFAULT;
ALTER TABLE "Connection" ALTER COLUMN "status" TYPE "ConnectionStatus_new" USING ("status"::text::"ConnectionStatus_new");
ALTER TYPE "ConnectionStatus" RENAME TO "ConnectionStatus_old";
ALTER TYPE "ConnectionStatus_new" RENAME TO "ConnectionStatus";
DROP TYPE "public"."ConnectionStatus_old";
ALTER TABLE "Connection" ALTER COLUMN "status" SET DEFAULT 'active';
COMMIT;

-- AlterTable
ALTER TABLE "Connection" ALTER COLUMN "status" SET DEFAULT 'active';

-- AlterTable
ALTER TABLE "ConnectionRequest" ALTER COLUMN "connectionStatus" SET DEFAULT 'pending';
