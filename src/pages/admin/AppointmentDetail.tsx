import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import axiosInstance from '../../utils/axiosInstance'

interface User {
  id: number
  firstName: string
  lastName: string
  email: string
  phone: string
  gender?: string
  dateOfBirth?: string
  profileImage?: string
  address?: string
}

interface PatientProfile {
  user: User
}

interface DoctorProfile {
  user: User
}

interface Service {
  id: number
  name: string
  price: number | string
  duration: number
}

interface Appointment {
  id: number
  patientProfileId: number
  doctorProfileId: number
  serviceId?: number
  appointmentDate: string
  startTime: string
  endTime: string
  status: 'PENDING' | 'CONFIRMED' | 'COMPLETED' | 'CANCELLED' | 'RESCHEDULED'
  reason?: string | null
  notes?: string | null
  diagnosis?: string | null
  cancellationReason?: string | null
  patientProfile?: PatientProfile | null
  doctorProfile?: DoctorProfile | null
  service?: Service | null
  createdAt: string
  updatedAt: string
}

export default function AppointmentDetail() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [appointment, setAppointment] = useState<Appointment | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isUpdating, setIsUpdating] = useState(false)
  const [newStatus, setNewStatus] = useState<string>('')
  const [showStatusModal, setShowStatusModal] = useState(false)
  const [notes, setNotes] = useState<string>('')
  const [diagnosis, setDiagnosis] = useState<string>('')

  useEffect(() => {
    if (id) {
      fetchAppointment()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id])

  const fetchAppointment = async () => {
    if (!id) return
    setIsLoading(true)
    setError(null)
    try {
      const response = await axiosInstance.get(`/admin/appointments/${id}`)
      const appointmentData = (response.data as { data?: Appointment })?.data ?? response.data
      if (!appointmentData || typeof appointmentData !== 'object') {
        throw new Error('Invalid appointment response')
      }
      setAppointment(appointmentData as Appointment)
      setNewStatus((appointmentData as Appointment).status || '')
      setNotes((appointmentData as Appointment).notes ?? '')
      setDiagnosis((appointmentData as Appointment).diagnosis ?? '')
    } catch (err: any) {
      console.error('Error fetching appointment:', err)
      setError(err?.response?.data?.message || 'فشل في تحميل تفاصيل الموعد')
    } finally {
      setIsLoading(false)
    }
  }

  const handleStatusUpdate = async () => {
    if (!id) return
    setIsUpdating(true)
    try {
      await axiosInstance.patch(`/admin/appointments/${id}/status`, {
        status: newStatus,
      })
      setShowStatusModal(false)
      fetchAppointment()
    } catch (err: any) {
      console.error('Error updating status:', err)
      setError(err?.response?.data?.message || 'فشل في تحديث الحالة')
    } finally {
      setIsUpdating(false)
    }
  }

  const formatDate = (iso: string) => {
    try {
      const d = new Date(iso)
      return d.toLocaleDateString('ar-EG', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
      })
    } catch {
      return iso
    }
  }

  const formatDateTime = (iso: string) => {
    try {
      const d = new Date(iso)
      return d.toLocaleString('ar-EG', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
      })
    } catch {
      return iso
    }
  }

  const formatCurrency = (price?: string | number | null) => {
    if (price === null || price === undefined) return '-'
    const value = typeof price === 'string' ? Number(price) : price
    if (!Number.isFinite(value)) return String(price)
    return `${value.toLocaleString('ar-EG')} جنيه`
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PENDING':
        return 'bg-yellow-100 text-yellow-800'
      case 'CONFIRMED':
        return 'bg-blue-100 text-blue-800'
      case 'COMPLETED':
        return 'bg-green-100 text-green-800'
      case 'CANCELLED':
        return 'bg-red-100 text-red-800'
      case 'RESCHEDULED':
        return 'bg-purple-100 text-purple-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'PENDING':
        return 'قيد الانتظار'
      case 'CONFIRMED':
        return 'مؤكد'
      case 'COMPLETED':
        return 'مكتمل'
      case 'CANCELLED':
        return 'ملغى'
      case 'RESCHEDULED':
        return 'معاد الجدولة'
      default:
        return status
    }
  }

  if (isLoading) {
    return (
      <div className='flex justify-center items-center h-screen'>
        <div className='flex flex-col items-center gap-4'>
          <svg
            className='animate-spin h-12 w-12 text-[#0067FF]'
            xmlns='http://www.w3.org/2000/svg'
            fill='none'
            viewBox='0 0 24 24'
          >
            <circle className='opacity-25' cx='12' cy='12' r='10' stroke='currentColor' strokeWidth='4'></circle>
            <path
              className='opacity-75'
              fill='currentColor'
              d='M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z'
            ></path>
          </svg>
          <p className='text-gray-600'>جاري التحميل...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className='p-8 font-["SFArabic-Regular"]' dir='rtl'>
        <button
          onClick={() => navigate('/admin/appointments')}
          className='text-[#0067FF] hover:text-[#0052CC] mb-6 flex items-center gap-2'
        >
          <svg className='w-5 h-5' fill='currentColor' viewBox='0 0 20 20'>
            <path d='M10.707 1.293a1 1 0 00-1.414 0l-6 6a1 1 0 101.414 1.414L9 3.414V16a1 1 0 102 0V3.414l4.293 4.293a1 1 0 001.414-1.414l-6-6z' />
          </svg>
          العودة
        </button>
        <div className='bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg'>{error}</div>
      </div>
    )
  }

  if (!appointment) {
    return (
      <div className='p-8 font-["SFArabic-Regular"]' dir='rtl'>
        <button
          onClick={() => navigate('/admin/appointments')}
          className='text-[#0067FF] hover:text-[#0052CC] mb-6 flex items-center gap-2'
        >
          <svg className='w-5 h-5' fill='currentColor' viewBox='0 0 20 20'>
            <path d='M10.707 1.293a1 1 0 00-1.414 0l-6 6a1 1 0 101.414 1.414L9 3.414V16a1 1 0 102 0V3.414l4.293 4.293a1 1 0 001.414-1.414l-6-6z' />
          </svg>
          العودة
        </button>
        <div className='text-gray-600 text-lg'>الموعد غير موجود</div>
      </div>
    )
  }

  return (
    <div className='p-8 font-["SFArabic-Regular"]' dir='rtl'>
      {/* Header */}
      <button
        onClick={() => navigate('/admin/appointments')}
        className='text-[#0067FF] hover:text-[#0052CC] mb-6 flex items-center gap-2'
      >
        <svg className='w-5 h-5' fill='currentColor' viewBox='0 0 20 20'>
          <path d='M10.707 1.293a1 1 0 00-1.414 0l-6 6a1 1 0 101.414 1.414L9 3.414V16a1 1 0 102 0V3.414l4.293 4.293a1 1 0 001.414-1.414l-6-6z' />
        </svg>
        العودة للمواعيد
      </button>

      <div className='mb-8'>
        <h1 className='text-3xl font-bold text-[#0067FF] mb-2'>تفاصيل الموعد</h1>
        <p className='text-gray-600'>رقم الموعد: {appointment.id}</p>
      </div>

      {error && (
        <div className='bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4'>
          {error}
        </div>
      )}

      <div className='grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6'>
        {/* Appointment Info */}
        <div className='bg-white rounded-lg shadow p-6 border border-gray-100'>
          <h2 className='text-xl font-bold text-gray-900 mb-6'>معلومات الموعد</h2>

          <div className='space-y-4'>
            <div className='flex justify-between items-center pb-4 border-b border-gray-100'>
              <span className='text-gray-600 font-medium'>الحالة</span>
              <span className={`px-4 py-2 rounded-full text-sm font-semibold ${getStatusColor(appointment.status)}`}>
                {getStatusLabel(appointment.status)}
              </span>
            </div>

            <div className='flex justify-between items-center pb-4 border-b border-gray-100'>
              <span className='text-gray-600 font-medium'>التاريخ والوقت</span>
              <span className='text-gray-900 font-semibold'>{formatDate(appointment.appointmentDate)}</span>
            </div>

            <div className='flex justify-between items-center pb-4 border-b border-gray-100'>
              <span className='text-gray-600 font-medium'>الوقت</span>
              <span className='text-gray-900 font-semibold'>
                {appointment.startTime} - {appointment.endTime}
              </span>
            </div>

            <div className='flex justify-between items-center pb-4 border-b border-gray-100'>
              <span className='text-gray-600 font-medium'>الخدمة</span>
              <span className='text-gray-900 font-semibold'>{appointment.service?.name || '-'}</span>
            </div>

            {appointment.service && (
              <div className='flex justify-between items-center pb-4 border-b border-gray-100'>
                <span className='text-gray-600 font-medium'>السعر</span>
                <span className='text-gray-900 font-semibold'>{formatCurrency(appointment.service.price)}</span>
              </div>
            )}

            <div className='flex justify-between items-center pb-4 border-b border-gray-100'>
              <span className='text-gray-600 font-medium'>تاريخ الإنشاء</span>
              <span className='text-gray-900 font-semibold'>{formatDateTime(appointment.createdAt)}</span>
            </div>

            <div className='flex justify-between items-center'>
              <span className='text-gray-600 font-medium'>آخر تحديث</span>
              <span className='text-gray-900 font-semibold'>{formatDateTime(appointment.updatedAt)}</span>
            </div>
          </div>

          <button
            onClick={() => setShowStatusModal(true)}
            className='w-full mt-6 bg-[#0067FF] text-white px-4 py-2 rounded-lg hover:bg-[#0052CC] transition-colors font-semibold'
          >
            تحديث الحالة
          </button>
        </div>

        {/* Patient & Doctor Info */}
        <div className='space-y-6'>
          {/* Patient Info */}
          {appointment.patientProfile?.user && (
            <div className='bg-white rounded-lg shadow p-6 border border-gray-100'>
              <h3 className='text-lg font-bold text-gray-900 mb-4'>معلومات المريض</h3>
              <div className='space-y-3'>
                <div className='flex justify-between items-center pb-3 border-b border-gray-100'>
                  <span className='text-gray-600'>الاسم</span>
                  <span className='text-gray-900 font-semibold'>
                    {appointment.patientProfile.user.firstName} {appointment.patientProfile.user.lastName}
                  </span>
                </div>
                <div className='flex justify-between items-center pb-3 border-b border-gray-100'>
                  <span className='text-gray-600'>البريد الإلكتروني</span>
                  <span className='text-gray-900 font-semibold'>{appointment.patientProfile.user.email}</span>
                </div>
                <div className='flex justify-between items-center pb-3 border-b border-gray-100'>
                  <span className='text-gray-600'>الهاتف</span>
                  <span className='text-gray-900 font-semibold'>{appointment.patientProfile.user.phone}</span>
                </div>
                {appointment.patientProfile.user.address && (
                  <div className='flex justify-between items-center pb-3 border-b border-gray-100'>
                    <span className='text-gray-600'>العنوان</span>
                    <span className='text-gray-900 font-semibold'>{appointment.patientProfile.user.address}</span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Doctor Info */}
          {appointment.doctorProfile?.user && (
            <div className='bg-white rounded-lg shadow p-6 border border-gray-100'>
              <h3 className='text-lg font-bold text-gray-900 mb-4'>معلومات الطبيب</h3>
              <div className='space-y-3'>
                <div className='flex justify-between items-center pb-3 border-b border-gray-100'>
                  <span className='text-gray-600'>الاسم</span>
                  <span className='text-gray-900 font-semibold'>
                    {appointment.doctorProfile.user.firstName} {appointment.doctorProfile.user.lastName}
                  </span>
                </div>
                <div className='flex justify-between items-center pb-3 border-b border-gray-100'>
                  <span className='text-gray-600'>البريد الإلكتروني</span>
                  <span className='text-gray-900 font-semibold'>{appointment.doctorProfile.user.email}</span>
                </div>
                <div className='flex justify-between items-center'>
                  <span className='text-gray-600'>الهاتف</span>
                  <span className='text-gray-900 font-semibold'>{appointment.doctorProfile.user.phone}</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Notes and Diagnosis */}
      <div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
        <div className='bg-white rounded-lg shadow p-6 border border-gray-100'>
          <h3 className='text-lg font-bold text-gray-900 mb-4'>سبب الموعد</h3>
          <p className='text-gray-700 whitespace-pre-line leading-relaxed'>{appointment.reason || '-'}</p>
        </div>

        <div className='bg-white rounded-lg shadow p-6 border border-gray-100'>
          <h3 className='text-lg font-bold text-gray-900 mb-4'>ملاحظات</h3>
          <p className='text-gray-700 whitespace-pre-line leading-relaxed'>{appointment.notes || '-'}</p>
        </div>

        {appointment.diagnosis && (
          <div className='bg-white rounded-lg shadow p-6 border border-gray-100'>
            <h3 className='text-lg font-bold text-gray-900 mb-4'>التشخيص</h3>
            <p className='text-gray-700 whitespace-pre-line leading-relaxed'>{appointment.diagnosis}</p>
          </div>
        )}

        {appointment.cancellationReason && (
          <div className='bg-white rounded-lg shadow p-6 border border-gray-100'>
            <h3 className='text-lg font-bold text-gray-900 mb-4'>سبب الإلغاء</h3>
            <p className='text-gray-700 whitespace-pre-line leading-relaxed'>{appointment.cancellationReason}</p>
          </div>
        )}
      </div>

      {/* Status Update Modal */}
      {showStatusModal && (
        <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4'>
          <div className='bg-white rounded-lg max-w-md w-full p-6'>
            <h2 className='text-xl font-bold text-gray-900 mb-4'>تحديث حالة الموعد</h2>

            <div className='mb-4'>
              <label className='block text-sm font-medium text-gray-700 mb-2'>الحالة الجديدة</label>
              <select
                value={newStatus}
                onChange={(e) => setNewStatus(e.target.value)}
                className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0067FF] text-right'
              >
                <option value='PENDING'>قيد الانتظار</option>
                <option value='CONFIRMED'>مؤكد</option>
                <option value='COMPLETED'>مكتمل</option>
                <option value='CANCELLED'>ملغى</option>
                <option value='RESCHEDULED'>معاد الجدولة</option>
              </select>
            </div>

            {newStatus === 'COMPLETED' && (
              <div className='mb-4'>
                <label className='block text-sm font-medium text-gray-700 mb-2'>التشخيص (اختياري)</label>
                <textarea
                  value={diagnosis}
                  onChange={(e) => setDiagnosis(e.target.value)}
                  placeholder='أدخل التشخيص هنا'
                  className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0067FF] text-right'
                  rows={3}
                />
              </div>
            )}

            {(newStatus === 'CANCELLED' || newStatus === 'RESCHEDULED') && (
              <div className='mb-4'>
                <label className='block text-sm font-medium text-gray-700 mb-2'>السبب (اختياري)</label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder='أدخل السبب هنا'
                  className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0067FF] text-right'
                  rows={3}
                />
              </div>
            )}

            <div className='flex gap-3 justify-end'>
              <button
                onClick={() => setShowStatusModal(false)}
                disabled={isUpdating}
                className='px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50'
              >
                إلغاء
              </button>
              <button
                onClick={handleStatusUpdate}
                disabled={isUpdating}
                className='px-4 py-2 bg-[#0067FF] text-white rounded-lg hover:bg-[#0052CC] disabled:opacity-50'
              >
                {isUpdating ? 'جاري التحديث...' : 'تحديث'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
