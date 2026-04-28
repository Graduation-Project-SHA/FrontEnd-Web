import React from 'react'
import { useNavigate } from 'react-router-dom'
import Card from '../../components/ui/Card'
import Table from '../../components/ui/Table'
import axiosInstance from '../../utils/axiosInstance'

const specializationMap: Record<string, string> = {
    ORTHOPEDICS: 'جراحة العظام',
    CARDIOLOGY: 'القلب والأوعية الدموية',
    PEDIATRICS: 'طب الأطفال',
    DERMATOLOGY: 'الأمراض الجلدية',
    GENERAL_SURGERY: 'جراحة عامة',
    GYNECOLOGY: 'طب النساء والتوليد',
    INTERNAL_MEDICINE: 'الطب الباطني',
    OPHTHALMOLOGY: 'طب العيون',
    NEUROLOGY: 'طب الأعصاب',
    PSYCHIATRY: 'الطب النفسي',
}

const statsConfig = [
    {
        key: 'totalDoctors' as const,
        title: 'إجمالي الأطباء',
        percentage: '',
        color: '#E8F4FD',
        circleColor: '#2B73F3',
        icon: (
            <svg className="w-6 h-6  text-[#ffffff]" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
            </svg>
        )
    },
    {
        key: 'verifiedDoctors' as const,
        title: 'الأطباء الموثقون',
        percentage: '',
        color: '#EEFBF4',
        circleColor: '#10B981',
        icon: (
            <svg className="w-6 h-6 text-[#ffffff]" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
        )
    },
    {
        key: 'pendingDoctors' as const,
        title: 'بانتظار التوثيق',
        percentage: '',
        color: '#FFF4E6',
        circleColor: '#F59E0B',
        icon: (
            <svg className="w-6 h-6 text-[#ffffff]" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
            </svg>
        )
    },
    {
        key: 'totalReviews' as const,
        title: 'إجمالي التقييمات',
        percentage: '',
        color: '#F3E8FF',
        circleColor: '#8B5CF6',
        icon: (
            <svg className="w-6 h-6 text-[#ffffff]" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
        )
    }
]

interface Doctor {
    id: number
    userId: number
    specialization: string
    bio: string
    practicalExperience: string
    isVerified: boolean
    isAvailable: boolean
    createdAt: string
    user: {
        id: number
        firstName: string
        lastName: string
        email: string
        phone: string
        gender: string
        dateOfBirth: string
        profileImage: string | null
        address: string | null
        isEmailVerified: boolean
    }
    _count: {
        reviews: number
    }
}

interface StatsOverview {
    totalDoctors: number
    verifiedDoctors: number
    pendingDoctors: number
    totalReviews: number
    totalServices: number
    averageRating: number
}

