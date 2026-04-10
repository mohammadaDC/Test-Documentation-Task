import { useState } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';

export default function ContactForm() {
  const [form, setForm]     = useState({ name: '', email: '', subject: '', message: '' });
  const [loading, setLoading] = useState(false);

  function handleChange(e) {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/contact`, form);
      toast.success('Message sent! We\'ll get back to you shortly.');
      setForm({ name: '', email: '', subject: '', message: '' });
    } catch {
      toast.error('Failed to send message. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
          <input name="name" value={form.name} onChange={handleChange} required className="input-field" placeholder="Jane Doe" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
          <input name="email" type="email" value={form.email} onChange={handleChange} required className="input-field" placeholder="jane@example.com" />
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Subject</label>
        <input name="subject" value={form.subject} onChange={handleChange} required className="input-field" placeholder="How can we help?" />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Message</label>
        <textarea name="message" value={form.message} onChange={handleChange} required rows={6} className="input-field resize-none" placeholder="Your message…" />
      </div>
      <button type="submit" disabled={loading} className="btn-primary w-full sm:w-auto">
        {loading ? 'Sending…' : 'Send Message'}
      </button>
    </form>
  );
}
