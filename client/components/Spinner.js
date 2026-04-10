export default function Spinner({ size = 'md', className = '' }) {
  const sizes = { sm: 'w-4 h-4', md: 'w-8 h-8', lg: 'w-12 h-12' };
  return (
    <div className={`inline-block animate-spin rounded-full border-2 border-gray-200 border-t-brand-600 ${sizes[size]} ${className}`} role="status">
      <span className="sr-only">Loading…</span>
    </div>
  );
}

export function PageLoader() {
  return (
    <div className="flex items-center justify-center min-h-[40vh]">
      <Spinner size="lg" />
    </div>
  );
}
