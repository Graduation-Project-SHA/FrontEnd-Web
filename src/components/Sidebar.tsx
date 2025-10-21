import React from 'react'
import { CiLogout } from "react-icons/ci";
import select from '../../public/icons/select.svg'
import { RxDashboard } from "react-icons/rx";
import { CiFileOn } from "react-icons/ci";
import { IoChatbubbleEllipsesOutline } from "react-icons/io5";
import { FaUserGroup } from "react-icons/fa6";
import { IoSettingsOutline } from "react-icons/io5";
import { MdOutlineAdminPanelSettings } from "react-icons/md";

import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import config from '../config';

const data = [
    {
        icon: <RxDashboard size={30} />,
        label: "لوحة التحكم",
        link: "/"
    },
    {
        icon: <CiFileOn size={30} />,
        label: "المستندات",
        link: "/documents"
    },
    {
        icon: <IoChatbubbleEllipsesOutline size={30} />,
        label: "المحادثات",
        link: "/chat"
    },
    {
        icon: <FaUserGroup size={30} />,
        label: "المستخدمين",
        link: "/admins"
    },
    {
        icon: <MdOutlineAdminPanelSettings size={30} />,
        label: "المستخدمين",
        link: "/roles"
    },

    {
        icon: <IoSettingsOutline size={30} />,
        label: "الإعدادات",
        link: "/settings"
    },
]



export default function Sidebar() {
    const [active, setActive] = React.useState(0);
    const navigate = useNavigate();

    const handleLogout = async () => {
        const token = localStorage.getItem('accessToken');
        try {
            if (token) {
                await axios.post(`${config.apiBaseUrl}/admin/auth/logout`, null, {
                    headers: {
                        authorization: `Bearer ${token}`,
                    },
                });
            }
        } catch (err) {
            // Optional: log error, but proceed to clear storage
            console.error('Logout error:', err);
        } finally {
            // Clear auth data regardless of API response
            localStorage.removeItem('accessToken');
            localStorage.removeItem('refreshToken');
            localStorage.removeItem('user');
            // Navigate to login page
            navigate('/login');
        }
    };

    return (
        <div className='w-[5.2rem] sticky top-0 h-screen  flex flex-col  items-center  shadow-xl '>
            <p className=' text-2xl my-4 font-bold text-[#0067FF]'>لوجو</p>
            <div className='flex flex-col items-center justify-between h-full'>
                <div className='relative'>
                    {
                        data.map((item, index) => (
                            <Link to={item.link} key={index}>
                                <div onClick={() => setActive(index)} className={`flex justify-center items-center cursor-pointer  w-20 h-20 mt-6 rounded-2xl relative`}>
                                    {active === index && (
                                        <>
                                            <img src={select} alt="ss" className="absolute -left-1 w-24 h-24 z-0 object-cover" />
                                            <div className="absolute  w-12 h-12 bg-[#0067FF] rounded-full z-10"></div>
                                        </>
                                    )}
                                    <div className={`z-10 ${active === index ? 'text-white' : 'text-[#141B34]'}`}>
                                        {item.icon}
                                    </div>
                                </div>
                            </Link>
                        ))
                    }
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
    )
}
