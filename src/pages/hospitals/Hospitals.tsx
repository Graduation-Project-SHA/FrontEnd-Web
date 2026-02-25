
import Card from '../../components/ui/Card'
import Table from '../../components/ui/Table'

const data = [
    {
        title: 'إجمالي المستشفيات',
        count: 89,
        percentage: '+14%',
        color: '#E8F4FD',
        circleColor: '#2B73F3',
        icon: (
            <svg className="w-6 h-6 text-[#2B73F3]" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M3 4a1 1 0 011-1h3a1 1 0 011 1v3a1 1 0 01-1 1H4a1 1 0 01-1-1V4zm2 2V5h1v1H5zM3 13a1 1 0 011-1h3a1 1 0 011 1v3a1 1 0 01-1 1H4a1 1 0 01-1-1v-3zm2 2v-1h1v1H5zM13 4a1 1 0 011-1h3a1 1 0 011 1v3a1 1 0 01-1 1h-3a1 1 0 01-1-1V4zm2 2V5h1v1h-1zM13 13a1 1 0 011-1h3a1 1 0 011 1v3a1 1 0 01-1 1h-3a1 1 0 01-1-1v-3zm2 2v-1h1v1h-1z" clipRule="evenodd" />
            </svg>
        )
    },
    {
        title: 'المستشفيات النشطة',
        count: 81,
        percentage: '+10%',
        color: '#EEFBF4',
        circleColor: '#10B981',
        icon: (
            <svg className="w-6 h-6 text-[#10B981]" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
        )
    },
    {
        title: 'إجمالي الأسرة',
        count: 12450,
        percentage: '+8%',
        color: '#FFF4E6',
        circleColor: '#F59E0B',
        icon: (
            <svg className="w-6 h-6 text-[#F59E0B]" fill="currentColor" viewBox="0 0 20 20">
                <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
            </svg>
        )
    },
    {
        title: 'أقسام الطوارئ',
        count: 89,
        percentage: '+14',
        color: '#FEF2F2',
        circleColor: '#EF4444',
        icon: (
            <svg className="w-6 h-6 text-[#EF4444]" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
            </svg>
        )
    }
]

const hospitalsData = [
    {
        contractId: 'HS001',
        name: 'مستشفى النيل التخصصي',
        address: 'كورنيش النيل، المعادي',
        phone: '+201012345678',
        email: 'info@nile-hospital.com',
        beds: 350,
        status: 'نشط'
    },
    {
        contractId: 'HS002',
        name: 'مستشفى دار الشفاء',
        address: 'مدينة نصر، القاهرة',
        phone: '+201087654321',
        email: 'contact@darshefaa.com',
        beds: 280,
        status: 'نشط'
    },
    {
        contractId: 'HS003',
        name: 'مستشفى السلام الدولي',
        address: 'المهندسين، الجيزة',
        phone: '+201098765432',
        email: 'info@salam-hospital.com',
        beds: 420,
        status: 'نشط'
    },
    {
        contractId: 'HS004',
        name: 'مستشفى الرحمة العام',
        address: 'شبرا الخيمة، القليوبية',
        phone: '+201023456789',
        email: 'rahma@hospital.com',
        beds: 195,
        status: 'معلق'
    },
    {
        contractId: 'HS005',
        name: 'مستشفى الأمل للأطفال',
        address: 'الدقي، الجيزة',
        phone: '+201034567890',
        email: 'alamal-kids@hospital.com',
        beds: 150,
        status: 'نشط'
    },
    {
        contractId: 'HS006',
        name: 'مستشفى الإيمان الجامعي',
        address: 'العباسية، القاهرة',
        phone: '+201045678901',
        email: 'aleeman-uni@hospital.com',
        beds: 520,
        status: 'نشط'
    },
    {
        contractId: 'HS007',
        name: 'مستشفى النور للعيون',
        address: 'الزمالك، القاهرة',
        phone: '+201056789012',
        email: 'alnoor-eye@hospital.com',
        beds: 85,
        status: 'نشط'
    },
    {
        contractId: 'HS008',
        name: 'مستشفى القلب المصري',
        address: 'التجمع الخامس، القاهرة الجديدة',
        phone: '+201067890123',
        email: 'heart@egy-hospital.com',
        beds: 220,
        status: 'معلق'
    }
]


export default function Hospitals() {
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
                    tableHeader="عدد المستشفيات المسجلة"
                    columns={[
                        { key: 'contractId', header: 'رقم التعاقد', width: '120px' },
                        { key: 'name', header: 'اسم المستشفى' },
                        { key: 'address', header: 'العنوان' },
                        { key: 'beds', header: 'عدد الأسرة', width: '100px' },
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
                    totalCount={hospitalsData.length}
                    data={hospitalsData}
                    showSearch={true}
                    showFilter={true}
                    searchPlaceholder="بحث عن مستشفى..."
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
                                console.log('View hospital:', row)
                            }
                        },
                        {
                            label: "تعديل",
                            onClick: (row) => {
                                console.log('Edit hospital:', row)
                            },
                            className: 'text-blue-600'
                        },
                        {
                            label: "تعليق",
                            onClick: (row) => {
                                console.log('Suspend hospital:', row)
                            },
                            className: 'text-orange-600'
                        },
                        {
                            label: "حذف",
                            onClick: (row) => {
                                console.log('Delete hospital:', row)
                            },
                            className: 'text-red-600'
                        }
                    ]}
                />
            </div>
        </div>
    )
}
