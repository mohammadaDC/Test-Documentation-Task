import Layout from '../../components/Layout';
import Link from 'next/link';

export default function CheckoutSuccessPage() {
  return (
    <Layout title="Order Confirmed – PageTurner Books">
      <div className="max-w-lg mx-auto px-4 py-24 text-center">
        <div className="text-7xl mb-6">🎉</div>
        <h1 className="text-3xl font-serif font-bold text-navy-900 mb-3">Order Confirmed!</h1>
        <p className="text-gray-500 mb-8">
          Thank you for your purchase. You will receive a confirmation email shortly.
          We hope you enjoy your books!
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/books" className="btn-primary">Continue Shopping</Link>
          <Link href="/profile" className="btn-outline">View My Orders</Link>
        </div>
      </div>
    </Layout>
  );
}
