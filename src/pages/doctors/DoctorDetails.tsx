import React from 'react'
import { useParams, Link } from 'react-router-dom'
import axios from 'axios'
import config from '../../config'

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

const genderMap: Record<string, string> = {
    MALE: 'ذكر',
    FEMALE: 'أنثى',
}

interface DoctorDetail {
    id: number
    userId: number
    specialization: string
    bio: string
    practicalExperience: string
    clinicName: string | null
    clinicAddress: string | null
    latitude: number | null
    longitude: number | null
    syndicateCardUrl: string | null
    isVerified: boolean
    isAvailable: boolean
    createdAt: string
    updatedAt: string
    averageRating: number
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
        createdAt: string
    }
    services: { id: number; name: string; price: number }[]
    availabilities: { id: number; day: string; startTime: string; endTime: string }[]
    reviews: { id: number; rating: number; comment: string }[]
    _count: { reviews: number }
}

function InfoRow({ label, value }: { label: string; value: React.ReactNode }) {
    return (
        <div className='flex items-start gap-2 py-2 border-b border-gray-100 last:border-0'>
            <span className='text-gray-500 text-sm min-w-[140px]'>{label}</span>
            <span className='text-gray-800 text-sm font-medium flex-1'>{value ?? '—'}</span>
        </div>
    )
}

