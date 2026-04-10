import '../styles/globals.css';
import { CartProvider } from '../context/CartContext';
import { AuthProvider } from '../context/AuthContext';
import ErrorBoundary from '../components/ErrorBoundary';

export default function App({ Component, pageProps }) {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <CartProvider>
          <ErrorBoundary>
            <Component {...pageProps} />
          </ErrorBoundary>
        </CartProvider>
      </AuthProvider>
    </ErrorBoundary>
  );
}
