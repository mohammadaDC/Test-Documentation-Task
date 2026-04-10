import Layout from '../components/Layout';
import CheckoutForm from '../components/CheckoutForm';
import Link from 'next/link';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import { useCart } from '../hooks/useCart';
import { FiArrowLeft } from 'react-icons/fi';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY);

export default function CheckoutPage() {
  const { items } = useCart();

  if (items.length === 0) {
    return (
      <Layout title="Checkout – PageTurner Books">
        <div className="max-w-lg mx-auto px-4 py-20 text-center text-gray-400">
          <div className="text-6xl mb-4">🛒</div>
          <p className="text-lg mb-4">Your cart is empty</p>
          <Link href="/books" className="btn-primary">Browse Books</Link>
        </div>
      </Layout>
    );
  }

  return (
    <Layout title="Checkout – PageTurner Books">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <Link href="/cart" className="inline-flex items-center gap-1 text-sm text-brand-600 hover:text-brand-700 mb-6">
          <FiArrowLeft size={14} /> Back to Cart
        </Link>
        <h1 className="section-title mb-8">Checkout</h1>
        <Elements stripe={stripePromise}>
          <CheckoutForm />
        </Elements>
      </div>
    </Layout>
  );
}
