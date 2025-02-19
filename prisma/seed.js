import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Birth day questions
  const birthDayQuestions = [
    {
      slug: 'krysztal-zycia-1-szukanie-siebie',
      title:
        'Jaką liczbę widzimy w krysztale życia, która sugeruje nam szukanie siebie, realizację pomysłów',
      category: 'Kryształ życia',
      difficulty: 'medium',
      explanation: '',
      answers: {
        create: [
          { text: '5', isCorrect: false },
          { text: '1', isCorrect: true },
          { text: '6', isCorrect: false },
          { text: '2', isCorrect: false },
        ],
      },
    },
    {
      slug: 'krysztal-zycia-2-wspolpraca-wplyw-kobiet',
      title:
        'Jaką liczbę widzimy w krysztale życia, która sugeruje nam wpływ innych, współpracę, wpływ kobiet',
      category: 'Kryształ życia',
      difficulty: 'medium',
      explanation: '',
      answers: {
        create: [
          { text: '1', isCorrect: false },
          { text: '2', isCorrect: true },
          { text: '4', isCorrect: false },
          { text: '8', isCorrect: false },
        ],
      },
    },
    {
      slug: 'krysztal-zycia-3-dobry-czas-miejsce',
      title:
        'Jaką liczbę widzimy w krysztale życia, która sugeruje nam dobry czas, dobre miejsce',
      category: 'Kryształ życia',
      difficulty: 'medium',
      explanation: '',
      answers: {
        create: [
          { text: '3', isCorrect: true },
          { text: '7', isCorrect: false },
          { text: '2', isCorrect: false },
          { text: '8', isCorrect: false },
        ],
      },
    },
    {
      slug: 'krysztal-zycia-4-praca',
      title: 'Jaką liczbę widzimy w krysztale życia, która sugeruje nam pracę',
      category: 'Kryształ życia',
      difficulty: 'medium',
      explanation: '',
      answers: {
        create: [
          { text: '7', isCorrect: false },
          { text: '4', isCorrect: true },
          { text: '9', isCorrect: false },
          { text: '2', isCorrect: false },
        ],
      },
    },
    {
      slug: 'krysztal-zycia-5-doplyw-energii',
      title:
        'Jaką liczbę widzimy w krysztale życia, która sugeruje nam dopływ energii',
      category: 'Kryształ życia',
      difficulty: 'medium',
      explanation: '',
      answers: {
        create: [
          { text: '7', isCorrect: false },
          { text: '4', isCorrect: false },
          { text: '5', isCorrect: true },
          { text: '6', isCorrect: false },
        ],
      },
    },
    {
      slug: 'krysztal-zycia-6-rodzina-dawanie',
      title:
        'Jaką liczbę widzimy w krysztale życia, która sugeruje nam rodzinę, branie i dawanie',
      category: 'Kryształ życia',
      difficulty: 'medium',
      explanation: '',
      answers: {
        create: [
          { text: '7', isCorrect: false },
          { text: '1', isCorrect: false },
          { text: '2', isCorrect: false },
          { text: '6', isCorrect: true },
        ],
      },
    },
    {
      slug: 'krysztal-zycia-7-medytacja-specjalizacja',
      title:
        'Jaką liczbę widzimy w krysztale życia, która sugeruje nam czas na medytację, specjalizację',
      category: 'Kryształ życia',
      difficulty: 'medium',
      explanation: '',
      answers: {
        create: [
          { text: '3', isCorrect: false },
          { text: '5', isCorrect: false },
          { text: '7', isCorrect: true },
          { text: '8', isCorrect: false },
        ],
      },
    },
    {
      slug: 'krysztal-zycia-8-materialny-energia-meska',
      title:
        'Jaką liczbę widzimy w krysztale życia, która sugeruje nam czas materialny, wpływ ojca (męskiej energii)',
      category: 'Kryształ życia',
      difficulty: 'medium',
      explanation: '',
      answers: {
        create: [
          { text: '1', isCorrect: false },
          { text: '3', isCorrect: false },
          { text: '8', isCorrect: true },
          { text: '7', isCorrect: false },
        ],
      },
    },
    {
      slug: 'krysztal-zycia-9-sluzba-zakonczenia',
      title:
        'Jaką liczbę widzimy w krysztale życia, która sugeruje nam bycie dla innych, zakończenia',
      category: 'Kryształ życia',
      difficulty: 'medium',
      explanation: '',
      answers: {
        create: [
          { text: '9', isCorrect: true },
          { text: '3', isCorrect: false },
          { text: '7', isCorrect: false },
          { text: '1', isCorrect: false },
        ],
      },
    },
  ];

  // Add the new questions to the existing array
  const allQuestions = [...birthDayQuestions, ...additionalQuestions];

  for (const questionData of allQuestions) {
    await prisma.question.create({
      data: questionData,
    });
  }

  console.log('Seed data created successfully');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
