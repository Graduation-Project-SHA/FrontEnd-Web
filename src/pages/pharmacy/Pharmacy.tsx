
import Card from '../../components/ui/Card'
import Table from '../../components/ui/Table'

const data = [
    {
        title: 'إجمالي الصيدليات',
        count: 156,
        percentage: '+18%',
        color: '#E8F4FD',
        circleColor: '#2B73F3',
        icon: (
            <svg className="w-6 h-6 text-[#2B73F3]" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M5 2a1 1 0 011 1v1h1a1 1 0 010 2H6v1a1 1 0 01-2 0V6H3a1 1 0 010-2h1V3a1 1 0 011-1zm0 10a1 1 0 011 1v1h1a1 1 0 110 2H6v1a1 1 0 11-2 0v-1H3a1 1 0 110-2h1v-1a1 1 0 011-1zM12 2a1 1 0 01.967.744L14.146 7.2 17.5 9.134a1 1 0 010 1.732l-3.354 1.935-1.18 4.455a1 1 0 01-1.933 0L9.854 12.8 6.5 10.866a1 1 0 010-1.732l3.354-1.935 1.18-4.455A1 1 0 0112 2z" clipRule="evenodd" />
            </svg>
        )
    },
    {
        title: 'الصيدليات النشطة',
        count: 142,
        percentage: '+12%',
        color: '#EEFBF4',
        circleColor: '#10B981',
        icon: (
            <svg className="w-6 h-6 text-[#10B981]" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
        )
    },
    {
        title: 'إجمالي الطلبات',
        count: 3254,
        percentage: '+25%',
        color: '#FFF4E6',
        circleColor: '#F59E0B',
        icon: (
            <svg className="w-6 h-6 text-[#F59E0B]" fill="currentColor" viewBox="0 0 20 20">
                <path d="M3 1a1 1 0 000 2h1.22l.305 1.222a.997.997 0 00.01.042l1.358 5.43-.893.892C3.74 11.846 4.632 14 6.414 14H15a1 1 0 000-2H6.414l1-1H14a1 1 0 00.894-.553l3-6A1 1 0 0017 3H6.28l-.31-1.243A1 1 0 005 1H3zM16 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM6.5 18a1.5 1.5 0 100-3 1.5 1.5 0 000 3z" />
            </svg>
        )
    },
    {
        title: 'المناطق المغطاة',
        count: 24,
        percentage: '+5',
        color: '#F3E8FF',
        circleColor: '#8B5CF6',
        icon: (
            <svg className="w-6 h-6 text-[#8B5CF6]" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
            </svg>
        )
    }
]

const pharmaciesData = [
    {
        contractId: 'PH001',
        name: 'صيدلية النور',
        address: 'شارع الجامعة، المعادي',
        phone: '+201012345678',
        email: 'alnoor@pharmacy.com',
        status: 'نشط'
    },
    {
        contractId: 'PH002',
        name: 'صيدلية الشفاء',
        address: 'ميدان التحرير، وسط البلد',
        phone: '+201087654321',
        email: 'elshefaa@pharmacy.com',
        status: 'نشط'
    },
    {
        contractId: 'PH003',
        name: 'صيدلية الحياة',
        address: 'شارع فيصل، الجيزة',
        phone: '+201098765432',
        email: 'alhayat@pharmacy.com',
        status: 'معلق'
    },
    {
        contractId: 'PH004',
        name: 'صيدلية المستقبل',
        address: 'مدينة نصر، القاهرة',
        phone: '+201023456789',
        email: 'almostakbal@pharmacy.com',
        status: 'نشط'
    },
    {
        contractId: 'PH005',
        name: 'صيدلية الأمل',
        address: 'شارع الهرم، الجيزة',
        phone: '+201034567890',
        email: 'alamal@pharmacy.com',
        status: 'نشط'
    },
    {
        contractId: 'PH006',
        name: 'صيدلية الرحمة',
        address: 'شبرا، القاهرة',
        phone: '+201045678901',
        email: 'elrahma@pharmacy.com',
        status: 'معلق'
    },
    {
        contractId: 'PH007',
        name: 'صيدلية السلام',
        address: 'المهندسين، الجيزة',
        phone: '+201056789012',
        email: 'elsalam@pharmacy.com',
        status: 'نشط'
    },
    {
        contractId: 'PH008',
        name: 'صيدلية الإيمان',
        address: 'العجوزة، الجيزة',
        phone: '+201067890123',
        email: 'aleeman@pharmacy.com',
        status: 'نشط'
    }
]


export default function Pharmacy() {
    return (
        <div className='px-4 md:px-10 py-4 md:py-8'>


            <div className='flex flex-wrap w-full gap-4'>
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
                    tableHeader="عدد الصيدليات المسجلة"
                    columns={[
                        { key: 'contractId', header: 'رقم التعاقد', width: '120px' },
                        { key: 'name', header: 'اسم الصيدلية' },
                        { key: 'address', header: 'العنوان' },
                        { key: 'phone', header: 'رقم الهاتف' },
                        { key: 'email', header: 'البريد الإلكتروني' },
                        {
                            key: 'status',
                            header: 'حالة التفعيل',
                            render: (row) => (
                                <span className={`px-3 py-1 rounded-full text-sm font-medium ${row.status === 'نشط'
                                    ? 'bg-green-100 text-green-700'
                                    : 'bg-yellow-100 text-yellow-700'
                                    }`}>
                                    {row.status}
                                </span>
                            )
                        }
                    ]}
                    totalCount={pharmaciesData.length}
                    data={pharmaciesData}
                    showSearch={true}
                    showFilter={true}
                    searchPlaceholder="بحث عن صيدلية..."
                    filterOptions={[
                        { label: 'الكل', value: 'all' },
                        { label: 'نشط', value: 'active' },
                        { label: 'معلق', value: 'suspended' }
                    ]}
                    actionsHeader="الإجراءات"
                    actions={[
                        {
                            label: "عرض التفاصيل",
                            onClick: (row) => {
                                console.log('View pharmacy:', row)
                            }
                        },
                        {
                            label: "تعديل",
                            onClick: (row) => {
                                console.log('Edit pharmacy:', row)
                            },
                            className: 'text-blue-600'
                        },
                        {
                            label: "تعليق",
                            onClick: (row) => {
                                console.log('Suspend pharmacy:', row)
                            },
                            className: 'text-orange-600'
                        },
                        {
                            label: "حذف",
                            onClick: (row) => {
                                console.log('Delete pharmacy:', row)
                            },
                            className: 'text-red-600'
                        }
                    ]}
                />
            </div>
        </div>
    )
}
