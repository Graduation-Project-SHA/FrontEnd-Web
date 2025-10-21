import { useEffect, useState } from 'react'
import axios from 'axios'
import config from '../../config'
import { useNavigate } from 'react-router-dom'

interface Resource {
    id: number
    resource: string
}

interface Permission {
    permissionId: number
    accessLevel: number
}

export default function CreateRole() {
    const [name, setName] = useState('')
    const [resources, setResources] = useState<Resource[]>([])
    const [selectedPermissions, setSelectedPermissions] = useState<Permission[]>([])
    const [isLoading, setIsLoading] = useState(false)
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const navigate = useNavigate()

    useEffect(() => {
        fetchResources()
    }, [])

    const fetchResources = async () => {
        setIsLoading(true)
        setError(null)
        try {
            const response = await axios.get(`${config.apiBaseUrl}/admin/roles/resources`,
                {
                    headers: {
                        authorization: `Bearer ${localStorage.getItem('accessToken')}`,
                    }
                }
            )
            setResources(response.data)
        } catch (err) {
            console.error('Error fetching resources:', err)
            setError('فشل في تحميل الموارد')
        } finally {
            setIsLoading(false)
        }
    }

    const handlePermissionChange = (resourceId: number, accessLevel: number) => {
        const existingIndex = selectedPermissions.findIndex(p => p.permissionId === resourceId)

        if (existingIndex >= 0) {
            // Update existing permission
            const updated = [...selectedPermissions]
            updated[existingIndex] = { permissionId: resourceId, accessLevel }
            setSelectedPermissions(updated)
        } else {
            // Add new permission
            setSelectedPermissions([...selectedPermissions, { permissionId: resourceId, accessLevel }])
        }
    }

    const removePermission = (resourceId: number) => {
        setSelectedPermissions(selectedPermissions.filter(p => p.permissionId !== resourceId))
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

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        if (!name.trim()) {
            setError('يرجى إدخال اسم الدور')
            return
        }

        if (selectedPermissions.length === 0) {
            setError('يرجى اختيار صلاحية واحدة على الأقل')
            return
        }

        setIsSubmitting(true)
        setError(null)

        try {
            await axios.post(`${config.apiBaseUrl}/admin/roles`, {
                name: name.trim(),
                permissions: selectedPermissions
            }, {
                headers: {
                    authorization: `Bearer ${localStorage.getItem('accessToken')}`,
                }
            })

            // Navigate back to roles page on success
            navigate('/roles')
        } catch (err: any) {
            console.error('Error creating role:', err)
            setError(err.response?.data?.message || 'فشل في إنشاء الدور')
        } finally {
            setIsSubmitting(false)
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

    return (
        <div className='p-8 font-["SFArabic-Regular"] max-w-4xl mx-auto' dir='rtl'>
            <div className='mb-8'>
                <h1 className='text-3xl font-bold text-[#0067FF] mb-2'>إنشاء دور جديد</h1>
                <p className='text-gray-600'>قم بإنشاء دور جديد وتحديد الصلاحيات</p>
            </div>

            {error && (
                <div className='mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg'>
                    {error}
                </div>
            )}

            <form onSubmit={handleSubmit} className='bg-white rounded-2xl shadow-lg p-6 border border-gray-100'>
                {/* Role Name */}
                <div className='mb-6'>
                    <label className='block text-lg font-semibold text-gray-700 mb-2'>
                        اسم الدور
                    </label>
                    <input
                        type='text'
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder='مثال: مدير، مشرف، مستخدم'
                        className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0067FF] focus:border-transparent'
                        required
                    />
                </div>

                {/* Permissions Section */}
                <div className='mb-6'>
                    <h2 className='text-lg font-semibold text-gray-700 mb-4'>الصلاحيات</h2>

                    <div className='space-y-4'>
                        {resources.map((resource) => {
                            const existingPermission = selectedPermissions.find(p => p.permissionId === resource.id)

                            return (
                                <div key={resource.id} className='bg-gray-50 rounded-lg p-4 border border-gray-200'>
                                    <div className='flex items-center justify-between mb-3'>
                                        <span className='font-semibold text-gray-800'>{resource.resource}</span>
                                        <span className='text-sm text-gray-500'>معرف: {resource.id}</span>
                                    </div>

                                    <div className='flex flex-wrap gap-2'>
                                        {[1, 2, 3, 4, 5, 6, 7].map((level) => (
                                            <button
                                                key={level}
                                                type='button'
                                                onClick={() => handlePermissionChange(resource.id, level)}
                                                className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${existingPermission?.accessLevel === level
                                                    ? 'bg-[#0067FF] text-white'
                                                    : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-100'
                                                    }`}
                                            >
                                                {getAccessLevelText(level)}
                                            </button>
                                        ))}
                                    </div>

                                    {existingPermission && (
                                        <button
                                            type='button'
                                            onClick={() => removePermission(resource.id)}
                                            className='mt-3 text-red-600 text-sm hover:text-red-800 font-medium'
                                        >
                                            إزالة الصلاحية
                                        </button>
                                    )}
                                </div>
                            )
                        })}
                    </div>
                </div>

                {/* Selected Permissions Summary */}
                {selectedPermissions.length > 0 && (
                    <div className='mb-6 bg-blue-50 rounded-lg p-4 border border-blue-200'>
                        <h3 className='font-semibold text-gray-700 mb-2'>ملخص الصلاحيات المحددة:</h3>
                        <div className='flex flex-wrap gap-2'>
                            {selectedPermissions.map((perm) => {
                                const resource = resources.find(r => r.id === perm.permissionId)
                                return (
                                    <span key={perm.permissionId} className='bg-white px-3 py-1 rounded-full text-sm border border-blue-300'>
                                        {resource?.resource} - {getAccessLevelText(perm.accessLevel)}
                                    </span>
                                )
                            })}
                        </div>
                    </div>
                )}

                {/* Action Buttons */}
                <div className='flex gap-4 justify-end'>
                    <button
                        type='button'
                        onClick={() => navigate('/roles')}
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
                                جاري الإنشاء...
                            </>
                        ) : (
                            'إنشاء الدور'
                        )}
                    </button>
                </div>
            </form>
        </div>
    )
}
