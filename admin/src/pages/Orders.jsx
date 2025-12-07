import React from 'react'
import { useEffect } from 'react'
import { useState } from 'react'
import axios from 'axios'
import {backendUrl, currency} from '../App'
import {toast} from 'react-toastify'
import { assets } from '../assets/assets'
import * as XLSX from 'xlsx'

const Orders = ({token}) => {

  const [orders, setOrders] = useState([])
  const [currentPage, setCurrentPage] = useState(1)
  const ordersPerPage = 5
  const [showCancelModal, setShowCancelModal] = useState(false)
  const [cancelReason, setCancelReason] = useState('')
  const [orderToCancel, setOrderToCancel] = useState(null)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [orderToDelete, setOrderToDelete] = useState(null)
  const [selectedOrderIds, setSelectedOrderIds] = useState([])
  const allVisibleSelected = orders.length > 0 && orders.every(o => selectedOrderIds.includes(o._id))

  const fetchAllOrders = async () => {
    if(!token){
        return null;
    }

    try {
      const response = await axios.post(backendUrl + '/api/order/list',{},{headers:{token}});
      if(response.data.success){
        const newOrders = response.data.orders.reverse()
        setOrders(newOrders)
        // Gỡ chọn những đơn không còn tồn tại
        setSelectedOrderIds(prev => prev.filter(id => newOrders.find(o => o._id === id)))
      }
      else {
        toast.error(response.data.message)
      }
      
    } catch (error) {
      toast.error(error.message)
    }
  }

  const statusHandler = async ( event , orderId ) => {
    try {
      const response = await axios.post(backendUrl + '/api/order/status' , {orderId , status: event.target.value} , {headers:{token}});
      if(response.data.success){
        await fetchAllOrders();
      }
    
    } catch (error) {
      console.log(error);
      toast.error(error.message || 'Có lỗi xảy ra khi cập nhật trạng thái đơn hàng');
    }
  }

  const openCancelModal = (order) => {
    setOrderToCancel(order);
    setCancelReason('');
    setShowCancelModal(true);
  }

  const closeCancelModal = () => {
    setShowCancelModal(false);
    setOrderToCancel(null);
    setCancelReason('');
  }

  const openDeleteModal = (order) => {
    setOrderToDelete(order);
    setShowDeleteModal(true);
  }

  const closeDeleteModal = () => {
    setShowDeleteModal(false);
    setOrderToDelete(null);
  }

  const cancelOrderHandler = async () => {
    if (!cancelReason.trim()) {
      toast.error('Vui lòng nhập lý do hủy đơn hàng!');
      return;
    }

    try {
      const response = await axios.post(backendUrl + '/api/order/status', {
        orderId: orderToCancel._id, 
        status: 'Đã hủy',
        cancelReason: cancelReason.trim()
      }, {headers:{token}});
      
      if(response.data.success){
        toast.success('Đã hủy đơn hàng thành công!');
        await fetchAllOrders();
        closeCancelModal();
      } else {
        toast.error(response.data.message || 'Có lỗi xảy ra khi hủy đơn hàng');
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message || 'Có lỗi xảy ra khi hủy đơn hàng');
    }
  }

  const deleteOrderHandler = async () => {
    try {
      const response = await axios.post(backendUrl + '/api/order/delete', {
        orderId: orderToDelete._id
      }, {headers:{token}});
      
      if(response.data.success){
        toast.success('Đã xóa đơn hàng thành công!');
        await fetchAllOrders();
        closeDeleteModal();
      } else {
        toast.error(response.data.message || 'Có lỗi xảy ra khi xóa đơn hàng');
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message || 'Có lỗi xảy ra khi xóa đơn hàng');
    }
  }

  useEffect(() =>{
    fetchAllOrders()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  },[token])

  // Tính toán các đơn hàng hiển thị theo trang
  const indexOfLastOrder = currentPage * ordersPerPage;
  const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;
  const currentOrders = orders.slice(indexOfFirstOrder, indexOfLastOrder);
  const totalPages = Math.ceil(orders.length / ordersPerPage);

  // Hàm chuyển trang
  const paginate = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const goToNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const goToPrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  // Toggle chọn 1 đơn
  const toggleSelectOrder = (orderId) => {
    setSelectedOrderIds(prev => prev.includes(orderId) ? prev.filter(id => id !== orderId) : [...prev, orderId])
  }

  // Chọn/Bỏ chọn tất cả
  const toggleSelectAll = () => {
    if (orders.length === 0) return
    if (allVisibleSelected) {
      setSelectedOrderIds([])
    } else {
      setSelectedOrderIds(orders.map(o => o._id))
    }
  }

  // Hàm xuất ra Excel dùng chung
  const exportOrdersToExcel = (exportOrders) => {
    try {
      if (!exportOrders || exportOrders.length === 0) {
        toast.error('Vui lòng chọn ít nhất 1 đơn để xuất')
        return
      }

      const excelData = exportOrders.map((order, index) => {
        const orderItems = order.items.map(item => `${item.name} (${item.size}) x${item.quantity}`).join('; ');
        return {
          'STT': index + 1,
          'Mã đơn hàng': order._id.slice(-8),
          'Ngày đặt hàng': new Date(order.createdAt).toLocaleDateString('vi-VN'),
          'Giờ đặt hàng': new Date(order.createdAt).toLocaleTimeString('vi-VN', {hour: '2-digit', minute: '2-digit'}),
          'Trạng thái': order.status === 'Đã hủy' && order.cancelReason 
            ? `${order.status} - ${order.cancelReason}`
            : order.status,
          'Tên khách hàng': `${order.address.firstName} ${order.address.lastName}`,
          'Số điện thoại': order.address.phone,
          'Địa chỉ': `${order.address.street}, ${order.address.city}, ${order.address.state}, ${order.address.country} ${order.address.zipcode}`,
          'Sản phẩm': orderItems,
          'Số lượng sản phẩm': order.items.length,
          'Giá gốc': `${order.originalAmount ? order.originalAmount.toLocaleString('vi-VN') : order.amount.toLocaleString('vi-VN')}${currency}`,
          'Giảm giá': `${order.discountAmount ? order.discountAmount.toLocaleString('vi-VN') : 0}${currency}`,
          'Voucher': order.voucherCode || '',
          'Tổng tiền': `${order.amount.toLocaleString('vi-VN')}${currency}`,
          'Phí vận chuyển': `${order.delivery_fee ? order.delivery_fee.toLocaleString('vi-VN') : 0}${currency}`,
          'Tổng cộng': `${(order.amount + (order.delivery_fee || 0)).toLocaleString('vi-VN')}${currency}`
        };
      });

      const workbook = XLSX.utils.book_new();
      const worksheet = XLSX.utils.json_to_sheet(excelData);

      // Auto filter
      worksheet['!autofilter'] = { ref: worksheet['!ref'] };

      // Column widths
      worksheet['!cols'] = [
        { wch: 5 },{ wch: 15 },{ wch: 15 },{ wch: 12 },{ wch: 22 },{ wch: 25 },{ wch: 15 },{ wch: 50 },{ wch: 60 },{ wch: 15 },{ wch: 15 },{ wch: 15 },{ wch: 15 },{ wch: 15 }
      ];

      // Style: header bold + border for all cells
      const headerStyle = {
        font: { bold: true, color: { rgb: 'FFFFFF' } },
        fill: { fgColor: { rgb: '366092' } },
        alignment: { horizontal: 'center', vertical: 'center' },
        border: { top:{style:'thin'}, bottom:{style:'thin'}, left:{style:'thin'}, right:{style:'thin'} }
      };
      const cellBorder = { border: { top:{style:'thin'}, bottom:{style:'thin'}, left:{style:'thin'}, right:{style:'thin'} } };

      const range = XLSX.utils.decode_range(worksheet['!ref']);
      // Apply header style to first row
      for (let C = range.s.c; C <= range.e.c; ++C) {
        const address = XLSX.utils.encode_cell({ r: 0, c: C });
        if (!worksheet[address]) continue;
        worksheet[address].s = headerStyle;
      }
      // Apply borders to all data cells
      for (let R = range.s.r + 1; R <= range.e.r; ++R) {
        for (let C = range.s.c; C <= range.e.c; ++C) {
          const address = XLSX.utils.encode_cell({ r: R, c: C });
          if (!worksheet[address]) continue;
          worksheet[address].s = { ...(worksheet[address].s || {}), ...cellBorder };
        }
      }

      XLSX.utils.book_append_sheet(workbook, worksheet, 'Đơn hàng đã chọn');
      const timestamp = new Date().toISOString().slice(0, 19).replace(/:/g, '-');
      const fileName = `DonHang_DaChon_${timestamp}.xlsx`;
      XLSX.writeFile(workbook, fileName);
      toast.success('Đã xuất Excel thành công!')
    } catch (error) {
      console.error('Lỗi khi xuất Excel (đã chọn):', error)
      toast.error('Có lỗi xảy ra khi xuất Excel (đã chọn)')
    }
  }

  // Function xuất đơn hàng ra Excel
  const exportToExcel = () => {
    exportOrdersToExcel(orders)
  };


  // Function xuất Excel cho đơn hàng đơn lẻ
  const exportSingleOrderToExcel = (order) => {
    try {
      // Tạo 1 bảng duy nhất với tất cả thông tin
      const excelData = [
        // Dòng tiêu đề chính
                 {
           'STT': 'THÔNG TIN ĐƠN HÀNG',
           'Mã đơn hàng': order._id.slice(-8),
           'Ngày đặt hàng': new Date(order.createdAt).toLocaleDateString('vi-VN'),
           'Giờ đặt hàng': new Date(order.createdAt).toLocaleTimeString('vi-VN', {hour: '2-digit', minute: '2-digit'}),
           'Trạng thái': order.status === 'Đã hủy' && order.cancelReason 
             ? `${order.status} - ${order.cancelReason}`
             : order.status,
           'Tên khách hàng': `${order.address.firstName} ${order.address.lastName}`,
           'Số điện thoại': order.address.phone,
           'Địa chỉ': `${order.address.street}, ${order.address.city}, ${order.address.state}, ${order.address.country} ${order.address.zipcode}`,
           'Phương thức thanh toán': order.paymentMethod,
           'Trạng thái thanh toán': order.payment ? 'Đã thanh toán' : 'Chưa thanh toán',
           'Tổng tiền sản phẩm': `${order.amount.toLocaleString('vi-VN')}${currency}`,
           'Phí vận chuyển': `${order.delivery_fee ? order.delivery_fee.toLocaleString('vi-VN') : 0}${currency}`,
           'Tổng cộng': `${(order.amount + (order.delivery_fee || 0)).toLocaleString('vi-VN')}${currency}`
         },
        // Dòng trống để phân cách
        {
          'STT': '',
          'Mã đơn hàng': '',
          'Ngày đặt hàng': '',
          'Giờ đặt hàng': '',
          'Trạng thái': '',
          'Tên khách hàng': '',
          'Số điện thoại': '',
          'Địa chỉ': '',
          'Phương thức thanh toán': '',
          'Trạng thái thanh toán': '',
          'Tổng tiền sản phẩm': '',
          'Phí vận chuyển': '',
          'Tổng cộng': ''
        },
        // Dòng tiêu đề sản phẩm
        {
          'STT': 'CHI TIẾT SẢN PHẨM',
          'Mã đơn hàng': '',
          'Ngày đặt hàng': '',
          'Giờ đặt hàng': '',
          'Trạng thái': '',
          'Tên khách hàng': '',
          'Số điện thoại': '',
          'Địa chỉ': '',
          'Phương thức thanh toán': '',
          'Trạng thái thanh toán': '',
          'Tổng tiền sản phẩm': '',
          'Phí vận chuyển': '',
          'Tổng cộng': ''
        }
      ];

      // Thêm dữ liệu sản phẩm
      order.items.forEach((item, index) => {
        excelData.push({
          'STT': index + 1,
          'Mã đơn hàng': item.name,
          'Ngày đặt hàng': item.size,
          'Giờ đặt hàng': item.quantity,
          'Trạng thái': `${item.price ? item.price.toLocaleString('vi-VN') : 0}${currency}`,
          'Tên khách hàng': `${(item.price * item.quantity).toLocaleString('vi-VN')}${currency}`,
          'Số điện thoại': '',
          'Địa chỉ': '',
          'Phương thức thanh toán': '',
          'Trạng thái thanh toán': '',
          'Tổng tiền sản phẩm': '',
          'Phí vận chuyển': '',
          'Tổng cộng': ''
        });
      });

      // Tạo workbook và worksheet
      const workbook = XLSX.utils.book_new();
      const worksheet = XLSX.utils.json_to_sheet(excelData);

      // Đặt tên cho worksheet
      XLSX.utils.book_append_sheet(workbook, worksheet, 'Đơn hàng');

      // Tự động điều chỉnh độ rộng cột
      const columnWidths = [
        { wch: 15 },  // STT
        { wch: 20 },  // Mã đơn hàng
        { wch: 15 },  // Ngày đặt hàng
        { wch: 15 },  // Giờ đặt hàng
        { wch: 15 },  // Trạng thái
        { wch: 25 },  // Tên khách hàng
        { wch: 15 },  // Số điện thoại
        { wch: 50 },  // Địa chỉ
        { wch: 20 },  // Phương thức thanh toán
        { wch: 20 },  // Trạng thái thanh toán
        { wch: 20 },  // Tổng tiền sản phẩm
        { wch: 20 },  // Phí vận chuyển
        { wch: 20 }   // Tổng cộng
      ];
      worksheet['!cols'] = columnWidths;

      // Định dạng tiêu đề cột (in đậm, nền xanh)
      const headerStyle = {
        font: { bold: true, color: { rgb: "FFFFFF" } },
        fill: { fgColor: { rgb: "366092" } },
        alignment: { horizontal: "center", vertical: "center" },
        border: {
          top: { style: "thin" },
          bottom: { style: "thin" },
          left: { style: "thin" },
          right: { style: "thin" }
        }
      };

      // Định dạng dòng tiêu đề chính (in đậm, nền xanh đậm)
      const mainHeaderStyle = {
        font: { bold: true, color: { rgb: "FFFFFF" } },
        fill: { fgColor: { rgb: "1F4E79" } },
        alignment: { horizontal: "center", vertical: "center" },
        border: {
          top: { style: "thin" },
          bottom: { style: "thin" },
          left: { style: "thin" },
          right: { style: "thin" }
        }
      };

      // Áp dụng style cho tiêu đề cột
      const range = XLSX.utils.decode_range(worksheet['!ref']);
      for (let C = range.s.c; C <= range.e.c; ++C) {
        const address = XLSX.utils.encode_cell({ r: 0, c: C });
        if (!worksheet[address]) continue;
        worksheet[address].s = headerStyle;
      }

      // Áp dụng style cho dòng tiêu đề chính
      for (let C = range.s.c; C <= range.e.c; ++C) {
        const address = XLSX.utils.encode_cell({ r: 0, c: C });
        if (!worksheet[address]) continue;
        worksheet[address].s = mainHeaderStyle;
      }

      // Áp dụng style cho dòng tiêu đề sản phẩm
      for (let C = range.s.c; C <= range.e.c; ++C) {
        const address = XLSX.utils.encode_cell({ r: 2, c: C });
        if (!worksheet[address]) continue;
        worksheet[address].s = mainHeaderStyle;
      }

      // Tạo tên file với mã đơn hàng
      const timestamp = new Date().toISOString().slice(0, 19).replace(/:/g, '-');
      const fileName = `DonHang_${order._id.slice(-8)}_${timestamp}.xlsx`;

      // Xuất file
      XLSX.writeFile(workbook, fileName);
      
      toast.success('Đã xuất Excel đơn hàng thành công!');
    } catch (error) {
      console.error('Lỗi khi xuất Excel đơn hàng:', error);
      toast.error('Có lỗi xảy ra khi xuất Excel đơn hàng');
    }
  };


  return (
    <div className="bg-gray-50 min-h-screen p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 flex items-center">
                <svg className="w-8 h-8 mr-3 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 2L3 7v11a1 1 0 001 1h3a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1h3a1 1 0 001-1V7l-7-5z" clipRule="evenodd"/>
                </svg>
                Quản lý đơn hàng
              </h1>
              <p className="text-gray-600 mt-1">Theo dõi và xử lý tất cả đơn hàng của khách hàng</p>
            </div>
            <div className="text-right flex items-center space-x-4">
              {/* Chọn tất cả */}
              <label className="flex items-center gap-2 bg-white border border-gray-200 rounded-lg px-3 py-2 cursor-pointer">
                <input type="checkbox" checked={allVisibleSelected} onChange={toggleSelectAll} />
                <span className="text-sm text-gray-700">Chọn tất cả</span>
              </label>
              {/* Button Xuất Excel */}
              <button
                onClick={exportToExcel}
                disabled={orders.length === 0}
                className={`flex items-center px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                  orders.length === 0
                    ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                    : 'bg-green-600 text-white hover:bg-green-700 active:bg-green-800'
                }`}
                title={orders.length === 0 ? 'Không có đơn hàng để xuất' : 'Xuất tất cả đơn hàng ra Excel'}
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                Xuất Excel
              </button>

              {/* Button Xuất Excel đã chọn */}
              <button
                onClick={() => exportOrdersToExcel(orders.filter(o => selectedOrderIds.includes(o._id)))}
                disabled={selectedOrderIds.length === 0}
                className={`flex items-center px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                  selectedOrderIds.length === 0
                    ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                    : 'bg-blue-600 text-white hover:bg-blue-700 active:bg-blue-800'
                }`}
                title={selectedOrderIds.length === 0 ? 'Chưa chọn đơn hàng' : 'Xuất các đơn đã chọn ra Excel'}
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 16v-1a4 4 0 00-4-4H7" />
                </svg>
                Xuất Excel (đã chọn)
              </button>

              
              
              {/* Thống kê đơn hàng */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-blue-800 font-semibold text-lg">{orders.length}</p>
                <p className="text-blue-600 text-sm">Tổng đơn hàng</p>
              </div>
            </div>
          </div>
        </div>

        {/* Stats và Pagination Info */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
          <div className="flex flex-wrap items-center justify-between">
            <div className="flex items-center space-x-4">
              <span className="text-gray-600">Hiển thị</span>
              <span className="font-semibold text-blue-600">{indexOfFirstOrder + 1} - {Math.min(indexOfLastOrder, orders.length)}</span>
              <span className="text-gray-600">trên</span>
              <span className="font-semibold text-blue-600">{orders.length}</span>
              <span className="text-gray-600">đơn hàng</span>
            </div>
            <div className="text-sm text-gray-500">
              Trang {currentPage} / {totalPages}
            </div>
          </div>
        </div>
        <div className="space-y-4">
          {
            currentOrders.map((order,index)=>(
              <div className='bg-white border border-gray-200 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden' key={index}>
                {/* Header với Order ID và Status */}
                <div className="bg-gray-50 px-6 py-4 border-b border-gray-200 flex justify-between items-center">
                  <div className="flex items-center space-x-3">
                    <input type="checkbox" checked={selectedOrderIds.includes(order._id)} onChange={() => toggleSelectOrder(order._id)} />
                    <div className="bg-blue-100 p-2 rounded-lg">
                      <img className='w-6 h-6' src={assets.parcel_icon} alt="" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-800">Đơn hàng #{order._id.slice(-8)}</h4>
                      <p className="text-sm text-gray-500">{new Date(order.createdAt).toLocaleDateString('vi-VN')} - {new Date(order.createdAt).toLocaleTimeString('vi-VN', {hour: '2-digit', minute: '2-digit'})}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                                         {/* Button Xuất Excel cho đơn hàng này */}
                     <button
                       onClick={() => exportSingleOrderToExcel(order)}
                       className="flex items-center px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-200"
                       title="Xuất đơn hàng này ra Excel"
                     >
                       <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                       </svg>
                       Excel
                     </button>
                     
                     {/* Button Xóa đơn hàng */}
                     <button
                       onClick={() => openDeleteModal(order)}
                       className="flex items-center px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors duration-200"
                       title="Xóa đơn hàng này"
                     >
                       <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                       </svg>
                       Xóa
                     </button>
                    
                    <span className="text-lg font-bold text-orange-600">{order.amount.toLocaleString('vi-VN')}{currency}</span>
                    <select onChange = {(event) => statusHandler(event , order._id)} value={order.status} 
                      className={`px-3 py-2 rounded-lg font-medium cursor-pointer border-0 focus:ring-2 focus:ring-blue-400 ${
                        order.status === 'Đã giao hàng' ? 'bg-green-100 text-green-800' :
                        order.status === 'Đang giao hàng' ? 'bg-blue-100 text-blue-800' :
                        order.status === 'Đang đóng gói' ? 'bg-yellow-100 text-yellow-800' :
                        order.status === 'Đã hủy' ? 'bg-red-100 text-red-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        <option value="Đã đặt hàng">Đã đặt hàng</option>
                        <option value="Đang đóng gói">Đang đóng gói</option>
                        <option value="Đang giao hàng">Đang giao hàng</option>
                        <option value="Đã giao hàng">Đã giao hàng</option>
                        <option value="Đã hủy">Đã hủy</option>
                    </select>
                    
                    {/* Hiển thị lý do hủy nếu có */}
                    {order.status === 'Đã hủy' && order.cancelReason && (
                      <div className="text-sm text-red-600 font-medium">
                        Lý do: {order.cancelReason}
                      </div>
                    )}
                    
                                         {/* Nút hủy đơn hàng - chỉ hiển thị khi chưa hủy và chưa giao hàng */}
                     {order.status !== 'Đã hủy' && order.status !== 'Đã giao hàng' && (
                       <button
                         onClick={() => openCancelModal(order)}
                         className="flex items-center px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors duration-200"
                         title="Hủy đơn hàng này"
                       >
                         <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                         </svg>
                         Hủy
                       </button>
                     )}
                  </div>
                </div>

                {/* Main Content */}
                <div className="p-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* Thông tin sản phẩm */}
                  <div className="lg:col-span-1">
                    <h5 className="font-semibold text-gray-800 mb-3 flex items-center">
                      <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm mr-2">
                        {order.items.length} sản phẩm
                      </span>
                      Chi tiết đơn hàng
                    </h5>
                    <div className="space-y-2 max-h-32 overflow-y-auto bg-gray-50 p-3 rounded-lg">
                      {order.items.map((item,index)=>(
                        <div key={index} className="flex justify-between items-center text-sm border-b border-gray-200 pb-1 last:border-b-0">
                          <span className="text-gray-700 font-medium">{item.name}</span>
                          <span className="text-gray-600">x{item.quantity} ({item.size})</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Thông tin khách hàng */}
                  <div className="lg:col-span-1">
                    <h5 className="font-semibold text-gray-800 mb-3 flex items-center">
                      <svg className="w-4 h-4 mr-2 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd"/>
                      </svg>
                      Thông tin khách hàng
                    </h5>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-start">
                        <span className="font-medium text-gray-600 w-20">Tên:</span>
                        <span className="text-gray-800 font-medium">{order.address.firstName + " " + order.address.lastName}</span>
                      </div>
                      <div className="flex items-start">
                        <span className="font-medium text-gray-600 w-20">Địa chỉ:</span>
                        <span className="text-gray-700 flex-1">
                          {order.address.street}<br/>
                          {order.address.city}, {order.address.state}<br/>
                          {order.address.country}, {order.address.zipcode}
                        </span>
                      </div>
                      <div className="flex items-center">
                        <span className="font-medium text-gray-600 w-20">SĐT:</span>
                        <span className="text-gray-800">{order.address.phone}</span>
                      </div>
                    </div>
                  </div>

                  {/* Thông tin thanh toán */}
                  <div className="lg:col-span-1">
                    <h5 className="font-semibold text-gray-800 mb-3 flex items-center">
                      <svg className="w-4 h-4 mr-2 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M4 4a2 2 0 00-2 2v1h16V6a2 2 0 00-2-2H4zM18 9H2v5a2 2 0 002 2h12a2 2 0 002-2V9zM4 13a1 1 0 011-1h1a1 1 0 110 2H5a1 1 0 01-1-1zm5-1a1 1 0 100 2h1a1 1 0 100-2H9z"/>
                      </svg>
                      Thanh toán
                    </h5>
                    <div className="space-y-3">
                      <div className="bg-gray-50 p-3 rounded-lg">
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-sm text-gray-600">Phương thức:</span>
                          <span className="font-medium text-gray-800 bg-white px-2 py-1 rounded text-sm">
                            {order.paymentMethod}
                          </span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-gray-600">Trạng thái:</span>
                          <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                            order.payment 
                              ? 'bg-green-100 text-green-800 border border-green-200' 
                              : 'bg-red-100 text-red-800 border border-red-200'
                          }`}>
                            {order.payment ? '✓ Đã thanh toán' : '✗ Chưa thanh toán'}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))
          }
        </div>
        {/* Phân trang */}
        {totalPages > 1 && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mt-6">
            <div className="flex justify-center items-center">
              <div className="flex items-center space-x-2">
                {/* Nút Previous */}
                <button
                  onClick={goToPrevPage}
                  disabled={currentPage === 1}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                    currentPage === 1
                      ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                      : 'bg-blue-500 text-white hover:bg-blue-600 shadow-md'
                  }`}
                >
                  ← Trước
                </button>

                {/* Số trang */}
                <div className="flex space-x-1">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((number) => (
                    <button
                      key={number}
                      onClick={() => paginate(number)}
                      className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                        currentPage === number
                          ? 'bg-blue-500 text-white shadow-md'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {number}
                    </button>
                  ))}
                </div>

                {/* Nút Next */}
                <button
                  onClick={goToNextPage}
                  disabled={currentPage === totalPages}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                    currentPage === totalPages
                      ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                      : 'bg-blue-500 text-white hover:bg-blue-600 shadow-md'
                  }`}
                >
                  Sau →
                </button>
              </div>
            </div>
          </div>
                 )}

         {/* Modal Hủy Đơn Hàng */}
         {showCancelModal && (
           <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
             <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
               <div className="flex items-center justify-between mb-4">
                 <h3 className="text-lg font-semibold text-gray-900">Hủy đơn hàng</h3>
                 <button
                   onClick={closeCancelModal}
                   className="text-gray-400 hover:text-gray-600"
                 >
                   <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                   </svg>
                 </button>
               </div>
               
               <div className="mb-4">
                 <p className="text-sm text-gray-600 mb-2">
                   Đơn hàng: <span className="font-medium">#{orderToCancel?._id.slice(-8)}</span>
                 </p>
                 <p className="text-sm text-gray-600 mb-4">
                   Khách hàng: <span className="font-medium">{orderToCancel?.address.firstName} {orderToCancel?.address.lastName}</span>
                 </p>
                 
                 <label className="block text-sm font-medium text-gray-700 mb-2">
                   Lý do hủy đơn hàng <span className="text-red-500">*</span>
                 </label>
                 <textarea
                   value={cancelReason}
                   onChange={(e) => setCancelReason(e.target.value)}
                   placeholder="Nhập lý do hủy đơn hàng..."
                   className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
                   rows="4"
                   required
                 />
               </div>
               
               <div className="flex justify-end space-x-3">
                 <button
                   onClick={closeCancelModal}
                   className="px-4 py-2 text-gray-600 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
                 >
                   Hủy bỏ
                 </button>
                 <button
                   onClick={cancelOrderHandler}
                   className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
                 >
                   Xác nhận hủy
                 </button>
               </div>
             </div>
           </div>
                   )}

          {/* Modal Xóa Đơn Hàng */}
          {showDeleteModal && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">Xóa đơn hàng</h3>
                  <button
                    onClick={closeDeleteModal}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
                
                <div className="mb-4">
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
                    <div className="flex items-center">
                      <svg className="w-5 h-5 text-red-400 mr-2" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd"/>
                      </svg>
                      <p className="text-red-800 font-medium">Cảnh báo!</p>
                    </div>
                    <p className="text-red-700 text-sm mt-2">
                      Hành động này không thể hoàn tác. Đơn hàng sẽ bị xóa vĩnh viễn khỏi hệ thống.
                    </p>
                  </div>
                  
                  <p className="text-sm text-gray-600 mb-2">
                    Đơn hàng: <span className="font-medium">#{orderToDelete?._id.slice(-8)}</span>
                  </p>
                  <p className="text-sm text-gray-600 mb-2">
                    Khách hàng: <span className="font-medium">{orderToDelete?.address.firstName} {orderToDelete?.address.lastName}</span>
                  </p>
                  <p className="text-sm text-gray-600 mb-4">
                    Tổng tiền: <span className="font-medium">{orderToDelete?.amount.toLocaleString('vi-VN')}{currency}</span>
                  </p>
                  
                  <p className="text-sm text-gray-700">
                    Bạn có chắc chắn muốn xóa đơn hàng này không?
                  </p>
                </div>
                
                <div className="flex justify-end space-x-3">
                  <button
                    onClick={closeDeleteModal}
                    className="px-4 py-2 text-gray-600 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
                  >
                    Hủy bỏ
                  </button>
                  <button
                    onClick={deleteOrderHandler}
                    className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
                  >
                    Xác nhận xóa
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    )
  }

export default Orders