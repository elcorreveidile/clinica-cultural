-- CreateEnum
CREATE TYPE "ReservaEstado" AS ENUM ('confirmada', 'cancelada');

-- CreateTable
CREATE TABLE "reservas" (
    "id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "actividad_id" TEXT NOT NULL,
    "estado" "ReservaEstado" NOT NULL DEFAULT 'confirmada',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "reservas_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "reservas_user_id_idx" ON "reservas"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "reservas_user_id_actividad_id_key" ON "reservas"("user_id", "actividad_id");

-- AddForeignKey
ALTER TABLE "reservas" ADD CONSTRAINT "reservas_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
