import React from 'react';
import { Link } from 'react-router-dom';

// Comprehensive mega menu data matching CellphoneS exact layout
export const MEGA_MENU_DATA = {
  'Điện thoại, Tablet': {
    title: 'Điện thoại & Máy tính bảng',
    columns: [
      {
        sectionTitle: 'Hãng điện thoại',
        type: 'badges',
        items: [
          { name: 'iPhone', path: '/collection?category=Điện thoại&brand=Apple' },
          { name: 'SAMSUNG', path: '/collection?category=Điện thoại&brand=Samsung' },
          { name: 'Xiaomi', path: '/collection?category=Điện thoại&brand=Xiaomi' },
          { name: 'OPPO', path: '/collection?category=Điện thoại&brand=OPPO' },
          { name: 'vivo', path: '/collection?category=Điện thoại&brand=Vivo' },
          { name: 'realme', path: '/collection?category=Điện thoại&brand=Realme' },
          { name: 'ASUS ROG', path: '/collection?category=Điện thoại&brand=Asus' },
          { name: 'SONY', path: '/collection?category=Điện thoại&brand=Sony' },
          { name: 'Google Pixel', path: '/collection?category=Điện thoại' },
          { name: 'Nokia', path: '/collection?category=Điện thoại' },
        ],
        subSection: {
          title: 'Mức giá điện thoại',
          items: [
            { name: 'Dưới 2 triệu', path: '/collection?category=Điện thoại' },
            { name: 'Từ 2 - 4 triệu', path: '/collection?category=Điện thoại' },
            { name: 'Từ 4 - 7 triệu', path: '/collection?category=Điện thoại' },
            { name: 'Từ 7 - 13 triệu', path: '/collection?category=Điện thoại' },
            { name: 'Từ 13 - 20 triệu', path: '/collection?category=Điện thoại' },
            { name: 'Trên 20 triệu', path: '/collection?category=Điện thoại' },
          ]
        }
      },
      {
        sectionTitle: 'Điện thoại HOT ⚡',
        type: 'list',
        items: [
          { name: 'iPhone 16 Pro Max', isHot: true, path: '/collection?category=Điện thoại&q=iPhone 16 Pro Max' },
          { name: 'iPhone 16 Pro', isHot: true, path: '/collection?category=Điện thoại&q=iPhone 16 Pro' },
          { name: 'iPhone 16 Plus', isHot: false, path: '/collection?category=Điện thoại&q=iPhone 16' },
          { name: 'Galaxy S24 Ultra', isHot: true, path: '/collection?category=Điện thoại&q=Galaxy S24 Ultra' },
          { name: 'Galaxy Z Fold6', isHot: true, path: '/collection?category=Điện thoại&q=Galaxy Z Fold6' },
          { name: 'Galaxy Z Flip6', isHot: true, path: '/collection?category=Điện thoại&q=Galaxy Z Flip6' },
          { name: 'Xiaomi 14 Ultra', isHot: false, path: '/collection?category=Điện thoại&q=Xiaomi 14' },
          { name: 'Redmi Note 13 Pro', isHot: false, path: '/collection?category=Điện thoại&q=Redmi' },
          { name: 'ROG Phone 8 Pro', isHot: true, path: '/collection?category=Điện thoại&q=ROG Phone' },
        ]
      },
      {
        sectionTitle: 'Hãng máy tính bảng',
        type: 'badges',
        items: [
          { name: 'iPad (Apple)', path: '/collection?category=Máy tính bảng&brand=Apple' },
          { name: 'Samsung Galaxy Tab', path: '/collection?category=Máy tính bảng&brand=Samsung' },
          { name: 'Xiaomi Pad', path: '/collection?category=Máy tính bảng&brand=Xiaomi' },
          { name: 'Lenovo Tab', path: '/collection?category=Máy tính bảng&brand=Lenovo' },
        ],
        subSection: {
          title: 'Máy tính bảng HOT ⚡',
          items: [
            { name: 'iPad Pro M4', isHot: true, path: '/collection?category=Máy tính bảng&q=iPad Pro' },
            { name: 'iPad Air M2', isHot: true, path: '/collection?category=Máy tính bảng&q=iPad Air' },
            { name: 'iPad Gen 10 10.9"', isHot: false, path: '/collection?category=Máy tính bảng&q=iPad' },
            { name: 'Galaxy Tab S9 Ultra', isHot: true, path: '/collection?category=Máy tính bảng&q=Tab S9' },
            { name: 'Redmi Pad Pro', isHot: false, path: '/collection?category=Máy tính bảng&q=Pad' },
          ]
        }
      }
    ]
  },

  'Laptop': {
    title: 'Laptop & Máy tính xách tay',
    columns: [
      {
        sectionTitle: 'Hãng Laptop hàng đầu',
        type: 'badges',
        items: [
          { name: 'Apple (MacBook)', path: '/collection?category=Laptop&brand=Apple' },
          { name: 'ASUS', path: '/collection?category=Laptop&brand=Asus' },
          { name: 'Dell', path: '/collection?category=Laptop&brand=Dell' },
          { name: 'HP', path: '/collection?category=Laptop&brand=HP' },
          { name: 'Lenovo', path: '/collection?category=Laptop&brand=Lenovo' },
          { name: 'MSI', path: '/collection?category=Laptop&brand=MSI' },
          { name: 'Acer', path: '/collection?category=Laptop&brand=Acer' },
        ],
        subSection: {
          title: 'Khoảng giá Laptop',
          items: [
            { name: 'Dưới 15 triệu', path: '/collection?category=Laptop' },
            { name: 'Từ 15 - 25 triệu', path: '/collection?category=Laptop' },
            { name: 'Từ 25 - 35 triệu', path: '/collection?category=Laptop' },
            { name: 'Trên 35 triệu', path: '/collection?category=Laptop' },
          ]
        }
      },
      {
        sectionTitle: 'Phân loại nhu cầu ⚡',
        type: 'list',
        items: [
          { name: 'Laptop Gaming đồ họa', isHot: true, path: '/collection?category=Laptop&q=Gaming' },
          { name: 'Laptop Mỏng nhẹ cao cấp', isHot: true, path: '/collection?category=Laptop&q=Air' },
          { name: 'Laptop Sinh viên - Văn phòng', isHot: false, path: '/collection?category=Laptop' },
          { name: 'MacBook Air M2 / M3', isHot: true, path: '/collection?category=Laptop&brand=Apple' },
          { name: 'MacBook Pro 14" / 16" M3 Max', isHot: true, path: '/collection?category=Laptop&brand=Apple' },
          { name: 'ASUS ROG Zephyrus / Strix', isHot: true, path: '/collection?category=Laptop&brand=Asus' },
          { name: 'Dell XPS 13 / 15', isHot: false, path: '/collection?category=Laptop&brand=Dell' },
          { name: 'Lenovo Legion Gaming', isHot: true, path: '/collection?category=Laptop&brand=Lenovo' },
        ]
      },
      {
        sectionTitle: 'Dòng chip xử lý CPU',
        type: 'badges',
        items: [
          { name: 'Intel Core i5', path: '/collection?category=Laptop&q=i5' },
          { name: 'Intel Core i7 / i9', path: '/collection?category=Laptop&q=i7' },
          { name: 'Intel Core Ultra (AI)', path: '/collection?category=Laptop&q=Ultra' },
          { name: 'Apple M3 / M3 Pro', path: '/collection?category=Laptop&brand=Apple' },
          { name: 'AMD Ryzen 7 / 9', path: '/collection?category=Laptop&q=Ryzen' },
        ],
        subSection: {
          title: 'Kích thước màn hình',
          items: [
            { name: '13.3 - 14 inch mỏng gọn', path: '/collection?category=Laptop' },
            { name: '15.6 - 16 inch tiêu chuẩn', path: '/collection?category=Laptop' },
            { name: '17.3 inch gaming lớn', path: '/collection?category=Laptop' },
          ]
        }
      }
    ]
  },

  'PC, Màn hình': {
    title: 'PC Gaming, Đồ họa & Màn hình',
    columns: [
      {
        sectionTitle: 'PC Gaming & Đồng bộ',
        type: 'badges',
        items: [
          { name: 'PC Gaming Minh Tuấn Dragon', path: '/collection?category=PC' },
          { name: 'PC Đồ họa - Render 3D', path: '/collection?category=PC' },
          { name: 'PC Văn phòng - All-in-One', path: '/collection?category=PC' },
          { name: 'Mac Studio / Mac Mini', path: '/collection?category=PC&brand=Apple' },
        ],
        subSection: {
          title: 'Tầm giá PC Build sẵn',
          items: [
            { name: 'PC Gaming 10 - 15 triệu', path: '/collection?category=PC' },
            { name: 'PC Gaming 15 - 25 triệu', path: '/collection?category=PC' },
            { name: 'PC Gaming 25 - 40 triệu', path: '/collection?category=PC' },
            { name: 'PC Supreme trên 40 triệu', path: '/collection?category=PC' },
          ]
        }
      },
      {
        sectionTitle: 'Màn hình máy tính ⚡',
        type: 'list',
        items: [
          { name: 'Màn hình Gaming 144Hz - 240Hz', isHot: true, path: '/collection?category=Màn hình' },
          { name: 'Màn hình Đồ họa chuẩn màu 4K', isHot: true, path: '/collection?category=Màn hình' },
          { name: 'Màn hình Cong Ultrawide', isHot: false, path: '/collection?category=Màn hình' },
          { name: 'Màn hình Văn phòng viền mỏng', isHot: false, path: '/collection?category=Màn hình' },
          { name: 'Màn hình OLED / Mini-LED', isHot: true, path: '/collection?category=Màn hình' },
        ]
      },
      {
        sectionTitle: 'Hãng Màn hình nổi bật',
        type: 'badges',
        items: [
          { name: 'Samsung Odyssey', path: '/collection?category=Màn hình&brand=Samsung' },
          { name: 'LG UltraGear / Ergo', path: '/collection?category=Màn hình&brand=LG' },
          { name: 'Dell UltraSharp', path: '/collection?category=Màn hình&brand=Dell' },
          { name: 'ASUS ROG / TUF', path: '/collection?category=Màn hình&brand=Asus' },
          { name: 'ViewSonic / AOC', path: '/collection?category=Màn hình' },
        ]
      }
    ]
  },

  'Linh kiện máy tính': {
    title: 'Linh kiện máy tính tự Build',
    columns: [
      {
        sectionTitle: 'Linh kiện cốt lõi',
        type: 'badges',
        items: [
          { name: 'CPU - Vi xử lý', path: '/collection?category=Linh kiện máy tính&q=CPU' },
          { name: 'VGA - Card màn hình', path: '/collection?category=Linh kiện máy tính&q=RTX' },
          { name: 'Mainboard - Bo mạch', path: '/collection?category=Linh kiện máy tính&q=Main' },
          { name: 'RAM - Bộ nhớ trong', path: '/collection?category=Linh kiện máy tính&q=RAM' },
          { name: 'Ổ cứng SSD M.2 NVMe', path: '/collection?category=Linh kiện máy tính&q=SSD' },
          { name: 'Nguồn máy tính (PSU)', path: '/collection?category=Linh kiện máy tính&q=Nguồn' },
          { name: 'Vỏ Case Gaming', path: '/collection?category=Linh kiện máy tính&q=Case' },
          { name: 'Tản nhiệt nước AIO', path: '/collection?category=Linh kiện máy tính&q=Tản' },
        ]
      },
      {
        sectionTitle: 'Card đồ họa HOT ⚡',
        type: 'list',
        items: [
          { name: 'NVIDIA GeForce RTX 4090 24GB', isHot: true, path: '/collection?category=Linh kiện máy tính&q=4090' },
          { name: 'NVIDIA GeForce RTX 4080 Super', isHot: true, path: '/collection?category=Linh kiện máy tính&q=4080' },
          { name: 'NVIDIA GeForce RTX 4070 Super', isHot: true, path: '/collection?category=Linh kiện máy tính&q=4070' },
          { name: 'NVIDIA GeForce RTX 4060 8GB', isHot: true, path: '/collection?category=Linh kiện máy tính&q=4060' },
          { name: 'AMD Radeon RX 7800 XT', isHot: false, path: '/collection?category=Linh kiện máy tính&q=RX' },
        ]
      },
      {
        sectionTitle: 'Hãng linh kiện chính hãng',
        type: 'badges',
        items: [
          { name: 'Intel', path: '/collection?category=Linh kiện máy tính&brand=Intel' },
          { name: 'AMD', path: '/collection?category=Linh kiện máy tính&brand=AMD' },
          { name: 'ASUS ROG', path: '/collection?category=Linh kiện máy tính&brand=Asus' },
          { name: 'MSI', path: '/collection?category=Linh kiện máy tính&brand=MSI' },
          { name: 'Gigabyte', path: '/collection?category=Linh kiện máy tính' },
          { name: 'Corsair', path: '/collection?category=Linh kiện máy tính&brand=Corsair' },
          { name: 'Kingston Fury', path: '/collection?category=Linh kiện máy tính' },
        ]
      }
    ]
  },

  'Âm thanh, Tai nghe': {
    title: 'Âm thanh & Tai nghe chính hãng',
    columns: [
      {
        sectionTitle: 'Dòng sản phẩm âm thanh',
        type: 'badges',
        items: [
          { name: 'Tai nghe Bluetooth True Wireless', path: '/collection?category=Phụ kiện di động&q=Tai nghe' },
          { name: 'Tai nghe Chụp tai (Over-ear)', path: '/collection?category=Phụ kiện di động&q=Chụp tai' },
          { name: 'Tai nghe Chống ồn chủ động (ANC)', path: '/collection?category=Phụ kiện di động' },
          { name: 'Loa Bluetooth di động', path: '/collection?category=Phụ kiện di động&q=Loa' },
          { name: 'Loa Soundbar TV / Karaoke', path: '/collection?category=Phụ kiện di động' },
        ]
      },
      {
        sectionTitle: 'Sản phẩm HOT ⚡',
        type: 'list',
        items: [
          { name: 'Apple AirPods Pro 2 USB-C', isHot: true, path: '/collection?category=Phụ kiện di động&q=AirPods' },
          { name: 'Apple AirPods 4 / ANC', isHot: true, path: '/collection?category=Phụ kiện di động&q=AirPods' },
          { name: 'Sony WH-1000XM5 Chống ồn', isHot: true, path: '/collection?category=Phụ kiện di động&q=Sony' },
          { name: 'Loa Sony ULT Field 1', isHot: true, path: '/collection?category=Phụ kiện di động&q=Sony' },
          { name: 'JBL Charge 5 / Flip 6', isHot: false, path: '/collection?category=Phụ kiện di động&q=JBL' },
          { name: 'Marshall Emberton II', isHot: true, path: '/collection?category=Phụ kiện di động' },
        ]
      },
      {
        sectionTitle: 'Thương hiệu âm thanh',
        type: 'badges',
        items: [
          { name: 'Apple', path: '/collection?category=Phụ kiện di động&brand=Apple' },
          { name: 'Sony', path: '/collection?category=Phụ kiện di động&brand=Sony' },
          { name: 'JBL', path: '/collection?category=Phụ kiện di động' },
          { name: 'Marshall', path: '/collection?category=Phụ kiện di động' },
          { name: 'Anker Soundcore', path: '/collection?category=Phụ kiện di động&brand=Anker' },
        ]
      }
    ]
  },

  'Phụ kiện máy tính': {
    title: 'Phụ kiện máy tính & Gaming Gear',
    columns: [
      {
        sectionTitle: 'Chuột & Bàn phím',
        type: 'badges',
        items: [
          { name: 'Bàn phím cơ Gaming', path: '/collection?category=Phụ kiện máy tính&q=Bàn phím' },
          { name: 'Chuột không dây công thái học', path: '/collection?category=Phụ kiện máy tính&q=Chuột' },
          { name: 'Lót chuột cỡ lớn (Deskmat)', path: '/collection?category=Phụ kiện máy tính' },
          { name: 'Giá treo tai nghe & Hub USB', path: '/collection?category=Phụ kiện máy tính' },
        ]
      },
      {
        sectionTitle: 'Gear HOT ⚡',
        type: 'list',
        items: [
          { name: 'Logitech MX Master 3S', isHot: true, path: '/collection?category=Phụ kiện máy tính&q=Logitech' },
          { name: 'Logitech G Pro X Superlight 2', isHot: true, path: '/collection?category=Phụ kiện máy tính&q=Logitech' },
          { name: 'Bàn phím cơ FL-Esports / Akko', isHot: false, path: '/collection?category=Phụ kiện máy tính' },
          { name: 'Corsair K70 RGB Pro', isHot: false, path: '/collection?category=Phụ kiện máy tính' },
        ]
      },
      {
        sectionTitle: 'Hãng Gaming Gear',
        type: 'badges',
        items: [
          { name: 'Logitech G', path: '/collection?category=Phụ kiện máy tính&brand=Logitech' },
          { name: 'Razer', path: '/collection?category=Phụ kiện máy tính' },
          { name: 'Corsair', path: '/collection?category=Phụ kiện máy tính' },
          { name: 'SteelSeries', path: '/collection?category=Phụ kiện máy tính' },
        ]
      }
    ]
  }
};

