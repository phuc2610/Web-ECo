import React from 'react';

/**
 * Bulletproof, zero-network-latency inline SVG device icons.
 * Never fails with 404, crisp on all resolutions, theme-aware.
 */
export const DeviceCategoryIcon = ({ type, className = "w-5 h-5", color = "currentColor" }) => {
  switch (type) {
    case 'phone':
    case 'Điện thoại':
      return (
        <svg className={className} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <rect x="5" y="2" width="14" height="20" rx="3" ry="3" />
          <line x1="12" y1="18" x2="12.01" y2="18" strokeWidth="2.5" />
          <line x1="10" y1="4" x2="14" y2="4" strokeWidth="1.5" />
        </svg>
      );

    case 'laptop':
    case 'Laptop':
      return (
        <svg className={className} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="4" width="18" height="12" rx="2" />
          <path d="M2 18h20a1 1 0 011 1v1H1v-1a1 1 0 011-1z" fill="currentColor" fillOpacity="0.15" />
          <path d="M2 18h20" />
        </svg>
      );

    case 'tablet':
    case 'Máy tính bảng':
      return (
        <svg className={className} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <rect x="4" y="2" width="16" height="20" rx="2.5" />
          <line x1="12" y1="18" x2="12.01" y2="18" strokeWidth="2.5" />
          <circle cx="12" cy="4.5" r="0.75" fill="currentColor" />
        </svg>
      );

    case 'pc':
    case 'PC':
      return (
        <svg className={className} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <rect x="4" y="2" width="16" height="20" rx="2" />
          <circle cx="12" cy="7" r="2.5" />
          <circle cx="12" cy="14" r="2.5" />
          <line x1="8" y1="19" x2="16" y2="19" strokeWidth="2" />
          <circle cx="7" cy="4" r="0.8" fill="currentColor" />
        </svg>
      );

    case 'accessories':
    case 'Phụ kiện':
    case 'Phụ kiện di động':
    case 'Phụ kiện máy tính':
    case 'Linh kiện máy tính':
      return (
        <svg className={className} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <path d="M3 18v-6a9 9 0 0118 0v6" />
          <path d="M21 19a2 2 0 01-2 2h-1a2 2 0 01-2-2v-3a2 2 0 012-2h3zM3 19a2 2 0 002 2h1a2 2 0 002-2v-3a2 2 0 00-2-2H3z" fill="currentColor" fillOpacity="0.15" />
        </svg>
      );

    case 'news':
    case 'Tin tức':
      return (
        <svg className={className} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <path d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2" />
          <path d="M7 8h6M7 12h6M7 16h4" />
        </svg>
      );

    case 'hot':
    case 'all':
    default:
      return (
        <svg className={className} viewBox="0 0 24 24" fill="currentColor">
          <path d="M13.5.67s.74 2.65.74 4.8c0 2.06-1.35 3.73-3.41 3.73-2.07 0-3.63-1.67-3.63-3.73l.03-.36C5.21 7.51 4 10.62 4 14c0 4.42 3.58 8 8 8s8-3.58 8-8C20 8.61 17.41 3.8 13.5.67zM11.71 19c-1.78 0-3.22-1.4-3.22-3.14 0-1.62 1.05-2.76 2.81-3.12 1.77-.36 3.6-1.21 4.62-2.58.39 1.29.59 2.65.59 4.04 0 2.65-2.15 4.8-4.8 4.8z" />
        </svg>
      );
  }
};

export default DeviceCategoryIcon;
