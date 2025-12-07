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
  const [category , setCategory] = useState("PC");
  const [subCategory , setSubCategory] = useState("PC");
  const [bestseller , setBestseller] = useState(false);
  const [sizes, setSizes] = useState([]);
  
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
    switch(category) {
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
                             setCategory('PC');
                     setSubCategory('PC');
                     setSizes([]);
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
                     // Reset subcategory based on new category
                     if (e.target.value === 'PC') {
                       setSubCategory('PC');
                     } else {
                       setSubCategory('');
                     }
                     setSizes([]); // Reset sizes when category changes
                     setCustomBrand(''); // Reset custom brand
                     setCustomSpec(''); // Reset custom spec
                     setCustomSpecs([]); // Reset custom specs when category changes
                     setStockQuantities({}); // Reset stock quantities when category changes
                  }} className='w-full px-3 py-2'>
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
