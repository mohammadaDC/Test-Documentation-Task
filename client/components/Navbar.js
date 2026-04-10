import Link from 'next/link';
import { useState } from 'react';
import { FiShoppingCart, FiMenu, FiX, FiUser, FiSearch } from 'react-icons/fi';
import { useCart } from '../hooks/useCart';
import { useAuth } from '../hooks/useAuth';

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const { itemCount } = useCart();
  const { user, logout } = useAuth();

  const navLinks = [
    { href: '/books', label: 'Browse Books' },
    { href: '/publications', label: 'Our Publications' },
    { href: '/contact', label: 'Contact' },
  ];

  return (
    <header className="sticky top-0 z-50 bg-navy-900 text-white shadow-md">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 text-xl font-serif font-bold text-brand-300 hover:text-brand-200 transition-colors">
            <span className="text-2xl">📚</span>
            PageTurner Books
          </Link>

          {/* Desktop nav links */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link key={link.href} href={link.href} className="text-gray-300 hover:text-white transition-colors font-medium">
                {link.label}
              </Link>
            ))}
          </div>

          {/* Right side actions */}
          <div className="flex items-center gap-4">
            <Link href="/books?search=true" className="text-gray-300 hover:text-white transition-colors hidden sm:block">
              <FiSearch size={20} />
            </Link>

            {/* Cart icon with badge */}
            <Link href="/cart" className="relative text-gray-300 hover:text-white transition-colors">
              <FiShoppingCart size={22} />
              {itemCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-brand-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center font-bold">
                  {itemCount > 99 ? '99+' : itemCount}
                </span>
              )}
            </Link>

            {/* User menu */}
            {user ? (
              <div className="relative group hidden sm:block">
                <button className="flex items-center gap-1 text-gray-300 hover:text-white transition-colors">
                  <FiUser size={20} />
                  <span className="text-sm">{user.name.split(' ')[0]}</span>
                </button>
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-1 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                  <Link href="/profile" className="block px-4 py-2 text-gray-700 hover:bg-gray-50 text-sm">My Profile</Link>
                  <Link href="/orders" className="block px-4 py-2 text-gray-700 hover:bg-gray-50 text-sm">My Orders</Link>
                  <button onClick={logout} className="block w-full text-left px-4 py-2 text-red-600 hover:bg-gray-50 text-sm">Logout</button>
                </div>
              </div>
            ) : (
              <Link href="/auth/login" className="hidden sm:block text-sm font-medium bg-brand-600 hover:bg-brand-700 text-white px-4 py-1.5 rounded-lg transition-colors">
                Sign In
              </Link>
            )}

            {/* Mobile hamburger */}
            <button className="md:hidden text-gray-300 hover:text-white" onClick={() => setMenuOpen(!menuOpen)}>
              {menuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {menuOpen && (
          <div className="md:hidden pb-4 border-t border-navy-700 mt-2 pt-3 space-y-2">
            {navLinks.map((link) => (
              <Link key={link.href} href={link.href} className="block text-gray-300 hover:text-white py-1.5 transition-colors" onClick={() => setMenuOpen(false)}>
                {link.label}
              </Link>
            ))}
            {user ? (
              <>
                <Link href="/profile" className="block text-gray-300 hover:text-white py-1.5" onClick={() => setMenuOpen(false)}>My Profile</Link>
                <button onClick={() => { logout(); setMenuOpen(false); }} className="text-red-400 hover:text-red-300 py-1.5">Logout</button>
              </>
            ) : (
              <Link href="/auth/login" className="block text-brand-300 hover:text-brand-200 py-1.5 font-medium" onClick={() => setMenuOpen(false)}>Sign In</Link>
            )}
          </div>
        )}
      </nav>
    </header>
  );
}
