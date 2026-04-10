import Layout from '../components/Layout';
import HeroBanner from '../components/HeroBanner';
import BookCard from '../components/BookCard';
import NewsletterSignup from '../components/NewsletterSignup';
import Link from 'next/link';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export async function getStaticProps() {
  try {
    const res = await fetch(`${API_URL}/api/books?featured=true&limit=8`);
    const data = await res.json();
    return { props: { featuredBooks: data.books || [] }, revalidate: 60 };
  } catch {
    return { props: { featuredBooks: [] }, revalidate: 60 };
  }
}

export default function HomePage({ featuredBooks }) {
  return (
    <Layout>
      <HeroBanner />

      {/* Featured books section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <h2 className="section-title">Featured Books</h2>
          <p className="section-subtitle">Hand-picked titles our team loves right now</p>
        </div>
        {featuredBooks.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
            {featuredBooks.map((book) => (
              <BookCard key={book.id} book={book} />
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-400">No featured books yet — check back soon!</p>
        )}
        <div className="text-center mt-10">
          <Link href="/books" className="btn-primary">Browse All Books</Link>
        </div>
      </section>

      {/* About / trust section */}
      <section id="about" className="bg-brand-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="section-title">About PageTurner Books</h2>
              <p className="text-gray-600 leading-relaxed mb-4">
                We are an independent bookstore dedicated to connecting readers with stories that matter. From beloved classics to debut novels and our own original publications, every book on our shelves is chosen with care.
              </p>
              <p className="text-gray-600 leading-relaxed mb-6">
                Founded by a small team of passionate readers, we believe books have the power to change perspectives, spark conversations, and build community.
              </p>
              <Link href="/publications" className="btn-outline">
                Discover Our Publications
              </Link>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {[
                { value: '10k+', label: 'Titles Available' },
                { value: '50k+', label: 'Happy Readers' },
                { value: '15+', label: 'Original Publications' },
                { value: '4.9★', label: 'Average Rating' },
              ].map((stat) => (
                <div key={stat.label} className="card p-6 text-center">
                  <div className="text-3xl font-bold text-brand-600 mb-1">{stat.value}</div>
                  <div className="text-sm text-gray-500">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <NewsletterSignup />
    </Layout>
  );
}
