import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const horoscopeQuestions = [
    {
      slug: 'horoskop-2024-siodemka',
      title:
        'Jest kwiecień 2024. Dla Siódemki numerologicznej trwa dobry rok numerologiczny na:',
      category: 'Horoskop',
      difficulty: 'medium',
      explanation: '',
      answers: {
        create: [
          { text: 'Podróże', isCorrect: false },
          { text: 'Podjęcie pracy w korporacji', isCorrect: false },
          { text: 'Kończenie, domykanie, sprzątanie', isCorrect: false },
          { text: 'Skupienie się na relacjach', isCorrect: true },
        ],
      },
    },
    {
      slug: 'horoskop-2024-jedynka',
      title:
        'Jest kwiecień 2024. Dla Jedynki numerologicznej trwa dobry rok numerologiczny na:',
      category: 'Horoskop',
      difficulty: 'medium',
      explanation: '',
      answers: {
        create: [
          { text: 'Rozpoczęcie dużej inwestycji', isCorrect: false },
          { text: 'Rozkręcenie nowego biznesu', isCorrect: false },
          { text: 'Zakończenie relacji, które już nie służą', isCorrect: true },
          { text: 'Wzięcie kredytu', isCorrect: false },
        ],
      },
    },
    {
      slug: 'horoskop-2024-piatka',
      title:
        'Jest kwiecień 2024. Dla Piątki numerologicznej trwa dobry rok numerologiczny na:',
      category: 'Horoskop',
      difficulty: 'medium',
      explanation: '',
      answers: {
        create: [
          { text: 'Zabawę i relacje towarzyskie', isCorrect: false },
          { text: 'Pracę i inwestycję we własny rozwój', isCorrect: true },
          { text: 'Lekkie wycofanie i odpoczynek', isCorrect: false },
          { text: 'Wzięcie kredytu', isCorrect: false },
        ],
      },
    },
    {
      slug: 'horoskop-2024-osemka',
      title:
        'Jest kwiecień 2024. Dla Ósemki numerologicznej trwa dobry rok numerologiczny na:',
      category: 'Horoskop',
      difficulty: 'medium',
      explanation: '',
      answers: {
        create: [
          { text: 'Zbudowanie rodziny', isCorrect: false },
          { text: 'Otwarcie nowego biznesu', isCorrect: false },
          { text: 'Rozwój duchowy', isCorrect: true },
          { text: 'Kończenie, domykanie, sprzątanie', isCorrect: false },
        ],
      },
    },
    {
      slug: 'horoskop-2023-kredyt',
      title:
        'We wrześniu 2023 zaczął się nowy rok numerologiczny. Która z Wibracji Głównych zdecydowanie nie powinna brać w tym roku kredytu?',
      category: 'Horoskop',
      difficulty: 'medium',
      explanation: '',
      answers: {
        create: [
          { text: 'Dwójka', isCorrect: false },
          { text: 'Trójka', isCorrect: false },
          { text: 'Czwórka', isCorrect: false },
          { text: 'Piątka', isCorrect: true },
        ],
      },
    },
    {
      slug: 'horoskop-2023-biznes',
      title:
        'We wrześniu 2023 zaczął się nowy rok numerologiczny. Która z Wibracji Głównych absolutnie nie powinna rozpoczynać w tym roku nowego biznesu?',
      category: 'Horoskop',
      difficulty: 'medium',
      explanation: '',
      answers: {
        create: [
          { text: 'Jedynka', isCorrect: true },
          { text: 'Dwójka', isCorrect: false },
          { text: 'Szóstka', isCorrect: false },
          { text: 'Siódemka', isCorrect: false },
        ],
      },
    },
    {
      slug: 'horoskop-2023-przyspieszenie',
      title:
        'We wrześniu 2023 zaczął się nowy rok numerologiczny. Która z Wibracji Głównych doświadczy przyspieszenia energii i dynamicznych zmian?',
      category: 'Horoskop',
      difficulty: 'medium',
      explanation: '',
      answers: {
        create: [
          { text: 'Trójka', isCorrect: false },
          { text: 'Piątka', isCorrect: false },
          { text: 'Szóstka', isCorrect: true },
          { text: 'Siódemka', isCorrect: false },
        ],
      },
    },
    {
      slug: 'horoskop-przeprowadzka-2024',
      title:
        'Osoba urodziła się 21 listopada 1990 roku, liczba celu 3. Planuje przeprowadzę w roku 2024. Jaki miesiąc będzie numerologicznie wspierający dla takiego przedsięwzięcia?',
      category: 'Horoskop',
      difficulty: 'medium',
      explanation: '',
      answers: {
        create: [
          { text: 'Styczeń', isCorrect: false },
          { text: 'Luty', isCorrect: true },
          { text: 'Marzec', isCorrect: false },
          { text: 'Kwiecień', isCorrect: false },
        ],
      },
    },
    {
      slug: 'horoskop-czworka-biznes',
      title:
        'W jakim roku numerologiczna Czwórka powinna otworzyć działalność gospodarczą związaną z branżą budowlaną?',
      category: 'Horoskop',
      difficulty: 'medium',
      explanation: '',
      answers: {
        create: [
          { text: '1 RN', isCorrect: true },
          { text: '7 RN', isCorrect: false },
          { text: '9 RN', isCorrect: false },
          {
            text: 'W żadnym – to nie jest branża dla tej osoby',
            isCorrect: false,
          },
        ],
      },
    },
    {
      slug: 'horoskop-dzialalnosc-2024',
      title:
        'W którym z poniższych dni osoba urodzona 4 marca 1983 realizująca cele 3 powinna otworzyć działalność gospodarczą?',
      category: 'Horoskop',
      difficulty: 'medium',
      explanation: '',
      answers: {
        create: [
          { text: '2 lutego 2024', isCorrect: false },
          { text: '16 marca 2024', isCorrect: false },
          { text: '25 czerwca 2024', isCorrect: true },
          { text: '18 grudnia 2024', isCorrect: false },
        ],
      },
    },
    {
      slug: 'horoskop-sprzedaz-motoru',
      title:
        'Antoni urodził się 8 lutego. Planuje sprzedać swój motor pod koniec tego lata. Który dzień sierpnia 2024 będzie najkorzystniejszy na wrzucenie tej informacji na facebook?',
      category: 'Horoskop',
      difficulty: 'medium',
      explanation: '',
      answers: {
        create: [
          { text: '20 sierpnia', isCorrect: false },
          { text: '24 sierpnia', isCorrect: true },
          { text: '25 sierpnia', isCorrect: false },
          { text: '27 sierpnia', isCorrect: false },
        ],
      },
    },
    {
      slug: 'horoskop-sprzedaz-ubran',
      title:
        'Renia urodziła się 2 maja. W ramach wiosennych porządków chce wystawić kilka ubrań na sprzedaż. Który dzień marca 2024 będzie najlepszy na publikację ogłoszenia?',
      category: 'Horoskop',
      difficulty: 'medium',
      explanation: '',
      answers: {
        create: [
          { text: '1 marca', isCorrect: false },
          { text: '5 marca', isCorrect: false },
          { text: '11 marca', isCorrect: false },
          { text: '24 marca', isCorrect: true },
        ],
      },
    },
    {
      slug: 'horoskop-data-slubu',
      title:
        'Kasia i Jacek właśnie się zaręczyli. Nie spieszą się z terminem ślubu, szukają daty najkorzystniejszej numerologicznie. Jak najlepiej do tego podejść?',
      category: 'Horoskop',
      difficulty: 'medium',
      explanation: '',
      answers: {
        create: [
          {
            text: 'Jeśli data będzie super korzystna dla jednej ze stron, to ustawienia drugiej strony nie są aż tak istotne.',
            isCorrect: false,
          },
          {
            text: 'Przynajmniej jedna osoba musi być w 6 RN by związek miał szanse powodzenia',
            isCorrect: false,
          },
          {
            text: 'W pierwszej kolejności trzeba znaleźć korzystny rok numerologiczny i rok osobisty obojga narzeczonych, a następnie poszukać w tym roku najkorzystniejszych dat',
            isCorrect: true,
          },
          {
            text: 'Jeśli dzień osobisty będzie korzystny dla obojga, to rok nie ma aż takiego znaczenia.',
            isCorrect: false,
          },
        ],
      },
    },
    {
      slug: 'horoskop-slub-2024',
      title:
        'Ela to numerologiczna Siódemka a Darek to Czwórka. Chcą się pobrać w 2024 roku. Co na to numerolog?',
      category: 'Horoskop',
      difficulty: 'medium',
      explanation: '',
      answers: {
        create: [
          {
            text: 'To bardzo zły pomysł, 2024 wibruje w 8 a to nie sprzyja małżeństwu.',
            isCorrect: false,
          },
          {
            text: 'Powinni poszukać korzystnej daty przed wrześniowym nowiem',
            isCorrect: true,
          },
          {
            text: 'Powinni poszukać korzystnej daty po wrześniowym nowiu',
            isCorrect: false,
          },
          {
            text: 'Mogą wybrać dowolną datę roku 2024 uważając jedynie by omijać 9 dzień osobisty ich obojga',
            isCorrect: false,
          },
        ],
      },
    },
    {
      slug: 'horoskop-slub-miesiac',
      title:
        'Paula i Szymon chcą wziąć ślub w jakimś ciepłym miesiącu 2024 roku. Zmiana roku nie wchodzi w rachubę. Który miesiąc wypada najkorzystniej we wstępnej weryfikacji?\nPaula– 07.08.1990, wibracja celu 9\nSzymon – 17.12.1991, wibracja celu 1',
      category: 'Horoskop',
      difficulty: 'medium',
      explanation: '',
      answers: {
        create: [
          { text: 'Maj', isCorrect: false },
          { text: 'Czerwiec', isCorrect: true },
          { text: 'Lipiec', isCorrect: false },
          { text: 'Sierpień', isCorrect: false },
        ],
      },
    },
    {
      slug: 'horoskop-kredyt-mieszkanie',
      title:
        'Jest lipiec 2024. Edyta, numerologiczna czwórka, wypatrzyła mieszkanie swoich marzeń, musi jednak wziąć kredyt. Przyszła zapytać numerologa, czy energia sprzyja temu zakupowi. Co jej powiesz?',
      category: 'Horoskop',
      difficulty: 'medium',
      explanation: '',
      answers: {
        create: [
          {
            text: 'Jeśli potrzebujesz kredytu, weź go koniecznie przed wrześniowym nowiem.',
            isCorrect: true,
          },
          {
            text: 'Absolutnie nie bierz kredytu, jesteś w roku numerologicznym, który z zasady nie przynosi żadnych korzystnych okazji.',
            isCorrect: false,
          },
          {
            text: 'Nie spiesz się, datę zaciągnięcia kredytu wyznacz w dowolnym miesiącu na podstawie dnia osobistego',
            isCorrect: false,
          },
          {
            text: 'Poszukajmy Twojego piątego miesiąca numerologicznego a wszystko dobrze się potoczy',
            isCorrect: false,
          },
        ],
      },
    },
  ];

  // Add the new questions to the existing array
  const allQuestions = [...horoscopeQuestions];

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
