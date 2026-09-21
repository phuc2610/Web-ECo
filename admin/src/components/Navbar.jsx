import React from 'react';
import { assets } from '../assets/assets';

const Navbar = ({ setToken }) => {
  return (
    <header className='bg-white border-b border-slate-200 px-6 py-3 flex items-center justify-between shadow-xs sticky top-0 z-30'>
      <div className='flex items-center gap-4'>
        <img className='h-9 w-auto object-contain' src={assets.logo} alt="Minh Tuấn Shop Admin" />
        <span className='hidden sm:inline-block px-2.5 py-0.5 text-[11px] font-black uppercase tracking-wider bg-blue-50 text-blue-700 rounded-md border border-blue-200'>
          Quản Trị Hệ Thống
        </span>
      </div>

      <div className='flex items-center gap-4'>
        <a
          href="http://localhost:5173"
          target="_blank"
          rel="noopener noreferrer"
          className='text-xs font-semibold text-blue-600 hover:text-blue-800 flex items-center gap-1.5 px-3 py-1.5 rounded-lg hover:bg-blue-50 transition-colors'
        >
          <span>Xem cửa hàng</span>
          <svg className='w-3.5 h-3.5' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
            <path strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' d='M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14' />
          </svg>
        </a>

        <div className='hidden md:flex items-center gap-2 pl-3 border-l border-slate-200 text-xs'>
          <div className='w-7 h-7 rounded-full bg-blue-600 text-white font-bold flex items-center justify-center text-xs'>
            A
          </div>
          <div className='text-left'>
            <p className='font-bold text-slate-800 leading-tight'>Admin</p>
            <p className='text-[10px] text-slate-400'>admin@np.com</p>
          </div>
        </div>

        <button
          onClick={() => setToken('')}
          className='bg-rose-50 text-rose-600 hover:bg-rose-600 hover:text-white px-4 py-2 rounded-xl text-xs font-bold transition-all border border-rose-200 shadow-2xs'
        >
          Đăng xuất
        </button>
      </div>
    </header>
  );
};

export default Navbar;