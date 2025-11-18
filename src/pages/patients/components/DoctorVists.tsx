import React from 'react'
import { Link } from 'react-router-dom'

export default function DoctorVists() {
    return (
        <div className=' w-[70rem] flex flex-col gap-8 px-10  shadow-lg py-5 rounded-2xl'>
            <div className=' flex  w-full justify-between items-center'>
                <h3 className='font-bold text-lg'>الزيارات</h3>
                <Link to={"/allVists"} className='text-[#2B73F3] flex gap-2 items-center font-bold '>
                    عرض المزيد
                </Link>
            </div>
            <div className='flex gap-10'>

                <div className="w-full   bg-white shadow-md rounded-2xl p-6 border border-gray-200">
                    <div className="flex items-center gap-5 mb-6">
                        <img
                            src="https://placehold.co/500"
                            alt="doctor"
                            className="w-16 h-16 rounded-lg object-cover border"
                        />
                        <div>
                            <h2 className="text-xl text-[#0F172A] font-bold">د. محمد مرعى</h2>
                            <p className="text-[#334155] text-sm">طبيب اسنان</p>
                        </div>
                    </div>


                    <div className="flex items-center justify-between mb-6">
                        <div className="text-right">
                            <p className="text-[#0F172A] font-semibold text-sm">الاعادة</p>
                            <p className=" text-[#334155] font-semibold">بعد 15 يوم</p>
                        </div>
                        <div className="text-right">
                            <p className="text-[#0F172A] font-semibold text-sm">تاريخ الزيارة</p>
                            <p className="text-[#334155]font-semibold">12، أكتوبر، 2025</p>
                        </div>
                    </div>


                    <div className="bg-gray-100 p-4 rounded-xl text-right">
                        <p className="text-[#0F172A] font-bold mb-1">ملاحظات</p>
                        <p className="text-[#334155] text-sm leading-relaxed">
                            يجب الابتعاد عن الاطعمة المثلجة او الساخنة لمدة اسبوعين والالتزام بمضاد التهابات اللثة
                        </p>
                    </div>
                </div>
                <div className="w-full  mx-auto bg-white shadow-md rounded-2xl p-6 border border-gray-200">
                    <div className="flex items-center gap-5 mb-6">
                        <img
                            src="https://placehold.co/500"
                            alt="doctor"
                            className="w-16 h-16 rounded-lg object-cover border"
                        />
                        <div>
                            <h2 className="text-xl text-[#0F172A] font-bold">د. محمد مرعى</h2>
                            <p className="text-[#334155] text-sm">طبيب اسنان</p>
                        </div>
                    </div>


                    <div className="flex items-center justify-between mb-6">
                        <div className="text-right">
                            <p className="text-[#0F172A] font-semibold text-sm">الاعادة</p>
                            <p className=" text-[#334155] font-semibold">بعد 15 يوم</p>
                        </div>
                        <div className="text-right">
                            <p className="text-[#0F172A] font-semibold text-sm">تاريخ الزيارة</p>
                            <p className="text-[#334155]font-semibold">12، أكتوبر، 2025</p>
                        </div>
                    </div>


                    <div className="bg-gray-100 p-4 rounded-xl text-right">
                        <p className="text-[#0F172A] font-bold mb-1">ملاحظات</p>
                        <p className="text-[#334155] text-sm leading-relaxed">
                            يجب الابتعاد عن الاطعمة المثلجة او الساخنة لمدة اسبوعين والالتزام بمضاد التهابات اللثة
                        </p>
                    </div>
                </div>

            </div>
        </div>
    )
}
