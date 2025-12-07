import React, { useState } from 'react'
import { useContext } from 'react';
import { ShopContext } from '../context/ShopContext';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useEffect } from 'react';



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

  useEffect(() =>{
    if(token){
      navigate('/');
    }
  },[token])


  return (
    <div className='min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100'>
      <div className='w-full max-w-md mx-4'>
        <form onSubmit={onSubmitHandler} className='bg-white rounded-xl shadow-2xl p-8 border border-gray-200'>
          {/* Header */}
          <div className='text-center mb-8'>
            <div className='inline-flex items-center gap-2 mb-4'>
              <p className='parata-regular text-3xl font-bold text-gray-800'>{currentState}</p>
            </div>
            <p className='text-gray-600 text-sm'>
              {currentState === 'Đăng nhập' 
                ? 'Đăng nhập để tiếp tục mua sắm' 
                : 'Tạo tài khoản mới để bắt đầu'
              }
            </p>
          </div>
          
          {/* Form Fields */}
          <div className='space-y-4'>
            {currentState === 'Đăng ký' && (
              <div>
                <label className='block text-sm font-medium text-gray-700 mb-2'>Họ và tên</label>
                <input 
                  onChange={(e) => setName(e.target.value)} 
                  value={name} 
                  type="text" 
                  className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors' 
                  placeholder='Nhập họ và tên của bạn' 
                  required 
                />
              </div>
            )}
            
            <div>
              <label className='block text-sm font-medium text-gray-700 mb-2'>Email</label>
              <input 
                onChange={(e) => setEmail(e.target.value)} 
                value={email} 
                type="email" 
                className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors' 
                placeholder='Nhập email của bạn' 
                required 
              />
            </div>
            
            <div>
              <label className='block text-sm font-medium text-gray-700 mb-2'>Mật khẩu</label>
              <input 
                onChange={(e) => setPassword(e.target.value)} 
                value={password} 
                type="password" 
                className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors' 
                placeholder='Nhập mật khẩu của bạn' 
                required 
              />
            </div>
          </div>
          
          {/* Action Links */}
          <div className='flex justify-between items-center text-sm mt-6 mb-8'>
            <button type="button" className='text-blue-600 hover:text-blue-700 font-medium transition-colors'>
              Quên mật khẩu?
            </button>
            <button 
              type="button"
              onClick={() => setCurrentState(currentState === 'Đăng nhập' ? 'Đăng ký' : 'Đăng nhập')} 
              className='text-blue-600 hover:text-blue-700 font-medium transition-colors'
            >
              {currentState === 'Đăng nhập' ? 'Tạo tài khoản' : 'Đăng nhập tại đây'}
            </button>
          </div>
          
          {/* Submit Button */}
          <button 
            type="submit"
            className='w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold py-3 px-6 rounded-lg hover:from-blue-700 hover:to-purple-700 transform hover:scale-105 transition-all duration-200 shadow-lg'
          >
            {currentState === 'Đăng nhập' ? 'Đăng nhập' : 'Đăng ký'}
          </button>
          
          {/* Footer Note */}
          <div className='text-center mt-8 pt-6 border-t border-gray-200'>
            <p className='text-gray-500 text-xs'>
              Bằng việc {currentState === 'Đăng nhập' ? 'đăng nhập' : 'đăng ký'}, bạn đồng ý với 
              <a href="#" className='text-blue-600 hover:text-blue-700'> Điều khoản sử dụng </a>
              và 
              <a href="#" className='text-blue-600 hover:text-blue-700'> Chính sách bảo mật</a>
            </p>
          </div>
        </form>
      </div>
    </div>
  )
}

export default Login