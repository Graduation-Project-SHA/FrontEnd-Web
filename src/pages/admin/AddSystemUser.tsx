import { useEffect, useState, useMemo } from 'react'
import axios from 'axios'
import config from '../../config'
import { useNavigate } from 'react-router-dom'
import { FiChevronDown, FiSearch } from 'react-icons/fi'
import { AiOutlineEye, AiOutlineEyeInvisible } from 'react-icons/ai'
import { BsShieldCheck } from 'react-icons/bs'

interface Role {
    id: number
    name: string
}

export default function AddSystemUser() {
    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [roleId, setRoleId] = useState<number | ''>('')
    const [isActive, setIsActive] = useState(true)

    const [roles, setRoles] = useState<Role[]>([])
    const [isLoadingRoles, setIsLoadingRoles] = useState(false)
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [showPassword, setShowPassword] = useState(false)
    const [isRoleOpen, setIsRoleOpen] = useState(false)
    const [roleSearch, setRoleSearch] = useState('')

    const navigate = useNavigate()

    useEffect(() => {
        fetchRoles()
    }, [])

    const fetchRoles = async () => {
        setIsLoadingRoles(true)
        setError(null)
        try {
            const res = await axios.get<Role[]>(`${config.apiBaseUrl}/admin/roles`, {
                headers: {
                    authorization: `Bearer ${localStorage.getItem('accessToken')}`,
                },
            })
            setRoles(res.data)
        } catch (err: any) {
            console.error('Error fetching roles:', err)
            setError(err?.response?.data?.message || 'فشل في تحميل الأدوار')
        } finally {
            setIsLoadingRoles(false)
        }
    }

    const filteredRoles = useMemo(() => {
        const s = roleSearch.trim().toLowerCase()
        if (!s) return roles
        return roles.filter(r => r.name.toLowerCase().includes(s))
    }, [roles, roleSearch])

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        if (!name.trim() || !email.trim() || !password) {
            setError('يرجى إدخال الاسم والبريد الإلكتروني وكلمة المرور')
            return
        }
        if (!roleId) {
            setError('يرجى اختيار دور')
            return
        }

        setIsSubmitting(true)
        setError(null)

        try {
            await axios.post(`${config.apiBaseUrl}/admin/admins`, {
                name: name.trim(),
                email: email.trim(),
                password,
                roleId: Number(roleId),
                isActive,
            }, {
                headers: {
                    'Content-Type': 'application/json',
                    authorization: `Bearer ${localStorage.getItem('accessToken')}`,
                }
            })

            navigate('/admins')
        } catch (err: any) {
            console.error('Error creating admin:', err)
            setError(err?.response?.data?.message || 'فشل في إنشاء المستخدم')
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <div className='p-8 font-["SFArabic-Regular"] max-w-3xl mx-auto' dir='rtl'>
            <div className='mb-8 flex justify-between items-center'>
                <div>
                    <h1 className='text-3xl font-bold text-[#0067FF] mb-2'>إضافة مستخدم نظام</h1>
                    <p className='text-gray-600'>أدخل بيانات المستخدم وحدد الدور</p>
                </div>
            </div>

            {error && (
                <div className='mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg'>
                    {error}
                </div>
            )}

            <form onSubmit={handleSubmit} className='bg-white rounded-2xl shadow-lg p-6 border border-gray-100'>
                <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                    <div>
                        <label className='block text-lg font-semibold text-gray-700 mb-2'>الاسم</label>
                        <input
                            type='text'
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder='أدخل الاسم بالكامل'
                            className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0067FF] focus:border-transparent'
                            required
                        />
                    </div>

                    <div>
                        <label className='block text-lg font-semibold text-gray-700 mb-2'>البريد الإلكتروني</label>
                        <input
                            type='email'
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder='example@email.com'
                            className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0067FF] focus:border-transparent'
                            required
                        />
                        <p className='mt-1 text-xs text-gray-500'>سيُستخدم هذا البريد لتسجيل الدخول وإشعارات النظام.</p>
                    </div>

                    <div>
                        <label className='block text-lg font-semibold text-gray-700 mb-2'>كلمة المرور</label>
                        <div className='relative'>
                            <input
                                type={showPassword ? 'text' : 'password'}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder='********'
                                className='w-full pr-12 pl-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0067FF] focus:border-transparent'
                                required
                            />
                            <button
                                type='button'
                                onClick={() => setShowPassword((s) => !s)}
                                className='absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700'
                                aria-label={showPassword ? 'إخفاء كلمة المرور' : 'إظهار كلمة المرور'}
                            >
                                {showPassword ? <AiOutlineEyeInvisible size={20} /> : <AiOutlineEye size={20} />}
                            </button>
                        </div>
                        <p className='mt-1 text-xs text-gray-500'>استخدم كلمة مرور قوية تحتوي على حروف وأرقام ورموز.</p>
                    </div>

                    <div className='md:col-span-2'>
                        <label className='block text-lg font-semibold text-gray-700 mb-2'>الدور</label>
                        {/* Custom Role Selector */}
                        <div className='relative'>
                            <button
                                type='button'
                                onClick={() => setIsRoleOpen((o) => !o)}
                                disabled={isLoadingRoles}
                                className='w-full flex items-center justify-between gap-3 px-4 py-3 border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-[#0067FF] disabled:opacity-60'
                            >
                                <span className='flex items-center gap-2 text-gray-800'>
                                    <BsShieldCheck className='text-[#0067FF]' />
                                    {roleId ? roles.find(r => r.id === roleId)?.name : 'اختر دورًا'}
                                </span>
                                <FiChevronDown className={`transition-transform ${isRoleOpen ? 'rotate-180' : ''}`} />
                            </button>

                            {isRoleOpen && (
                                <div className='absolute right-0 z-50 mt-2 w-full max-h-72 overflow-hidden rounded-lg border border-gray-200 bg-white shadow-xl'>
                                    <div className='p-3 border-b border-gray-100 bg-gray-50'>
                                        <div className='relative'>
                                            <input
                                                type='text'
                                                value={roleSearch}
                                                onChange={(e) => setRoleSearch(e.target.value)}
                                                placeholder='ابحث عن دور...'
                                                className='w-full pr-10 pl-3 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#0067FF]'
                                            />
                                            <FiSearch className='absolute right-3 top-1/2 -translate-y-1/2 text-gray-400' />
                                        </div>
                                    </div>
                                    <ul className='max-h-56 overflow-auto py-1'>
                                        {isLoadingRoles && (
                                            <li className='px-4 py-3 text-sm text-gray-500'>جاري تحميل الأدوار...</li>
                                        )}
                                        {!isLoadingRoles && filteredRoles.length === 0 && (
                                            <li className='px-4 py-3 text-sm text-gray-500'>لا توجد نتائج</li>
                                        )}
                                        {!isLoadingRoles && filteredRoles.map((r) => (
                                            <li key={r.id}>
                                                <button
                                                    type='button'
                                                    onClick={() => { setRoleId(r.id); setIsRoleOpen(false) }}
                                                    className={`w-full text-right px-4 py-2 hover:bg-gray-50 flex items-center justify-between ${roleId === r.id ? 'bg-blue-50' : ''}`}
                                                >
                                                    <span className='text-gray-800'>{r.name}</span>
                                                    {roleId === r.id && <span className='text-xs text-[#0067FF]'>محدد</span>}
                                                </button>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}
                        </div>
                        <p className='mt-1 text-xs text-gray-500'>حدد الدور المناسب لصلاحيات هذا المستخدم.</p>
                    </div>

                    <div className='md:col-span-2'>
                        <label className='inline-flex items-center gap-3'>
                            <input
                                type='checkbox'
                                checked={isActive}
                                onChange={(e) => setIsActive(e.target.checked)}
                                className='w-5 h-5 rounded border-gray-300'
                            />
                            <span className='text-gray-700 font-medium'>نشط</span>
                        </label>
                    </div>
                </div>

                <div className='mt-8 flex justify-end gap-4'>
                    <button
                        type='button'
                        onClick={() => navigate('/admins')}
                        className='px-6 py-3 bg-gray-200 text-gray-700 rounded-lg font-semibold hover:bg-gray-300 transition-colors'
                        disabled={isSubmitting}
                    >
                        إلغاء
                    </button>
                    <button
                        type='submit'
                        disabled={isSubmitting}
                        className='px-6 py-3 bg-[#0067FF] text-white rounded-lg font-semibold hover:bg-[#0052CC] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2'
                    >
                        {isSubmitting ? (
                            <>
                                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                جاري الإضافة...
                            </>
                        ) : (
                            'إضافة المستخدم'
                        )}
                    </button>
                </div>
            </form>
        </div>
    )
}
