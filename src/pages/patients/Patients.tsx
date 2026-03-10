import Card from '../../components/ui/Card'
import Table from '../../components/ui/Table'
import { useNavigate } from 'react-router-dom'

const data = [
    {
        color: "#F0F7FF",
        circleColor: "#CDE6FE",
        icon: (
            <svg className="w-6 h-6 text-[#2B73F3]" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
            </svg>
        ),
        title: "المرضى"
    },
    {
        color: "#FFF4E5",
        circleColor: "#FFE2B8",
        icon: (
            <svg className="w-6 h-6 text-[#F59E0B]" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
            </svg>
        ),
        title: "المواعيد"
    },
    {
        color: "#E5F7F0",
        circleColor: "#B8EFD9",
        icon: (
            <svg className="w-6 h-6 text-[#10B981]" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M4 4a2 2 0 00-2 2v4a2 2 0 002 2V6h10a2 2 0 00-2-2H4zm2 6a2 2 0 012-2h8a2 2 0 012 2v4a2 2 0 01-2 2H8a2 2 0 01-2-2v-4zm6 4a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
            </svg>
        ),
        title: "الفواتير"
    },
    {
        color: "#F9E5FF",
        circleColor: "#EFB8FE",
        icon: (
            <svg className="w-6 h-6 text-[#8B5CF6]" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
            </svg>
        ),
        title: "المستخدمين"
    }
]

const patientsData = [
    {
        id: 1,
        name: "أحمد محمد",
        gender: "ذكر",
        doctor: {
            name: "د. علي أحمد",
            specialty: "طب عام",
            imageLink: ""
        },
        condition: "عمليات"
    },
    {
        id: 2,
        name: "سارة علي",
        gender: "أنثى",
        doctor: {
            name: "د. ليلى حسن",
            specialty: "طب أطفال",
            imageLink: ""
        },
        condition: "متابعة"
    }
]

export default function Patients() {
    const navigate = useNavigate();
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
                    />
                ))}
            </div>
            <div>
                <Table tableHeader="قائمة المرضى" columns={[
                    { key: 'id', header: 'رقم' },
                    { key: 'name', header: 'الاسم' },
                    { key: 'gender', header: 'النوع' },
                    { key: 'doctor', header: 'الطبيب', render: (row) => row.doctor.name },
                    { key: 'condition', header: 'الحالة' }
                ]}
                    totalCount={342}
                    data={patientsData}
                    actionsHeader="الإجراءات"
                    actions={[
                        {
                            label: "التفاصيل",
                            onClick: (row) => {
                                navigate(`/patients/${row.id}`);
                            }
                        },
                        {
                            label: "حذف",
                            onClick: (_row) => {
                                // handle delete action
                            }
                        }
                    ]}
                />
            </div>
        </div>
    )
}