export default function Doctors() {
    const navigate = useNavigate()
    const [doctors, setDoctors] = React.useState<Doctor[]>([])
    const [isLoading, setIsLoading] = React.useState(true)
    const [error, setError] = React.useState<string | null>(null)
    const [pagination, setPagination] = React.useState({ page: 1, limit: 20, total: 0, totalPages: 1 })
    const [verifiedFilter, setVerifiedFilter] = React.useState<boolean | undefined>(undefined)
    const [stats, setStats] = React.useState<StatsOverview | null>(null)

    React.useEffect(() => {
        const fetchStats = async () => {
            try {
                const response = await axiosInstance.get('/admin/doctors/statistics')
                setStats(response.data.data.overview)
            } catch (err) {
                console.error('Failed to fetch stats:', err)
            }
        }
        fetchStats()
    }, [])

    React.useEffect(() => {
        const fetchDoctors = async () => {
            setIsLoading(true)
            try {
                const params: Record<string, unknown> = { page: pagination.page, limit: pagination.limit }
                if (verifiedFilter !== undefined) params.isVerified = verifiedFilter
                const response = await axiosInstance.get('/admin/doctors', { params })
                setDoctors(response.data.data)
                setPagination(response.data.pagination)
            } catch (err) {
                console.error('Failed to fetch doctors:', err)
                setError('فشل تحميل بيانات الأطباء')
            } finally {
                setIsLoading(false)
            }
        }

        fetchDoctors()
    }, [pagination.page, verifiedFilter])

    const tableRows = doctors.map((doctor) => ({
        id: doctor.id,
        userId: doctor.userId,
        name: `${doctor.user.firstName} ${doctor.user.lastName}`,
        experience: doctor.practicalExperience,
        specialty: specializationMap[doctor.specialization] ?? doctor.specialization,
        reviews: doctor._count.reviews,
        status: doctor.isAvailable ? 'نشط' : 'متوقف',
        isVerified: doctor.isVerified,
    }))

    return (
        <div className='px-4 md:px-10 py-4 md:py-8'>
            <div className='flex flex-wrap w-full gap-4'>
                {statsConfig.map((item, index) => (
                    <Card
                        key={index}
                        color={item.color}
                        circleColor={item.circleColor}
                        icon={item.icon}
                        title={item.title}
                        count={stats ? stats[item.key] : 0}
                        percentage={item.percentage}
                    />
                ))}
            </div>
            <div>
                {error && (
                    <div className='text-red-500 text-center py-4'>{error}</div>
                )}
                {/* Verified Filter Tabs */}
                <div className='flex gap-2 mb-4 mt-6' dir='rtl'>
                    {[
                        { label: 'الكل', value: undefined },
                        { label: 'موثق', value: true },
                        { label: 'غير موثق', value: false },
                    ].map((tab) => (
                        <button
                            key={String(tab.value)}
                            onClick={() => { setVerifiedFilter(tab.value); setPagination(p => ({ ...p, page: 1 })) }}
                            className={`px-4 py-1.5 rounded-full text-sm font-medium border transition-colors ${verifiedFilter === tab.value
                                ? 'bg-[#2B73F3] text-white border-[#2B73F3]'
                                : 'bg-white text-gray-600 border-gray-300 hover:border-[#2B73F3] hover:text-[#2B73F3]'
                                }`}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>
                {isLoading ? (
                    <div className='text-center py-10 text-gray-500'>جاري التحميل...</div>
                ) : (
                    <Table
                        tableHeader={
                            verifiedFilter === true ? 'الأطباء الموثقون' :
                            verifiedFilter === false ? 'الأطباء غير الموثقين' :
                            'قائمة الأطباء'
                        }
                        columns={[
                            { key: 'id', header: 'رقم الدكتور', width: '100px' },
                            { key: 'name', header: 'الاسم' },
                            { key: 'experience', header: 'الخبرة' },
                            { key: 'specialty', header: 'التخصص' },
                            { key: 'reviews', header: 'عدد التقييمات' },
                            {
                                key: 'isVerified',
                                header: 'التوثيق',
                                render: (row) => (
                                    <span className={`px-3 py-1 rounded-full text-sm font-medium inline-flex items-center gap-1 ${
                                        row.isVerified
                                        ? 'bg-green-100 text-green-700'
                                        : 'bg-yellow-100 text-yellow-700'
                                        }`}>
                                        {row.isVerified ? (
                                            <svg className='w-3.5 h-3.5' fill='currentColor' viewBox='0 0 20 20'><path fillRule='evenodd' d='M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z' clipRule='evenodd' /></svg>
                                        ) : (
                                            <svg className='w-3.5 h-3.5' fill='currentColor' viewBox='0 0 20 20'><path fillRule='evenodd' d='M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z' clipRule='evenodd' /></svg>
                                        )}
                                        {row.isVerified ? 'موثق' : 'غير موثق'}
                                    </span>
                                )
                            },
                            {
                                key: 'status',
                                header: 'الحالة',
                                render: (row) => (
                                    <span className={`px-3 py-1 rounded-full text-sm font-medium inline-flex items-center gap-1 ${row.status === 'نشط'
                                        ? 'bg-green-100 text-green-700'
                                        : 'bg-red-100 text-red-700'
                                        }`}>
                                        <span className={`w-2 h-2 rounded-full ${row.status === 'نشط' ? 'bg-green-500' : 'bg-red-500'}`} />
                                        {row.status}
                                    </span>
                                )
                            }
                        ]}
                        totalCount={pagination.total}
                        data={tableRows}
                        actionsHeader="الإجراءات"
                        actions={[
                            {
                                label: "عرض التفاصيل",
                                onClick: (row) => {
                                    navigate(`/doctors/${row.userId}`)
                                }
                            }
                        ]}
                    />
                )}
            </div>
        </div>
    )
}
