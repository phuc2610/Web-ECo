import React, { useContext, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ShopContext } from '../context/ShopContext';
import { TECH_NEWS_ARTICLES, getArticleBySlug } from '../data/newsData';
import PageTransition from '../components/PageTransition';

const NewsDetail = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { products, currency } = useContext(ShopContext);

  const article = getArticleBySlug(slug);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [slug]);

  // Find related products matching keyword
  const relatedProducts = (products || []).filter(p => {
    if (!article.relatedProductKeyword) return false;
    const kw = article.relatedProductKeyword.toLowerCase();
    return (
      p.name?.toLowerCase().includes(kw) ||
      p.category?.toLowerCase().includes(kw) ||
      p.brand?.toLowerCase().includes(kw)
    );
  }).slice(0, 4);

  // Other recent articles
  const recentArticles = TECH_NEWS_ARTICLES.filter(a => a.id !== article.id);

  return (
    <PageTransition>
      <div className="min-h-screen bg-[#f4f6f8] py-6 sm:py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Breadcrumb Navigation */}
          <nav className="flex items-center gap-2 text-xs text-slate-500 mb-6 bg-white px-4 py-2.5 rounded-xl border border-slate-200/80 shadow-2xs">
            <Link to="/" className="hover:text-[#d70018] font-medium">Trang chủ</Link>
            <span>/</span>
            <Link to="/news" className="hover:text-[#d70018] font-medium">Tin tức công nghệ</Link>
            <span>/</span>
            <span className="text-[#d70018] font-bold truncate max-w-xs sm:max-w-md">{article.title}</span>
          </nav>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Main Article Content (8 cols) */}
            <article className="lg:col-span-8 bg-white p-6 sm:p-10 rounded-3xl border border-slate-100 shadow-sm space-y-6">
              
              {/* Category & Time */}
              <div className="flex flex-wrap items-center gap-3">
                <span className="px-3 py-1 bg-red-50 text-[#d70018] rounded-full font-bold text-xs border border-red-200">
                  {article.category}
                </span>
                <span className="text-xs text-slate-400">• {article.date} ({article.timeAgo})</span>
                <span className="text-xs text-slate-400">• {article.readTime}</span>
                <span className="text-xs text-slate-400">• {article.views} lượt xem</span>
              </div>

              {/* Main Headline */}
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-900 leading-tight">
                {article.title}
              </h1>

              {/* Author Card */}
              <div className="flex items-center justify-between py-3 border-y border-slate-100">
                <div className="flex items-center gap-3">
                  <img
                    src={article.authorAvatar}
                    alt={article.author}
                    className="w-10 h-10 rounded-full object-cover border border-slate-200"
                  />
                  <div>
                    <p className="text-xs font-bold text-slate-900">{article.author}</p>
                    <p className="text-[11px] text-slate-400">Biên tập viên công nghệ Minh Tuấn Shop</p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button 
                    onClick={() => navigator.clipboard && navigator.clipboard.writeText(window.location.href)}
                    className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 rounded-lg text-xs font-semibold text-slate-700 transition-colors flex items-center gap-1.5"
                    title="Sao chép liên kết"
                  >
                    <span>🔗</span>
                    <span className="hidden sm:inline">Chia sẻ</span>
                  </button>
                </div>
              </div>

              {/* Lead Excerpt */}
              <p className="text-sm sm:text-base font-semibold text-slate-700 leading-relaxed bg-slate-50 p-4 rounded-2xl border-l-4 border-[#d70018]">
                {article.excerpt}
              </p>

              {/* Hero Banner Image */}
              <div className="rounded-2xl overflow-hidden aspect-video bg-slate-100 shadow-sm">
                <img
                  src={article.image}
                  alt={article.title}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Intro Body */}
              <div className="text-sm sm:text-base text-slate-700 leading-relaxed space-y-4 font-normal">
                <p>{article.content.intro}</p>

                {/* Article Sub-sections */}
                {article.content.sections.map((sec, sIdx) => (
                  <div key={sIdx} className="space-y-3 pt-4">
                    <h2 className="text-lg sm:text-xl font-bold text-slate-900 tracking-tight">
                      {sec.heading}
                    </h2>
                    <p className="leading-relaxed">{sec.body}</p>

                    {sec.image && (
                      <div className="space-y-1.5 py-2">
                        <img
                          src={sec.image}
                          alt={sec.heading}
                          className="rounded-2xl w-full object-cover max-h-[420px]"
                        />
                        {sec.caption && (
                          <p className="text-xs text-center text-slate-400 italic">
                            {sec.caption}
                          </p>
                        )}
                      </div>
                    )}

                    {sec.table && (
                      <div className="overflow-x-auto my-4">
                        <table className="w-full border-collapse border border-slate-200 text-xs sm:text-sm rounded-xl overflow-hidden">
                          <tbody>
                            {sec.table.map((row, rIdx) => (
                              <tr key={rIdx} className={rIdx % 2 === 0 ? 'bg-slate-50' : 'bg-white'}>
                                <td className="p-3 font-bold text-slate-700 border border-slate-200 w-1/3">
                                  {row.label}
                                </td>
                                <td className="p-3 text-slate-800 border border-slate-200 font-medium">
                                  {row.value}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </div>
                ))}

                {/* Pros and Cons Box */}
                {(article.content.pros || article.content.cons) && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-6">
                    {article.content.pros && (
                      <div className="p-5 bg-emerald-50/70 border border-emerald-200 rounded-2xl space-y-2">
                        <h3 className="text-xs font-black uppercase text-emerald-800 flex items-center gap-1.5">
                          <span>✓</span> ƯU ĐIỂM NỔI BẬT
                        </h3>
                        <ul className="space-y-1.5 text-xs text-emerald-950">
                          {article.content.pros.map((p, i) => (
                            <li key={i} className="flex items-start gap-1.5">
                              <span className="text-emerald-600 font-bold">•</span>
                              <span>{p}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {article.content.cons && (
                      <div className="p-5 bg-amber-50/70 border border-amber-200 rounded-2xl space-y-2">
                        <h3 className="text-xs font-black uppercase text-amber-800 flex items-center gap-1.5">
                          <span>!</span> ĐIỂM CẦN LƯU Ý
                        </h3>
                        <ul className="space-y-1.5 text-xs text-amber-950">
                          {article.content.cons.map((c, i) => (
                            <li key={i} className="flex items-start gap-1.5">
                              <span className="text-amber-600 font-bold">•</span>
                              <span>{c}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                )}

                {/* Verdict Box */}
                {article.content.verdict && (
                  <div className="p-5 bg-red-50/80 border border-red-200 rounded-2xl space-y-1.5 mt-6">
                    <h3 className="text-xs font-black uppercase text-[#d70018] flex items-center gap-1.5">
                      <span>★</span> TỔNG KẾT & LỜI KHUYÊN
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-800 leading-relaxed font-medium">
                      {article.content.verdict}
                    </p>
                  </div>
                )}
              </div>

              {/* Related Products Widget (Direct Buy) */}
              {relatedProducts.length > 0 && (
                <div className="pt-8 border-t border-slate-200 space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="font-black text-slate-900 text-sm uppercase tracking-tight flex items-center gap-2">
                      <span className="p-1 bg-red-100 text-[#d70018] rounded-md">🛍️</span>
                      <span>Sản phẩm chính hãng liên quan tại Minh Tuấn Shop</span>
                    </h3>
                    <Link
                      to="/collection"
                      className="inline-flex items-center gap-1.5 px-3 py-1 bg-red-50 hover:bg-[#d70018] text-[#d70018] hover:text-white border border-red-200 rounded-xl text-xs font-bold transition-all shadow-2xs group"
                    >
                      <span>Xem tất cả</span>
                      <svg className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 5l7 7-7 7" />
                      </svg>
                    </Link>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {relatedProducts.map(prod => (
                      <div 
                        key={prod._id}
                        onClick={() => navigate(`/product/${prod._id}`)}
                        className="p-3 bg-slate-50 hover:bg-white rounded-2xl border border-slate-200/80 hover:border-red-300 hover:shadow-md transition-all cursor-pointer flex flex-col justify-between"
                      >
                        <div className="aspect-square rounded-xl overflow-hidden bg-white p-2 mb-2">
                          <img src={prod.image[0]} alt={prod.name} className="w-full h-full object-contain" />
                        </div>
                        <h4 className="text-xs font-bold text-slate-800 line-clamp-2 leading-tight hover:text-[#d70018]">
                          {prod.name}
                        </h4>
                        <div className="mt-2">
                          <p className="text-xs font-black text-[#d70018]">
                            {prod.price?.toLocaleString()} {currency}
                          </p>
                          {prod.originalPrice && (
                            <p className="text-[10px] text-slate-400 line-through">
                              {prod.originalPrice?.toLocaleString()} {currency}
                            </p>
                          )}
                        </div>
                        <button className="mt-2 w-full py-1.5 bg-[#d70018] hover:bg-[#ba0014] text-white text-[11px] font-bold rounded-lg transition-colors shadow-2xs">
                          MUA NGAY
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

            </article>

            {/* Sidebar (4 cols): Other News & Promotions */}
            <aside className="lg:col-span-4 space-y-6">
              
              {/* Other Recent Tech Articles */}
              <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-sm space-y-4">
                <h3 className="font-bold text-slate-900 text-sm uppercase tracking-wider pb-2 border-b border-slate-100 flex items-center gap-2">
                  <span>🔥</span> Bài viết công nghệ hot khác
                </h3>

                <div className="space-y-3">
                  {recentArticles.map(other => (
                    <Link
                      key={other.id}
                      to={`/news/${other.slug}`}
                      className="group flex gap-3 items-start pb-3 border-b border-slate-100 last:border-0 last:pb-0"
                    >
                      <div className="w-20 h-16 rounded-xl overflow-hidden shrink-0 bg-slate-100">
                        <img
                          src={other.image}
                          alt={other.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                        />
                      </div>
                      <div className="space-y-1">
                        <span className="text-[10px] font-bold text-[#d70018] uppercase">
                          {other.category}
                        </span>
                        <h4 className="text-xs font-bold text-slate-800 group-hover:text-[#d70018] line-clamp-2 leading-snug">
                          {other.title}
                        </h4>
                        <span className="text-[10px] text-slate-400 block">{other.timeAgo}</span>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>

              {/* Promotion Banner Widget */}
              <div className="bg-gradient-to-br from-[#d70018] to-[#990010] p-6 rounded-3xl text-white shadow-md text-center space-y-3">
                <span className="text-3xl">🎁</span>
                <h4 className="font-black text-base uppercase">Đăng Ký Smember Ngay</h4>
                <p className="text-xs text-red-100 leading-relaxed">
                  Nhận voucher 500k khi mua điện thoại, laptop tại Minh Tuấn Shop và tích điểm tới 5% mỗi đơn hàng.
                </p>
                <Link
                  to="/login"
                  className="inline-block px-5 py-2.5 bg-white text-[#d70018] font-black rounded-xl text-xs hover:bg-red-50 transition-colors uppercase shadow-sm"
                >
                  ĐĂNG KÝ HỘI VIÊN
                </Link>
              </div>

            </aside>

          </div>

        </div>
      </div>
    </PageTransition>
  );
};

export default NewsDetail;
