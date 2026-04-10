import { Component } from 'react';
import Link from 'next/link';

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, info) {
    console.error('[ErrorBoundary] Uncaught error:', error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] px-4 text-center">
          <div className="text-6xl mb-6">📚</div>
          <h2 className="text-2xl font-serif font-bold text-navy-900 mb-2">Something went wrong</h2>
          <p className="text-gray-500 mb-6 max-w-md">
            An unexpected error occurred. Please try refreshing the page or returning home.
          </p>
          {process.env.NODE_ENV === 'development' && this.state.error && (
            <pre className="text-left text-xs bg-red-50 border border-red-200 text-red-700 rounded-lg p-4 mb-6 max-w-xl overflow-auto">
              {this.state.error.toString()}
            </pre>
          )}
          <div className="flex gap-4">
            <button
              onClick={() => this.setState({ hasError: false, error: null })}
              className="btn-outline"
            >
              Try Again
            </button>
            <Link href="/" className="btn-primary">Go Home</Link>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}
