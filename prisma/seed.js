import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Clear existing data
  await prisma.answer.deleteMany();
  await prisma.question.deleteMany();
  await prisma.testSettings.deleteMany();
  await prisma.user.deleteMany();

  // Create users
  const admin = await prisma.user.create({
    data: {
      email: 'admin@numerology.com',
      password: 'admin123',
      name: 'Admin User',
      role: 'ADMIN',
    },
  });

  const student = await prisma.user.create({
    data: {
      email: 'student@numerology.com',
      password: 'student123',
      name: 'Student User',
      role: 'STUDENT',
    },
  });

  // Create test settings
  const settings = await prisma.testSettings.create({
    data: {
      timeLimit: 60,
      questionsPerTest: 20,
      passingScore: 70.0,
      randomizeQuestions: true,
      showFeedbackImmediately: true,
      allowRetake: true,
      retakeWaitingPeriod: 24,
      lifepathWeight: 25,
      destinyWeight: 25,
      soulUrgeWeight: 25,
      personalityWeight: 25,
    },
  });

  // Create sample questions
  const question1 = await prisma.question.create({
    data: {
      slug: 'life-path-number-september-15-1985',
      title:
        'What is the Life Path number for someone born on September 15, 1985?',
      category: 'LIFE_PATH',
      difficulty: 'BEGINNER',
      active: true,
      answers: {
        create: [
          { text: '7', isCorrect: false },
          { text: '1', isCorrect: true },
          { text: '9', isCorrect: false },
          { text: '5', isCorrect: false },
        ],
      },
    },
  });

  const question2 = await prisma.question.create({
    data: {
      slug: 'numerology-planet-mars-number',
      title: 'In numerology, what number represents the planet Mars?',
      category: 'DESTINY_NUMBER',
      difficulty: 'INTERMEDIATE',
      active: true,
      answers: {
        create: [
          { text: '9', isCorrect: false },
          { text: '8', isCorrect: false },
          { text: '6', isCorrect: false },
          { text: '5', isCorrect: true },
        ],
      },
    },
  });

  console.log({ admin, student, settings, question1, question2 });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
