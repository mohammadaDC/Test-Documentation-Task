import Link from 'next/link';
import { FiFacebook, FiTwitter, FiInstagram } from 'react-icons/fi';

export default function Footer() {
  return (
    <footer className="bg-navy-900 text-gray-300 pt-12 pb-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-10">

          {/* Brand */}
          <div>
            <h3 className="text-white font-serif text-xl font-bold mb-3">📚 PageTurner Books</h3>
            <p className="text-sm leading-relaxed text-gray-400">
              Your independent bookstore for curated reads, original publications, and a love of stories.
            </p>
            <div className="flex gap-4 mt-4">
              <a href="#" aria-label="Facebook"  className="hover:text-white transition-colors"><FiFacebook size={18} /></a>
              <a href="#" aria-label="Twitter"   className="hover:text-white transition-colors"><FiTwitter  size={18} /></a>
              <a href="#" aria-label="Instagram" className="hover:text-white transition-colors"><FiInstagram size={18} /></a>
            </div>
          </div>

          {/* Shop */}
          <div>
            <h4 className="text-white font-semibold mb-3 uppercase tracking-wide text-sm">Shop</h4>
            <ul className="space-y-2 text-sm">
              {['Browse Books', 'New Arrivals', 'Best Sellers', 'Our Publications'].map((item) => (
                <li key={item}>
                  <Link href={item === 'Our Publications' ? '/publications' : '/books'} className="hover:text-white transition-colors">
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="text-white font-semibold mb-3 uppercase tracking-wide text-sm">Company</h4>
            <ul className="space-y-2 text-sm">
              {[
                { label: 'About Us',   href: '/#about' },
                { label: 'Contact',    href: '/contact' },
                { label: 'Blog',       href: '/blog' },
                { label: 'Careers',    href: '/careers' },
              ].map((item) => (
                <li key={item.label}>
                  <Link href={item.href} className="hover:text-white transition-colors">{item.label}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Help */}
          <div>
            <h4 className="text-white font-semibold mb-3 uppercase tracking-wide text-sm">Help</h4>
            <ul className="space-y-2 text-sm">
              {[
                { label: 'FAQ',             href: '/faq' },
                { label: 'Shipping Policy', href: '/shipping' },
                { label: 'Returns',         href: '/returns' },
                { label: 'Privacy Policy',  href: '/privacy' },
              ].map((item) => (
                <li key={item.label}>
                  <Link href={item.href} className="hover:text-white transition-colors">{item.label}</Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="border-t border-navy-700 pt-6 text-center text-xs text-gray-500">
          &copy; {new Date().getFullYear()} PageTurner Books. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
