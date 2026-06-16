-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('patient', 'tutor_local', 'professor', 'admin');

-- CreateEnum
CREATE TYPE "LanguageLevel" AS ENUM ('A1', 'A2', 'B1', 'B2', 'C1', 'C2');

-- CreateEnum
CREATE TYPE "CardStatus" AS ENUM ('active', 'inactive', 'expired');

-- CreateEnum
CREATE TYPE "MentorshipStatus" AS ENUM ('pending', 'active', 'completed');

-- CreateEnum
CREATE TYPE "FarmaciaCategory" AS ENUM ('grammar', 'vocabulary', 'cultural', 'conversation', 'writing', 'audiovisual');

-- CreateEnum
CREATE TYPE "ContentType" AS ENUM ('video', 'text', 'exercise', 'interactive', 'podcast');

-- CreateEnum
CREATE TYPE "ResourceType" AS ENUM ('pill', 'ointment', 'syrup', 'injection');

-- CreateEnum
CREATE TYPE "PortfolioContentType" AS ENUM ('writing', 'audio', 'video', 'miniseries_episode', 'project');

-- CreateEnum
CREATE TYPE "Visibility" AS ENUM ('private', 'shared_with_professor', 'public');

-- CreateEnum
CREATE TYPE "ActivityType" AS ENUM ('ruta_tapas', 'museo', 'cine', 'teatro', 'taller', 'debate', 'safari_fotografico');

-- CreateEnum
CREATE TYPE "SessionStatus" AS ENUM ('scheduled', 'completed', 'cancelled');

