import React, { useState, useEffect } from 'react';
import { assets } from '../assets/assets';
import { toast } from 'react-toastify';

const EditProductModal = ({ isOpen, onClose, onUpdate, product }) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    originalPrice: '',
    category: 'PC',
    subCategory: 'PC',
    bestseller: false,
    sizes: [],
    stockQuantities: {},
    image: []
  });

  const [image1, setImage1] = useState(false);
  const [image2, setImage2] = useState(false);
  const [image3, setImage3] = useState(false);
  const [image4, setImage4] = useState(false);

  // Custom input fields for "Khác" options
  const [customBrand, setCustomBrand] = useState("");
  const [customSpec, setCustomSpec] = useState("");
  const [customSpecs, setCustomSpecs] = useState([]);

  // Quản lý số lượng tồn kho cho từng thông số
  const [stockQuantities, setStockQuantities] = useState({});

  // Initialize form data when product changes
  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name || '',
        description: product.description || '',
        price: product.price || '',
        originalPrice: product.originalPrice || '',
        category: product.category || 'PC',
        subCategory: product.subCategory || 'PC',
        bestseller: product.bestseller || false,
        sizes: product.sizes || [],
        stockQuantities: product.stockQuantities || {},
        image: product.image || []
      });
      
      // Set stock quantities
      setStockQuantities(product.stockQuantities || {});
    }
  }, [product]);

  // Set custom specs when formData.category changes
  useEffect(() => {
    if (product && formData.category) {
      // Set custom specs from existing sizes
      const existingCustomSpecs = (product.sizes || []).filter(spec => 
        !getAvailableSizes().includes(spec)
      );
      setCustomSpecs(existingCustomSpecs);
    }
  }, [product, formData.category]);

  // Get available brands based on selected category
  const getAvailableBrands = () => {
    switch(formData.category) {
      case 'PC':
        return []; // PC không cần brand
      case 'Laptop':
        return ['Dell', 'HP', 'Lenovo', 'Asus', 'MSI', 'Acer', 'Khác'];
      case 'CPU':
        return ['Intel', 'AMD', 'Khác'];
      case 'Mainboard':
        return ['Asus', 'MSI', 'Gigabyte', 'ASRock', 'Intel', 'Khác'];
      case 'RAM':
        return ['Corsair', 'Kingston', 'G.Skill', 'Crucial', 'Team Group', 'Khác'];
      case 'GPU':
        return ['NVIDIA', 'AMD', 'Intel', 'Asus', 'MSI', 'Gigabyte', 'EVGA', 'Khác'];
      case 'PSU':
        return ['Corsair', 'Seasonic', 'EVGA', 'Cooler Master', 'Thermaltake', 'Khác'];
      case 'Ổ cứng':
        return ['Samsung', 'Western Digital', 'Seagate', 'Crucial', 'Kingston', 'Khác'];
      case 'Case':
        return ['NZXT', 'Phanteks', 'Lian Li', 'Cooler Master', 'Fractal Design', 'Khác'];
      case 'Tản nhiệt':
        return ['Noctua', 'Cooler Master', 'be quiet!', 'Arctic', 'Corsair', 'Khác'];
      case 'Ổ đĩa quang':
        return ['LG', 'Asus', 'Pioneer', 'Khác'];
      case 'Card mở rộng':
        return ['Asus', 'TP-Link', 'Creative', 'Elgato', 'Khác'];
      case 'Màn hình':
        return ['Samsung', 'LG', 'Dell', 'HP', 'Asus', 'Acer', 'BenQ', 'Khác'];
      case 'Chuột':
        return ['Logitech', 'Razer', 'SteelSeries', 'Corsair', 'HyperX', 'Khác'];
      case 'Bàn phím':
        return ['Logitech', 'Razer', 'SteelSeries', 'Corsair', 'HyperX', 'Cherry', 'Khác'];
      case 'Tai nghe':
        return ['Logitech', 'Razer', 'SteelSeries', 'Corsair', 'HyperX', 'Sennheiser', 'Khác'];
      default:
        return [];
    }
  };

  // Get available sizes based on selected category
  const getAvailableSizes = () => {
    switch(formData.category) {
      case 'PC':
        return ['ATX', 'Micro-ATX', 'Mini-ITX'];
      case 'Laptop':
        return ['13 inch', '14 inch', '15.6 inch', '17 inch'];
      case 'CPU':
        return ['Socket 1151', 'Socket 1200', 'Socket 1700', 'AM4', 'AM5'];
      case 'Mainboard':
        return ['ATX', 'Micro-ATX', 'Mini-ITX'];
      case 'RAM':
        return ['DDR4', 'DDR5'];
      case 'GPU':
        return ['PCIe x16', 'PCIe x8'];
      case 'PSU':
        return ['450W', '550W', '650W', '750W', '850W', '1000W'];
      case 'Ổ cứng':
        return ['128GB', '256GB', '512GB', '1TB', '2TB', '4TB'];
      case 'Case':
        return ['ATX', 'Micro-ATX', 'Mini-ITX'];
      case 'Tản nhiệt':
        return ['120mm', '140mm', '240mm', '280mm', '360mm'];
      case 'Ổ đĩa quang':
        return ['DVD-RW', 'Blu-ray'];
      case 'Card mở rộng':
        return ['PCIe x1', 'PCIe x4', 'PCIe x8'];
      case 'Màn hình':
        return ['24 inch', '27 inch', '32 inch', '34 inch', '38 inch', '49 inch'];
      case 'Chuột':
        return ['Có dây', 'Không dây', 'Gaming', 'Văn phòng'];
      case 'Bàn phím':
        return ['Cơ học', 'Membrane', 'Có dây', 'Không dây', 'Gaming', 'Văn phòng'];
      case 'Tai nghe':
        return ['Có dây', 'Không dây', 'Gaming', 'Studio', 'Văn phòng'];
      default:
        return [];
    }
  };

  // Handle brand selection
  const handleBrandChange = (e) => {
    const value = e.target.value;
    setFormData(prev => ({ ...prev, subCategory: value }));
    if (value === 'Khác') {
      setCustomBrand('');
    } else {
      setCustomBrand('');
    }
  };

  // Handle size selection
  const handleSizeChange = (size) => {
    setFormData(prev => ({
      ...prev,
      sizes: prev.sizes.includes(size) 
        ? prev.sizes.filter(item => item !== size)
        : [...prev.sizes, size]
    }));
  };

  // Handle custom spec addition
  const handleAddCustomSpec = () => {
    if (customSpec.trim()) {
      const newSpec = customSpec.trim();
      setCustomSpecs(prev => [...prev, newSpec]);
      setCustomSpec('');
    }
  };

  // Handle stock quantity change
  const handleStockChange = (spec, quantity) => {
    const numQuantity = quantity === '' ? '' : parseInt(quantity);
    setStockQuantities(prev => ({
      ...prev,
      [spec]: numQuantity
    }));
  };

  // Get final brand value
  const getFinalBrand = () => {
    if (formData.subCategory === 'Khác' && customBrand.trim()) {
      return customBrand.trim();
    }
    if (formData.subCategory === 'PC') {
      return 'PC';
    }
    return formData.subCategory;
  };

  // Get final stock data
  const getFinalStockData = () => {
    const stockData = {};
    formData.sizes.forEach(spec => {
      stockData[spec] = stockQuantities[spec] === '' || stockQuantities[spec] === undefined ? 0 : stockQuantities[spec];
    });
    return stockData;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate custom inputs
    if (formData.subCategory === 'Khác' && !customBrand.trim()) {
      toast.error('Vui lòng nhập tên thương hiệu tùy chỉnh');
      return;
    }

    // Validate stock quantities
    const missingStock = formData.sizes.filter(spec => 
      stockQuantities[spec] === '' || stockQuantities[spec] === undefined
    );
    
    if (missingStock.length > 0) {
      toast.error(`Vui lòng nhập số lượng cho: ${missingStock.join(', ')}`);
      return;
    }

    // Prepare update data
    const updateData = {
      id: product._id,
      name: formData.name,
      description: formData.description,
      price: formData.price,
      originalPrice: formData.originalPrice,
      category: formData.category,
      subCategory: getFinalBrand(),
      bestseller: formData.bestseller,
      sizes: JSON.stringify(formData.sizes),
      stockQuantities: JSON.stringify(getFinalStockData())
    };

    // Add new images if selected
    if (image1) updateData.image1 = image1;
    if (image2) updateData.image2 = image2;
    if (image3) updateData.image3 = image3;
    if (image4) updateData.image4 = image4;

    onUpdate(updateData);
  };

  if (!isOpen || !product) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-800">Sửa sản phẩm: {product.name}</h2>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 text-2xl font-bold"
            >
              ×
            </button>
          </div>

          <form onSubmit={handleSubmit} className='flex flex-col w-full items-start gap-3'>
            <div>
              <p className='mb-2 font-bold text-gray-700'>Tải lên hình ảnh mới (để trống nếu không thay đổi)</p>
              <div className='flex gap-2'>
                <label htmlFor="edit-image1">
                  <img className='w-20 cursor-pointer' src={!image1 ? (product.image[0] || assets.upload_area) : URL.createObjectURL(image1)} alt="" />
                  <input onChange={(e) => setImage1(e.target.files[0])} type="file" id="edit-image1" hidden />
                </label>
                <label htmlFor="edit-image2">
                  <img className='w-20 cursor-pointer' src={!image2 ? (product.image[1] || assets.upload_area) : URL.createObjectURL(image2)} alt="" />
                  <input onChange={(e) => setImage2(e.target.files[0])} type="file" id="edit-image2" hidden />
                </label>
                <label htmlFor="edit-image3">
                  <img className='w-20 cursor-pointer' src={!image3 ? (product.image[2] || assets.upload_area) : URL.createObjectURL(image3)} alt="" />
                  <input onChange={(e) => setImage3(e.target.files[0])} type="file" id="edit-image3" hidden />
                </label>
                <label htmlFor="edit-image4">
                  <img className='w-20 cursor-pointer' src={!image4 ? (product.image[3] || assets.upload_area) : URL.createObjectURL(image4)} alt="" />
                  <input onChange={(e) => setImage4(e.target.files[0])} type="file" id="edit-image4" hidden />
                </label>
              </div>
            </div>

            <div className='w-full'>
              <p className='mb-2 font-bold text-gray-700'>Tên sản phẩm</p>
              <input 
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))} 
                value={formData.name} 
                className='w-full max-w-[500px] px-3 py-2 border border-gray-300 rounded' 
                type="text" 
                placeholder='Nhập tên sản phẩm' 
                required 
              />
            </div>

            <div className='w-full'>
              <p className='mb-2 font-bold text-gray-700'>Mô tả sản phẩm</p>
              <textarea 
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))} 
                value={formData.description} 
                className='w-full max-w-[500px] px-3 py-2 border border-gray-300 rounded' 
                placeholder='Nhập nội dung mô tả sản phẩm' 
                required 
              />
            </div>

            <div className='flex flex-col sm:flex-row gap-2 w-full sm:gap-8'>
              <div>
                <p className='mb-2 font-bold text-gray-700'>Danh mục chính</p>
                <select 
                  onChange={(e) => {
                    setFormData(prev => ({ ...prev, category: e.target.value }));
                    if (e.target.value === 'PC') {
                      setFormData(prev => ({ ...prev, subCategory: 'PC' }));
                    } else {
                      setFormData(prev => ({ ...prev, subCategory: '' }));
                    }
                    setFormData(prev => ({ ...prev, sizes: [] }));
                    setCustomBrand('');
                    setCustomSpec('');
                    setCustomSpecs([]);
                    setStockQuantities({});
                  }} 
                  className='w-full px-3 py-2 border border-gray-300 rounded'
                >
                  <option value="PC">PC (Máy tính để bàn)</option>
                  <option value="Laptop">Laptop (Máy tính xách tay)</option>
                  <option value="CPU">CPU (Bộ vi xử lý)</option>
                  <option value="Mainboard">Mainboard (Bo mạch chủ)</option>
                  <option value="RAM">RAM (Bộ nhớ tạm)</option>
                  <option value="GPU">GPU (Card đồ họa)</option>
                  <option value="PSU">PSU (Nguồn máy tính)</option>
                  <option value="Ổ cứng">Ổ cứng (HDD/SSD)</option>
                  <option value="Case">Case (Vỏ máy tính)</option>
                  <option value="Tản nhiệt">Tản nhiệt (quạt, tản nhiệt nước/khí)</option>
                  <option value="Ổ đĩa quang">Ổ đĩa quang (nếu có)</option>
                  <option value="Card mở rộng">Card mở rộng (WiFi, Sound card, Capture card, …)</option>
                  <option value="Màn hình">Màn hình (Monitor)</option>
                  <option value="Chuột">Chuột (Mouse)</option>
                  <option value="Bàn phím">Bàn phím (Keyboard)</option>
                  <option value="Tai nghe">Tai nghe (Headphone)</option>
                </select>
              </div>

              <div>
                <p className='mb-2 font-bold text-gray-700'>Thương hiệu</p>
                <select 
                  onChange={handleBrandChange} 
                  value={formData.subCategory}
                  className='w-full px-3 py-2 border border-gray-300 rounded'
                  disabled={formData.category === 'PC'}
                >
                  <option value="">{formData.category === 'PC' ? 'PC không cần thương hiệu' : 'Chọn thương hiệu'}</option>
                  {getAvailableBrands().map((brand, index) => (
                    <option key={index} value={brand}>{brand}</option>
                  ))}
                </select>
                
                {/* Custom brand input */}
                {formData.subCategory === 'Khác' && (
                  <input 
                    type="text" 
                    placeholder="Nhập tên thương hiệu tùy chỉnh" 
                    value={customBrand}
                    onChange={(e) => setCustomBrand(e.target.value)}
                    className='w-full px-3 py-2 mt-2 border border-gray-300 rounded'
                    required
                  />
                )}
              </div>

              <div>
                <p className='mb-2 font-bold text-gray-700'>Giá bán</p>
                <input 
                  onChange={(e) => setFormData(prev => ({ ...prev, price: e.target.value }))} 
                  value={formData.price} 
                  className='w-full px-3 py-2 sm:w-[140px] border border-gray-300 rounded' 
                  type="Number" 
                  placeholder='Giá bán...đ' 
                  required
                />
              </div>

              <div>
                <p className='mb-2 font-bold text-gray-700'>Giá gốc (tùy chọn)</p>
                <input 
                  onChange={(e) => setFormData(prev => ({ ...prev, originalPrice: e.target.value }))} 
                  value={formData.originalPrice} 
                  className='w-full px-3 py-2 sm:w-[140px] border border-gray-300 rounded' 
                  type="Number" 
                  placeholder='Giá gốc...đ' 
                />
              </div>
            </div>

            <div>
              <p className='mb-2 text-gray-700 font-bold'>Thông số kỹ thuật</p>
              <div className='flex gap-3 flex-wrap'>
                {/* Hiển thị thông số có sẵn */}
                {getAvailableSizes().map((size, index) => (
                  <div 
                    key={`available-${index}`}
                    className='flex flex-col items-center gap-2'
                  >
                    <div 
                      onClick={() => handleSizeChange(size)}
                      className='cursor-pointer'
                    >
                      <p className={`${formData.sizes.includes(size) ? "bg-orange-200" : "bg-slate-200"} px-3 py-1 rounded`}>
                        {size}
                      </p>
                    </div>
                    
                    {/* Stock input cho thông số có sẵn */}
                    {formData.sizes.includes(size) && (
                      <div className='flex items-center gap-1'>
                        <input 
                          type="number" 
                          placeholder="SL" 
                          min="0"
                          value={stockQuantities[size] || ''}
                          onChange={(e) => handleStockChange(size, e.target.value)}
                          className='w-16 px-2 py-1 text-sm border border-gray-300 rounded text-center'
                        />
                        <span className='text-xs text-gray-500'>cái</span>
                      </div>
                    )}
                  </div>
                ))}
                
                {/* Hiển thị thông số tùy chỉnh đã thêm */}
                {customSpecs.map((customSize, index) => (
                  <div 
                    key={`custom-${index}`}
                    className='flex flex-col items-center gap-2'
                  >
                    <div 
                      onClick={() => handleSizeChange(customSize)}
                      className='cursor-pointer'
                    >
                      <p className={`${formData.sizes.includes(customSize) ? "bg-orange-200" : "bg-green-100"} px-3 py-1 rounded border border-green-300`}>
                        {customSize}
                      </p>
                    </div>
                    
                    {/* Stock input cho thông số tùy chỉnh */}
                    {formData.sizes.includes(customSize) && (
                      <div className='flex items-center gap-1'>
                        <input 
                          type="number" 
                          placeholder="SL" 
                          min="0"
                          value={stockQuantities[customSize] || ''}
                          onChange={(e) => handleStockChange(customSize, e.target.value)}
                          className='w-16 px-2 py-1 text-sm border border-gray-300 rounded text-center'
                        />
                        <span className='text-xs text-gray-500'>cái</span>
                      </div>
                    )}
                  </div>
                ))}
                
                {/* Custom spec input */}
                <div className='flex items-center gap-2'>
                  <input 
                    type="text" 
                    placeholder="Thông số tùy chỉnh" 
                    value={customSpec}
                    onChange={(e) => setCustomSpec(e.target.value)}
                    className='px-3 py-1 border border-gray-300 rounded text-sm'
                  />
                  <button 
                    type="button"
                    onClick={handleAddCustomSpec}
                    className='px-3 py-1 bg-blue-500 text-white rounded text-sm hover:bg-blue-600'
                  >
                    Thêm
                  </button>
                </div>
              </div>
            </div>

            <div className='flex gap-2 mt-2'>
              <input 
                onChange={() => setFormData(prev => ({ ...prev, bestseller: !prev.bestseller }))} 
                checked={formData.bestseller} 
                type="checkbox" 
                id='edit-bestseller' 
              />
              <label className='cursor-pointer' htmlFor='edit-bestseller'>Thêm vào danh sách bán chạy nhất</label>
            </div>

            <div className='flex gap-3 mt-4 w-full justify-end'>
              <button 
                type='button'
                onClick={onClose}
                className='px-6 py-3 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition ease-in-out'
              >
                Hủy
              </button>
              <button 
                type='submit' 
                className='px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition ease-in-out'
              >
                Cập nhật sản phẩm
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditProductModal;
