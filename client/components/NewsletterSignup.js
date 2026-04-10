import { useState } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';

export default function NewsletterSignup() {
  const [email, setEmail]   = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/contact/newsletter`, { email });
      toast.success('You\'re subscribed! Watch your inbox for updates.');
      setEmail('');
    } catch {
      toast.error('Subscription failed. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="bg-navy-900 text-white py-14">
      <div className="max-w-xl mx-auto px-4 text-center">
        <h2 className="text-2xl font-serif font-bold mb-2">Stay in the Loop</h2>
        <p className="text-gray-400 mb-6 text-sm">
          Get notified about new arrivals, author events, and exclusive discounts.
        </p>
        <form onSubmit={handleSubmit} className="flex gap-2">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            placeholder="Your email address"
            className="flex-1 rounded-lg px-4 py-2.5 text-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-brand-400"
          />
          <button type="submit" disabled={loading} className="btn-primary whitespace-nowrap">
            {loading ? 'Subscribing…' : 'Subscribe'}
          </button>
        </form>
        <p className="text-xs text-gray-500 mt-3">No spam, ever. Unsubscribe at any time.</p>
      </div>
    </section>
  );
}
