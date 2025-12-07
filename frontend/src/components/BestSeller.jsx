import React, { useContext, useEffect, useState } from 'react'
import { ShopContext } from '../context/ShopContext'
import Title from './Title';
import ProductItem from './ProductItem';

const BestSeller = () => {
  const { products } = useContext(ShopContext);
  const [displayProducts, setDisplayProducts] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  
  useEffect(() => {
    // Get best seller 10 products and latest 10 products, total 20
    const bestSellerProducts = products.filter((item) => (item.bestseller)).slice(-10);
    const latestProducts = products.slice(-10);
    
    // Combine and shuffle them to create variety
    const combinedProducts = [...bestSellerProducts, ...latestProducts];
    
    // Remove duplicates based on _id
    const uniqueProducts = combinedProducts.filter((product, index, self) => 
      index === self.findIndex(p => p._id === product._id)
    );
    
    setDisplayProducts(uniqueProducts);
  }, [products]);

  // Auto-slide effect - show 10 products at a time, slide every 10 seconds
  useEffect(() => {
    if (displayProducts.length <= 10) return; // Only auto-slide if more than 10 products

    const interval = setInterval(() => {
      setIsTransitioning(true);
      
      setTimeout(() => {
        setCurrentIndex((prevIndex) => {
          // Create circular navigation - always ensure we have 10 products
          const nextIndex = prevIndex + 10;
          if (nextIndex >= displayProducts.length) {
            return 0; // Wrap back to beginning
          }
          return nextIndex;
        });
        
        setTimeout(() => {
          setIsTransitioning(false);
        }, 100);
      }, 500);
      
    }, 10000); // Change every 10 seconds

    return () => clearInterval(interval);
  }, [displayProducts.length]);

  // Get current 10 products to display with circular wrapping
  const getCurrentProducts = () => {
    if (displayProducts.length <= 10) {
      return displayProducts; // If 10 or fewer products, show all
    }
    
    const startIndex = currentIndex;
    let endIndex = startIndex + 10;
    
    // If we need to wrap around to get 10 products
    if (endIndex > displayProducts.length) {
      const productsFromStart = displayProducts.slice(startIndex);
      const productsFromBeginning = displayProducts.slice(0, 10 - productsFromStart.length);
      return [...productsFromStart, ...productsFromBeginning];
    }
    
    return displayProducts.slice(startIndex, endIndex);
  };

  const currentProducts = getCurrentProducts();

  return (
    <div className='my-10'>
      <div className='text-center py-8 text-3xl'>
        <Title text1={'Sản phẩm '} text2={'bán chạy nhất '} />
      </div>

      {/* Products Grid with Smooth Sliding - Always show exactly 10 products */}
      <div className='grid grid-cols-5 gap-8 gap-y-10 overflow-hidden'>
        {currentProducts.map((item, index) => (
          <div 
            key={`${currentIndex}-${index}`} 
            className={`transition-all duration-700 ease-in-out transform ${
              isTransitioning 
                ? 'opacity-0 scale-95 translate-y-4' 
                : 'opacity-100 scale-100 translate-y-0'
            }`}
            style={{
              transitionDelay: `${index * 50}ms`
            }}
          >
            <ProductItem 
              id={item._id} 
              image={item.image} 
              name={item.name} 
              price={item.price} 
              originalPrice={item.originalPrice}
              averageRating={item.averageRating}
              totalReviews={item.totalReviews}
            />
          </div>
        ))}
      </div>
    </div>
  )
}

export default BestSeller