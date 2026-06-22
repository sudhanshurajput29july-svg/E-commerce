import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { SlidersHorizontal, Search, Star, X } from 'lucide-react';
import api from '../../services/api.js';
import ProductCard from '../../components/Customer/ProductCard.jsx';
import { SkeletonCard } from '../../components/Common/Skeleton.jsx';

const Shop = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // Parse initial query params from URL
  const queryParams = new URLSearchParams(location.search);
  const initialCategory = queryParams.get('category') || '';
  const initialSearch = queryParams.get('search') || '';

  // Filter States
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [searchQuery, setSearchQuery] = useState(initialSearch);
  const [brandFilter, setBrandFilter] = useState('');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [minRating, setMinRating] = useState('');
  const [sortOption, setSortOption] = useState('newest');

  // UI States
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  // Sync category and search when location query changes
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    setSelectedCategory(params.get('category') || '');
    setSearchQuery(params.get('search') || '');
  }, [location.search]);

  // Fetch Categories
  useEffect(() => {
    const fetchCats = async () => {
      try {
        const res = await api.get('/categories');
        setCategories(res.data);
      } catch (error) {
        console.error('Error fetching categories:', error.message);
      }
    };
    fetchCats();
  }, []);

  // Fetch Products
  const fetchProducts = async () => {
    setLoading(true);
    try {
      let url = `/products?sort=${sortOption}`;
      if (selectedCategory) url += `&category=${selectedCategory}`;
      if (searchQuery) url += `&search=${encodeURIComponent(searchQuery)}`;
      if (brandFilter) url += `&brand=${encodeURIComponent(brandFilter)}`;
      if (minPrice) url += `&minPrice=${minPrice}`;
      if (maxPrice) url += `&maxPrice=${maxPrice}`;
      if (minRating) url += `&rating=${minRating}`;

      const res = await api.get(url);
      setProducts(res.data.products);
    } catch (error) {
      console.error('Error loading products:', error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [selectedCategory, searchQuery, brandFilter, minPrice, maxPrice, minRating, sortOption]);

  const handleClearFilters = () => {
    setSelectedCategory('');
    setSearchQuery('');
    setBrandFilter('');
    setMinPrice('');
    setMaxPrice('');
    setMinRating('');
    setSortOption('newest');
    navigate('/shop');
  };

  const uniqueBrands = ['Quantum', 'ApexTech', 'AuraFashion', 'NordicHome', 'GlowOrganics'];

  // Sidebar Filter Form Content
  const FilterSidebarContent = () => (
    <div className="space-y-6">
      {/* Search Input inside Filter */}
      <div>
        <label className="block text-2xs font-bold text-slate-500 uppercase tracking-wider mb-2 dark:text-slate-400">Search Products</label>
        <div className="relative">
          <input
            type="text"
            placeholder="Type keyboard, mug..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2 pl-9 pr-3 text-xs focus:outline-none dark:bg-slate-900 dark:border-slate-700 dark:text-white"
          />
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
        </div>
      </div>

      {/* Category Selection */}
      <div>
        <label className="block text-2xs font-bold text-slate-500 uppercase tracking-wider mb-2 dark:text-slate-400">Categories</label>
        <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
          <button
            onClick={() => setSelectedCategory('')}
            className={`w-full text-left text-xs px-2 py-1.5 rounded-lg transition ${
              selectedCategory === ''
                ? 'bg-indigo-50 text-indigo-700 font-bold dark:bg-slate-800 dark:text-indigo-400'
                : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-800'
            }`}
          >
            All Categories
          </button>
          {categories.map((cat) => (
            <button
              key={cat._id}
              onClick={() => setSelectedCategory(cat.slug)}
              className={`w-full text-left text-xs px-2 py-1.5 rounded-lg transition ${
                selectedCategory === cat.slug
                  ? 'bg-indigo-50 text-indigo-700 font-bold dark:bg-slate-800 dark:text-indigo-400'
                  : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-800'
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>
      </div>

      {/* Brand Selection */}
      <div>
        <label className="block text-2xs font-bold text-slate-500 uppercase tracking-wider mb-2 dark:text-slate-400">Brand</label>
        <select
          value={brandFilter}
          onChange={(e) => setBrandFilter(e.target.value)}
          className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs focus:outline-none dark:bg-slate-900 dark:border-slate-700 dark:text-white"
        >
          <option value="">All Brands</option>
          {uniqueBrands.map((brand) => (
            <option key={brand} value={brand}>{brand}</option>
          ))}
        </select>
      </div>

      {/* Price Selection */}
      <div>
        <label className="block text-2xs font-bold text-slate-500 uppercase tracking-wider mb-2 dark:text-slate-400">Price Range (₹)</label>
        <div className="flex items-center space-x-2">
          <input
            type="number"
            placeholder="Min"
            value={minPrice}
            onChange={(e) => setMinPrice(e.target.value)}
            className="w-1/2 bg-slate-50 border border-slate-200 rounded-xl p-2 text-xs focus:outline-none text-center dark:bg-slate-900 dark:border-slate-700 dark:text-white"
          />
          <span className="text-slate-400 text-xs">-</span>
          <input
            type="number"
            placeholder="Max"
            value={maxPrice}
            onChange={(e) => setMaxPrice(e.target.value)}
            className="w-1/2 bg-slate-50 border border-slate-200 rounded-xl p-2 text-xs focus:outline-none text-center dark:bg-slate-900 dark:border-slate-700 dark:text-white"
          />
        </div>
      </div>

      {/* Rating Selection */}
      <div>
        <label className="block text-2xs font-bold text-slate-500 uppercase tracking-wider mb-2 dark:text-slate-400">Min Rating</label>
        <div className="space-y-1">
          {[4, 3, 2].map((starVal) => (
            <button
              key={starVal}
              onClick={() => setMinRating(starVal.toString())}
              className={`w-full flex items-center space-x-2 text-left text-xs px-2 py-1.5 rounded-lg transition ${
                minRating === starVal.toString()
                  ? 'bg-indigo-50 text-indigo-700 font-bold dark:bg-slate-800 dark:text-indigo-400'
                  : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-800'
              }`}
            >
              <span className="flex text-amber-400">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className={`h-3.5 w-3.5 ${i < starVal ? 'fill-current' : 'text-slate-200 dark:text-slate-700'}`} />
                ))}
              </span>
              <span>& Up</span>
            </button>
          ))}
        </div>
      </div>

      {/* Reset Button */}
      <button
        onClick={handleClearFilters}
        className="w-full py-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-bold text-xs rounded-xl transition"
      >
        Clear Filters
      </button>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Toolbar / Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-slate-100 pb-5 mb-8 dark:border-slate-800 gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-800 dark:text-white">Product Catalog</h1>
          <p className="text-xs text-slate-400">Showing {products.length} products</p>
        </div>

        <div className="flex items-center space-x-3 w-full sm:w-auto">
          {/* Mobile Filter Button */}
          <button
            onClick={() => setMobileFiltersOpen(true)}
            className="flex sm:hidden items-center justify-center space-x-2 px-4 py-2 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800 flex-1"
          >
            <SlidersHorizontal className="h-4 w-4" />
            <span>Filters</span>
          </button>

          {/* Sort Selector */}
          <div className="flex items-center space-x-2 flex-1 sm:flex-initial justify-end">
            <span className="text-2xs text-slate-400 hidden md:inline font-semibold uppercase tracking-wider">Sort By</span>
            <select
              value={sortOption}
              onChange={(e) => setSortOption(e.target.value)}
              className="bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold text-slate-700 focus:outline-none dark:bg-slate-850 dark:border-slate-700 dark:text-white focus:ring-1 focus:ring-indigo-500"
            >
              <option value="newest">Newest First</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="rating">Highest Rated</option>
            </select>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Left: Desktop Filters Panel */}
        <aside className="hidden lg:block lg:col-span-1 bg-white p-6 rounded-3xl border border-slate-100 dark:bg-slate-800 dark:border-slate-750 shadow-2xs h-fit sticky top-20">
          <FilterSidebarContent />
        </aside>

        {/* Right: Products Listings Grid */}
        <div className="lg:col-span-3">
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => <SkeletonCard key={i} />)}
            </div>
          ) : products.length === 0 ? (
            <div className="bg-white p-12 text-center rounded-3xl border border-slate-100 dark:bg-slate-800 dark:border-slate-700 text-xs text-slate-400">
              No products found matching the criteria. Try clearing some filters.
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {products.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Mobile Sidebar Overlay Drawer */}
      {mobileFiltersOpen && (
        <div className="fixed inset-0 z-50 flex lg:hidden">
          <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs" onClick={() => setMobileFiltersOpen(false)}></div>
          <div className="relative ml-auto flex h-full w-full max-w-xs flex-col overflow-y-auto bg-white dark:bg-slate-950 py-4 pb-12 shadow-xl px-5 transition duration-300">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-5 dark:border-slate-850">
              <span className="font-bold text-sm text-slate-800 dark:text-white">Filter Criteria</span>
              <button onClick={() => setMobileFiltersOpen(false)} className="text-slate-400 hover:text-slate-500">
                <X className="h-5 w-5" />
              </button>
            </div>
            <FilterSidebarContent />
          </div>
        </div>
      )}
    </div>
  );
};

export default Shop;
