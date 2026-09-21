import React, { useState } from 'react'
import { assets } from '../assets/assets'
import axios from 'axios'
import {backendUrl} from '../App'
import {toast} from 'react-toastify'

const Add = ({token}) => {

  const [image1,setImage1] = useState(false)
  const [image2,setImage2] = useState(false)
  const [image3,setImage3] = useState(false)
  const [image4,setImage4] = useState(false)

  const [name , setName] = useState("");
  const [description , setDescription] = useState("");
  const [price , setPrice] = useState("");
  const [originalPrice , setOriginalPrice] = useState("");
  const [category , setCategory] = useState("Điện thoại");
  const [subCategory , setSubCategory] = useState("Apple");
  const [bestseller , setBestseller] = useState(false);
  const [sizes, setSizes] = useState(["128GB", "256GB"]);
  
  // Custom input fields for "Khác" options
  const [customBrand, setCustomBrand] = useState("");
  const [customSpec, setCustomSpec] = useState("");
  
  // Danh sách thông số tùy chỉnh đã thêm (để hiển thị button)
  const [customSpecs, setCustomSpecs] = useState([]);
  
  // Quản lý số lượng tồn kho cho từng thông số
  const [stockQuantities, setStockQuantities] = useState({});

  // Get available brands based on selected category
  const getAvailableBrands = () => {
    switch(category) {
      case 'Điện thoại':
        return ['Apple', 'Samsung', 'Xiaomi', 'OPPO', 'Vivo', 'Realme', 'Google Pixel', 'Asus ROG Phone', 'Khác'];
      case 'Máy tính bảng':
        return ['Apple', 'Samsung', 'Xiaomi', 'Lenovo', 'Khác'];
      case 'Laptop':
        return ['Apple', 'Dell', 'Asus', 'HP', 'Lenovo', 'MSI', 'Acer', 'Khác'];
      case 'PC':
        return ['Minh Tuấn Gaming', 'Minh Tuấn Workstation', 'Asus', 'MSI', 'Khác'];
      case 'Phụ kiện di động':
        return ['Apple', 'Samsung', 'Anker', 'Baseus', 'Ugreen', 'Belkin', 'Sony', 'Khác'];
      case 'Phụ kiện máy tính':
        return ['Logitech', 'Razer', 'SteelSeries', 'Corsair', 'FL-Esports', 'Akko', 'Khác'];
      case 'Linh kiện máy tính':
        return ['Intel', 'AMD', 'NVIDIA', 'Asus', 'MSI', 'Gigabyte', 'Corsair', 'Kingston', 'Khác'];
      case 'Màn hình':
        return ['Samsung', 'LG', 'Dell', 'HP', 'Asus', 'Acer', 'BenQ', 'Khác'];
      case 'CPU':
        return ['Intel', 'AMD', 'Khác'];
      case 'GPU':
        return ['NVIDIA', 'AMD', 'Intel', 'Asus', 'MSI', 'Gigabyte', 'EVGA', 'Khác'];
      case 'RAM':
        return ['Corsair', 'Kingston', 'G.Skill', 'Crucial', 'Team Group', 'Khác'];
      case 'Ổ cứng':
        return ['Samsung', 'Western Digital', 'Seagate', 'Crucial', 'Kingston', 'Khác'];
      default:
        return ['Apple', 'Samsung', 'Asus', 'Dell', 'Khác'];
    }
  };

  // Get available sizes based on selected category
  const getAvailableSizes = () => {
    switch(category) {
      case 'Điện thoại':
        return ['128GB', '256GB', '512GB', '1TB'];
      case 'Máy tính bảng':
        return ['64GB', '128GB', '256GB', '512GB', '1TB'];
      case 'Laptop':
        return ['16GB / 512GB', '16GB / 1TB', '32GB / 1TB', '18GB / 512GB', '36GB / 512GB', '8GB / 256GB'];
      case 'PC':
        return ['Core i5 / RTX 4060', 'Core i7 / RTX 4070', 'Core i9 / RTX 4090', 'Ryzen 7 / RX 7800 XT'];
      case 'Phụ kiện di động':
        return ['Trắng', 'Đen', 'Titan Sa Mạc', 'Titan Tự Nhiên', 'Xanh', 'USB-C'];
      case 'Phụ kiện máy tính':
        return ['Không dây', 'Có dây', 'RGB', 'Retro Gray', 'Đen', 'Trắng'];
      case 'Linh kiện máy tính':
      case 'GPU':
        return ['16GB', '12GB', '8GB', '24GB', 'OC Edition'];
      case 'RAM':
        return ['16GB DDR5', '32GB DDR5', '64GB DDR5', '16GB DDR4', '32GB DDR4'];
      case 'Ổ cứng':
        return ['500GB', '1TB', '2TB', '4TB'];
      case 'Màn hình':
        return ['24 inch', '27 inch', '32 inch', '34 inch', '49 inch OLED'];
      default:
        return ['Tiêu chuẩn', 'Cao cấp'];
    }
  };

  // Handle brand selection
  const handleBrandChange = (e) => {
    const value = e.target.value;
    setSubCategory(value);
    if (value === 'Khác') {
      setCustomBrand('');
    } else {
      setCustomBrand('');
    }
  };

  // Handle size selection
  const handleSizeChange = (size) => {
    if (size === 'Khác') {
      setCustomSpec('');
    }
    setSizes(prev => 
      prev.includes(size) ? prev.filter(item => item !== size) : [...prev, size]
    );
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
    // Cho phép nhập 0, nhưng không cho phép chuỗi rỗng
    const numQuantity = quantity === '' ? '' : parseInt(quantity);
    setStockQuantities(prev => ({
      ...prev,
      [spec]: numQuantity
    }));
  };

  // Get final brand value (either selected or custom)
  const getFinalBrand = () => {
    if (subCategory === 'Khác' && customBrand.trim()) {
      return customBrand.trim();
    }
    // For PC, return a default value instead of empty string
    if (subCategory === 'PC') {
      return 'PC';
    }
    return subCategory;
  };

  // Get final sizes array (including custom specs)
  const getFinalSizes = () => {
    const finalSizes = [...sizes];
    return finalSizes;
  };
  
  // Get final stock data with quantities
  const getFinalStockData = () => {
    const stockData = {};
    sizes.forEach(spec => {
      // Nếu không có giá trị hoặc giá trị rỗng, mặc định là 0
      stockData[spec] = stockQuantities[spec] === '' || stockQuantities[spec] === undefined ? 0 : stockQuantities[spec];
    });
    return stockData;
  };

  const onSubmitHandler = async(e) => {
    e.preventDefault();

    // Validate custom inputs
    if (subCategory === 'Khác' && !customBrand.trim()) {
      toast.error('Vui lòng nhập tên thương hiệu tùy chỉnh');
      return;
    }
    
    // Validate stock quantities
    const missingStock = sizes.filter(spec => 
      stockQuantities[spec] === '' || stockQuantities[spec] === undefined
    );
    
    if (missingStock.length > 0) {
      toast.error(`Vui lòng nhập số lượng cho: ${missingStock.join(', ')}`);
      return;
    }

    try {

      const formData = new FormData();

      formData.append("name",name);
      formData.append("description",description);
      formData.append("price",price);
      if (originalPrice) {
        formData.append("originalPrice", originalPrice);
      }
      formData.append("category",category);
      formData.append("subCategory",getFinalBrand());
             formData.append("bestseller",bestseller);
       formData.append("sizes",JSON.stringify(getFinalSizes()));
       formData.append("stockQuantities",JSON.stringify(getFinalStockData()));

      image1 && formData.append("image1",image1);
      image2 && formData.append("image2",image2);
      image3 && formData.append("image3",image3);
      image4 && formData.append("image4",image4);

      const response = await axios.post(backendUrl + "/api/product/add",formData,{headers:{token}});
      
      if(response.data.success){
        toast.success(response.data.message);
        setName('');
        setDescription('');
        setImage1(false);
        setImage2(false);
        setImage3(false);
        setImage4(false);
        setPrice('');
        setOriginalPrice('');
        setCategory('Điện thoại');
        setSubCategory('Apple');
        setSizes(['128GB', '256GB']);
        setCustomBrand('');
        setCustomSpec('');
                     setCustomSpecs([]);
                     setStockQuantities({});
      } else {
        toast.error(response.data.message);
      }

    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  }

  return (
    <div>
        <form onSubmit={onSubmitHandler} className='flex flex-col w-full items-start gap-3'>
            <div>
              <p className='mb-2 font-bold text-gray-700'>Tải lên hình ảnh</p>

              <div className='flex gap-2'>
                <label htmlFor="image1">
                  <img className='w-20 cursor-pointer' src={!image1 ? assets.upload_area : URL.createObjectURL(image1)} alt="" />
                  <input onChange={(e) => setImage1(e.target.files[0])} type="file" id="image1" hidden />
                </label>
                <label htmlFor="image2">
                  <img className='w-20 cursor-pointer' src={!image2 ? assets.upload_area : URL.createObjectURL(image2)} alt="" />
                  <input onChange={(e) => setImage2(e.target.files[0])} type="file" id="image2" hidden />
                </label>
                <label htmlFor="image3">
                  <img className='w-20 cursor-pointer' src={!image3 ? assets.upload_area : URL.createObjectURL(image3)} alt="" />
                  <input onChange={(e) => setImage3(e.target.files[0])} type="file" id="image3" hidden />
                </label>
                <label htmlFor="image4">
                  <img className='w-20 cursor-pointer' src={!image4 ? assets.upload_area : URL.createObjectURL(image4)} alt="" />
                  <input onChange={(e) => setImage4(e.target.files[0])} type="file" id="image4" hidden />
                </label>
              </div>
            </div>

            <div className='w-full'>
              <p className='mb-2 font-bold text-gray-700'>Tên sản phẩm</p>
              <input onChange={(e) => setName(e.target.value)} value={name} className='w-full max-w-[500px] px-3 py-2' type="text" placeholder='Nhập tên sản phẩm' required />
            </div>

            <div className='w-full'>
              <p className='mb-2 font-bold text-gray-700'>Mô tả sản phẩm</p>
              <textarea onChange={(e) => setDescription(e.target.value)} value={description} className='w-full max-w-[500px] px-3 py-2' type="text" placeholder='Nhập nội dung mô tả sản phẩm' required />
            </div>

            <div className='flex flex-col sm:flex-row gap-2 w-full sm:gap-8'>

                <div>
                  <p className='mb-2 font-bold text-gray-700'>Danh mục chính</p>
                  <select onChange={(e) => {
                     setCategory(e.target.value);
                     setSubCategory('');
                     setSizes([]); // Reset sizes when category changes
                     setCustomBrand(''); // Reset custom brand
                     setCustomSpec(''); // Reset custom spec
                     setCustomSpecs([]); // Reset custom specs when category changes
                     setStockQuantities({}); // Reset stock quantities when category changes
                  }} value={category} className='w-full px-3 py-2 border rounded-xl'>
                      <option value="Điện thoại">Điện thoại (Smartphones)</option>
                      <option value="Máy tính bảng">Máy tính bảng (Tablets / iPad)</option>
                      <option value="Laptop">Laptop (Máy tính xách tay)</option>
                      <option value="PC">PC (Gaming & Đồ họa)</option>
                      <option value="Phụ kiện di động">Phụ kiện di động (Tai nghe, Sạc, Cáp...)</option>
                      <option value="Phụ kiện máy tính">Phụ kiện máy tính (Bàn phím, Chuột...)</option>
                      <option value="Linh kiện máy tính">Linh kiện máy tính (CPU, GPU, RAM...)</option>
                      <option value="Màn hình">Màn hình (Monitors)</option>
                  </select>
                </div>

                 <div>
                  <p className='mb-2 font-bold text-gray-700'>Thương hiệu</p>
                  <select 
                    onChange={handleBrandChange} 
                    className='w-full px-3 py-2'
                    disabled={category === 'PC'} // Disable for PC
                  >
                      <option value="">{category === 'PC' ? 'PC không cần thương hiệu' : 'Chọn thương hiệu'}</option>
                      {getAvailableBrands().map((brand, index) => (
                        <option key={index} value={brand}>{brand}</option>
                      ))}
                  </select>
                  
                  {/* Custom brand input */}
                  {subCategory === 'Khác' && (
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
                  <input onChange={(e) => setPrice(e.target.value)} value={price} className='w-full px-3 py-2 sm:w-[140px]' type="Number" placeholder='Giá bán...đ' />
                </div>

                <div>
                  <p className='mb-2 font-bold text-gray-700'>Giá gốc (tùy chọn)</p>
                  <input onChange={(e) => setOriginalPrice(e.target.value)} value={originalPrice} className='w-full px-3 py-2 sm:w-[140px]' type="Number" placeholder='Giá gốc...đ' />
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
                      <p className={`${sizes.includes(size) ? "bg-orange-200" : "bg-slate-200"} px-3 py-1 rounded`}>
                        {size}
                      </p>
                    </div>
                    
                    {/* Stock input cho thông số có sẵn */}
                    {sizes.includes(size) && (
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
                      <p className={`${sizes.includes(customSize) ? "bg-orange-200" : "bg-green-100"} px-3 py-1 rounded border border-green-300`}>
                        {customSize}
                      </p>
                    </div>
                    
                    {/* Stock input cho thông số tùy chỉnh */}
                    {sizes.includes(customSize) && (
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
              <input onChange={() => setBestseller(prev => !prev)} checked={bestseller} type="checkbox" id='bestseller' />
              <label className='cursor-pointer' htmlFor="bestseller">Thêm vào danh sách bán chạy nhất</label>
            </div>

            <button type='submit' className='w-28 py-3 mt-4 bg-black text-white cursor-pointer rounded-lg hover:bg-gray-600 transition ease-in-out'>Thêm</button>

        </form>
    </div>
  )
}

export default Add;
