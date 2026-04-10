import Layout from '../components/Layout';
import CartItem from '../components/CartItem';
import Link from 'next/link';
import { useCart } from '../hooks/useCart';
import { FiArrowLeft } from 'react-icons/fi';

export default function CartPage() {
  const { items, subtotal, itemCount, clearCart } = useCart();

  const shipping = subtotal >= 30 ? 0 : 4.99;
  const tax      = subtotal * 0.08;
  const total    = subtotal + shipping + tax;

  return (
    <Layout title="Your Cart – PageTurner Books">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <Link href="/books" className="inline-flex items-center gap-1 text-sm text-brand-600 hover:text-brand-700 mb-6">
          <FiArrowLeft size={14} /> Continue Shopping
        </Link>

        <h1 className="section-title mb-8">Your Cart ({itemCount} items)</h1>

        {items.length === 0 ? (
          <div className="text-center py-20 text-gray-400">
            <div className="text-7xl mb-4">🛒</div>
            <p className="text-lg mb-4">Your cart is empty</p>
            <Link href="/books" className="btn-primary">Browse Books</Link>
          </div>
        ) : (
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Items list */}
            <div className="flex-1 card p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="font-semibold text-gray-800">Items</h2>
                <button onClick={clearCart} className="text-xs text-red-500 hover:text-red-600">Clear all</button>
              </div>
              {items.map((item) => <CartItem key={item.id} item={item} />)}
            </div>

            {/* Order summary */}
            <div className="lg:w-80 shrink-0">
              <div className="card p-6 sticky top-24">
                <h2 className="font-serif font-bold text-lg mb-5">Order Summary</h2>
                <div className="space-y-3 text-sm mb-5">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Subtotal</span>
                    <span>${subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Shipping</span>
                    <span>{shipping === 0 ? <span className="text-green-600">Free</span> : `$${shipping.toFixed(2)}`}</span>
                  </div>
                  {shipping > 0 && (
                    <p className="text-xs text-gray-400">Add ${(30 - subtotal).toFixed(2)} more for free shipping</p>
                  )}
                  <div className="flex justify-between">
                    <span className="text-gray-600">Estimated Tax (8%)</span>
                    <span>${tax.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between font-bold text-base border-t pt-3">
                    <span>Total</span>
                    <span className="text-brand-600">${total.toFixed(2)}</span>
                  </div>
                </div>
                <Link href="/checkout" className="btn-primary w-full text-center block">
                  Proceed to Checkout
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}
