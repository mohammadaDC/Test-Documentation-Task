import { Fragment } from 'react';
import Link from 'next/link';
import { FiX } from 'react-icons/fi';
import CartItem from './CartItem';
import { useCart } from '../hooks/useCart';

export default function CartDrawer({ open, onClose }) {
  const { items, subtotal, itemCount } = useCart();

  return (
    <>
      {/* Overlay */}
      {open && <div className="fixed inset-0 bg-black/40 z-40" onClick={onClose} />}

      {/* Drawer */}
      <div className={`fixed top-0 right-0 h-full w-full max-w-sm bg-white shadow-2xl z-50 flex flex-col transform transition-transform duration-300 ${open ? 'translate-x-0' : 'translate-x-full'}`}>
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b">
          <h2 className="font-serif font-bold text-lg">Your Cart ({itemCount})</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
            <FiX size={22} />
          </button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto px-5">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-gray-400">
              <div className="text-6xl mb-4">🛒</div>
              <p>Your cart is empty</p>
              <Link href="/books" onClick={onClose} className="mt-4 text-brand-600 hover:text-brand-700 font-medium text-sm">
                Browse Books
              </Link>
            </div>
          ) : (
            items.map((item) => <CartItem key={item.id} item={item} />)
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="border-t px-5 py-5 space-y-3">
            <div className="flex justify-between font-semibold text-lg">
              <span>Subtotal</span>
              <span className="text-brand-600">${subtotal.toFixed(2)}</span>
            </div>
            <p className="text-xs text-gray-400">Shipping calculated at checkout</p>
            <Link
              href="/checkout"
              onClick={onClose}
              className="btn-primary w-full text-center block"
            >
              Proceed to Checkout
            </Link>
            <Link
              href="/cart"
              onClick={onClose}
              className="block text-center text-sm text-brand-600 hover:text-brand-700 font-medium"
            >
              View Full Cart
            </Link>
          </div>
        )}
      </div>
    </>
  );
}
