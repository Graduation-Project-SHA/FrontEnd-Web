import React from 'react'
import Input from './components/Input'
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios';
import config from '../../config';

export default function Login() {
  const [data, setData] = React.useState({
    email: '',
    password: ''
  });
  const [errors, setErrors] = React.useState<string | null>(null);

  const [isLoading, setIsLoading] = React.useState(false);
  const navigate = useNavigate();

  const onchangeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    setData({
      ...data,
      [e.target.name]: e.target.value
    });
  }

  const submitHandler = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await axios.post(`${config.apiBaseUrl}/admin/auth/local-login`, {
        email: data.email,
        password: data.password
      });
      console.log('Login response:', response.data);
      localStorage.setItem('accessToken', response.data.tokens.accessToken);
      navigate('/');
    } catch (error) {
      console.error('Login error:', error);
      if (axios.isAxiosError(error)) {
        setErrors(error.response?.data.message || 'An error occurred');
      } else {
        setErrors('An error occurred');
      }
      console.log(errors)
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div dir='rtl' className=' bg-[#1B6AF3] h-screen w-full flex justify-center items-center font-["SFArabic-Regular"] relative overflow-hidden'>
      {/* Mesh Gradient Layers */}
      <img src="/Ellipse.png" alt="" className='absolute bottom-0 right-36 pointer-events-none ' />
      <img src="/Ellipse2.png" alt="" className='absolute -top-5 right-36 pointer-events-none animate-[float_6s_ease-in-out_infinite_0.5s]' />
      <img src="/Ellipse3.png" alt="" className='absolute left-0 pointer-events-none animate-[float_7s_ease-in-out_infinite_1s]' />


      {/* Login Form Card */}
      <div className='flex flex-col w-[38.6rem] items-center h-[36.3rem] rounded-4xl bg-gradient-to-t to-[#F2F2F2F2]/95 from-[#F2F2F2]/55 border-white border-[1px] relative z-10'>
        <div className='flex items-center flex-col my-5'>
          <h1 className='text-7xl text-[#105FE7] font-bold my-10'>لوجو</h1>
          <form onSubmit={submitHandler} className='flex flex-col gap-4  '>
            <Input label="البريد الالكترونى" type="email" name="email" placeholder="أدخل بريدك الإلكتروني" onChange={onchangeHandler} />
            <Input label="كلمة المرور" type="password" name="password" placeholder="أدخل كلمة المرور" onChange={onchangeHandler} />
          </form>

          <div className='flex justify-between items-center w-full mt-4'>
            <Link to={"/forgetPassword"} className='text-[#105FE7] text-bold underline'>
              نسيت كلمه المرور ؟
            </Link>
            <div className='flex gap-5 text-[#6C7278]  my-5 justify-between'>
              <p>تذكر بياناتى</p>
              <input type='checkbox' className='' />
            </div>
          </div>
          {errors && (
            <div className='text-red-500 mb-4'>
              {errors}
            </div>
          )}
          <button
            type="submit"
            onClick={submitHandler}
            disabled={isLoading}
            className='bg-[#105FE7] hover:bg-[#1158bb] font-bold duration-200 w-[30.5rem] h-[3.75rem] text-white py-2 px-4 rounded disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2'
          >
            {isLoading ? (
              <>
                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                جاري التحميل...
              </>
            ) : (
              'تسجيل الدخول'
            )}
          </button>
        </div>
      </div>
    </div>
  )
}
