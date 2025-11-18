import React from 'react'
import { MdOutlineKeyboardDoubleArrowLeft } from "react-icons/md";
import { TiArrowLeft } from "react-icons/ti";
import { Link } from 'react-router-dom';

export default function PatientDetailsHeader() {
    return (
        <div>
            <div className='flex justify-between w-full'>
                <div className='flex gap-5 font-bold items-center'>
                    <p>صفحه المرضي</p>
                    <MdOutlineKeyboardDoubleArrowLeft />
                    <p>تفاصيل مستخدم</p>
                </div>
                <div>
                    <Link to="/" className='text-[#2B73F3] flex gap-2 items-center font-bold'>
                        العودة
                        <TiArrowLeft />
                    </Link>
                </div>
            </div>

            {/* Patient Details Header buttons */}
            <div className='flex gap-5 mt-8'>
                <button className='  bg-[#2B73F3] rounded-lg font-medium text-white w-[8.2rem] h-[2.5rem] cursor-pointer hover:bg-[#1A5FCC] duration-300' >تفاصيل المريض</button>
                <button className='  border-1 border-[#E2E8F0] rounded-lg font-medium  w-[8.2rem] h-[2.5rem] cursor-pointer hover:bg-[#E2E8F0] duration-300' >التأمين الصحي</button>
            </div>
        </div>

    )
}
