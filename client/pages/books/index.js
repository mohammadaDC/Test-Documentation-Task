import { useState, useEffect } from 'react';
import Layout from '../../components/Layout';
import BookCard from '../../components/BookCard';
import FilterSidebar from '../../components/FilterSidebar';

const API_URL = process.env.NEXT_PUBLIC_API_URL;
const PAGE_SIZE = 12;

export async function getStaticProps() {
  try {
    const [booksRes, catsRes] = await Promise.all([
      fetch(`${API_URL}/api/books?limit=${PAGE_SIZE}&page=1`),
      fetch(`${API_URL}/api/books/categories`),
    ]);
    const { books, total } = await booksRes.json();
    const { categories } = await catsRes.json();
    return { props: { initialBooks: books || [], initialTotal: total || 0, categories: categories || [] }, revalidate: 30 };
  } catch {
    return { props: { initialBooks: [], initialTotal: 0, categories: [] }, revalidate: 30 };
  }
}

export default function BooksPage({ initialBooks, initialTotal, categories }) {
  const [books, setBooks]   = useState(initialBooks);
  const [total, setTotal]   = useState(initialTotal);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({ search: '', category: '', maxPrice: 100, sort: 'newest', page: 1 });

  useEffect(() => {
    let active = true;
    async function fetchBooks() {
      setLoading(true);
      const params = new URLSearchParams({
        limit: PAGE_SIZE,
        page: filters.page,
        ...(filters.search   && { search: filters.search }),
        ...(filters.category && { category: filters.category }),
        ...(filters.maxPrice < 100 && { maxPrice: filters.maxPrice }),
        sort: filters.sort,
      });
      try {
        const res  = await fetch(`${API_URL}/api/books?${params}`);
        const data = await res.json();
        if (active) { setBooks(data.books || []); setTotal(data.total || 0); }
      } catch { /* keep existing */ }
      if (active) setLoading(false);
    }
    fetchBooks();
    return () => { active = false; };
  }, [filters]);

  const totalPages = Math.ceil(total / PAGE_SIZE);

  return (
    <Layout title="Browse Books – PageTurner Books">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <h1 className="section-title mb-1">Browse Books</h1>
        <p className="section-subtitle">{total} titles available</p>

        <div className="flex flex-col lg:flex-row gap-8">
          <FilterSidebar categories={categories} filters={filters} onChange={setFilters} />

          <div className="flex-1">
            {loading ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-6">
                {Array.from({ length: PAGE_SIZE }).map((_, i) => (
                  <div key={i} className="card animate-pulse aspect-[2/3] bg-gray-100 rounded-xl" />
                ))}
              </div>
            ) : books.length === 0 ? (
              <div className="text-center py-20 text-gray-400">
                <div className="text-5xl mb-4">🔍</div>
                <p>No books match your filters.</p>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-6">
                  {books.map((book) => <BookCard key={book.id} book={book} />)}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex justify-center items-center gap-2 mt-10">
                    <button
                      disabled={filters.page === 1}
                      onClick={() => setFilters((f) => ({ ...f, page: f.page - 1 }))}
                      className="px-3 py-1.5 rounded-lg border text-sm disabled:opacity-40 hover:bg-gray-50"
                    >
                      Previous
                    </button>
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                      <button
                        key={p}
                        onClick={() => setFilters((f) => ({ ...f, page: p }))}
                        className={`px-3 py-1.5 rounded-lg border text-sm ${p === filters.page ? 'bg-brand-600 text-white border-brand-600' : 'hover:bg-gray-50'}`}
                      >
                        {p}
                      </button>
                    ))}
                    <button
                      disabled={filters.page === totalPages}
                      onClick={() => setFilters((f) => ({ ...f, page: f.page + 1 }))}
                      className="px-3 py-1.5 rounded-lg border text-sm disabled:opacity-40 hover:bg-gray-50"
                    >
                      Next
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}
