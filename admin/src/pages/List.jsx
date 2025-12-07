import axios from "axios";
import React, { useState, useEffect } from "react";
import { backendUrl, currency } from "../App";
import { toast } from "react-toastify";
import { assets } from "../assets/assets";
import ConfirmModal from "../components/ConfirmModal";
import EditProductModal from "../components/EditProductModal";

const List = ({ token }) => {
  const [list, setList] = useState([]);
  const [filteredList, setFilteredList] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [showModal, setShowModal] = useState(false);
  const [productToDelete, setProductToDelete] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [productToEdit, setProductToEdit] = useState(null);

  const fetchList = async () => {
    try {
      const repsonse = await axios.get(backendUrl + "/api/product/list");
      if (repsonse.data.success) {
        const sortedProducts = repsonse.data.products.sort(
          (a, b) => new Date(b.createdAt || b.date) - new Date(a.createdAt || a.date)
        );
        setList(sortedProducts);
        setFilteredList(sortedProducts);
      } else {
        toast.error(repsonse.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

  const removeProduct = async (id) => {
    try {
      const response = await axios.post(backendUrl + "/api/product/remove", { id }, { headers: { token } });
      if (response.data.success) {
        toast.success(response.data.message);
        await fetchList();
        setShowModal(false);
        setProductToDelete(null);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

  const handleDeleteClick = (product) => {
    setProductToDelete(product);
    setShowModal(true);
  };

  const handleConfirmDelete = () => {
    if (productToDelete) {
      removeProduct(productToDelete._id);
    }
  };

  const handleCancelDelete = () => {
    setShowModal(false);
    setProductToDelete(null);
  };

  const handleEditClick = (product) => {
    setProductToEdit(product);
    setShowEditModal(true);
  };

  const handleCancelEdit = () => {
    setShowEditModal(false);
    setProductToEdit(null);
  };

  const handleUpdateProduct = async (updatedProduct) => {
    try {
      // Create FormData for file uploads
      const formData = new FormData();
      
      // Add all text fields
      formData.append('id', updatedProduct.id);
      formData.append('name', updatedProduct.name);
      formData.append('description', updatedProduct.description);
      formData.append('price', updatedProduct.price);
      formData.append('category', updatedProduct.category);
      formData.append('subCategory', updatedProduct.subCategory);
      formData.append('bestseller', updatedProduct.bestseller);
      formData.append('sizes', updatedProduct.sizes);
      formData.append('stockQuantities', updatedProduct.stockQuantities);
      
      // Add image files if they exist
      if (updatedProduct.image1) formData.append('image1', updatedProduct.image1);
      if (updatedProduct.image2) formData.append('image2', updatedProduct.image2);
      if (updatedProduct.image3) formData.append('image3', updatedProduct.image3);
      if (updatedProduct.image4) formData.append('image4', updatedProduct.image4);
      
      const response = await axios.post(
        backendUrl + "/api/product/update", 
        formData, 
        { 
          headers: { 
            token,
            'Content-Type': 'multipart/form-data'
          } 
        }
      );
      
      if (response.data.success) {
        toast.success(response.data.message);
        await fetchList();
        setShowEditModal(false);
        setProductToEdit(null);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

  const handleSearch = (searchValue) => {
    setSearchTerm(searchValue);
    setCurrentPage(1);

    if (searchValue.trim() === "") {
      setFilteredList(list);
    } else {
      const filtered = list.filter(
        (item) =>
          item.name.toLowerCase().includes(searchValue.toLowerCase()) ||
          item.category.toLowerCase().includes(searchValue.toLowerCase())
      );
      setFilteredList(filtered);
    }
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredList.slice(indexOfFirstItem, indexOfLastItem);

  const totalPages = Math.ceil(filteredList.length / itemsPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const goToPreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const goToNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const getPageNumbers = () => {
    const pageNumbers = [];
    const maxVisiblePages = 5;

    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i);
      }
    } else {
      if (currentPage <= 3) {
        for (let i = 1; i <= 5; i++) {
          pageNumbers.push(i);
        }
      } else if (currentPage >= totalPages - 2) {
        for (let i = totalPages - 4; i <= totalPages; i++) {
          pageNumbers.push(i);
        }
      } else {
        for (let i = currentPage - 2; i <= currentPage + 2; i++) {
          pageNumbers.push(i);
        }
      }
    }

    return pageNumbers;
  };

  useEffect(() => {
    fetchList();
  }, []);

  return (
    <>
      <p className="text-2xl font-bold text-gray-800 mb-4 text-center">Danh sách tất cả sản phẩm</p>

      <div className="mb-4 flex flex-col sm:flex-row gap-4 items-center justify-between">
        <div className="relative flex-1 max-w-md">
          <input
            type="text"
            placeholder="Tìm kiếm sản phẩm theo tên hoặc hãng..."
            value={searchTerm}
            onChange={(e) => handleSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
        </div>
        <div className="text-sm text-gray-600">Danh sách có {filteredList.length} sản phẩm</div>
      </div>

      <div className="flex flex-col gap-2">
        <div className="hidden md:grid grid-cols-[1fr_3fr_1fr_1fr_1fr] items-center border border-gray-300 py-1 px-2 bg-gray-100 text-sm">
          <b>Hình ảnh</b>
          <b>Tên</b>
          <b>Hãng</b>
          <b>Giá</b>
          <b className="text-center">Thao tác</b>
        </div>

        {currentItems.length > 0 ? (
          currentItems.map((item, index) => (
            <div
              className="grid grid-cols-[1fr_3fr_1fr] md:grid-cols-[1fr_3fr_1fr_1fr_1fr] items-center border border-gray-300 text-sm gap-2 py-1 px-2 hover:bg-gray-100 transition ease-in-out"
              key={index}
            >
              <img className="w-20" src={item.image[0]} alt="" />
              <p className="text-orange-600">{item.name}</p>
              <p className="text-blue-600">{item.category}</p>
              <p className="text-red-600">
                {item.price.toLocaleString("vi-VN")}
                {currency}
              </p>
              <div className="text-right md:text-center flex justify-center gap-2">
                {/* Edit Button */}
                <div
                  onClick={() => handleEditClick(item)}
                  className="cursor-pointer text-lg"
                  title="Sửa sản phẩm"
                >
                  <svg 
                    className="w-8 h-8 hover:bg-blue-100 p-1 rounded-full transition ease-in-out text-blue-600" 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path 
                      strokeLinecap="round" 
                      strokeLinejoin="round" 
                      strokeWidth={2} 
                      d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" 
                    />
                  </svg>
                </div>
                
                {/* Delete Button */}
                <div
                  onClick={() => handleDeleteClick(item)}
                  className="cursor-pointer text-lg"
                  title="Xóa sản phẩm"
                >
                  <img
                    className="w-8 h-8 hover:bg-red-100 p-1 rounded-full transition ease-in-out"
                    src={assets.delete_icon}
                    alt=""
                  />
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-8 text-gray-500">
            {searchTerm ? "Không tìm thấy sản phẩm nào" : "Chưa có sản phẩm nào"}
          </div>
        )}
      </div>

      {totalPages > 1 && (
        <div className="flex flex-col sm:flex-row justify-between items-center mt-6 gap-4">
          <div className="text-sm text-gray-600">
            Hiển thị {indexOfFirstItem + 1} - {Math.min(indexOfLastItem, filteredList.length)} trên{" "}
            {filteredList.length} sản phẩm
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={goToPreviousPage}
              disabled={currentPage === 1}
              className={`px-3 py-1 rounded-lg text-sm font-medium transition ${
                currentPage === 1
                  ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                  : "bg-blue-500 text-white hover:bg-blue-600"
              }`}
            >
              Trước
            </button>

            {getPageNumbers().map((pageNumber) => (
              <button
                key={pageNumber}
                onClick={() => paginate(pageNumber)}
                className={`px-3 py-1 rounded-lg text-sm font-medium transition ${
                  currentPage === pageNumber ? "bg-blue-500 text-white" : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                }`}
              >
                {pageNumber}
              </button>
            ))}

            <button
              onClick={goToNextPage}
              disabled={currentPage === totalPages}
              className={`px-3 py-1 rounded-lg text-sm font-medium transition ${
                currentPage === totalPages
                  ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                  : "bg-blue-500 text-white hover:bg-blue-600"
              }`}
            >
              Tiếp
            </button>
          </div>
        </div>
      )}

      <ConfirmModal
        isOpen={showModal}
        onClose={handleCancelDelete}
        onConfirm={handleConfirmDelete}
        title="Xác nhận xóa sản phẩm"
        message={`Bạn có chắc chắn muốn xóa sản phẩm "${productToDelete?.name}" không?`}
        confirmText="Xóa"
        cancelText="Hủy"
      />

      <EditProductModal
        isOpen={showEditModal}
        onClose={handleCancelEdit}
        onUpdate={handleUpdateProduct}
        product={productToEdit}
      />
    </>
  );
};

export default List;
