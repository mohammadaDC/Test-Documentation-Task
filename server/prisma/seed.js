const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
  // Categories
  const categories = await Promise.all([
    prisma.category.upsert({ where: { slug: 'fiction' },       update: {}, create: { name: 'Fiction',        slug: 'fiction' } }),
    prisma.category.upsert({ where: { slug: 'non-fiction' },   update: {}, create: { name: 'Non-Fiction',    slug: 'non-fiction' } }),
    prisma.category.upsert({ where: { slug: 'science' },       update: {}, create: { name: 'Science',        slug: 'science' } }),
    prisma.category.upsert({ where: { slug: 'history' },       update: {}, create: { name: 'History',        slug: 'history' } }),
    prisma.category.upsert({ where: { slug: 'children' },      update: {}, create: { name: "Children's",     slug: 'children' } }),
    prisma.category.upsert({ where: { slug: 'self-help' },     update: {}, create: { name: 'Self-Help',      slug: 'self-help' } }),
    prisma.category.upsert({ where: { slug: 'our-publications' }, update: {}, create: { name: 'Our Publications', slug: 'our-publications' } }),
  ]);

  const [fiction, nonFiction, science, history, children, selfHelp, ourPub] = categories;

  // Seed books
  const books = [
    {
      title: 'The Midnight Library',
      slug: 'the-midnight-library',
      author: 'Matt Haig',
      description: 'Between life and death there is a library, and within that library the shelves go on forever. Every book provides a chance to try another life you could have lived.',
      price: 14.99,
      coverImage: 'https://covers.openlibrary.org/b/id/10909258-L.jpg',
      isbn: '9780525559474',
      pages: 304,
      stock: 50,
      featured: true,
      categoryId: fiction.id,
    },
    {
      title: 'Educated',
      slug: 'educated',
      author: 'Tara Westover',
      description: 'A memoir about a young girl who, kept out of school, leaves her survivalist family and goes on to earn a PhD from Cambridge University.',
      price: 16.99,
      coverImage: 'https://covers.openlibrary.org/b/id/8739161-L.jpg',
      isbn: '9780399590504',
      pages: 352,
      stock: 40,
      featured: true,
      categoryId: nonFiction.id,
    },
    {
      title: 'A Brief History of Time',
      slug: 'a-brief-history-of-time',
      author: 'Stephen Hawking',
      description: 'A landmark volume in science writing by one of the great minds of our time, exploring topics from the Big Bang to black holes.',
      price: 12.99,
      coverImage: 'https://covers.openlibrary.org/b/id/8739220-L.jpg',
      isbn: '9780553380163',
      pages: 212,
      stock: 35,
      featured: true,
      categoryId: science.id,
    },
    {
      title: 'Sapiens: A Brief History of Humankind',
      slug: 'sapiens',
      author: 'Yuval Noah Harari',
      description: 'A narrative history about the most important events in human history from the Stone Age to the 21st century.',
      price: 18.99,
      coverImage: 'https://covers.openlibrary.org/b/id/8739157-L.jpg',
      isbn: '9780062316097',
      pages: 443,
      stock: 60,
      featured: true,
      categoryId: history.id,
    },
    {
      title: 'The Very Hungry Caterpillar',
      slug: 'the-very-hungry-caterpillar',
      author: 'Eric Carle',
      description: 'The classic story of a very hungry caterpillar who eats through a variety of foods before transforming into a beautiful butterfly.',
      price: 9.99,
      coverImage: 'https://covers.openlibrary.org/b/id/8739090-L.jpg',
      isbn: '9780399226908',
      pages: 32,
      stock: 80,
      featured: false,
      categoryId: children.id,
    },
    {
      title: 'Atomic Habits',
      slug: 'atomic-habits',
      author: 'James Clear',
      description: 'A proven framework for improving every day. Learn how tiny changes in behaviour can lead to remarkable results.',
      price: 17.99,
      coverImage: 'https://covers.openlibrary.org/b/id/8739150-L.jpg',
      isbn: '9780735211292',
      pages: 320,
      stock: 70,
      featured: true,
      categoryId: selfHelp.id,
    },
    {
      title: 'Pages & Prose: Our Debut Anthology',
      slug: 'pages-and-prose-anthology',
      author: 'Various Authors',
      description: 'A curated collection of short stories and poems from emerging writers published by our bookstore. A celebration of new literary voices.',
      price: 22.99,
      coverImage: 'https://via.placeholder.com/300x450?text=Pages+%26+Prose',
      pages: 280,
      stock: 100,
      featured: true,
      isPublication: true,
      categoryId: ourPub.id,
    },
    {
      title: 'The Art of Reading: Essays on Books and Life',
      slug: 'art-of-reading-essays',
      author: 'The Bookstore Editorial Team',
      description: 'Original essays by our editors and guest contributors exploring the deep relationship between readers and their books.',
      price: 19.99,
      coverImage: 'https://via.placeholder.com/300x450?text=Art+of+Reading',
      pages: 220,
      stock: 75,
      featured: true,
      isPublication: true,
      categoryId: ourPub.id,
    },
  ];

  for (const book of books) {
    await prisma.book.upsert({
      where: { slug: book.slug },
      update: {},
      create: book,
    });
  }

  console.log('Database seeded successfully.');
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(async () => prisma.$disconnect());
