import Link from 'next/link';

export default function HeroBanner() {
  return (
    <section
      className="relative bg-navy-900 text-white overflow-hidden"
      style={{ minHeight: '520px' }}
    >
      {/* Background gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-navy-900 via-navy-800 to-brand-900 opacity-95" />

      {/* Decorative circles */}
      <div className="absolute -top-20 -right-20 w-96 h-96 bg-brand-600 rounded-full opacity-10 blur-3xl" />
      <div className="absolute bottom-0 left-10 w-72 h-72 bg-navy-700 rounded-full opacity-20 blur-2xl" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 flex flex-col lg:flex-row items-center gap-12">

        {/* Text content */}
        <div className="flex-1 text-center lg:text-left">
          <span className="inline-block bg-brand-600 text-white text-xs font-semibold uppercase tracking-widest px-3 py-1 rounded-full mb-4">
            Independent Bookstore
          </span>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-serif font-bold leading-tight mb-6">
            Discover Your Next<br />
            <span className="text-brand-300">Great Read</span>
          </h1>
          <p className="text-gray-300 text-lg max-w-xl mx-auto lg:mx-0 mb-8">
            Browse thousands of curated titles across every genre — fiction, science, history, children's books, and our very own publications. Free shipping on orders over $30.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
            <Link href="/books" className="btn-primary text-center">
              Shop All Books
            </Link>
            <Link href="/publications" className="btn-outline border-white text-white hover:bg-white hover:text-navy-900 text-center">
              Our Publications
            </Link>
          </div>
        </div>

        {/* Feature cards */}
        <div className="flex-1 grid grid-cols-2 gap-4 w-full max-w-sm mx-auto lg:max-w-none">
          {[
            { icon: '🚚', title: 'Free Shipping', desc: 'On orders over $30' },
            { icon: '🔒', title: 'Secure Checkout', desc: 'Powered by Stripe' },
            { icon: '📖', title: '10,000+ Titles', desc: 'Across all genres' },
            { icon: '✍️', title: 'Our Publications', desc: 'Original authors' },
          ].map((item) => (
            <div key={item.title} className="bg-white/10 backdrop-blur rounded-xl p-4 text-center hover:bg-white/20 transition-colors">
              <div className="text-3xl mb-2">{item.icon}</div>
              <div className="font-semibold text-sm">{item.title}</div>
              <div className="text-xs text-gray-300 mt-0.5">{item.desc}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
