import { useEffect, useState } from 'react'
import axios from 'axios'
import config from '../../config'
import { useNavigate } from 'react-router-dom'

interface Permission {
    permissionId: number
    resource: string
    accessLevel: number
}

interface Role {
    id: number
    name: string
    permissions: Permission[]
}

export default function Roles() {
    const [roles, setRoles] = useState<Role[]>([])
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const navigate = useNavigate()

    useEffect(() => {
        fetchRoles()
    }, [])

    const fetchRoles = async () => {
        setIsLoading(true)
        setError(null)
        try {
            const response = await axios.get(`${config.apiBaseUrl}/admin/roles`,
                {
                    headers: {
                        authorization: `Bearer ${localStorage.getItem('accessToken')}`,
                    }
                }
            )
            setRoles(response.data)
        } catch (err) {
            console.error('Error fetching roles:', err)
            setError('فشل في تحميل الأدوار')
        } finally {
            setIsLoading(false)
        }
    }

    const getAccessLevelText = (level: number) => {
        const levels: { [key: number]: string } = {
            1: 'قراءة',
            2: 'كتابة',
            3: 'قراءة وكتابة',
            4: 'حذف',
            5: 'قراءة وحذف',
            6: 'كتابة وحذف',
            7: 'جميع الصلاحيات'
        }
        return levels[level] || `المستوى ${level}`
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
                    <h1 className='text-3xl font-bold text-[#0067FF] mb-2'>الأدوار والصلاحيات</h1>
                    <p className='text-gray-600'>إدارة أدوار المستخدمين والصلاحيات</p>
                </div>
                <button
                    onClick={() => navigate('/roles/create')}
                    className='bg-[#0067FF] text-white px-6 py-3 rounded-lg font-semibold hover:bg-[#0052CC] transition-colors flex items-center gap-2'
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                    </svg>
                    إنشاء دور جديد
                </button>
            </div>

            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
                {roles.map((role) => (
                    <div key={role.id} className='bg-white rounded-2xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-shadow'>
                        <div className='mb-4'>
                            <h2 className='text-2xl font-bold text-[#0067FF] mb-1'>{role.name}</h2>
                            <p className='text-sm text-gray-500'>معرف الدور: {role.id}</p>
                        </div>

                        <div>
                            <h3 className='text-lg font-semibold mb-3 text-gray-700'>الصلاحيات:</h3>
                            <div className='space-y-3'>
                                {role.permissions.map((permission) => (
                                    <div key={permission.permissionId} className='bg-gray-50 rounded-lg p-3 border border-gray-200'>
                                        <div className='flex justify-between items-start mb-1'>
                                            <span className='font-semibold text-gray-800'>{permission.resource}</span>
                                            <span className='text-xs bg-[#0067FF] text-white px-2 py-1 rounded-full'>
                                                {permission.accessLevel}
                                            </span>
                                        </div>
                                        <p className='text-sm text-gray-600'>{getAccessLevelText(permission.accessLevel)}</p>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className='mt-4 pt-4 border-t border-gray-200'>
                            <p className='text-sm text-gray-500'>
                                عدد الصلاحيات: {role.permissions.length}
                            </p>
                        </div>
                    </div>
                ))}
            </div>

            {roles.length === 0 && (
                <div className='text-center py-12'>
                    <p className='text-gray-500 text-xl'>لا توجد أدوار متاحة</p>
                </div>
            )}
        </div>
    )
}
