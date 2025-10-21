import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import config from '../../config'

interface RoleInfo {
	name: string
}

interface SystemUser {
	id: number
	name: string
	email: string
	isActive: boolean
	createdAt: string
	updatedAt: string
	role?: RoleInfo
}

interface PaginatedResponse {
	data: SystemUser[]
	total: number
	page: number
	limit: number
	totalPages: number
	hasNextPage: boolean
	hasPreviousPage: boolean
	currentPage: number
}

export default function SystemUsers() {
	const [users, setUsers] = useState<SystemUser[]>([])
	const [isLoading, setIsLoading] = useState(false)
	const [error, setError] = useState<string | null>(null)
	const [page, setPage] = useState<number>(1)
	const [limit] = useState<number>(10)
	const [totalPages, setTotalPages] = useState<number>(1)
	const [hasNextPage, setHasNextPage] = useState<boolean>(false)
	const [hasPreviousPage, setHasPreviousPage] = useState<boolean>(false)
	const [total, setTotal] = useState<number>(0)
	const navigate = useNavigate()

	useEffect(() => {
		fetchUsers(page)
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [page])

	const fetchUsers = async (pageNum: number) => {
		setIsLoading(true)
		setError(null)
		try {
			const response = await axios.get<PaginatedResponse>(`${config.apiBaseUrl}/admin/admins`, {
				params: { page: pageNum, limit },
				headers: {
					authorization: `Bearer ${localStorage.getItem('accessToken')}`,
				},
			})
			const res = response.data
			setUsers(res.data)
			setTotal(res.total)
			setTotalPages(res.totalPages)
			setHasNextPage(res.hasNextPage)
			setHasPreviousPage(res.hasPreviousPage)
		} catch (err: any) {
			console.error('Error fetching system users:', err)
			setError(err?.response?.data?.message || 'فشل في تحميل المستخدمين')
		} finally {
			setIsLoading(false)
		}
	}

	const formatDate = (iso?: string) => {
		if (!iso) return '-'
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

	if (isLoading) {
		return (
			<div className='flex justify-center items-center h-screen'>
				<div className='flex flex-col items-center gap-4'>
					<svg className="animate-spin h-12 w-12 text-[#0067FF]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
						<circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
						<path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
					</svg>
					<p className='text-gray-600'>جاري التحميل...</p>
				</div>
			</div>
		)
	}

	if (error) {
		return (
			<div className='flex justify-center items-center h-screen'>
				<div className='text-red-500 text-xl'>{error}</div>
			</div>
		)
	}

	return (
		<div className='p-8 font-["SFArabic-Regular"]' dir='rtl'>
			<div className='mb-8 flex justify-between items-center'>
				<div>
					<h1 className='text-3xl font-bold text-[#0067FF] mb-2'>مديرو النظام</h1>
					<p className='text-gray-600'>قائمة مستخدمي النظام وأدوارهم</p>
				</div>
				<button
					onClick={() => navigate('/admins/create')}
					className='bg-[#0067FF] text-white px-6 py-3 rounded-lg font-semibold hover:bg-[#0052CC] transition-colors flex items-center gap-2'
				>
					<svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
						<path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
					</svg>
					إضافة مستخدم
				</button>
			</div>

			<div className='bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden'>
				<div className='overflow-x-auto'>
					<table className='min-w-full text-right'>
						<thead className='bg-gray-50 text-gray-700'>
							<tr>
								<th className='px-6 py-3 text-sm font-semibold'>#</th>
								<th className='px-6 py-3 text-sm font-semibold'>الاسم</th>
								<th className='px-6 py-3 text-sm font-semibold'>البريد الإلكتروني</th>
								<th className='px-6 py-3 text-sm font-semibold'>الدور</th>
								<th className='px-6 py-3 text-sm font-semibold'>الحالة</th>
								<th className='px-6 py-3 text-sm font-semibold'>تاريخ الإنشاء</th>
								<th className='px-6 py-3 text-sm font-semibold'>آخر تحديث</th>
							</tr>
						</thead>
						<tbody className='divide-y divide-gray-100'>
							{users.map((u) => (
								<tr key={u.id} className='hover:bg-gray-50'>
									<td className='px-6 py-4 text-gray-600'>{u.id}</td>
									<td className='px-6 py-4 font-semibold text-gray-900'>{u.name}</td>
									<td className='px-6 py-4 text-gray-700'>{u.email}</td>
									<td className='px-6 py-4'>
										<span className='inline-flex items-center gap-2'>
											<span className='text-gray-800 font-medium'>{u.role?.name || '-'}</span>
										</span>
									</td>
									<td className='px-6 py-4'>
										{u.isActive ? (
											<span className='text-xs bg-green-100 text-green-700 px-3 py-1 rounded-full'>نشط</span>
										) : (
											<span className='text-xs bg-gray-200 text-gray-700 px-3 py-1 rounded-full'>غير نشط</span>
										)}
									</td>
									<td className='px-6 py-4 text-gray-700'>{formatDate(u.createdAt)}</td>
									<td className='px-6 py-4 text-gray-700'>{formatDate(u.updatedAt)}</td>
								</tr>
							))}
							{users.length === 0 && (
								<tr>
									<td colSpan={7} className='px-6 py-8 text-center text-gray-500'>لا يوجد مستخدمون</td>
								</tr>
							)}
						</tbody>
					</table>
				</div>

				{/* Pagination */}
				<div className='flex items-center justify-between px-6 py-4 border-t border-gray-100 bg-white'>
					<div className='text-sm text-gray-600'>
						الصفحة {page} من {totalPages} — إجمالي {total} مستخدم
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
			</div>
		</div>
	)
}

