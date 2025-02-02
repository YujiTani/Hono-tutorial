-- CreateEnum
CREATE TYPE "Status" AS ENUM ('DRAFT', 'READY', 'PUBLISHED');

-- CreateTable
CREATE TABLE "quests" (
    "id" SERIAL NOT NULL,
    "uuid" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "state" "Status" NOT NULL DEFAULT 'DRAFT',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "quests_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "courses" (
    "id" SERIAL NOT NULL,
    "uuid" TEXT NOT NULL,
    "questId" TEXT,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "difficulty" SMALLINT NOT NULL DEFAULT 0,
    "state" "Status" NOT NULL DEFAULT 'DRAFT',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "courses_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "stages" (
    "id" SERIAL NOT NULL,
    "uuid" TEXT NOT NULL,
    "courseId" TEXT,
    "prefix" TEXT NOT NULL,
    "overview" TEXT,
    "target" TEXT,
    "state" "Status" NOT NULL DEFAULT 'DRAFT',
    "failedCase" SMALLINT NOT NULL DEFAULT 0,
    "completeCase" SMALLINT NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "stages_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "questions" (
    "id" SERIAL NOT NULL,
    "uuid" TEXT NOT NULL,
    "stageId" TEXT,
    "name" TEXT NOT NULL,
    "answer" TEXT NOT NULL,
    "explanation" TEXT,
    "body" TEXT NOT NULL,
    "category" SMALLINT NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "questions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "words" (
    "id" SERIAL NOT NULL,
    "uuid" TEXT NOT NULL,
    "questionId" TEXT,
    "name" TEXT NOT NULL,
    "synonyms" TEXT NOT NULL,
    "orderIndex" SMALLINT NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "words_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "false_answers" (
    "id" SERIAL NOT NULL,
    "uuid" TEXT NOT NULL,
    "questionId" TEXT,
    "answer" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "false_answers_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "quests_uuid_key" ON "quests"("uuid");

-- CreateIndex
CREATE INDEX "quests_state_idx" ON "quests"("state");

-- CreateIndex
CREATE INDEX "quests_uuid_idx" ON "quests"("uuid");

-- CreateIndex
CREATE UNIQUE INDEX "courses_uuid_key" ON "courses"("uuid");

-- CreateIndex
CREATE INDEX "courses_uuid_idx" ON "courses"("uuid");

-- CreateIndex
CREATE INDEX "courses_questId_idx" ON "courses"("questId");

-- CreateIndex
CREATE INDEX "courses_difficulty_idx" ON "courses"("difficulty");

-- CreateIndex
CREATE UNIQUE INDEX "stages_uuid_key" ON "stages"("uuid");

-- CreateIndex
CREATE UNIQUE INDEX "stages_prefix_key" ON "stages"("prefix");

-- CreateIndex
CREATE INDEX "stages_uuid_idx" ON "stages"("uuid");

-- CreateIndex
CREATE INDEX "stages_courseId_idx" ON "stages"("courseId");

-- CreateIndex
CREATE INDEX "stages_prefix_idx" ON "stages"("prefix");

-- CreateIndex
CREATE INDEX "stages_state_idx" ON "stages"("state");

-- CreateIndex
CREATE UNIQUE INDEX "questions_uuid_key" ON "questions"("uuid");

-- CreateIndex
CREATE INDEX "questions_uuid_idx" ON "questions"("uuid");

-- CreateIndex
CREATE INDEX "questions_stageId_idx" ON "questions"("stageId");

-- CreateIndex
CREATE UNIQUE INDEX "words_uuid_key" ON "words"("uuid");

-- CreateIndex
CREATE INDEX "words_uuid_idx" ON "words"("uuid");

-- CreateIndex
CREATE INDEX "words_questionId_idx" ON "words"("questionId");

-- CreateIndex
CREATE INDEX "words_name_idx" ON "words"("name");

-- CreateIndex
CREATE UNIQUE INDEX "false_answers_uuid_key" ON "false_answers"("uuid");

-- CreateIndex
CREATE INDEX "false_answers_uuid_idx" ON "false_answers"("uuid");

-- CreateIndex
CREATE INDEX "false_answers_questionId_idx" ON "false_answers"("questionId");

-- AddForeignKey
ALTER TABLE "courses" ADD CONSTRAINT "courses_questId_fkey" FOREIGN KEY ("questId") REFERENCES "quests"("uuid") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "stages" ADD CONSTRAINT "stages_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "courses"("uuid") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "questions" ADD CONSTRAINT "questions_stageId_fkey" FOREIGN KEY ("stageId") REFERENCES "stages"("uuid") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "words" ADD CONSTRAINT "words_questionId_fkey" FOREIGN KEY ("questionId") REFERENCES "questions"("uuid") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "false_answers" ADD CONSTRAINT "false_answers_questionId_fkey" FOREIGN KEY ("questionId") REFERENCES "questions"("uuid") ON DELETE CASCADE ON UPDATE CASCADE;