const CategoryMegaMenu = ({ categoryKey, onClose }) => {
  const data = MEGA_MENU_DATA[categoryKey] || MEGA_MENU_DATA['Điện thoại, Tablet'];

  if (!data) return null;

  return (
    <div 
      className="absolute top-0 left-full ml-1 w-[740px] xl:w-[820px] bg-white rounded-2xl shadow-2xl border border-slate-100 p-6 z-50 text-slate-800 animate-fadeIn"
      onMouseLeave={onClose}
    >
      <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-100">
        <h3 className="font-black text-slate-900 text-sm uppercase tracking-tight flex items-center gap-2">
          <span className="w-2 h-4 bg-[#d70018] rounded-full"></span>
          <span>{data.title}</span>
        </h3>
        <Link 
          to="/collection" 
          onClick={onClose} 
          className="inline-flex items-center gap-1.5 px-3 py-1 bg-red-50 hover:bg-[#d70018] text-[#d70018] hover:text-white border border-red-200 rounded-xl text-xs font-bold transition-all shadow-2xs group"
        >
          <span>Xem tất cả</span>
          <svg className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 5l7 7-7 7" />
          </svg>
        </Link>
      </div>

      <div className="grid grid-cols-3 gap-6">
        {data.columns.map((col, idx) => (
          <div key={idx} className="space-y-4">
            <div>
              <h4 className="font-bold text-xs uppercase tracking-wider text-slate-800 mb-2.5 pb-1 border-b border-slate-100">
                {col.sectionTitle}
              </h4>

              {col.type === 'badges' ? (
                <div className="flex flex-wrap gap-1.5">
                  {col.items.map((it, i) => (
                    <Link
                      key={i}
                      to={it.path}
                      onClick={onClose}
                      className="px-2.5 py-1 bg-slate-50 hover:bg-red-50 hover:text-[#d70018] hover:border-red-200 border border-slate-200/80 rounded-lg text-xs font-semibold transition-all shadow-2xs truncate"
                    >
                      {it.name}
                    </Link>
                  ))}
                </div>
              ) : (
                <div className="space-y-1.5">
                  {col.items.map((it, i) => (
                    <Link
                      key={i}
                      to={it.path}
                      onClick={onClose}
                      className="flex items-center justify-between py-1 px-1.5 rounded-md hover:bg-red-50 text-xs font-medium text-slate-700 hover:text-[#d70018] transition-colors"
                    >
                      <span className="truncate">{it.name}</span>
                      {it.isHot && (
                        <span className="text-[9px] bg-red-600 text-white px-1 py-0.2 rounded font-black tracking-tight shrink-0">
                          HOT
                        </span>
                      )}
                    </Link>
                  ))}
                </div>
              )}
            </div>

            {col.subSection && (
              <div className="pt-2 border-t border-slate-100">
                <h5 className="font-bold text-[11px] uppercase tracking-wider text-slate-500 mb-2">
                  {col.subSection.title}
                </h5>
                <div className="flex flex-wrap gap-1.5">
                  {col.subSection.items.map((sub, sIdx) => (
                    <Link
                      key={sIdx}
                      to={sub.path}
                      onClick={onClose}
                      className="px-2 py-0.5 bg-white hover:bg-red-50 hover:text-[#d70018] border border-slate-200 rounded text-[11px] text-slate-600 transition-colors flex items-center gap-1"
                    >
                      <span>{sub.name}</span>
                      {sub.isHot && <span className="text-[8px] text-red-600 font-black">★</span>}
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default CategoryMegaMenu;
