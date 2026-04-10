import { useState } from 'react';
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import axios from 'axios';
import { useCart } from '../hooks/useCart';
import { useRouter } from 'next/router';
import toast from 'react-hot-toast';

const CARD_ELEMENT_OPTIONS = {
  style: {
    base:    { fontSize: '16px', color: '#374151', '::placeholder': { color: '#9ca3af' } },
    invalid: { color: '#ef4444' },
  },
};

export default function CheckoutForm() {
  const stripe     = useStripe();
  const elements   = useElements();
  const { items, subtotal, clearCart } = useCart();
  const router     = useRouter();

  const shipping   = subtotal >= 30 ? 0 : 4.99;
  const tax        = subtotal * 0.08;
  const total      = subtotal + shipping + tax;

  const [form, setForm]       = useState({ name: '', email: '', address: '', city: '', zip: '', country: 'US' });
  const [processing, setProcessing] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    if (!stripe || !elements) return;

    setProcessing(true);
    const toastId = toast.loading('Processing payment…');

    try {
      // Create payment intent on server
      const { data } = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/payments/create-intent`, {
        items: items.map((i) => ({ id: i.id, quantity: i.quantity })),
        shipping: form,
      });

      // Confirm card payment
      const result = await stripe.confirmCardPayment(data.clientSecret, {
        payment_method: {
          card: elements.getElement(CardElement),
          billing_details: { name: form.name, email: form.email },
        },
      });

      if (result.error) {
        toast.error(result.error.message, { id: toastId });
      } else if (result.paymentIntent.status === 'succeeded') {
        clearCart();
        toast.success('Payment successful! Thank you for your order.', { id: toastId });
        router.push('/checkout/success');
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Payment failed. Please try again.', { id: toastId });
    } finally {
      setProcessing(false);
    }
  }

  function handleChange(e) {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Contact & Shipping */}
      <div className="card p-6">
        <h2 className="font-serif font-bold text-lg mb-4">Shipping Information</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
            <input name="name" value={form.name} onChange={handleChange} required className="input-field" placeholder="Jane Doe" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input name="email" type="email" value={form.email} onChange={handleChange} required className="input-field" placeholder="jane@example.com" />
          </div>
          <div className="sm:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">Street Address</label>
            <input name="address" value={form.address} onChange={handleChange} required className="input-field" placeholder="123 Book Lane" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
            <input name="city" value={form.city} onChange={handleChange} required className="input-field" placeholder="New York" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">ZIP / Postal Code</label>
            <input name="zip" value={form.zip} onChange={handleChange} required className="input-field" placeholder="10001" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Country</label>
            <select name="country" value={form.country} onChange={handleChange} className="input-field">
              <option value="US">United States</option>
              <option value="GB">United Kingdom</option>
              <option value="CA">Canada</option>
              <option value="AU">Australia</option>
            </select>
          </div>
        </div>
      </div>

      {/* Payment */}
      <div className="card p-6">
        <h2 className="font-serif font-bold text-lg mb-4">Payment Details</h2>
        <div className="border rounded-lg p-3">
          <CardElement options={CARD_ELEMENT_OPTIONS} />
        </div>
        <p className="text-xs text-gray-400 mt-2">Secured by Stripe. We never store your card details.</p>
      </div>

      {/* Summary & submit */}
      <div className="card p-6">
        <h2 className="font-serif font-bold text-lg mb-4">Order Summary</h2>
        <div className="space-y-2 text-sm mb-4">
          <div className="flex justify-between"><span className="text-gray-600">Subtotal</span><span>${subtotal.toFixed(2)}</span></div>
          <div className="flex justify-between"><span className="text-gray-600">Shipping</span><span>{shipping === 0 ? <span className="text-green-600">Free</span> : `$${shipping.toFixed(2)}`}</span></div>
          <div className="flex justify-between"><span className="text-gray-600">Tax (8%)</span><span>${tax.toFixed(2)}</span></div>
          <div className="flex justify-between font-bold text-base border-t pt-3"><span>Total</span><span className="text-brand-600">${total.toFixed(2)}</span></div>
        </div>
        <button type="submit" disabled={!stripe || processing} className="btn-primary w-full">
          {processing ? 'Processing…' : `Pay $${total.toFixed(2)}`}
        </button>
      </div>
    </form>
  );
}
