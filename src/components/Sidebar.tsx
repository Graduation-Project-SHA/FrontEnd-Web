import React from 'react'
import { CiLogout } from "react-icons/ci";
import select from '../../public/icons/select.svg'
import { RxDashboard } from "react-icons/rx";
import { MdOutlineAdminPanelSettings } from "react-icons/md";
import { MdOutlineSick } from "react-icons/md";
import { FaStethoscope } from "react-icons/fa6";
import { FaHandHoldingHeart } from "react-icons/fa6";
import { Link, useNavigate } from 'react-router-dom';
import axiosInstance from '../utils/axiosInstance';

const data = [
    {
        icon: <RxDashboard size={25} />,
        label: "لوحة التحكم",
        link: "/"
    },
    {
        icon: <MdOutlineSick size={25} />,
        label: "الحالات المرضية",
        link: "/patients"
    },
    {
        icon: <FaStethoscope size={25} />,
        label: "الاطباء",
        link: "/doctors"
    },
    {
        icon: <FaHandHoldingHeart size={25} />,
        label: "التبرعات",
        link: "/donations"
    },
    {
        icon: <MdOutlineAdminPanelSettings size={25} />,
        label: "الأدوار",
        link: "/roles"
    },

]



export default function Sidebar() {
    const [active, setActive] = React.useState(0);
    const navigate = useNavigate();

    const handleLogout = async () => {
        try {
            await axiosInstance.post('/auth/logout');
        } catch (err) {
            // Optional: log error, but proceed to clear storage
            console.error('Logout error:', err);
        } finally {
            // Clear auth data regardless of API response
            localStorage.removeItem('accessToken');
            localStorage.removeItem('refreshToken');

            // Navigate to login page
            navigate('/login');
        }
    };

    return (
        <>
            {/* Desktop Sidebar - side fixed */}
            <div className='hidden md:flex w-[5.2rem] sticky top-0 h-screen flex-col items-center shadow-xl shrink-0'>
                <p className='text-2xl my-4 font-bold text-[#0067FF]'>لوجو</p>
                <div className='flex flex-col items-center justify-between h-full'>
                    <div className='relative'>
                        {data.map((item, index) => (
                            <Link to={item.link} key={index}>
                                <div onClick={() => setActive(index)} className={`flex justify-center items-center cursor-pointer w-20 h-20 rounded-2xl relative`}>
                                    {active === index && (
                                        <>
                                            <img src={select} alt="ss" className="absolute -left-1 w-24 h-24 z-0 object-cover" />
                                            <div className="absolute w-12 h-12 bg-[#0067FF] rounded-full z-10"></div>
                                        </>
                                    )}
                                    <div className={`z-10 ${active === index ? 'text-white' : 'text-[#141B34]'}`}>
                                        {item.icon}
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                    <div className='mb-4'>
                        <button
                            onClick={handleLogout}
                            className='flex items-center justify-center w-12 h-12 rounded-full hover:bg-gray-100 text-[#141B34]'
                            aria-label='تسجيل الخروج'
                            title='تسجيل الخروج'
                        >
                            <CiLogout size={28} />
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Bottom Nav */}
            <div className='md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200 shadow-lg'>
                <div className='flex items-center justify-around px-2 py-2'>
                    {data.slice(0, 6).map((item, index) => (
                        <Link to={item.link} key={index}>
                            <div
                                onClick={() => setActive(index)}
                                className={`flex flex-col items-center justify-center w-14 h-12 rounded-xl transition-all ${active === index ? 'text-[#0067FF] bg-[#EEF4FF]' : 'text-[#141B34]'}`}
                            >
                                {item.icon}
                            </div>
                        </Link>
                    ))}
                    <button
                        onClick={handleLogout}
                        className='flex flex-col items-center justify-center w-14 h-12 rounded-xl text-red-500'
                        aria-label='تسجيل الخروج'
                    >
                        <CiLogout size={22} />
                    </button>
                </div>
            </div>
        </>
    )
}
