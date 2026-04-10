const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function getBooks(req, res) {
  try {
    const {
      page     = 1,
      limit    = 12,
      search   = '',
      category = '',
      maxPrice,
      featured,
      sort     = 'newest',
      isPublication,
    } = req.query;

    const where = {
      ...(search   && { OR: [{ title: { contains: search, mode: 'insensitive' } }, { author: { contains: search, mode: 'insensitive' } }] }),
      ...(category && { category: { slug: category } }),
      ...(maxPrice && { price: { lte: parseFloat(maxPrice) } }),
      ...(featured === 'true' && { featured: true }),
      ...(isPublication === 'true' && { isPublication: true }),
    };

    const orderBy = {
      newest:     { createdAt: 'desc' },
      price_asc:  { price: 'asc' },
      price_desc: { price: 'desc' },
      title_asc:  { title: 'asc' },
    }[sort] || { createdAt: 'desc' };

    const [books, total] = await Promise.all([
      prisma.book.findMany({
        where,
        orderBy,
        skip:  (parseInt(page) - 1) * parseInt(limit),
        take:  parseInt(limit),
        include: { category: { select: { id: true, name: true, slug: true } } },
      }),
      prisma.book.count({ where }),
    ]);

    res.json({ books, total, page: parseInt(page), pages: Math.ceil(total / parseInt(limit)) });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

async function getBook(req, res) {
  try {
    const book = await prisma.book.findUnique({
      where: { id: req.params.id },
      include: { category: true },
    });
    if (!book) return res.status(404).json({ message: 'Book not found' });
    res.json(book);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

async function getCategories(_req, res) {
  try {
    const categories = await prisma.category.findMany({ orderBy: { name: 'asc' } });
    res.json({ categories });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

async function createBook(req, res) {
  try {
    const book = await prisma.book.create({ data: req.body });
    res.status(201).json(book);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
}

async function updateBook(req, res) {
  try {
    const book = await prisma.book.update({ where: { id: req.params.id }, data: req.body });
    res.json(book);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
}

async function deleteBook(req, res) {
  try {
    await prisma.book.delete({ where: { id: req.params.id } });
    res.json({ message: 'Book deleted' });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
}

module.exports = { getBooks, getBook, getCategories, createBook, updateBook, deleteBook };
