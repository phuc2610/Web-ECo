import React, { useState, useEffect, useContext } from 'react';
import { ShopContext } from '../context/ShopContext';
import axios from 'axios';
import { toast } from 'react-toastify';

const ReviewList = ({ productId, reviews = [], loading = false, showEmptyState = false }) => {

  if (loading) {
    return (
      <div className="flex justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (reviews.length === 0) {
    return (
      <div className="text-center py-8">
        <div className="text-gray-500 text-lg mb-2">
          {showEmptyState ? "Chưa có đánh giá nào" : "Không tìm thấy đánh giá"}
        </div>
        <div className="text-gray-400 text-sm">
          {showEmptyState ? "Hãy là người đầu tiên đánh giá sản phẩm này" : "Có thể đánh giá chưa được hiển thị"}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {reviews.map((review) => (
        <div key={review._id} className="border border-gray-200 rounded-lg p-6 bg-gray-50">
          {/* Review Header */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                <span className="text-blue-600 font-semibold text-sm">
                  {review.userId?.name?.charAt(0) || 'U'}
                </span>
              </div>
              <div>
                <div className="font-medium text-gray-900">
                  {review.userId?.name || 'Người dùng'}
                </div>
                <div className="text-sm text-gray-500">
                  {new Date(review.createdAt).toLocaleDateString('vi-VN')}
                </div>
              </div>
            </div>
            
            {/* Rating */}
            <div className="flex items-center space-x-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <span
                  key={star}
                  className={`text-lg ${
                    star <= review.rating
                      ? 'text-yellow-400'
                      : 'text-gray-300'
                  }`}
                >
                  ★
                </span>
              ))}
            </div>
          </div>

          {/* Review Content */}
          <div className="mb-4">
            <p className="text-gray-700 leading-relaxed">{review.comment}</p>
          </div>

          {/* Review Images */}
          {review.images && review.images.length > 0 && (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {review.images.map((image, index) => (
                <div key={index} className="aspect-square bg-gray-200 rounded-lg overflow-hidden">
                  <img
                    src={image}
                    alt={`Review image ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </div>
              ))}
            </div>
          )}

          {/* Review Footer */}
          <div className="flex items-center justify-between pt-4 border-t border-gray-200">
            <div className="text-sm text-gray-500">
              Đánh giá này có hữu ích không?
            </div>
            <div className="flex items-center space-x-2">
              <button className="text-sm text-gray-500 hover:text-green-600 transition-colors">
                👍 Hữu ích
              </button>
              <button className="text-sm text-gray-500 hover:text-red-600 transition-colors">
                👎 Không hữu ích
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ReviewList;
