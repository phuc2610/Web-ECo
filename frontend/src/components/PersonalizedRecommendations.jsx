import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { ShopContext } from "../context/ShopContext";
import ProductItem from "./ProductItem";
import { getSessionId } from "../utils/analyticsTracker";

const SparklesIcon = () => (
  <svg className="w-3.5 h-3.5 animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
  </svg>
);

const CompassIcon = () => (
  <svg className="w-3.5 h-3.5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <circle cx="12" cy="12" r="10" strokeWidth={2} />
    <polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76" fill="currentColor" />
  </svg>
);

const PersonalizedRecommendations = () => {
  const { products, backendUrl } = useContext(ShopContext);
  const [recommendations, setRecommendations] = useState([]);
  const [reason, setReason] = useState("Dựa trên sản phẩm bạn vừa tìm kiếm & quan tâm gần đây");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPersonalized = async () => {
      try {
        const sessionId = getSessionId();
        const token = localStorage.getItem("token");
        const res = await axios.get(`${backendUrl}/api/analytics/recommendations`, {
          params: { sessionId },
          headers: token ? { token } : {},
        });

        if (res.data.success && res.data.recommendations.length > 0) {
          setRecommendations(res.data.recommendations.slice(0, 8));
          if (res.data.reason) {
            setReason(res.data.reason);
          }
        } else {
          setRecommendations(products.slice(0, 8));
        }
      } catch (error) {
        console.warn("Lỗi load gợi ý cá nhân hóa:", error);
        setRecommendations(products.slice(0, 8));
      } finally {
        setLoading(false);
      }
    };

    if (products && products.length > 0) {
      fetchPersonalized();
    }
  }, [products, backendUrl]);

  if (loading || recommendations.length === 0) return null;

  return (
    <div className="my-14 p-6 sm:p-8 bg-gradient-to-br from-red-50/70 via-rose-50/40 to-amber-50/50 rounded-3xl border border-red-200/70 shadow-sm relative overflow-hidden">
      {/* Decorative background circle */}
      <div className="absolute -right-12 -top-12 w-48 h-48 bg-red-200/30 rounded-full blur-2xl pointer-events-none" />
      <div className="absolute -left-12 -bottom-12 w-48 h-48 bg-amber-200/30 rounded-full blur-2xl pointer-events-none" />

      {/* Header section */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-red-600 text-white text-xs font-bold rounded-full uppercase tracking-wider shadow-sm">
              <SparklesIcon />
              Gợi ý thông minh cho bạn
            </span>
            <span className="hidden sm:inline-flex items-center gap-1 text-xs text-slate-500 font-medium">
              <CompassIcon />
              Tự động phân tích nhu cầu
            </span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-800 tracking-tight">
            Có Thể Bạn Đang Tìm Kiếm
          </h2>
          <p className="text-sm sm:text-base text-slate-600 font-medium mt-1">
            {reason}
          </p>
        </div>
      </div>

      {/* Product Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 sm:gap-6">
        {recommendations.map((item) => (
          <ProductItem
            key={item._id}
            id={item._id}
            image={item.image || item.images}
            name={item.name}
            price={item.sellingPrice || item.price}
            originalPrice={item.originalPrice || item.price}
            averageRating={item.averageRating}
            totalReviews={item.totalReviews}
            brand={item.subCategory}
            sizes={item.sizes}
            category={item.category}
          />
        ))}
      </div>
    </div>
  );
};

export default PersonalizedRecommendations;
