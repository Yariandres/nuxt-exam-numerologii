-- CreateTable
CREATE TABLE "ExamSettings" (
    "id" TEXT NOT NULL,
    "timerMinutes" INTEGER NOT NULL DEFAULT 40,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ExamSettings_pkey" PRIMARY KEY ("id")
);
