import Image from 'next/image';
import Link from 'next/link';
import { FiShoppingCart, FiStar } from 'react-icons/fi';
import { useCart } from '../hooks/useCart';
import toast from 'react-hot-toast';

export default function BookCard({ book }) {
  const { addItem } = useCart();

  function handleAddToCart(e) {
    e.preventDefault();
    addItem(book);
    toast.success(`"${book.title}" added to cart!`);
  }

  return (
    <Link href={`/books/${book.id}`} className="card group flex flex-col overflow-hidden">
      {/* Cover image */}
      <div className="relative aspect-[2/3] bg-gray-100 overflow-hidden">
        {book.coverImage ? (
          <Image
            src={book.coverImage}
            alt={book.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center bg-brand-50 text-brand-300 text-6xl">📚</div>
        )}
        {book.featured && (
          <span className="absolute top-2 left-2 bg-brand-600 text-white text-xs font-bold px-2 py-0.5 rounded">Featured</span>
        )}
      </div>

      {/* Info */}
      <div className="p-3 flex flex-col flex-grow">
        <p className="text-xs text-gray-400 uppercase tracking-wide mb-0.5">{book.category?.name}</p>
        <h3 className="font-serif font-semibold text-gray-800 text-sm leading-snug line-clamp-2 mb-0.5 group-hover:text-brand-600 transition-colors">
          {book.title}
        </h3>
        <p className="text-xs text-gray-500 mb-3">{book.author}</p>

        <div className="mt-auto flex items-center justify-between">
          <span className="text-brand-600 font-bold">${parseFloat(book.price).toFixed(2)}</span>
          <button
            onClick={handleAddToCart}
            className="flex items-center gap-1 bg-brand-600 hover:bg-brand-700 text-white text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors"
          >
            <FiShoppingCart size={13} />
            Add
          </button>
        </div>
      </div>
    </Link>
  );
}
