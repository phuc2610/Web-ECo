import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { TECH_NEWS_ARTICLES } from '../data/newsData';
import PageTransition from '../components/PageTransition';

const CATEGORIES = ['Tất cả', 'Đánh giá', 'So sánh', 'Tư vấn mua sắm', 'Tư vấn Build PC'];

const News = () => {
  const [selectedCat, setSelectedCat] = useState('Tất cả');
  const [searchWord, setSearchWord] = useState('');

  const filteredNews = TECH_NEWS_ARTICLES.filter(item => {
    const matchCat = selectedCat === 'Tất cả' || item.category === selectedCat;
    const matchSearch = !searchWord.trim() || 
      item.title.toLowerCase().includes(searchWord.toLowerCase()) || 
      item.excerpt.toLowerCase().includes(searchWord.toLowerCase());
    return matchCat && matchSearch;
  });

  return (
    <PageTransition>
      <div className="min-h-screen bg-[#f4f6f8] py-8 sm:py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          
          {/* Header Banner */}
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-100 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 text-xs text-slate-500 mb-1">
                <Link to="/" className="hover:text-[#d70018]">Trang chủ</Link>
                <span>/</span>
                <span className="text-[#d70018] font-bold">Tin tức công nghệ</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-black text-slate-900 flex items-center gap-2 uppercase">
                <span>📰</span> SForum Công Nghệ Minh Tuấn
              </h1>
              <p className="text-xs sm:text-sm text-slate-500 mt-1">
                Cập nhật 24/7 đánh giá sản phẩm, mẹo vặt, so sánh thiết bị và tư vấn cấu hình chuẩn xác.
              </p>
            </div>

            {/* Search input */}
            <div className="w-full md:w-72">
              <input
                type="text"
                value={searchWord}
                onChange={(e) => setSearchWord(e.target.value)}
                placeholder="Tìm bài viết công nghệ..."
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:ring-2 focus:ring-red-500 focus:outline-none"
              />
            </div>
          </div>

          {/* Category Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
            {CATEGORIES.map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedCat(cat)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                  selectedCat === cat
                    ? 'bg-[#d70018] text-white shadow-sm'
                    : 'bg-white text-slate-700 hover:bg-red-50 hover:text-[#d70018] border border-slate-200/80'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Articles Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredNews.map(item => (
              <Link
                key={item.id}
                to={`/news/${item.slug}`}
                className="group flex flex-col justify-between bg-white rounded-3xl overflow-hidden border border-slate-100 hover:border-red-300 hover:shadow-lg transition-all"
              >
                <div>
                  <div className="aspect-video overflow-hidden bg-slate-100">
                    <img
                      src={item.image}
                      alt={item.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <div className="p-4 space-y-2">
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="font-bold text-[#d70018] bg-red-50 px-2 py-0.5 rounded-md">
                        {item.category}
                      </span>
                      <span className="text-slate-400">{item.timeAgo}</span>
                    </div>
                    <h2 className="text-xs sm:text-sm font-bold text-slate-800 group-hover:text-[#d70018] line-clamp-2 leading-snug">
                      {item.title}
                    </h2>
                    <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                      {item.excerpt}
                    </p>
                  </div>
                </div>

                <div className="p-4 pt-0 flex items-center justify-between text-[11px] text-slate-400 border-t border-slate-50 mt-2">
                  <span>Tác giả: {item.author}</span>
                  <span className="text-[#d70018] font-bold group-hover:translate-x-0.5 transition-transform">
                    Đọc tiếp &rarr;
                  </span>
                </div>
              </Link>
            ))}
          </div>

        </div>
      </div>
    </PageTransition>
  );
};

export default News;
