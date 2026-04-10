export default function FilterSidebar({ categories, filters, onChange }) {
  return (
    <aside className="w-full lg:w-64 shrink-0">
      <div className="card p-5 space-y-6">
        <h2 className="font-serif font-bold text-lg text-navy-800">Filters</h2>

        {/* Search */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Search</label>
          <input
            type="text"
            value={filters.search}
            onChange={(e) => onChange({ ...filters, search: e.target.value, page: 1 })}
            placeholder="Title or author…"
            className="input-field text-sm"
          />
        </div>

        {/* Category */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
          <div className="space-y-1.5">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="category"
                value=""
                checked={!filters.category}
                onChange={() => onChange({ ...filters, category: '', page: 1 })}
                className="accent-brand-600"
              />
              <span className="text-sm text-gray-700">All Categories</span>
            </label>
            {categories.map((cat) => (
              <label key={cat.id} className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="category"
                  value={cat.slug}
                  checked={filters.category === cat.slug}
                  onChange={() => onChange({ ...filters, category: cat.slug, page: 1 })}
                  className="accent-brand-600"
                />
                <span className="text-sm text-gray-700">{cat.name}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Price range */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Max Price: ${filters.maxPrice}</label>
          <input
            type="range"
            min="0"
            max="100"
            step="5"
            value={filters.maxPrice}
            onChange={(e) => onChange({ ...filters, maxPrice: e.target.value, page: 1 })}
            className="w-full accent-brand-600"
          />
          <div className="flex justify-between text-xs text-gray-400 mt-1">
            <span>$0</span>
            <span>$100</span>
          </div>
        </div>

        {/* Sort */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Sort By</label>
          <select
            value={filters.sort}
            onChange={(e) => onChange({ ...filters, sort: e.target.value, page: 1 })}
            className="input-field text-sm"
          >
            <option value="newest">Newest First</option>
            <option value="price_asc">Price: Low to High</option>
            <option value="price_desc">Price: High to Low</option>
            <option value="title_asc">Title: A–Z</option>
          </select>
        </div>

        {/* Reset */}
        <button
          onClick={() => onChange({ search: '', category: '', maxPrice: 100, sort: 'newest', page: 1 })}
          className="w-full text-sm text-brand-600 hover:text-brand-700 font-medium"
        >
          Reset Filters
        </button>
      </div>
    </aside>
  );
}
