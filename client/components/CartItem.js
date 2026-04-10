import Image from 'next/image';
import { FiTrash2, FiMinus, FiPlus } from 'react-icons/fi';
import { useCart } from '../hooks/useCart';

export default function CartItem({ item }) {
  const { updateQuantity, removeItem } = useCart();

  return (
    <div className="flex gap-4 py-4 border-b last:border-b-0">
      {/* Thumbnail */}
      <div className="relative w-16 h-24 shrink-0 rounded-lg overflow-hidden bg-gray-100">
        {item.coverImage ? (
          <Image src={item.coverImage} alt={item.title} fill className="object-cover" />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center text-3xl">📚</div>
        )}
      </div>

      {/* Details */}
      <div className="flex-1 min-w-0">
        <p className="font-serif font-semibold text-sm text-gray-800 line-clamp-2">{item.title}</p>
        <p className="text-xs text-gray-500 mb-2">{item.author}</p>

        <div className="flex items-center justify-between">
          {/* Qty controls */}
          <div className="flex items-center gap-1 border rounded-lg overflow-hidden">
            <button
              onClick={() => updateQuantity(item.id, item.quantity - 1)}
              className="px-2 py-1 hover:bg-gray-50 transition-colors"
              aria-label="Decrease quantity"
            >
              <FiMinus size={12} />
            </button>
            <span className="px-3 text-sm font-medium">{item.quantity}</span>
            <button
              onClick={() => updateQuantity(item.id, item.quantity + 1)}
              className="px-2 py-1 hover:bg-gray-50 transition-colors"
              aria-label="Increase quantity"
            >
              <FiPlus size={12} />
            </button>
          </div>

          <span className="font-bold text-brand-600 text-sm">
            ${(parseFloat(item.price) * item.quantity).toFixed(2)}
          </span>
        </div>
      </div>

      {/* Remove */}
      <button
        onClick={() => removeItem(item.id)}
        className="text-gray-400 hover:text-red-500 transition-colors self-start mt-1"
        aria-label="Remove item"
      >
        <FiTrash2 size={16} />
      </button>
    </div>
  );
}
