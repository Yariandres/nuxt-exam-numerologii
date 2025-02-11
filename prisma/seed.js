import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  // Clear existing data
  await prisma.answer.deleteMany();
  await prisma.question.deleteMany();

  // Create questions
  const question1 = await prisma.question.create({
    data: {
      slug: 'life-path-number-september-15-1985',
      title:
        'What is the Life Path number for someone born on September 15, 1985?',
      explanation:
        'To calculate the Life Path number: 9+1+5+1+9+8+5 = 38, 3+8 = 11, 1+1 = 2',
      category: 'life-path',
      difficulty: 'beginner',
      answers: {
        create: [
          { text: '7', isCorrect: false },
          { text: '2', isCorrect: true },
          { text: '9', isCorrect: false },
          { text: '5', isCorrect: false },
        ],
      },
    },
  });

  const question2 = await prisma.question.create({
    data: {
      slug: 'destiny-number-calculation',
      title: 'How is the Destiny (Expression) Number calculated?',
      explanation:
        'The Destiny Number is calculated by converting each letter in the full name to its corresponding number value and then reducing to a single digit.',
      category: 'destiny-number',
      difficulty: 'intermediate',
      answers: {
        create: [
          {
            text: 'By adding only the consonants in the name',
            isCorrect: false,
          },
          { text: 'By adding only the vowels in the name', isCorrect: false },
          {
            text: 'By adding all letters in the full name using their numerical values',
            isCorrect: true,
          },
          { text: 'By multiplying the birth date numbers', isCorrect: false },
        ],
      },
    },
  });

  const question3 = await prisma.question.create({
    data: {
      slug: 'master-numbers',
      title: 'Which numbers are considered Master Numbers in Numerology?',
      explanation:
        'Master Numbers are 11, 22, and 33. These numbers carry special spiritual significance and should not be reduced to single digits in calculations.',
      category: 'master-numbers',
      difficulty: 'beginner',
      answers: {
        create: [
          { text: '11, 22, 33', isCorrect: true },
          { text: '10, 20, 30', isCorrect: false },
          { text: '13, 16, 19', isCorrect: false },
          { text: '7, 9, 11', isCorrect: false },
        ],
      },
    },
  });

  const question4 = await prisma.question.create({
    data: {
      slug: 'karmic-debt-numbers',
      title: 'What are the Karmic Debt Numbers in Numerology?',
      explanation:
        'Karmic Debt Numbers are 13, 14, 16, and 19. They indicate specific lessons or challenges that need to be addressed from past lives.',
      category: 'karmic-debt',
      difficulty: 'advanced',
      answers: {
        create: [
          { text: '11, 22, 33, 44', isCorrect: false },
          { text: '13, 14, 16, 19', isCorrect: true },
          { text: '12, 15, 18, 21', isCorrect: false },
          { text: '10, 20, 30, 40', isCorrect: false },
        ],
      },
    },
  });

  const question5 = await prisma.question.create({
    data: {
      slug: 'personal-year-calculation',
      title: 'How do you calculate a Personal Year number?',
      explanation:
        'The Personal Year number is calculated by adding the month and day of birth to the current year, then reducing to a single digit.',
      category: 'personal-year',
      difficulty: 'intermediate',
      answers: {
        create: [
          {
            text: 'Add birth month + birth day + current year',
            isCorrect: true,
          },
          { text: 'Add all numbers in your birth date', isCorrect: false },
          {
            text: 'Add only the month and day of the current date',
            isCorrect: false,
          },
          { text: 'Multiply birth month by current year', isCorrect: false },
        ],
      },
    },
  });

  console.log('Seed data created:', {
    question1: question1.id,
    question2: question2.id,
    question3: question3.id,
    question4: question4.id,
    question5: question5.id,
  });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