-- CreateTable
CREATE TABLE "users" (
    "id" UUID NOT NULL,
    "email" TEXT NOT NULL,
    "full_name" TEXT,
    "role" "UserRole" NOT NULL DEFAULT 'patient',
    "date_of_birth" TIMESTAMP(3),
    "nationality" TEXT,
    "current_level" "LanguageLevel",
    "profile_picture_url" TEXT,
    "bio" TEXT,
    "phone" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "magic_link_tokens" (
    "id" UUID NOT NULL,
    "token_hash" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "user_id" UUID,
    "expires_at" TIMESTAMP(3) NOT NULL,
    "used_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "magic_link_tokens_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "sessions" (
    "id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "expires_at" TIMESTAMP(3) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "sessions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "diagnoses" (
    "id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "diagnosis_date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "grammar_score" INTEGER,
    "listening_comprehension_score" INTEGER,
    "reading_comprehension_score" INTEGER,
    "written_expression_score" INTEGER,
    "assessed_level" "LanguageLevel",
    "interview_notes" TEXT,
    "linguistic_strengths" TEXT,
    "linguistic_weaknesses" TEXT,
    "recommended_farmacias" JSONB,
    "initial_treatment_plan" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "completed_at" TIMESTAMP(3),

    CONSTRAINT "diagnoses_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "seguros_lc" (
    "id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "card_number" TEXT NOT NULL,
    "card_status" "CardStatus" NOT NULL DEFAULT 'active',
    "issued_date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expiry_date" TIMESTAMP(3),
    "qr_code_data" TEXT,
    "qr_code_image_url" TEXT,
    "linked_tutor_id" UUID,
    "mentorship_status" "MentorshipStatus",
    "mentorship_start_date" TIMESTAMP(3),
    "discounted_activities" JSONB,
    "mentoring_sessions_used" INTEGER NOT NULL DEFAULT 0,
    "mentoring_sessions_total" INTEGER NOT NULL DEFAULT 12,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "seguros_lc_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "farmacias" (
    "id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "category" "FarmaciaCategory",
    "target_level" "LanguageLevel",
    "icon_url" TEXT,
    "description" TEXT,
    "resources_count" INTEGER,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "farmacias_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "recursos" (
    "id" UUID NOT NULL,
    "farmacia_id" UUID NOT NULL,
    "title" TEXT NOT NULL,
    "content_type" "ContentType",
    "resource_type" "ResourceType",
    "content_url" TEXT,
    "description" TEXT,
    "duration_minutes" INTEGER,
    "difficulty_level" "LanguageLevel",
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "recursos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "portafolio" (
    "id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "content_type" "PortfolioContentType" NOT NULL,
    "file_url" TEXT,
    "thumbnail_url" TEXT,
    "duration_minutes" INTEGER,
    "visibility" "Visibility" NOT NULL DEFAULT 'private',
    "professor_feedback" TEXT,
    "professor_feedback_date" TIMESTAMP(3),
    "version_number" INTEGER NOT NULL DEFAULT 1,
    "previous_version_id" UUID,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "portafolio_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "actividades_culturales" (
    "id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "type" "ActivityType",
    "description" TEXT,
    "location" TEXT,
    "date_time" TIMESTAMP(3),
    "duration_minutes" INTEGER,
    "max_participants" INTEGER,
    "current_participants" INTEGER NOT NULL DEFAULT 0,
    "price_euros" DECIMAL(10,2),
    "seguro_lc_discount_percent" INTEGER NOT NULL DEFAULT 20,
    "language_level_target" TEXT,
    "image_url" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "actividades_culturales_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "chat_linea_emergencia" (
    "id" UUID NOT NULL,
    "user_id" UUID,
    "conversation_id" UUID NOT NULL,
    "user_message" TEXT NOT NULL,
    "ai_response" TEXT NOT NULL,
    "language_level_context" "LanguageLevel",
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "chat_linea_emergencia_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "sesiones_tutoria" (
    "id" UUID NOT NULL,
    "seguro_lc_id" UUID,
    "tutor_id" UUID,
    "patient_id" UUID,
    "scheduled_date" TIMESTAMP(3),
    "actual_date" TIMESTAMP(3),
    "duration_minutes" INTEGER NOT NULL DEFAULT 60,
    "notes" TEXT,
    "status" "SessionStatus" DEFAULT 'scheduled',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "sesiones_tutoria_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "magic_link_tokens_token_hash_key" ON "magic_link_tokens"("token_hash");

-- CreateIndex
CREATE INDEX "magic_link_tokens_email_idx" ON "magic_link_tokens"("email");

-- CreateIndex
CREATE INDEX "sessions_user_id_idx" ON "sessions"("user_id");

-- CreateIndex
CREATE INDEX "diagnoses_user_id_idx" ON "diagnoses"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "seguros_lc_user_id_key" ON "seguros_lc"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "seguros_lc_card_number_key" ON "seguros_lc"("card_number");

-- CreateIndex
CREATE INDEX "recursos_farmacia_id_idx" ON "recursos"("farmacia_id");

-- CreateIndex
CREATE INDEX "portafolio_user_id_idx" ON "portafolio"("user_id");

-- CreateIndex
CREATE INDEX "chat_linea_emergencia_user_id_idx" ON "chat_linea_emergencia"("user_id");

-- CreateIndex
CREATE INDEX "chat_linea_emergencia_conversation_id_idx" ON "chat_linea_emergencia"("conversation_id");

-- AddForeignKey
ALTER TABLE "magic_link_tokens" ADD CONSTRAINT "magic_link_tokens_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sessions" ADD CONSTRAINT "sessions_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "diagnoses" ADD CONSTRAINT "diagnoses_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "seguros_lc" ADD CONSTRAINT "seguros_lc_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "seguros_lc" ADD CONSTRAINT "seguros_lc_linked_tutor_id_fkey" FOREIGN KEY ("linked_tutor_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "recursos" ADD CONSTRAINT "recursos_farmacia_id_fkey" FOREIGN KEY ("farmacia_id") REFERENCES "farmacias"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "portafolio" ADD CONSTRAINT "portafolio_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "portafolio" ADD CONSTRAINT "portafolio_previous_version_id_fkey" FOREIGN KEY ("previous_version_id") REFERENCES "portafolio"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "chat_linea_emergencia" ADD CONSTRAINT "chat_linea_emergencia_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sesiones_tutoria" ADD CONSTRAINT "sesiones_tutoria_seguro_lc_id_fkey" FOREIGN KEY ("seguro_lc_id") REFERENCES "seguros_lc"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sesiones_tutoria" ADD CONSTRAINT "sesiones_tutoria_tutor_id_fkey" FOREIGN KEY ("tutor_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sesiones_tutoria" ADD CONSTRAINT "sesiones_tutoria_patient_id_fkey" FOREIGN KEY ("patient_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
