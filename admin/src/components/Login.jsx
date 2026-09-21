import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';
import React from 'react'
import { useState } from 'react'
import { assets } from '../assets/assets';
import { backendUrl } from '../App';

const Login = ({setToken}) => {

    const [email,setEmail] = useState('');
    const [password,setPassword] = useState('');

    const onSubmitHandler = async (e) => {
        try {
            e.preventDefault();
            const response = await axios.post(backendUrl+ '/api/user/admin', {email,password});
            if (response.data.success){
                setToken(response.data.token);
            } else {
                toast.error(response.data.message);
            }
        } catch (error) {
            console.log(error);
            toast.error(error.message);
        }
    }

  return (
    <div className='min-h-screen flex items-center justify-center w-full bg-[#f4f6f8] px-4'>
        <div className='bg-white shadow-xl rounded-2xl p-8 max-w-md w-full border border-slate-200'>
            <div className='flex justify-center mb-4'>
                <img src={assets.logo} alt="Minh Tuấn Shop Admin" className='h-12 w-auto object-contain' />
            </div>
            <h1 className='text-xl font-black text-slate-800 uppercase tracking-tight mb-6 text-center'>Hệ Thống Quản Trị</h1>
            <form onSubmit = {onSubmitHandler} className='space-y-4'>
                <div className='min-w-72'>
                    <label className='block text-xs font-bold text-slate-700 mb-1.5'>Tài khoản Email</label>
                    <input onChange={(e) =>setEmail(e.target.value)} value={email} className='rounded-xl w-full px-3.5 py-2.5 border border-slate-200 text-xs sm:text-sm focus:ring-2 focus:ring-red-500 focus:outline-none' type="email" placeholder='admin@np.com' required />
                </div>
                <div className='min-w-72'>
                    <label className='block text-xs font-bold text-slate-700 mb-1.5'>Mật khẩu</label>
                    <input onChange={(e) =>setPassword(e.target.value)} value={password} className='rounded-xl w-full px-3.5 py-2.5 border border-slate-200 text-xs sm:text-sm focus:ring-2 focus:ring-red-500 focus:outline-none' type="password" placeholder='Nhập mật khẩu' required />
                </div>
                <button className='w-full py-3 px-4 rounded-xl text-white font-bold bg-[#d70018] hover:bg-[#ba0014] transition-colors shadow-md text-xs sm:text-sm uppercase tracking-wider' type='submit'>Đăng nhập Quản Trị</button>
            </form>
        </div>
    </div>
  )
}

export default Login