import Layout from '../components/Layout';
import BookCard from '../components/BookCard';
import NewsletterSignup from '../components/NewsletterSignup';
import Link from 'next/link';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export async function getStaticProps() {
  try {
    const res  = await fetch(`${API_URL}/api/books?isPublication=true&limit=50`);
    const data = await res.json();
    return { props: { publications: data.books || [] }, revalidate: 60 };
  } catch {
    return { props: { publications: [] }, revalidate: 60 };
  }
}

export default function PublicationsPage({ publications }) {
  return (
    <Layout title="Our Publications – PageTurner Books" description="Original books published by the PageTurner Books editorial team.">
      {/* Hero */}
      <section className="bg-navy-900 text-white py-16 text-center">
        <div className="max-w-2xl mx-auto px-4">
          <span className="inline-block bg-brand-600 text-white text-xs font-semibold uppercase tracking-widest px-3 py-1 rounded-full mb-4">
            Our Own Titles
          </span>
          <h1 className="text-4xl font-serif font-bold mb-4">Our Publications</h1>
          <p className="text-gray-300 leading-relaxed">
            Beyond curating titles from around the world, we publish our own books — carefully crafted anthologies, essays, and works from emerging voices we believe in.
          </p>
        </div>
      </section>

      {/* Books grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        {publications.length > 0 ? (
          <>
            <p className="text-gray-500 mb-8">{publications.length} original publication{publications.length !== 1 ? 's' : ''}</p>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
              {publications.map((book) => <BookCard key={book.id} book={book} />)}
            </div>
          </>
        ) : (
          <div className="text-center py-20 text-gray-400">
            <div className="text-5xl mb-4">✍️</div>
            <p>Our first publications are coming soon!</p>
            <Link href="/books" className="btn-primary mt-6 inline-block">Browse All Books</Link>
          </div>
        )}
      </section>

      {/* Mission */}
      <section className="bg-brand-50 py-14">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <h2 className="section-title">Why We Publish</h2>
          <p className="text-gray-600 leading-relaxed mb-4">
            Publishing is at the heart of who we are. We work directly with authors — from first-time writers to established voices — to bring stories to life that might otherwise go untold.
          </p>
          <p className="text-gray-600 leading-relaxed">
            Every publication is a labour of love: thoughtfully edited, beautifully designed, and distributed worldwide through our online store and partner retailers.
          </p>
          <Link href="/contact" className="btn-primary mt-8 inline-block">Enquire About Publishing With Us</Link>
        </div>
      </section>

      <NewsletterSignup />
    </Layout>
  );
}
