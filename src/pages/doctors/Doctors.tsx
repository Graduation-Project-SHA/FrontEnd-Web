import React from 'react'
import Card from '../../components/ui/Card'
import Table from '../../components/ui/Table'

const data = [
    {
        title: 'إجمالي الأطباء',
        count: 45,
        percentage: '+12%',
        color: '#E8F4FD',
        circleColor: '#2B73F3',
        icon: (
            <svg className="w-6 h-6 text-[#2B73F3]" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
            </svg>
        )
    },
    {
        title: 'الأطباء النشطون',
        count: 38,
        percentage: '+8%',
        color: '#EEFBF4',
        circleColor: '#10B981',
        icon: (
            <svg className="w-6 h-6 text-[#10B981]" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
        )
    },
    {
        title: 'إجمالي الحجوزات',
        count: 1847,
        percentage: '+15%',
        color: '#FFF4E6',
        circleColor: '#F59E0B',
        icon: (
            <svg className="w-6 h-6 text-[#F59E0B]" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
            </svg>
        )
    },
    {
        title: 'التخصصات',
        count: 12,
        percentage: '+2',
        color: '#F3E8FF',
        circleColor: '#8B5CF6',
        icon: (
            <svg className="w-6 h-6 text-[#8B5CF6]" fill="currentColor" viewBox="0 0 20 20">
                <path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3zM3.31 9.397L5 10.12v4.102a8.969 8.969 0 00-1.05-.174 1 1 0 01-.89-.89 11.115 11.115 0 01.25-3.762zM9.3 16.573A9.026 9.026 0 007 14.935v-3.957l1.818.78a3 3 0 002.364 0l5.508-2.361a11.026 11.026 0 01.25 3.762 1 1 0 01-.89.89 8.968 8.968 0 00-5.35 2.524 1 1 0 01-1.4 0zM6 18a1 1 0 001-1v-2.065a8.935 8.935 0 00-2-.712V17a1 1 0 001 1z" />
            </svg>
        )
    }
]

const doctorsData = [
    {
        id: 'DR001',
        name: 'د. أحمد محمود',
        experience: '15 سنة',
        specialty: 'جراحة العظام',
        bookings: 245,
        status: 'نشط'
    },
    {
        id: 'DR002',
        name: 'د. فاطمة السيد',
        experience: '10 سنوات',
        specialty: 'طب الأطفال',
        bookings: 198,
        status: 'نشط'
    },
    {
        id: 'DR003',
        name: 'د. محمد علي',
        experience: '8 سنوات',
        specialty: 'القلب والأوعية الدموية',
        bookings: 312,
        status: 'نشط'
    },
    {
        id: 'DR004',
        name: 'د. سارة حسن',
        experience: '12 سنة',
        specialty: 'الأمراض الجلدية',
        bookings: 156,
        status: 'متوقف'
    },
    {
        id: 'DR005',
        name: 'د. خالد عبدالله',
        experience: '20 سنة',
        specialty: 'جراحة عامة',
        bookings: 289,
        status: 'نشط'
    },
    {
        id: 'DR006',
        name: 'د. نورا إبراهيم',
        experience: '6 سنوات',
        specialty: 'طب النساء والتوليد',
        bookings: 178,
        status: 'نشط'
    },
    {
        id: 'DR007',
        name: 'د. عمر يوسف',
        experience: '14 سنة',
        specialty: 'الطب الباطني',
        bookings: 234,
        status: 'نشط'
    },
    {
        id: 'DR008',
        name: 'د. مريم أحمد',
        experience: '9 سنوات',
        specialty: 'طب العيون',
        bookings: 167,
        status: 'متوقف'
    }
]


export default function Doctors() {
    return (
        <div className='px-10 py-8'>


            <div className='flex md:justify-between items-center justify-center flex-wrap w-full gap-5'>
                {data.map((item, index) => (
                    <Card
                        key={index}
                        color={item.color}
                        circleColor={item.circleColor}
                        icon={item.icon}
                        title={item.title}
                        count={item.count}
                        percentage={item.percentage}
                    />
                ))}
            </div>
            <div>
                <Table
                    tableHeader="قائمة الأطباء"
                    columns={[
                        { key: 'id', header: 'رقم الدكتور', width: '100px' },
                        { key: 'name', header: 'الاسم' },
                        { key: 'experience', header: 'الخبرة' },
                        { key: 'specialty', header: 'التخصص' },
                        { key: 'bookings', header: 'عدد الحجوزات' },
                        {
                            key: 'status',
                            header: 'الحالة',
                            render: (row) => (
                                <span className={`px-3 py-1 rounded-full text-sm font-medium ${row.status === 'نشط'
                                        ? 'bg-green-100 text-green-700'
                                        : 'bg-red-100 text-red-700'
                                    }`}>
                                    {row.status}
                                </span>
                            )
                        }
                    ]}
                    totalCount={doctorsData.length}
                    data={doctorsData}
                    actionsHeader="الإجراءات"
                    actions={[
                        {
                            label: "عرض التفاصيل",
                            onClick: (row) => {
                                console.log('View doctor:', row)
                            }
                        },
                        {
                            label: "تعديل",
                            onClick: (row) => {
                                console.log('Edit doctor:', row)
                            },
                            className: 'text-blue-600'
                        },
                        {
                            label: "حذف",
                            onClick: (row) => {
                                console.log('Delete doctor:', row)
                            },
                            className: 'text-red-600'
                        }
                    ]}
                />
            </div>
        </div>
    )
}
