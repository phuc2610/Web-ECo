import React, { useContext, useEffect, useState, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { ShopContext } from '../context/ShopContext';
import ProductItem from '../components/ProductItem';
import PageTransition from '../components/PageTransition';

// Expanded Categories for Minh Tuấn Shop (Using Home Page CellphoneS SVG Icons)
const CATEGORIES = [
  { id: 'Điện thoại', label: 'Điện thoại', icon: 'https://dashboard.cellphones.com.vn/storage/icon-homepage-mobile.svg' },
  { id: 'Laptop', label: 'Laptop', icon: 'https://dashboard.cellphones.com.vn/storage/icon-homepage-laptop.svg' },
  { id: 'Máy tính bảng', label: 'Máy tính bảng', icon: 'https://dashboard.cellphones.com.vn/storage/icon-homepage-mobile.svg' },
  { id: 'PC', label: 'PC Gaming & Đồ họa', icon: 'https://dashboard.cellphones.com.vn/storage/icon-homepage-pc.svg' },
  { id: 'Màn hình', label: 'Màn hình', icon: 'https://dashboard.cellphones.com.vn/storage/icon-homepage-pc.svg' },
  { id: 'Linh kiện máy tính', label: 'Linh kiện máy tính', icon: 'https://dashboard.cellphones.com.vn/storage/icon-homepage-pc.svg' },
  { id: 'Phụ kiện máy tính', label: 'Phụ kiện máy tính', icon: 'https://dashboard.cellphones.com.vn/storage/icon-homepage-accessories.svg' },
  { id: 'Phụ kiện di động', label: 'Phụ kiện di động', icon: 'https://dashboard.cellphones.com.vn/storage/icon-homepage-audio-2.svg' },
];

// Dynamic Brand mapping based on category
const CATEGORY_BRANDS = {
  'Điện thoại': ['Apple', 'Samsung', 'Xiaomi', 'OPPO', 'Vivo', 'Realme', 'Google Pixel', 'Asus'],
  'Máy tính bảng': ['Apple', 'Samsung', 'Xiaomi', 'Lenovo'],
  'Laptop': ['Apple', 'Dell', 'Asus', 'HP', 'Lenovo', 'MSI', 'Acer'],
  'PC': ['Minh Tuấn Gaming', 'Minh Tuấn Workstation', 'Asus', 'MSI'],
  'Màn hình': ['Samsung', 'LG', 'Dell', 'Asus', 'Acer', 'ViewSonic'],
  'Linh kiện máy tính': ['Intel', 'AMD', 'NVIDIA', 'Asus', 'MSI', 'Gigabyte', 'Corsair', 'Kingston'],
  'Phụ kiện máy tính': ['Logitech', 'Razer', 'Corsair', 'FL-Esports', 'Akko'],
  'Phụ kiện di động': ['Apple', 'Samsung', 'Anker', 'Baseus', 'Ugreen', 'Sony', 'Belkin'],
};

const PRICE_RANGES = [
  { id: 'all', label: 'Tất cả mức giá', min: 0, max: Infinity },
  { id: 'under5', label: 'Dưới 5 triệu', min: 0, max: 5000000 },
  { id: '5to15', label: '5 - 15 triệu', min: 5000000, max: 15000000 },
  { id: '15to30', label: '15 - 30 triệu', min: 15000000, max: 30000000 },
  { id: 'above30', label: 'Trên 30 triệu', min: 30000000, max: Infinity },
];

// CellphoneS Subcategory quick-pills with authentic real-device photos
const QUICK_DEVICE_FILTERS = {
  default: [
    { label: 'Tất cả', brand: null, keyword: null, image: null },
    { label: 'Củ cáp', brand: null, keyword: 'Sạc', image: 'https://images.unsplash.com/photo-1583863788434-e58a36330cf0?w=100' },
    { label: 'Chuột, bàn phím', brand: 'Logitech', keyword: 'Bàn phím', image: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=100' },
    { label: 'Sạc dự phòng', brand: 'Anker', keyword: 'Dự phòng', image: 'https://images.unsplash.com/photo-1609592424361-9c87422f51f0?w=100' },
    { label: 'Camera', brand: null, keyword: 'Camera', image: 'https://images.unsplash.com/photo-1557597774-9d273605dfa9?w=100' },
    { label: 'Phụ kiện Apple', brand: 'Apple', keyword: 'AirPods', image: 'https://images.unsplash.com/photo-1600294037681-c80b4cb5b434?w=100' },
    { label: 'Phụ kiện tiện ích', brand: null, keyword: 'Phụ kiện', image: 'https://images.unsplash.com/photo-1585338107529-13afc5f02586?w=100' },
    { label: 'Ốp lưng & Bao da', brand: null, keyword: 'Ốp lưng', image: 'https://images.unsplash.com/photo-1601784551446-20c9e07cdbdb?w=100' },
  ],
  'Điện thoại': [
    { label: 'Tất cả', brand: null, keyword: null, image: null },
    { label: 'iPhone', brand: 'Apple', keyword: 'iPhone', image: 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=100' },
    { label: 'Samsung Galaxy', brand: 'Samsung', keyword: 'Galaxy', image: 'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=100' },
    { label: 'Xiaomi', brand: 'Xiaomi', keyword: 'Xiaomi', image: 'https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=100' },
    { label: 'OPPO', brand: 'OPPO', keyword: 'OPPO', image: 'https://images.unsplash.com/photo-1574944985070-8f3ebc6b79d2?w=100' },
    { label: 'vivo', brand: 'Vivo', keyword: 'vivo', image: 'https://images.unsplash.com/photo-1580910051074-3eb694886505?w=100' },
    { label: 'Điện thoại Gaming', brand: 'Asus', keyword: 'ROG', image: 'https://images.unsplash.com/photo-1567581935884-3349723552ca?w=100' }
  ],
  'Laptop': [
    { label: 'Tất cả', brand: null, keyword: null, image: null },
    { label: 'MacBook', brand: 'Apple', keyword: 'MacBook', image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=100' },
    { label: 'ASUS ROG', brand: 'Asus', keyword: 'ROG', image: 'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=100' },
    { label: 'Dell XPS', brand: 'Dell', keyword: 'XPS', image: 'https://images.unsplash.com/photo-1593642632823-8f785ba67e45?w=100' },
    { label: 'Lenovo Legion', brand: 'Lenovo', keyword: 'Legion', image: 'https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=100' },
    { label: 'Laptop Gaming', brand: null, keyword: 'Gaming', image: 'https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=100' }
  ]
};

const Collection = () => {
  const { products, search, showSearch } = useContext(ShopContext);
  const [searchParams, setSearchParams] = useSearchParams();

  // Filters State
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedBrands, setSelectedBrands] = useState([]);
  const [selectedPriceRange, setSelectedPriceRange] = useState('all');
  const [onlyInStock, setOnlyInStock] = useState(false);
  const [sortType, setSortType] = useState('relevant');
  const [showMobileFilter, setShowMobileFilter] = useState(false);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 16;

  // Initialize from URL query params
  useEffect(() => {
    const categoryParam = searchParams.get('category');
    const brandParam = searchParams.get('brand');

    if (categoryParam) {
      if (categoryParam === 'sale') {
        // special case
      } else {
        setSelectedCategories([categoryParam]);
      }
    }
    if (brandParam) {
      setSelectedBrands([brandParam]);
    }
  }, [searchParams]);

  // Compute available brands dynamically
  const availableBrands = useMemo(() => {
    if (selectedCategories.length === 0) {
      // Return top brands across all categories
      const allBrandsSet = new Set();
      Object.values(CATEGORY_BRANDS).forEach(list => list.forEach(b => allBrandsSet.add(b)));
      return Array.from(allBrandsSet);
    }
    const brandsSet = new Set();
    selectedCategories.forEach(cat => {
      const list = CATEGORY_BRANDS[cat] || [];
      list.forEach(b => brandsSet.add(b));
    });
    return Array.from(brandsSet);
  }, [selectedCategories]);

  // Toggle Category
  const toggleCategory = (catId) => {
    setSelectedCategories(prev =>
      prev.includes(catId) ? prev.filter(c => c !== catId) : [...prev, catId]
    );
    setCurrentPage(1);
  };

  // Toggle Brand
  const toggleBrand = (brandName) => {
    setSelectedBrands(prev =>
      prev.includes(brandName) ? prev.filter(b => b !== brandName) : [...prev, brandName]
    );
    setCurrentPage(1);
  };

  // Clear all filters
  const clearAllFilters = () => {
    setSelectedCategories([]);
    setSelectedBrands([]);
    setSelectedPriceRange('all');
    setOnlyInStock(false);
    setSortType('relevant');
    setCurrentPage(1);
    setSearchParams({});
  };

  // Filtered & Sorted products
  const filteredProducts = useMemo(() => {
    let result = [...products];

    // Search query (from global search or params)
    const activeSearch = (showSearch && search) ? search : searchParams.get('q') || '';
    if (activeSearch.trim()) {
      const q = activeSearch.toLowerCase().trim();
      result = result.filter(p =>
        p.name?.toLowerCase().includes(q) ||
        p.brand?.toLowerCase().includes(q) ||
        p.category?.toLowerCase().includes(q)
      );
    }

    // Sale parameter
    if (searchParams.get('category') === 'sale') {
      result = result.filter(p => (p.originalPrice && p.originalPrice > p.price) || p.bestseller);
    }

    // Category filter
    if (selectedCategories.length > 0) {
      result = result.filter(p => selectedCategories.includes(p.category));
    }

    // Brand filter (checking brand field and subCategory field for safety)
    if (selectedBrands.length > 0) {
      result = result.filter(p => {
        const itemBrand = (p.brand || p.subCategory || '').toLowerCase();
        return selectedBrands.some(b => itemBrand.includes(b.toLowerCase()));
      });
    }

    // Price range filter
    const activeRange = PRICE_RANGES.find(r => r.id === selectedPriceRange);
    if (activeRange && activeRange.id !== 'all') {
      result = result.filter(p => p.price >= activeRange.min && p.price <= activeRange.max);
    }

    // Only in-stock
    if (onlyInStock) {
      result = result.filter(p => (p.stockQuantity ?? 10) > 0);
    }

    // Sorting
    switch (sortType) {
      case 'low-high':
        result.sort((a, b) => a.price - b.price);
        break;
      case 'high-low':
        result.sort((a, b) => b.price - a.price);
        break;
      case 'newest':
        result.sort((a, b) => new Date(b.date || 0) - new Date(a.date || 0));
        break;
      case 'rating':
        result.sort((a, b) => (b.averageRating || 5) - (a.averageRating || 5));
        break;
      default: // relevant / bestseller
        result.sort((a, b) => (b.bestseller ? 1 : 0) - (a.bestseller ? 1 : 0));
        break;
    }

    return result;
  }, [products, search, showSearch, searchParams, selectedCategories, selectedBrands, selectedPriceRange, onlyInStock, sortType]);

  // Pagination calculation
  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);
  const paginatedProducts = useMemo(() => {
    const start = (currentPage - 1) * productsPerPage;
    return filteredProducts.slice(start, start + productsPerPage);
  }, [filteredProducts, currentPage, productsPerPage]);

  const hasActiveFilters = selectedCategories.length > 0 || selectedBrands.length > 0 || selectedPriceRange !== 'all' || onlyInStock;

  return (
    <PageTransition>
      <div className='min-h-screen bg-slate-50 py-6 sm:py-8'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>

          {/* Top Breadcrumb & Title Bar */}
          <div className='flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-4 sm:p-5 rounded-2xl border border-slate-100 shadow-sm mb-4'>
            <div>
              <div className='flex items-center gap-2 text-xs text-slate-500 mb-1'>
                <span className='hover:text-[#d70018] cursor-pointer'>Trang chủ</span>
                <span>/</span>
                <span className='text-[#d70018] font-bold'>
                  {selectedCategories.length === 1 ? selectedCategories[0] : 'Sản phẩm công nghệ'}
                </span>
              </div>
              <h1 className='text-xl sm:text-2xl font-black text-slate-900 flex items-center gap-2'>
                {selectedCategories.length === 1 ? selectedCategories[0] : 'Tất Cả Thiết Bị'}
                <span className='text-xs font-bold bg-red-100 text-[#d70018] px-2.5 py-0.5 rounded-full'>
                  {filteredProducts.length} sản phẩm
                </span>
              </h1>
            </div>

            {/* Actions: Mobile Filter Toggle + Sorting */}
            <div className='flex items-center gap-3 self-end sm:self-auto w-full sm:w-auto justify-between'>
              <button
                onClick={() => setShowMobileFilter(true)}
                className='lg:hidden flex items-center gap-2 px-4 py-2 bg-red-50 hover:bg-red-100 text-[#d70018] rounded-xl text-xs font-bold transition-colors'
              >
                <svg className='w-4 h-4' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                  <path strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' d='M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z' />
                </svg>
                Bộ lọc {hasActiveFilters && `(${selectedCategories.length + selectedBrands.length})`}
              </button>

              <div className='flex items-center gap-2 ml-auto'>
                <span className='text-xs text-slate-500 font-medium hidden sm:inline'>Sắp xếp:</span>
                <select
                  value={sortType}
                  onChange={(e) => setSortType(e.target.value)}
                  className='bg-white border border-slate-200 text-slate-800 text-xs rounded-xl px-3 py-2 font-bold focus:ring-2 focus:ring-red-500 focus:outline-none cursor-pointer'
                >
                  <option value='relevant'>Nổi bật nhất</option>
                  <option value='newest'>Mới nhất</option>
                  <option value='low-high'>Giá: Thấp → Cao</option>
                  <option value='high-low'>Giá: Cao → Thấp</option>
                  <option value='rating'>Đánh giá cao</option>
                </select>
              </div>
            </div>
          </div>

          {/* CellphoneS Horizontal Subcategory Quick-Pill Bar (Screenshot 4) */}
          <div className='bg-white p-3.5 rounded-2xl border border-slate-200 shadow-2xs mb-4 overflow-x-auto scrollbar-none'>
            <div className='flex items-center gap-2 min-w-max'>
              {(QUICK_DEVICE_FILTERS[selectedCategories[0]] || QUICK_DEVICE_FILTERS.default).map((pill, idx) => {
                const isActive = (!pill.brand && !pill.keyword && selectedBrands.length === 0) ||
                                 (pill.brand && selectedBrands.includes(pill.brand));

                return (
                  <button
                    key={idx}
                    type='button'
                    onClick={() => {
                      if (!pill.brand && !pill.keyword) {
                        setSelectedBrands([]);
                      } else if (pill.brand) {
                        toggleBrand(pill.brand);
                      }
                    }}
                    className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border text-xs font-bold transition-all ${
                      isActive
                        ? 'border-red-500 bg-red-50/80 text-[#d70018] shadow-2xs'
                        : 'border-slate-200 hover:border-slate-300 bg-white text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    {pill.image && (
                      <img
                        src={pill.image}
                        alt={pill.label}
                        className='w-6 h-6 object-cover rounded-md shrink-0 bg-slate-50 border border-slate-100'
                      />
                    )}
                    <span>{pill.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* CellphoneS Fast Filter Criteria Buttons */}
          <div className='flex flex-wrap items-center gap-2 mb-4'>
            <button
              type='button'
              onClick={() => setOnlyInStock(prev => !prev)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-colors flex items-center gap-1.5 ${
                onlyInStock
                  ? 'bg-red-50 text-[#d70018] border-red-400'
                  : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
              }`}
            >
              <span>📦</span>
              <span>Sẵn hàng tại shop</span>
            </button>

            {PRICE_RANGES.filter(r => r.id !== 'all').map(range => (
              <button
                key={range.id}
                type='button'
                onClick={() => setSelectedPriceRange(selectedPriceRange === range.id ? 'all' : range.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-medium border transition-colors ${
                  selectedPriceRange === range.id
                    ? 'bg-red-50 text-[#d70018] border-red-400 font-bold'
                    : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                }`}
              >
                {range.label}
              </button>
            ))}
          </div>

          {/* Active Filter Badges */}
          {hasActiveFilters && (
            <div className='flex flex-wrap items-center gap-2 mb-6 p-3 bg-red-50/70 border border-red-200/60 rounded-xl'>
              <span className='text-xs font-semibold text-red-900'>Đang lọc theo:</span>
              {selectedCategories.map(cat => (
                <span key={cat} className='inline-flex items-center gap-1 text-xs bg-white text-[#d70018] px-2.5 py-1 rounded-lg border border-red-200 font-medium shadow-2xs'>
                  {cat}
                  <button onClick={() => toggleCategory(cat)} className='hover:text-red-700 font-bold'>×</button>
                </span>
              ))}
              {selectedBrands.map(b => (
                <span key={b} className='inline-flex items-center gap-1 text-xs bg-white text-slate-800 px-2.5 py-1 rounded-lg border border-slate-300 font-bold shadow-2xs'>
                  {b}
                  <button onClick={() => toggleBrand(b)} className='hover:text-red-600 font-bold'>×</button>
                </span>
              ))}
              {selectedPriceRange !== 'all' && (
                <span className='inline-flex items-center gap-1 text-xs bg-white text-emerald-700 px-2.5 py-1 rounded-lg border border-emerald-200 font-medium shadow-2xs'>
                  {PRICE_RANGES.find(r => r.id === selectedPriceRange)?.label}
                  <button onClick={() => setSelectedPriceRange('all')} className='hover:text-red-500'>×</button>
                </span>
              )}
              {onlyInStock && (
                <span className='inline-flex items-center gap-1 text-xs bg-white text-teal-700 px-2.5 py-1 rounded-lg border border-teal-200 font-medium shadow-2xs'>
                  Còn hàng
                  <button onClick={() => setOnlyInStock(false)} className='hover:text-red-500'>×</button>
                </span>
              )}
              <button
                onClick={clearAllFilters}
                className='text-xs text-red-600 hover:text-red-700 font-bold underline ml-auto'
              >
                Xóa tất cả bộ lọc
              </button>
            </div>
          )}

          {/* Main Layout: Sidebar + Grid */}
          <div className='grid grid-cols-1 lg:grid-cols-4 gap-8'>

            {/* DESKTOP SIDEBAR FILTER */}
            <aside className='hidden lg:block lg:col-span-1 space-y-6'>
              
              {/* Category Filter Box */}
              <div className='bg-white p-5 rounded-2xl border border-slate-100 shadow-sm'>
                <h3 className='text-sm font-bold text-slate-800 uppercase tracking-wider mb-4 pb-2 border-b border-slate-100 flex items-center justify-between'>
                  Danh mục sản phẩm
                </h3>
                <div className='space-y-1.5'>
                  {CATEGORIES.map(cat => {
                    const isSelected = selectedCategories.includes(cat.id);
                    return (
                      <button
                        key={cat.id}
                        onClick={() => toggleCategory(cat.id)}
                        className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
                          isSelected
                            ? 'bg-[#d70018] text-white shadow-sm'
                            : 'text-slate-600 hover:bg-red-50 hover:text-[#d70018]'
                        }`}
                      >
                        <span className='flex items-center gap-2.5'>
                          <img
                            src={cat.icon}
                            alt=""
                            className={`w-4 h-4 object-contain ${isSelected ? 'brightness-0 invert' : 'opacity-75'}`}
                          />
                          <span>{cat.label}</span>
                        </span>
                        {isSelected && <span>✓</span>}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Dynamic Brand Filter Box */}
              <div className='bg-white p-5 rounded-2xl border border-slate-100 shadow-sm'>
                <h3 className='text-sm font-bold text-slate-800 uppercase tracking-wider mb-4 pb-2 border-b border-slate-100'>
                  Thương hiệu {selectedCategories.length > 0 && `(${selectedCategories.join(', ')})`}
                </h3>
                <div className='grid grid-cols-2 gap-2 max-h-56 overflow-y-auto pr-1'>
                  {availableBrands.map(brand => {
                    const isSelected = selectedBrands.includes(brand);
                    return (
                      <button
                        key={brand}
                        onClick={() => toggleBrand(brand)}
                        className={`px-2.5 py-1.5 rounded-lg text-xs font-medium text-center border transition-all truncate ${
                          isSelected
                            ? 'bg-red-50 border-red-500 text-[#d70018] font-bold ring-1 ring-red-400'
                            : 'border-slate-200 text-slate-600 hover:border-slate-300 hover:bg-slate-50'
                        }`}
                      >
                        {brand}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Price Range Filter */}
              <div className='bg-white p-5 rounded-2xl border border-slate-100 shadow-sm'>
                <h3 className='text-sm font-bold text-slate-800 uppercase tracking-wider mb-4 pb-2 border-b border-slate-100'>
                  Mức giá
                </h3>
                <div className='space-y-2'>
                  {PRICE_RANGES.map(range => (
                    <label
                      key={range.id}
                      className='flex items-center gap-2.5 text-xs text-slate-700 cursor-pointer hover:text-[#d70018] transition-colors'
                    >
                      <input
                        type='radio'
                        name='priceRange'
                        checked={selectedPriceRange === range.id}
                        onChange={() => { setSelectedPriceRange(range.id); setCurrentPage(1); }}
                        className='text-[#d70018] focus:ring-red-500 h-3.5 w-3.5'
                      />
                      <span className={selectedPriceRange === range.id ? 'font-bold text-[#d70018]' : ''}>
                        {range.label}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              {/* In-Stock Toggle */}
              <div className='bg-white p-5 rounded-2xl border border-slate-100 shadow-sm'>
                <label className='flex items-center justify-between cursor-pointer'>
                  <span className='text-xs font-bold text-slate-700'>Chỉ hiện sản phẩm còn hàng</span>
                  <input
                    type='checkbox'
                    checked={onlyInStock}
                    onChange={(e) => { setOnlyInStock(e.target.checked); setCurrentPage(1); }}
                    className='rounded text-[#d70018] focus:ring-red-500 h-4 w-4'
                  />
                </label>
              </div>

            </aside>

            {/* PRODUCT GRID DISPLAY */}
            <main className='lg:col-span-3 space-y-6'>
              {filteredProducts.length === 0 ? (
                <div className='bg-white rounded-3xl p-12 text-center border border-slate-100 shadow-sm'>
                  <div className='w-20 h-20 bg-red-50 text-[#d70018] rounded-full flex items-center justify-center mx-auto text-3xl mb-4'>
                    🔍
                  </div>
                  <h3 className='text-lg font-bold text-slate-800 mb-2'>Không tìm thấy sản phẩm phù hợp</h3>
                  <p className='text-xs sm:text-sm text-slate-500 max-w-md mx-auto mb-6'>
                    Thử tìm kiếm với từ khóa khác hoặc xóa bớt các tiêu chí lọc đang chọn để hiển thị thêm sản phẩm.
                  </p>
                  <button
                    onClick={clearAllFilters}
                    className='px-6 py-2.5 bg-[#d70018] text-white text-xs sm:text-sm font-bold rounded-xl hover:bg-[#ba0014] transition-colors shadow-md'
                  >
                    Xóa toàn bộ bộ lọc
                  </button>
                </div>
              ) : (
                <>
                  <div className='grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4'>
                    {paginatedProducts.map((item) => (
                      <ProductItem
                        key={item._id}
                        id={item._id}
                        image={item.image}
                        name={item.name}
                        price={item.price}
                        originalPrice={item.originalPrice}
                        averageRating={item.averageRating}
                        totalReviews={item.totalReviews}
                        brand={item.brand}
                        sizes={item.sizes}
                        category={item.category}
                      />
                    ))}
                  </div>

                  {/* Modern Pagination */}
                  {totalPages > 1 && (
                    <div className='flex items-center justify-between bg-white p-4 rounded-2xl border border-slate-100 shadow-sm'>
                      <span className='text-xs text-slate-500'>
                        Trang {currentPage} / {totalPages} ({filteredProducts.length} sản phẩm)
                      </span>
                      <div className='flex items-center gap-1.5'>
                        <button
                          onClick={() => { setCurrentPage(prev => Math.max(prev - 1, 1)); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                          disabled={currentPage === 1}
                          className='px-3 py-1.5 rounded-lg text-xs font-semibold border border-slate-200 text-slate-700 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-50'
                        >
                          &larr; Trước
                        </button>
                        {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
                          <button
                            key={p}
                            onClick={() => { setCurrentPage(p); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                            className={`w-8 h-8 rounded-lg text-xs font-bold transition-colors ${
                              currentPage === p
                                ? 'bg-[#d70018] text-white shadow'
                                : 'text-slate-700 hover:bg-slate-100'
                            }`}
                          >
                            {p}
                          </button>
                        ))}
                        <button
                          onClick={() => { setCurrentPage(prev => Math.min(prev + 1, totalPages)); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                          disabled={currentPage === totalPages}
                          className='px-3 py-1.5 rounded-lg text-xs font-semibold border border-slate-200 text-slate-700 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-50'
                        >
                          Sau &rarr;
                        </button>
                      </div>
                    </div>
                  )}
                </>
              )}
            </main>

          </div>
        </div>

        {/* MOBILE FILTER DRAWER */}
        {showMobileFilter && (
          <div className='fixed inset-0 z-50 flex justify-end bg-black/50 backdrop-blur-xs'>
            <div className='w-full max-w-xs bg-white h-full p-6 overflow-y-auto space-y-6 shadow-2xl animate-slide-in'>
              <div className='flex items-center justify-between pb-4 border-b border-slate-200'>
                <h3 className='text-base font-bold text-slate-800'>Bộ Lọc Sản Phẩm</h3>
                <button
                  onClick={() => setShowMobileFilter(false)}
                  className='p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600 text-lg'
                >
                  ✕
                </button>
              </div>

              {/* Category */}
              <div>
                <h4 className='text-xs font-bold uppercase text-slate-500 mb-2'>Danh mục</h4>
                <div className='space-y-1'>
                  {CATEGORIES.map(cat => {
                    const isSelected = selectedCategories.includes(cat.id);
                    return (
                      <button
                        key={cat.id}
                        onClick={() => toggleCategory(cat.id)}
                        className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-colors ${
                          isSelected
                            ? 'bg-[#d70018] text-white font-bold'
                            : 'bg-slate-50 text-slate-700 hover:bg-red-50 hover:text-[#d70018]'
                        }`}
                      >
                        <span className='flex items-center gap-2'>
                          <img
                            src={cat.icon}
                            alt=""
                            className={`w-4 h-4 object-contain ${isSelected ? 'brightness-0 invert' : 'opacity-70'}`}
                          />
                          <span>{cat.label}</span>
                        </span>
                        {isSelected && <span>✓</span>}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Brands */}
              <div>
                <h4 className='text-xs font-bold uppercase text-slate-500 mb-2'>Thương hiệu</h4>
                <div className='grid grid-cols-2 gap-1.5'>
                  {availableBrands.map(b => (
                    <button
                      key={b}
                      onClick={() => toggleBrand(b)}
                      className={`px-2 py-1.5 rounded text-xs truncate text-center ${
                        selectedBrands.includes(b)
                          ? 'bg-[#d70018] text-white font-bold'
                          : 'bg-slate-50 text-slate-700'
                      }`}
                    >
                      {b}
                    </button>
                  ))}
                </div>
              </div>

              {/* Price */}
              <div>
                <h4 className='text-xs font-bold uppercase text-slate-500 mb-2'>Mức giá</h4>
                <div className='space-y-1.5'>
                  {PRICE_RANGES.map(range => (
                    <label key={range.id} className='flex items-center gap-2 text-xs text-slate-700'>
                      <input
                        type='radio'
                        name='mobilePrice'
                        checked={selectedPriceRange === range.id}
                        onChange={() => setSelectedPriceRange(range.id)}
                      />
                      {range.label}
                    </label>
                  ))}
                </div>
              </div>

              {/* Actions */}
              <div className='pt-4 border-t border-slate-200 flex gap-2'>
                <button
                  onClick={clearAllFilters}
                  className='flex-1 py-2.5 bg-slate-100 text-slate-700 rounded-xl text-xs font-bold'
                >
                  Xóa lọc
                </button>
                <button
                  onClick={() => setShowMobileFilter(false)}
                  className='flex-1 py-2.5 bg-blue-600 text-white rounded-xl text-xs font-bold'
                >
                  Áp dụng ({filteredProducts.length})
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </PageTransition>
  );
};

export default Collection;