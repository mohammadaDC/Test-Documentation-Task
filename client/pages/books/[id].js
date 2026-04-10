import Image from 'next/image';
import Layout from '../../components/Layout';
import { useCart } from '../../hooks/useCart';
import toast from 'react-hot-toast';
import Link from 'next/link';
import { FiShoppingCart, FiArrowLeft } from 'react-icons/fi';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export async function getStaticPaths() {
  try {
    const res   = await fetch(`${API_URL}/api/books?limit=100`);
    const data  = await res.json();
    const paths = (data.books || []).map((b) => ({ params: { id: b.id } }));
    return { paths, fallback: 'blocking' };
  } catch {
    return { paths: [], fallback: 'blocking' };
  }
}

export async function getStaticProps({ params }) {
  try {
    const res = await fetch(`${API_URL}/api/books/${params.id}`);
    if (!res.ok) return { notFound: true };
    const book = await res.json();
    return { props: { book }, revalidate: 60 };
  } catch {
    return { notFound: true };
  }
}

export default function BookDetailPage({ book }) {
  const { addItem } = useCart();

  function handleAddToCart() {
    addItem(book);
    toast.success(`"${book.title}" added to cart!`);
  }

  return (
    <Layout title={`${book.title} – PageTurner Books`} description={book.description}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <Link href="/books" className="inline-flex items-center gap-1 text-sm text-brand-600 hover:text-brand-700 mb-6">
          <FiArrowLeft size={14} /> Back to Books
        </Link>

        <div className="flex flex-col md:flex-row gap-10">
          {/* Cover */}
          <div className="w-full md:w-72 shrink-0">
            <div className="relative aspect-[2/3] rounded-xl overflow-hidden shadow-lg bg-gray-100">
              {book.coverImage ? (
                <Image src={book.coverImage} alt={book.title} fill className="object-cover" />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center text-7xl">📚</div>
              )}
            </div>
          </div>

          {/* Details */}
          <div className="flex-1">
            <p className="text-sm text-brand-600 font-semibold uppercase tracking-widest mb-2">{book.category?.name}</p>
            <h1 className="text-3xl sm:text-4xl font-serif font-bold text-navy-900 mb-2">{book.title}</h1>
            <p className="text-gray-500 text-lg mb-6">by <span className="font-medium text-gray-700">{book.author}</span></p>

            <div className="flex items-baseline gap-4 mb-6">
              <span className="text-3xl font-bold text-brand-600">${parseFloat(book.price).toFixed(2)}</span>
              {book.stock > 0
                ? <span className="text-sm text-green-600 font-medium">In Stock ({book.stock} left)</span>
                : <span className="text-sm text-red-500 font-medium">Out of Stock</span>
              }
            </div>

            <button
              onClick={handleAddToCart}
              disabled={book.stock === 0}
              className="btn-primary flex items-center gap-2 mb-8"
            >
              <FiShoppingCart size={18} />
              Add to Cart
            </button>

            <div className="prose prose-gray max-w-none mb-8">
              <h2 className="text-lg font-serif font-semibold mb-2 text-navy-800">About This Book</h2>
              <p className="text-gray-600 leading-relaxed">{book.description}</p>
            </div>

            {/* Meta table */}
            <div className="border rounded-xl overflow-hidden text-sm">
              {[
                ['ISBN',      book.isbn],
                ['Pages',     book.pages],
                ['Published', book.publishedAt ? new Date(book.publishedAt).toLocaleDateString() : '—'],
                ['Category',  book.category?.name],
              ].map(([label, value]) => (
                <div key={label} className="flex border-b last:border-b-0">
                  <span className="w-32 bg-gray-50 px-4 py-2.5 font-medium text-gray-600 border-r">{label}</span>
                  <span className="px-4 py-2.5 text-gray-800">{value || '—'}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
