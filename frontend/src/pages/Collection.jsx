import React, { useContext, useEffect, useState } from 'react';
import { ShopContext } from '../context/ShopContext';
import { assets } from '../assets/assets';
import Title from '../components/Title';
import ProductItem from '../components/ProductItem';
import PageTransition from '../components/PageTransition';
import FadeIn from '../components/FadeIn';

const Collection = () => {

  const {products , search , showSearch } = useContext(ShopContext);
  const [showFilter,setShowfilter] = useState(false);
  const [filterProducts, setFilterProducts] = useState([]);
  const [category,setCategory] = useState([]);
  const [subCategory,setSubCategory] = useState([]);
  const [sortType, setSortType] = useState('relevant');

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 20;

  const toggleCategory = (e) => {
    if(category.includes(e.target.value)){
      setCategory(prev=> prev.filter(item => item !== e.target.value));
    }
    else{
      setCategory(prev=> [...prev, e.target.value]);
    }
  }

  const toggleSubCategory = (e) => {
    if(subCategory.includes(e.target.value)){
      setSubCategory(prev=> prev.filter(item => item !== e.target.value));
    }
    else{
      setSubCategory(prev=> [...prev, e.target.value]);
    }
  }

  const clearAllFilters = () => {
    setCategory([]);
    setSubCategory([]);
    setSortType('relevant');
    setCurrentPage(1); // Reset to first page when clearing filters
  }

  const applyFilter =() => {
    let productsCopy = products.slice();

    if(showSearch && search.length ){
      productsCopy = productsCopy.filter(item => item.name.toLowerCase().includes(search.toLowerCase()));
    }

    if(category.length > 0){
      productsCopy = productsCopy.filter(item => category.includes(item.category));
    }
    
    if(subCategory.length > 0){
      // Xử lý logic "Khác" cho brand filter
      const hasKhac = subCategory.includes('Khác');
      const otherBrands = subCategory.filter(brand => brand !== 'Khác');
      
      if (hasKhac && otherBrands.length > 0) {
        // Nếu có cả "Khác" và brand khác
        productsCopy = productsCopy.filter(item => {
          const isOtherBrand = otherBrands.includes(item.subCategory);
          const isCustomBrand = !getAvailableBrandsForCategory(item.category).includes(item.subCategory);
          return isOtherBrand || isCustomBrand;
        });
      } else if (hasKhac && otherBrands.length === 0) {
        // Chỉ chọn "Khác" - hiện tất cả brand không có trong danh sách
        productsCopy = productsCopy.filter(item => {
          const availableBrands = getAvailableBrandsForCategory(item.category);
          return !availableBrands.includes(item.subCategory);
        });
      } else {
        // Chỉ filter theo brand có sẵn
        productsCopy = productsCopy.filter(item => otherBrands.includes(item.subCategory));
      }
    }

    setFilterProducts(productsCopy);
    setCurrentPage(1); // Reset to first page when applying new filters
  }

  // Helper function để lấy danh sách brand có sẵn cho category
  const getAvailableBrandsForCategory = (categoryName) => {
    switch(categoryName) {
      case 'PC':
        return [];
      case 'Laptop':
        return ['Dell', 'HP', 'Lenovo', 'Asus', 'MSI', 'Acer'];
      case 'CPU':
        return ['Intel', 'AMD'];
      case 'Mainboard':
        return ['Asus', 'MSI', 'Gigabyte', 'ASRock', 'Intel'];
      case 'RAM':
        return ['Corsair', 'Kingston', 'G.Skill', 'Crucial', 'Team Group'];
      case 'GPU':
        return ['NVIDIA', 'AMD', 'Intel', 'Asus', 'MSI', 'Gigabyte', 'EVGA'];
      case 'PSU':
        return ['Corsair', 'Seasonic', 'EVGA', 'Cooler Master', 'Thermaltake'];
      case 'Ổ cứng':
        return ['Samsung', 'Western Digital', 'Seagate', 'Crucial', 'Kingston'];
      case 'Case':
        return ['NZXT', 'Phanteks', 'Lian Li', 'Cooler Master', 'Fractal Design'];
      case 'Tản nhiệt':
        return ['Noctua', 'Cooler Master', 'be quiet!', 'Arctic', 'Corsair'];
      case 'Ổ đĩa quang':
        return ['LG', 'Asus', 'Pioneer'];
      case 'Card mở rộng':
        return ['Asus', 'TP-Link', 'Creative', 'Elgato'];
      case 'Màn hình':
        return ['Samsung', 'LG', 'Dell', 'HP', 'Asus', 'Acer', 'BenQ'];
      case 'Chuột':
        return ['Logitech', 'Razer', 'SteelSeries', 'Corsair', 'HyperX'];
      case 'Bàn phím':
        return ['Logitech', 'Razer', 'SteelSeries', 'Corsair', 'HyperX', 'Cherry'];
      case 'Tai nghe':
        return ['Logitech', 'Razer', 'SteelSeries', 'Corsair', 'HyperX', 'Sennheiser'];
      default:
        return [];
    }
  }

  const sortProduct = () =>{
    let fpCopy = filterProducts.slice();
    switch (sortType) {
      case 'low-high':
        setFilterProducts(fpCopy.sort((a,b)=>(a.price - b.price)));
        break;
      case 'high-low':
        setFilterProducts(fpCopy.sort((a,b)=>(b.price - a.price)));
        break;
      
      default:
        applyFilter();
        break;
    }
  }

  // Pagination functions
  const totalPages = Math.ceil(filterProducts.length / productsPerPage);
  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = filterProducts.slice(indexOfFirstProduct, indexOfLastProduct);

  const goToPage = (pageNumber) => {
    setCurrentPage(pageNumber);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const goToNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const goToPrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  useEffect(() => {
    applyFilter();
  },[category, subCategory , search , showSearch , products]);

  useEffect(() => {
    sortProduct();
  },[sortType]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 pt-16">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <PageTransition>
          <FadeIn>
            <div className='flex flex-col lg:flex-row gap-8'>
              {/* Left Side - Filter Options */}
              <div className='lg:w-72'>
                {/* Filter Header */}
                <div className='bg-white rounded-2xl shadow-lg p-4 mb-4'>
                  <div className='flex items-center justify-between mb-3'>
                    <h3 className='text-lg font-bold text-gray-800'>Bộ lọc</h3>
                    <button 
                      onClick={() => setShowfilter(!showFilter)} 
                      className='lg:hidden p-2 text-gray-500 hover:text-gray-700 transition-colors'
                    >
                      <svg className={`w-5 h-5 transition-transform ${showFilter ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>
                  </div>
                  
                  {/* Active Filters Summary */}
                  {(category.length > 0 || subCategory.length > 0) && (
                    <div className='mb-3 p-2 bg-blue-50 rounded-lg border border-blue-200'>
                      <div className='flex items-center justify-between mb-2'>
                        <span className='text-xs font-medium text-blue-800'>Đang lọc:</span>
                        <button 
                          onClick={clearAllFilters}
                          className='text-xs text-blue-600 hover:text-blue-800 underline'
                        >
                          Xóa tất cả
                        </button>
                      </div>
                      <div className='flex flex-wrap gap-1'>
                        {category.map(cat => (
                          <span key={cat} className='px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full'>
                            {cat}
                          </span>
                        ))}
                        {subCategory.map(sub => (
                          <span key={sub} className='px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full'>
                            {sub}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

        {/* Category Filter */}
                <div className={`bg-white rounded-2xl shadow-lg p-4 mb-4 ${showFilter ? 'block' : 'hidden lg:block'}`}>
                  <h4 className='text-base font-semibold text-gray-800 mb-3'>Danh mục chính</h4>
                  <div className='space-y-2'>
                    {[
                      { value: 'PC', label: 'PC (Máy tính để bàn)' },
                      { value: 'Laptop', label: 'Laptop (Máy tính xách tay)' },
                      { value: 'CPU', label: 'CPU (Bộ vi xử lý)' },
                      { value: 'Mainboard', label: 'Mainboard (Bo mạch chủ)' },
                      { value: 'RAM', label: 'RAM (Bộ nhớ tạm)' },
                      { value: 'GPU', label: 'GPU (Card đồ họa)' },
                      { value: 'PSU', label: 'PSU (Nguồn máy tính)' },
                      { value: 'Ổ cứng', label: 'Ổ cứng (HDD/SSD)' },
                      { value: 'Case', label: 'Case (Vỏ máy tính)' },
                      { value: 'Tản nhiệt', label: 'Tản nhiệt (quạt, tản nhiệt nước/khí)' },
                      { value: 'Ổ đĩa quang', label: 'Ổ đĩa quang (nếu có)' },
                      { value: 'Card mở rộng', label: 'Card mở rộng (WiFi, Sound card, Capture card, …)' },
                      { value: 'Màn hình', label: 'Màn hình (Monitor)' },
                      { value: 'Chuột', label: 'Chuột (Mouse)' },
                      { value: 'Bàn phím', label: 'Bàn phím (Keyboard)' },
                      { value: 'Tai nghe', label: 'Tai nghe (Headphone)' }
                    ].map(item => (
                      <label key={item.value} className='flex items-center gap-2 cursor-pointer group hover:bg-gray-50 p-1 rounded transition-colors'>
                        <input 
                          className='w-3 h-3 text-blue-600 rounded border-gray-300 focus:ring-blue-500 focus:ring-1' 
                          type="checkbox" 
                          value={item.value} 
                          checked={category.includes(item.value)}
                          onChange={toggleCategory} 
                        />
                        <span className='text-xs text-gray-700 group-hover:text-gray-900'>{item.label}</span>
                      </label>
                    ))}
          </div>
        </div>

        {/* SubCategory Filter */}
            <div className={`bg-white rounded-2xl shadow-lg p-4 ${showFilter ? 'block' : 'hidden lg:block'}`}>
              <h4 className='text-base font-semibold text-gray-800 mb-3'>Thương hiệu</h4>
              
              {category.length === 0 ? (
                <div className='text-center py-4'>
                  <p className='text-gray-500 text-xs'>Vui lòng chọn danh mục chính trước</p>
                </div>
              ) : (
                    <div className='space-y-2'>
            {/* PC - Không hiện brand */}
            {category.includes('PC') && (
                      <div className='text-center py-2 text-gray-500 italic bg-gray-50 rounded text-xs'>
                        PC không cần chọn thương hiệu
                      </div>
                    )}
                    
                    {/* Dynamic brand options based on selected categories */}
                    {category.map(cat => {
                      const brands = getAvailableBrandsForCategory(cat);
                      if (brands.length === 0) return null;
                      
                      return (
                        <div key={cat} className='border-l-2 border-blue-200 pl-3'>
                          <h5 className='text-xs font-medium text-gray-700 mb-1'>{cat}</h5>
                          <div className='space-y-1'>
                            {brands.map(brand => (
                              <label key={brand} className='flex items-center gap-2 cursor-pointer group hover:bg-gray-50 p-1 rounded transition-colors'>
                                <input 
                                  className='w-3 h-3 text-blue-600 rounded border-gray-300 focus:ring-blue-500 focus:ring-1' 
                                  type="checkbox" 
                                  value={brand} 
                                  checked={subCategory.includes(brand)}
                                  onChange={toggleSubCategory} 
                                />
                                <span className='text-xs text-gray-700 group-hover:text-gray-900'>{brand}</span>
                              </label>
                            ))}
                            <label className='flex items-center gap-2 cursor-pointer group hover:bg-gray-50 p-1 rounded transition-colors'>
                              <input 
                                className='w-3 h-3 text-blue-600 rounded border-gray-300 focus:ring-blue-500 focus:ring-1' 
                                type="checkbox" 
                                value={'Khác'} 
                                checked={subCategory.includes('Khác')}
                                onChange={toggleSubCategory} 
                              />
                              <span className='text-xs text-gray-700 group-hover:text-gray-900'>Khác</span>
                            </label>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>

            {/* Right Side - Products */}
            <div className='flex-1'>
              {/* Products Header */}
              <div className='bg-white rounded-2xl shadow-lg p-4 mb-6'>
                <div className='flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3'>
                  <div className='flex items-center gap-3'>
                    <h2 className='text-xl sm:text-2xl font-bold text-gray-800'>
                      Tất cả <span className='text-blue-600'>sản phẩm</span>
                    </h2>
                    <span className='px-2 py-1 bg-blue-100 text-blue-700 text-xs font-medium rounded-full'>
                      {filterProducts.length} sản phẩm
                    </span>
                  </div>
                  
                  {/* Product Sort */}
                  <div className='flex items-center gap-2'>
                    <label className='text-xs font-medium text-gray-700'>Sắp xếp:</label>
                    <select 
                      onChange={(e)=>setSortType(e.target.value)} 
                      value={sortType}
                      className='border border-gray-200 rounded px-2 py-1 text-xs focus:border-blue-500 focus:ring-1 focus:ring-blue-200 transition-all duration-200 cursor-pointer'
                    >
                      <option value="relevant">Liên quan</option>
                      <option value="low-high">Giá: Thấp → Cao</option>
                      <option value="high-low">Giá: Cao → Thấp</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Products Grid */}
              {filterProducts.length === 0 ? (
                <div className='bg-white rounded-2xl shadow-lg p-12 text-center'>
                  <div className='w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4'>
                    <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">Không tìm thấy sản phẩm</h3>
                  <p className="text-gray-600 mb-4 text-sm">Hãy thử điều chỉnh bộ lọc hoặc tìm kiếm với từ khóa khác</p>
                  <button 
                    onClick={clearAllFilters}
                    className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-4 py-2 rounded-lg font-medium hover:from-blue-700 hover:to-blue-800 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 text-sm"
                  >
                    Xóa bộ lọc
                  </button>
                </div>
              ) : (
                <>
                  <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mb-8'>
                    {currentProducts.map((item,index) => (
                      <ProductItem 
                        key={index} 
                        name={item.name} 
                        id={item._id} 
                        image={item.image} 
                        price={item.price} 
                        originalPrice={item.originalPrice}
                        averageRating={item.averageRating}
                        totalReviews={item.totalReviews}
                      />
                    ))}
                  </div>

                  {/* Pagination */}
                  {totalPages > 1 && (
                    <div className='bg-white rounded-2xl shadow-lg p-4'>
                      <div className='flex items-center justify-between'>
                        <div className='text-sm text-gray-600'>
                          Hiển thị {indexOfFirstProduct + 1}-{Math.min(indexOfLastProduct, filterProducts.length)} trong tổng số {filterProducts.length} sản phẩm
                        </div>
                        
                        <div className='flex items-center gap-2'>
                          {/* Previous Button */}
                          <button
                            onClick={goToPrevPage}
                            disabled={currentPage === 1}
                            className={`px-3 py-2 text-sm rounded-lg transition-all duration-200 ${
                              currentPage === 1
                                ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                                : 'bg-blue-500 text-white hover:bg-blue-600'
                            }`}
                          >
                            Trước
                          </button>

                          {/* Page Numbers */}
                          <div className='flex items-center gap-1'>
                            {Array.from({ length: totalPages }, (_, index) => {
                              const pageNumber = index + 1;
                              // Show first page, last page, current page, and pages around current page
                              if (
                                pageNumber === 1 ||
                                pageNumber === totalPages ||
                                (pageNumber >= currentPage - 1 && pageNumber <= currentPage + 1)
                              ) {
                                return (
                                  <button
                                    key={pageNumber}
                                    onClick={() => goToPage(pageNumber)}
                                    className={`px-3 py-2 text-sm rounded-lg transition-all duration-200 ${
                                      currentPage === pageNumber
                                        ? 'bg-blue-500 text-white'
                                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                                    }`}
                                  >
                                    {pageNumber}
                                  </button>
                                );
                              } else if (
                                pageNumber === currentPage - 2 ||
                                pageNumber === currentPage + 2
                              ) {
                                return <span key={pageNumber} className="px-2 text-gray-400">...</span>;
                              }
                              return null;
                            })}
                          </div>

                          {/* Next Button */}
                          <button
                            onClick={goToNextPage}
                            disabled={currentPage === totalPages}
                            className={`px-3 py-2 text-sm rounded-lg transition-all duration-200 ${
                              currentPage === totalPages
                                ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                                : 'bg-blue-500 text-white hover:bg-blue-600'
                            }`}
                          >
                            Tiếp
                          </button>
          </div>
        </div>       
      </div>
                  )}
                </>
              )}
            </div>
          </div>
        </FadeIn>
        </PageTransition>
      </div>
    </div>
  )
}

export default Collection;  