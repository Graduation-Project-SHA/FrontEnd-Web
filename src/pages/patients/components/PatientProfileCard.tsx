import React from 'react'

interface PatientInfo {
    id: string
    name: string
    lastVisit: string
    imageUrl: string
    dateAdded: string
    birthDate: string
    gender: string
    phone: string
    email: string
}

interface InfoRowProps {
    label: string
    value: string
}

const InfoRow: React.FC<InfoRowProps> = ({ label, value }) => (
    <div className='flex justify-between'>
        <p className='text-gray-600'>{label}</p>
        <p className='font-medium'>{value}</p>
    </div>
)

export default function PatientProfileCard({ patient }: { patient?: PatientInfo }) {
    const defaultPatient: PatientInfo = {
        id: 'PT001',
        name: 'أحمد محمد',
        lastVisit: '25 اكتوبر 2025',
        imageUrl: 'https://placehold.co/500',
        dateAdded: '10 مايو 2024',
        birthDate: '10 Jan 1991',
        gender: 'ذكر',
        phone: '+0201016793101',
        email: 'ahmed@example.com'
    }

    const patientData = patient || defaultPatient

    const infoItems = [
        { label: 'تمت الاضافة في', value: patientData.dateAdded },
        { label: 'تاريخ الميلاد', value: patientData.birthDate },
        { label: 'النوع', value: patientData.gender },
        { label: 'رقم الهاتف', value: patientData.phone },
        { label: 'إيميل', value: patientData.email }
    ]

    return (
        <div className='mt-10 '>
            <div className='w-[30.1rem] p-10 rounded-xl shadow-lg px-8'>
                {/* Patient Header */}
                <div className='flex items-center gap-5 border-b-2 border-gray-200 pb-5'>
                    <div className='w-[4.5rem] h-[4.5rem] rounded-xl overflow-hidden flex-shrink-0'>
                        <img
                            src={patientData.imageUrl}
                            alt={`${patientData.name} profile`}
                            className='w-full h-full object-cover'
                        />
                    </div>

                    <div className='flex flex-col gap-1'>
                        <span className='bg-[#EBF2F9] text-[#1F6DB2] px-2 py-0.5 rounded-md text-sm font-medium inline-block w-fit'>
                            #{patientData.id}
                        </span>
                        <h2 className='text-lg font-bold'>{patientData.name}</h2>
                        <p className='text-sm text-gray-500'>اخر زيارة: {patientData.lastVisit}</p>
                    </div>
                </div>

                {/* Patient Information */}
                <div className='mt-5 border-b-2 border-gray-200 pb-5'>
                    <h3 className='font-bold mb-4'>المعلومات الاساسية</h3>
                    <div className='flex flex-col gap-4'>
                        {infoItems.map((item, index) => (
                            <InfoRow key={index} label={item.label} value={item.value} />
                        ))}
                    </div>
                </div>

                {/* Additional sections can be added here */}
                <div className='mt-5'>
                    <h3 className='font-bold mb-4'>معلومات العنوان</h3>
                    <div>
                        <p>2557  القاهرة  , السلام  , عدلى منصور</p>
                    </div>
                </div>

            </div>
        </div>
    )
}
