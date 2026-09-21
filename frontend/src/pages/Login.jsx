import React, { useState, useContext, useEffect } from 'react';
import { assets } from '../assets/assets';
import { ShopContext } from '../context/ShopContext';
import axios from 'axios';
import { toast } from 'react-toastify';



const Login = () => {
  
  const [currentState , setCurrentState] = useState('Đăng nhập');
  const {token, setToken , navigate , backendUrl , setUser} = useContext(ShopContext)
  const [name,setName] = useState('');
  const [password,setPassword] = useState('');
  const [email,setEmail] = useState('');


  const onSubmitHandler = async (event) =>{
    event.preventDefault(); 
    try {
      if(currentState === 'Đăng ký'){

        const response = await axios.post(backendUrl + '/api/user/register' , {name,email,password});
         if (response.data.success){
        toast.success("Đăng ký thành công! Vui lòng đăng nhập.");
        setCurrentState('Đăng nhập');
        setName('');
        setPassword('');
        
    } else {
      toast.error(response.data.message);
    }
      }
      else {

        const response  = await axios.post(backendUrl + '/api/user/login' , {email,password});
        if(response.data.success){
          setToken(response.data.token);
          setUser(response.data.user);
          localStorage.setItem('token' , response.data.token);
          localStorage.setItem('user' , JSON.stringify(response.data.user));
        } else {
          toast.error(response.data.message);
        }
        

      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
      
    }
  }

  useEffect(() => {
    if (token) {
      navigate('/');
    }
  }, [token]);

  return (
    <div className='min-h-screen flex items-center justify-center bg-[#f4f6f8] py-12 px-4'>
      <div className='w-full max-w-md'>
        
        {/* Top Smember Branding Banner */}
        <div className='bg-[#d70018] rounded-t-3xl p-6 text-white text-center shadow-lg relative overflow-hidden'>
          <div className='bg-white px-3 py-1.5 rounded-2xl inline-block mb-3 shadow-sm'>
            <img src={assets.logo} alt="Minh Tuấn Shop" className='h-8 w-auto object-contain' />
          </div>
          <h1 className='text-xl font-black uppercase tracking-tight'>Smember Membership</h1>
          <p className='text-xs text-red-100 mt-1'>
            {currentState === 'Đăng nhập' 
              ? 'Đăng nhập để nhận voucher và tích điểm mua sắm' 
              : 'Đăng ký thành viên Smember nhận ngay quà tặng 500k'}
          </p>

          {/* Member perks pills */}
          <div className='flex items-center justify-center gap-3 mt-4 text-[10px] text-red-100'>
            <span className='flex items-center gap-1 bg-red-800/60 px-2.5 py-1 rounded-full'>
              <span>★</span> Tích điểm đến 5%
            </span>
            <span className='flex items-center gap-1 bg-red-800/60 px-2.5 py-1 rounded-full'>
              <span>🎂</span> Quà sinh nhật VIP
            </span>
            <span className='flex items-center gap-1 bg-red-800/60 px-2.5 py-1 rounded-full'>
              <span>⚡</span> Giao 2h ưu tiên
            </span>
          </div>
        </div>

        {/* Main Form Container */}
        <div className='bg-white rounded-b-3xl shadow-xl p-6 sm:p-8 border-x border-b border-slate-200'>
          
          {/* Tab Switcher (CellphoneS Style) */}
          <div className='grid grid-cols-2 p-1 bg-slate-100 rounded-xl mb-6'>
            <button
              type='button'
              onClick={() => setCurrentState('Đăng nhập')}
              className={`py-2 rounded-lg text-xs font-black transition-all ${
                currentState === 'Đăng nhập'
                  ? 'bg-white text-[#d70018] shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              ĐĂNG NHẬP
            </button>
            <button
              type='button'
              onClick={() => setCurrentState('Đăng ký')}
              className={`py-2 rounded-lg text-xs font-black transition-all ${
                currentState === 'Đăng ký'
                  ? 'bg-white text-[#d70018] shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              ĐĂNG KÝ
            </button>
          </div>

          <form onSubmit={onSubmitHandler} className='space-y-4'>
            {currentState === 'Đăng ký' && (
              <div>
                <label className='block text-xs font-bold text-slate-700 mb-1.5'>Họ và tên của bạn</label>
                <input 
                  onChange={(e) => setName(e.target.value)} 
                  value={name} 
                  type="text" 
                  className='w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-xs sm:text-sm focus:ring-2 focus:ring-red-500 focus:border-red-500 focus:outline-none transition-colors' 
                  placeholder='Ví dụ: Nguyễn Văn An' 
                  required 
                />
              </div>
            )}
            
            <div>
              <label className='block text-xs font-bold text-slate-700 mb-1.5'>Địa chỉ Email</label>
              <input 
                onChange={(e) => setEmail(e.target.value)} 
                value={email} 
                type="email" 
                className='w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-xs sm:text-sm focus:ring-2 focus:ring-red-500 focus:border-red-500 focus:outline-none transition-colors' 
                placeholder='nguyenvanan@gmail.com' 
                required 
              />
            </div>
            
            <div>
              <label className='block text-xs font-bold text-slate-700 mb-1.5'>Mật khẩu</label>
              <input 
                onChange={(e) => setPassword(e.target.value)} 
                value={password} 
                type="password" 
                className='w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-xs sm:text-sm focus:ring-2 focus:ring-red-500 focus:border-red-500 focus:outline-none transition-colors' 
                placeholder='Nhập mật khẩu (từ 8 ký tự)' 
                required 
              />
            </div>

            {currentState === 'Đăng nhập' && (
              <div className='flex justify-between items-center text-xs'>
                <label className='flex items-center gap-1.5 text-slate-600 cursor-pointer'>
                  <input type='checkbox' defaultChecked className='rounded text-[#d70018] focus:ring-red-500' />
                  <span>Ghi nhớ tài khoản</span>
                </label>
                <a href="#forgot" className='text-[#d70018] font-bold hover:underline'>
                  Quên mật khẩu?
                </a>
              </div>
            )}
            
            {/* Submit Button */}
            <button 
              type="submit"
              className='w-full bg-[#d70018] hover:bg-[#ba0014] text-white font-black py-3 px-6 rounded-xl shadow-md active:scale-[0.99] transition-all text-xs sm:text-sm uppercase tracking-wider mt-2'
            >
              {currentState === 'Đăng nhập' ? 'ĐĂNG NHẬP NGAY' : 'TẠO TÀI KHOẢN SMEMBER'}
            </button>
          </form>
          
          {/* Footer Note */}
          <div className='text-center mt-6 pt-5 border-t border-slate-100'>
            <p className='text-slate-400 text-[11px]'>
              Bằng việc thao tác, bạn đồng ý với 
              <span className='text-[#d70018] font-bold cursor-pointer'> Điều khoản sử dụng </span>
              và 
              <span className='text-[#d70018] font-bold cursor-pointer'> Chính sách bảo mật </span>
              của Minh Tuấn Shop.
            </p>
          </div>

        </div>

      </div>
    </div>
  );
};

export default Login;