export default function DoctorDetails() {
    const { id } = useParams<{ id: string }>()
    const [doctor, setDoctor] = React.useState<DoctorDetail | null>(null)
    const [isLoading, setIsLoading] = React.useState(true)
    const [error, setError] = React.useState<string | null>(null)
    const [verifying, setVerifying] = React.useState(false)

    const [imgError, setImgError] = React.useState(false)

    React.useEffect(() => {
        const fetchDoctor = async () => {
            setIsLoading(true)
            try {
                const token = localStorage.getItem('accessToken')
                const response = await axios.get(`${config.apiBaseUrl}/admin/doctors/${id}`, {
                    headers: { Authorization: `Bearer ${token}` }
                })
                setDoctor(response.data.data)
            } catch (err) {
                console.error('Failed to fetch doctor:', err)
                setError('فشل تحميل بيانات الطبيب')
            } finally {
                setIsLoading(false)
            }
        }
        fetchDoctor()
    }, [id])

    const handleVerifyToggle = async () => {
        if (!doctor) return
        setVerifying(true)
        try {
            const token = localStorage.getItem('accessToken')
            await axios.patch(
                `${config.apiBaseUrl}/admin/doctors/${id}/verify`,
                { isVerified: !doctor.isVerified },
                { headers: { Authorization: `Bearer ${token}` } }
            )
            setDoctor({ ...doctor, isVerified: !doctor.isVerified })
        } catch (err) {
            console.error('Failed to update verification:', err)
        } finally {
            setVerifying(false)
        }
    }

    if (isLoading) {
        return <div className='flex justify-center items-center h-64 text-gray-500'>جاري التحميل...</div>
    }

    if (error || !doctor) {
        return <div className='flex justify-center items-center h-64 text-red-500'>{error ?? 'لم يتم العثور على الطبيب'}</div>
    }

    const profileImageUrl = doctor.user.profileImage
        ? `${config.apiBaseUrl}${doctor.user.profileImage}`
        : null

    const syndicateUrl = doctor.syndicateCardUrl
        ? `${config.apiBaseUrl}${doctor.syndicateCardUrl}`
        : null

    return (
        <div className='px-4 md:px-8 py-4 md:py-6' dir='rtl'>
            {/* Breadcrumb */}
            <div className='flex items-center gap-2 text-sm text-gray-500 mb-6'>
                <Link to='/doctors' className='hover:text-[#2B73F3] transition-colors'>الأطباء</Link>
                <span>/</span>
                <span className='text-gray-800 font-medium'>{doctor.user.firstName} {doctor.user.lastName}</span>
            </div>

            {/* Header Card */}
            <div className='bg-white rounded-2xl shadow-sm border border-gray-100 p-4 md:p-6 mb-6 flex flex-col sm:flex-row items-center gap-4 md:gap-6'>
                {profileImageUrl && !imgError ? (
                    <img
                        src={profileImageUrl}
                        alt='profile'
                        className='w-24 h-24 rounded-full object-cover border-4 border-[#E8F4FD]'
                        onError={() => setImgError(true)}
                    />
                ) : (
                    <div className='w-24 h-24 rounded-full bg-[#E8F4FD] flex items-center justify-center text-3xl text-[#2B73F3] font-bold'>
                        {doctor.user.firstName.charAt(0).toUpperCase()}
                    </div>
                )}
                <div className='flex-1'>
                    <div className='flex items-center gap-3 flex-wrap'>
                        <h1 className='text-2xl font-bold text-gray-800'>
                            {doctor.user.firstName} {doctor.user.lastName}
                        </h1>
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${doctor.isVerified ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                            {doctor.isVerified ? 'موثق' : 'غير موثق'}
                        </span>
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${doctor.isAvailable ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-500'}`}>
                            {doctor.isAvailable ? 'متاح' : 'غير متاح'}
                        </span>
                    </div>
                    <p className='text-[#2B73F3] font-medium mt-1'>
                        {specializationMap[doctor.specialization] ?? doctor.specialization}
                    </p>
                    <div className='flex items-center gap-1 mt-1'>
                        <span className='text-yellow-400'>★</span>
                        <span className='text-sm text-gray-600'>{doctor.averageRating.toFixed(1)} ({doctor._count.reviews} تقييم)</span>
                    </div>
                </div>
                <button
                    onClick={handleVerifyToggle}
                    disabled={verifying}
                    className={`px-5 py-2 rounded-xl text-sm font-medium transition-colors disabled:opacity-50 ${doctor.isVerified
                        ? 'bg-red-50 text-red-600 hover:bg-red-100 border border-red-200'
                        : 'bg-[#2B73F3] text-white hover:bg-blue-700'
                        }`}
                >
                    {verifying ? '...' : doctor.isVerified ? 'إلغاء التوثيق' : 'توثيق الطبيب'}
                </button>
            </div>

            <div className='grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6'>
                {/* Personal Info */}
                <div className='bg-white rounded-2xl shadow-sm border border-gray-100 p-6'>
                    <h2 className='text-base font-bold text-gray-700 mb-4'>المعلومات الشخصية</h2>
                    <InfoRow label='البريد الإلكتروني' value={doctor.user.email} />
                    <InfoRow label='رقم الهاتف' value={doctor.user.phone} />
                    <InfoRow label='الجنس' value={genderMap[doctor.user.gender] ?? doctor.user.gender} />
                    <InfoRow label='تاريخ الميلاد' value={new Date(doctor.user.dateOfBirth).toLocaleDateString('ar-EG')} />
                    <InfoRow label='العنوان' value={doctor.user.address} />
                    <InfoRow label='البريد موثق' value={doctor.user.isEmailVerified ? 'نعم' : 'لا'} />
                    <InfoRow label='تاريخ التسجيل' value={new Date(doctor.user.createdAt).toLocaleDateString('ar-EG')} />
                </div>

                {/* Professional Info */}
                <div className='bg-white rounded-2xl shadow-sm border border-gray-100 p-6'>
                    <h2 className='text-base font-bold text-gray-700 mb-4'>المعلومات المهنية</h2>
                    <InfoRow label='التخصص' value={specializationMap[doctor.specialization] ?? doctor.specialization} />
                    <InfoRow label='الخبرة العملية' value={doctor.practicalExperience} />
                    <InfoRow label='نبذة' value={doctor.bio} />
                    <InfoRow label='اسم العيادة' value={doctor.clinicName} />
                    <InfoRow label='عنوان العيادة' value={doctor.clinicAddress} />
                    {doctor.latitude && doctor.longitude && (
                        <InfoRow
                            label='الموقع'
                            value={
                                <a
                                    href={`https://maps.google.com/?q=${doctor.latitude},${doctor.longitude}`}
                                    target='_blank'
                                    rel='noreferrer'
                                    className='text-[#2B73F3] underline'
                                >
                                    عرض على الخريطة
                                </a>
                            }
                        />
                    )}
                </div>

                {/* Syndicate Card */}
                {syndicateUrl && (
                    <div className='bg-white rounded-2xl shadow-sm border border-gray-100 p-6'>
                        <h2 className='text-base font-bold text-gray-700 mb-4'>بطاقة النقابة</h2>
                        {syndicateUrl.endsWith('.pdf') ? (
                            <a
                                href={syndicateUrl}
                                target='_blank'
                                rel='noreferrer'
                                className='flex items-center gap-2 text-[#2B73F3] hover:underline'
                            >
                                <svg className='w-5 h-5' fill='currentColor' viewBox='0 0 20 20'>
                                    <path fillRule='evenodd' d='M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z' clipRule='evenodd' />
                                </svg>
                                عرض ملف PDF
                            </a>
                        ) : (
                            <img
                                src={syndicateUrl}
                                alt='syndicate card'
                                className='max-w-full rounded-lg'
                                onError={(e) => {
                                    e.currentTarget.style.display = 'none'
                                    e.currentTarget.insertAdjacentHTML('afterend', '<p class="text-sm text-gray-400">تعذر تحميل الصورة</p>')
                                }}
                            />
                        )}
                    </div>
                )}

                {/* Services */}
                <div className='bg-white rounded-2xl shadow-sm border border-gray-100 p-6'>
                    <h2 className='text-base font-bold text-gray-700 mb-4'>الخدمات ({doctor.services.length})</h2>
                    {doctor.services.length === 0 ? (
                        <p className='text-sm text-gray-400'>لا توجد خدمات مضافة</p>
                    ) : (
                        <div className='flex flex-col gap-2'>
                            {doctor.services.map((s) => (
                                <div key={s.id} className='flex justify-between items-center py-2 border-b border-gray-100 last:border-0'>
                                    <span className='text-sm text-gray-700'>{s.name}</span>
                                    <span className='text-sm font-medium text-[#2B73F3]'>{s.price} ج.م</span>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Availabilities */}
                <div className='bg-white rounded-2xl shadow-sm border border-gray-100 p-6'>
                    <h2 className='text-base font-bold text-gray-700 mb-4'>مواعيد العمل ({doctor.availabilities.length})</h2>
                    {doctor.availabilities.length === 0 ? (
                        <p className='text-sm text-gray-400'>لا توجد مواعيد مضافة</p>
                    ) : (
                        <div className='flex flex-col gap-2'>
                            {doctor.availabilities.map((a) => (
                                <div key={a.id} className='flex justify-between items-center py-2 border-b border-gray-100 last:border-0'>
                                    <span className='text-sm text-gray-700'>{a.day}</span>
                                    <span className='text-sm text-gray-500'>{a.startTime} – {a.endTime}</span>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Reviews */}
                <div className='bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:col-span-2'>
                    <h2 className='text-base font-bold text-gray-700 mb-4'>التقييمات ({doctor._count.reviews})</h2>
                    {doctor.reviews.length === 0 ? (
                        <p className='text-sm text-gray-400'>لا توجد تقييمات بعد</p>
                    ) : (
                        <div className='flex flex-col gap-3'>
                            {doctor.reviews.map((r) => (
                                <div key={r.id} className='flex gap-3 p-3 bg-gray-50 rounded-xl'>
                                    <span className='text-yellow-400 font-bold'>{r.rating}★</span>
                                    <p className='text-sm text-gray-700'>{r.comment}</p>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
