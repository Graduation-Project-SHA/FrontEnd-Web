import React from 'react'
import Card from '../../components/ui/Card'
import Table from '../../components/ui/Table'

const data = [
    {
        color: "#F0F7FF",
        circleColor: "#CDE6FE",
        icon: "",
        title: "المرضى"
    },
    {
        color: "#FFF4E5",
        circleColor: "#FFE2B8",
        icon: "",
        title: "المواعيد"
    },
    {
        color: "#E5F7F0",
        circleColor: "#B8EFD9",
        icon: "",
        title: "الفواتير"
    },
    {
        color: "#F9E5FF",
        circleColor: "#EFB8FE",
        icon: "",
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
    return (
        <div className='px-10 py-8'>


            <div className='flex md:justify-between items-center justify-center flex-wrap w-full gap-5  '>
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
                                // handle details action
                            }
                        },
                        {
                            label: "حذف",
                            onClick: (row) => {
                                // handle delete action
                            }
                        }
                    ]}
                />
            </div>
        </div>
    )
}
