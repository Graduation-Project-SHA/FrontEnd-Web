import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axiosInstance from '../../utils/axiosInstance'

interface User {
  id: number
  firstName: string
  lastName: string
  email: string
  phone: string
  profileImage?: string
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
  price: number
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
  reason?: string
  notes?: string
  diagnosis?: string
  cancellationReason?: string
  patientProfile: PatientProfile
  doctorProfile: DoctorProfile
  service?: Service
  createdAt: string
  updatedAt: string
}

interface PaginatedResponse {
  data: Appointment[]
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}

interface Stats {
  total: number
  pending: number
  confirmed: number
  completed: number
  cancelled: number
  today: number
  upcoming: number
}

export default function AdminAppointments() {
  const [appointments, setAppointments] = useState<Appointment[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [page, setPage] = useState<number>(1)
  const [limit] = useState<number>(10)
  const [totalPages, setTotalPages] = useState<number>(1)
  const [total, setTotal] = useState<number>(0)
  const [stats, setStats] = useState<Stats | null>(null)
  const [statsLoading, setStatsLoading] = useState(false)

  // Filters
  const [statusFilter, setStatusFilter] = useState<string>('')
  const [fromDate, setFromDate] = useState<string>('')
  const [toDate, setToDate] = useState<string>('')
  const [dateFilter, setDateFilter] = useState<string>('')

  // Delete modal
  const [deleteModal, setDeleteModal] = useState<{ show: boolean; id?: number }>({ show: false })
  const [isDeleting, setIsDeleting] = useState(false)

  const navigate = useNavigate()
  const hasPreviousPage = page > 1
  const hasNextPage = page < totalPages

  useEffect(() => {
    fetchAppointments(page)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, statusFilter, fromDate, toDate, dateFilter])

  useEffect(() => {
    fetchStats()
  }, [])

  const fetchAppointments = async (pageNum: number) => {
    setIsLoading(true)
    setError(null)
    try {
      const params: any = { page: pageNum, limit }
      if (statusFilter) params.status = statusFilter
      if (dateFilter) params.date = dateFilter
      if (fromDate) params.from = fromDate
      if (toDate) params.to = toDate

      const response = await axiosInstance.get<PaginatedResponse>('/admin/appointments', { params })
      setAppointments(response.data.data)
      setTotal(response.data.pagination.total)
      setTotalPages(response.data.pagination.totalPages)
    } catch (err: any) {
      console.error('Error fetching appointments:', err)
      setError(err?.response?.data?.message || 'فشل في تحميل المواعيد')
    } finally {
      setIsLoading(false)
    }
  }

  const fetchStats = async () => {
    setStatsLoading(true)
    try {
      const response = await axiosInstance.get('/admin/appointments/statistics')
      setStats(response.data)
    } catch (err: any) {
      console.error('Error fetching stats:', err)
    } finally {
      setStatsLoading(false)
    }
  }

  const handleStatusChange = async (appointmentId: number, newStatus: string) => {
    try {
      await axiosInstance.patch(`/admin/appointments/${appointmentId}/status`, {
        status: newStatus,
      })
      // Refresh the list
      fetchAppointments(page)
      fetchStats()
    } catch (err: any) {
      console.error('Error updating status:', err)
      setError(err?.response?.data?.message || 'فشل في تحديث الحالة')
    }
  }

  const handleDeleteClick = (id: number) => {
    setDeleteModal({ show: true, id })
  }

  const confirmDelete = async () => {
    if (!deleteModal.id) return

    setIsDeleting(true)
    try {
      await axiosInstance.delete(`/admin/appointments/${deleteModal.id}`)
      setDeleteModal({ show: false })
      fetchAppointments(page)
      fetchStats()
    } catch (err: any) {
      console.error('Error deleting appointment:', err)
      setError(err?.response?.data?.message || 'فشل في حذف الموعد')
    } finally {
      setIsDeleting(false)
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

  if (isLoading && page === 1) {
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

  return (
    <div className='p-8 font-["SFArabic-Regular"]' dir='rtl'>
      {/* Header */}
      <div className='mb-8 flex justify-between items-center'>
        <div>
          <h1 className='text-3xl font-bold text-[#0067FF] mb-2'>المواعيد الطبية</h1>
          <p className='text-gray-600'>تتبع المواعيد بين الأطباء والمرضى</p>
        </div>
      </div>

      {/* Statistics Cards */}
      {stats && !statsLoading && (
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8'>
          <div className='bg-white rounded-lg shadow p-6 border-r-4 border-blue-500'>
            <div className='flex items-center justify-between'>
              <div>
                <p className='text-gray-600 text-sm'>إجمالي المواعيد</p>
                <p className='text-2xl font-bold text-gray-900'>{stats.total}</p>
              </div>
              <div className='bg-blue-100 rounded-full p-3'>
                <svg className='w-6 h-6 text-blue-600' fill='currentColor' viewBox='0 0 20 20'>
                  <path d='M10.5 1.5H3.75A2.25 2.25 0 001.5 3.75v12.5A2.25 2.25 0 003.75 18.5h12.5a2.25 2.25 0 002.25-2.25V9.5m-15-6h15m-15 4.5h15M10 14.5h7.5' />
                </svg>
              </div>
            </div>
          </div>

          <div className='bg-white rounded-lg shadow p-6 border-r-4 border-yellow-500'>
            <div className='flex items-center justify-between'>
              <div>
                <p className='text-gray-600 text-sm'>قيد الانتظار</p>
                <p className='text-2xl font-bold text-gray-900'>{stats.pending}</p>
              </div>
              <div className='bg-yellow-100 rounded-full p-3'>
                <svg className='w-6 h-6 text-yellow-600' fill='currentColor' viewBox='0 0 20 20'>
                  <path d='M10 18a8 8 0 100-16 8 8 0 000 16zm0-2a6 6 0 100-12 6 6 0 000 12z' />
                </svg>
              </div>
            </div>
          </div>

          <div className='bg-white rounded-lg shadow p-6 border-r-4 border-green-500'>
            <div className='flex items-center justify-between'>
              <div>
                <p className='text-gray-600 text-sm'>مكتمل</p>
                <p className='text-2xl font-bold text-gray-900'>{stats.completed}</p>
              </div>
              <div className='bg-green-100 rounded-full p-3'>
                <svg className='w-6 h-6 text-green-600' fill='currentColor' viewBox='0 0 20 20'>
                  <path d='M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z' />
                </svg>
              </div>
            </div>
          </div>

          <div className='bg-white rounded-lg shadow p-6 border-r-4 border-red-500'>
            <div className='flex items-center justify-between'>
              <div>
                <p className='text-gray-600 text-sm'>ملغى</p>
                <p className='text-2xl font-bold text-gray-900'>{stats.cancelled}</p>
              </div>
              <div className='bg-red-100 rounded-full p-3'>
                <svg className='w-6 h-6 text-red-600' fill='currentColor' viewBox='0 0 20 20'>
                  <path d='M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z' />
                </svg>
              </div>
            </div>
          </div>
        </div>
      )}

      {error && (
        <div className='bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4'>
          {error}
        </div>
      )}

      {/* Filters */}
      <div className='bg-white rounded-lg shadow p-6 mb-6 border border-gray-100'>
        <h3 className='text-lg font-semibold text-gray-900 mb-4'>المرشحات</h3>
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4'>
          <div>
            <label className='block text-sm font-medium text-gray-700 mb-2'>الحالة</label>
            <select
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value)
                setPage(1)
              }}
              className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0067FF] text-right'
            >
              <option value=''>الكل</option>
              <option value='PENDING'>قيد الانتظار</option>
              <option value='CONFIRMED'>مؤكد</option>
              <option value='COMPLETED'>مكتمل</option>
              <option value='CANCELLED'>ملغى</option>
              <option value='RESCHEDULED'>معاد الجدولة</option>
            </select>
          </div>

          <div>
            <label className='block text-sm font-medium text-gray-700 mb-2'>من التاريخ</label>
            <input
              type='date'
              value={fromDate}
              onChange={(e) => {
                setFromDate(e.target.value)
                setPage(1)
              }}
              className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0067FF] text-right'
            />
          </div>

          <div>
            <label className='block text-sm font-medium text-gray-700 mb-2'>إلى التاريخ</label>
            <input
              type='date'
              value={toDate}
              onChange={(e) => {
                setToDate(e.target.value)
                setPage(1)
              }}
              className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0067FF] text-right'
            />
          </div>

          <div className='flex items-end'>
            <button
              onClick={() => {
                setStatusFilter('')
                setFromDate('')
                setToDate('')
                setDateFilter('')
                setPage(1)
              }}
              className='w-full bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300 transition-colors'
            >
              مسح المرشحات
            </button>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className='bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden'>
        <div className='overflow-x-auto'>
          <table className='min-w-full text-right'>
            <thead className='bg-gray-50 text-gray-700'>
              <tr>
                <th className='px-6 py-3 text-sm font-semibold'>#</th>
                <th className='px-6 py-3 text-sm font-semibold'>المريض</th>
                <th className='px-6 py-3 text-sm font-semibold'>الطبيب</th>
                <th className='px-6 py-3 text-sm font-semibold'>التاريخ</th>
                <th className='px-6 py-3 text-sm font-semibold'>الوقت</th>
                <th className='px-6 py-3 text-sm font-semibold'>الخدمة</th>
                <th className='px-6 py-3 text-sm font-semibold'>الحالة</th>
                <th className='px-6 py-3 text-sm font-semibold'>الإجراءات</th>
              </tr>
            </thead>
            <tbody className='divide-y divide-gray-100'>
              {appointments.map((appt, idx) => (
                <tr key={appt.id} className='hover:bg-gray-50'>
                  <td className='px-6 py-4 text-gray-600'>{(page - 1) * limit + idx + 1}</td>
                  <td className='px-6 py-4'>
                    <div className='font-semibold text-gray-900'>
                      {appt.patientProfile.user.firstName} {appt.patientProfile.user.lastName}
                    </div>
                    <div className='text-sm text-gray-500'>{appt.patientProfile.user.email}</div>
                  </td>
                  <td className='px-6 py-4'>
                    <div className='font-semibold text-gray-900'>
                      {appt.doctorProfile.user.firstName} {appt.doctorProfile.user.lastName}
                    </div>
                    <div className='text-sm text-gray-500'>{appt.doctorProfile.user.email}</div>
                  </td>
                  <td className='px-6 py-4 text-gray-700'>{formatDate(appt.appointmentDate)}</td>
                  <td className='px-6 py-4 text-gray-700'>
                    {appt.startTime} - {appt.endTime}
                  </td>
                  <td className='px-6 py-4 text-gray-700'>{appt.service?.name || '-'}</td>
                  <td className='px-6 py-4'>
                    <select
                      value={appt.status}
                      onChange={(e) => handleStatusChange(appt.id, e.target.value)}
                      className={`text-xs px-3 py-1 rounded-full font-medium ${getStatusColor(appt.status)} border-0 cursor-pointer`}
                    >
                      <option value='PENDING'>قيد الانتظار</option>
                      <option value='CONFIRMED'>مؤكد</option>
                      <option value='COMPLETED'>مكتمل</option>
                      <option value='CANCELLED'>ملغى</option>
                      <option value='RESCHEDULED'>معاد الجدولة</option>
                    </select>
                  </td>
                  <td className='px-6 py-4'>
                    <div className='flex gap-2'>
                      <button
                        onClick={() => navigate(`/admin/appointments/${appt.id}`)}
                        className='text-[#0067FF] hover:text-[#0052CC] text-sm font-medium'
                      >
                        عرض
                      </button>
                      <button
                        onClick={() => handleDeleteClick(appt.id)}
                        className='text-red-600 hover:text-red-800 text-sm font-medium'
                      >
                        حذف
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {appointments.length === 0 && (
                <tr>
                  <td colSpan={8} className='px-6 py-8 text-center text-gray-500'>لا توجد مواعيد</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className='flex items-center justify-between px-6 py-4 border-t border-gray-100 bg-white'>
          <div className='text-sm text-gray-600'>
            الصفحة {page} من {totalPages} — إجمالي {total} موعد
          </div>
          <div className='flex gap-2'>
            <button
              className='px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed'
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={!hasPreviousPage}
            >
              السابق
            </button>
            <button
              className='px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed'
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={!hasNextPage}
            >
              التالي
            </button>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteModal.show && (
        <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4'>
          <div className='bg-white rounded-2xl shadow-2xl p-6 max-w-sm w-full'>
            <div className='flex items-center justify-center h-12 w-12 rounded-full bg-red-100 mx-auto mb-4'>
              <svg className='h-6 w-6 text-red-600' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16' />
              </svg>
            </div>
            <h3 className='text-xl font-bold text-gray-900 mb-2 text-center'>تأكيد الحذف</h3>
            <p className='text-gray-600 mb-6 text-center'>هل أنت متأكد من رغبتك في حذف هذا الموعد؟ لا يمكن التراجع عن هذا الإجراء.</p>
            <div className='flex gap-3 justify-end'>
              <button
                onClick={() => setDeleteModal({ show: false })}
                disabled={isDeleting}
                className='px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 transition-colors font-medium'
              >
                إلغاء
              </button>
              <button
                onClick={confirmDelete}
                disabled={isDeleting}
                className='inline-flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 transition-colors font-medium'
              >
                <svg className='h-4 w-4' fill='currentColor' viewBox='0 0 20 20'>
                  <path fillRule='evenodd' d='M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z' clipRule='evenodd' />
                </svg>
                {isDeleting ? 'جاري الحذف...' : 'حذف'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
