import Layout from '../components/Layout';
import ContactForm from '../components/ContactForm';
import { FiMapPin, FiMail, FiPhone } from 'react-icons/fi';

export default function ContactPage() {
  return (
    <Layout title="Contact Us – PageTurner Books" description="Get in touch with the PageTurner Books team.">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="text-center mb-12">
          <h1 className="section-title">Get In Touch</h1>
          <p className="section-subtitle max-w-xl mx-auto">
            Have a question about an order, want to collaborate, or just love talking about books? We'd love to hear from you.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Contact info */}
          <div className="space-y-6">
            <div className="card p-6">
              <h2 className="font-serif font-bold text-lg mb-4">Contact Information</h2>
              <ul className="space-y-4 text-sm text-gray-600">
                <li className="flex gap-3">
                  <FiMapPin className="text-brand-600 mt-0.5 shrink-0" size={16} />
                  <span>123 Bookshelf Lane,<br />New York, NY 10001</span>
                </li>
                <li className="flex gap-3">
                  <FiMail className="text-brand-600 mt-0.5 shrink-0" size={16} />
                  <a href="mailto:hello@pageturnerbooks.com" className="hover:text-brand-600 transition-colors">
                    hello@pageturnerbooks.com
                  </a>
                </li>
                <li className="flex gap-3">
                  <FiPhone className="text-brand-600 mt-0.5 shrink-0" size={16} />
                  <a href="tel:+12125550100" className="hover:text-brand-600 transition-colors">+1 (212) 555-0100</a>
                </li>
              </ul>
            </div>

            <div className="card p-6">
              <h2 className="font-serif font-bold text-lg mb-3">Opening Hours</h2>
              <ul className="text-sm text-gray-600 space-y-1.5">
                <li className="flex justify-between"><span>Mon – Fri</span><span>9:00 AM – 7:00 PM</span></li>
                <li className="flex justify-between"><span>Saturday</span><span>10:00 AM – 6:00 PM</span></li>
                <li className="flex justify-between"><span>Sunday</span><span>Closed</span></li>
              </ul>
            </div>
          </div>

          {/* Contact form */}
          <div className="lg:col-span-2 card p-8">
            <h2 className="font-serif font-bold text-xl mb-6">Send a Message</h2>
            <ContactForm />
          </div>
        </div>
      </div>
    </Layout>
  );
}
