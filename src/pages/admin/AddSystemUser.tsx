import { useMemo, useState } from 'react';
import type { FormEvent } from 'react';
import axiosInstance from '../../utils/axiosInstance';
import { useNavigate } from 'react-router-dom';
import { FiChevronDown, FiSearch } from 'react-icons/fi';
import { AiOutlineEye, AiOutlineEyeInvisible } from 'react-icons/ai';
import { BsShieldCheck } from 'react-icons/bs';

type SystemRole = 'USER' | 'DOCTOR' | 'ADMIN';

interface RoleOption {
    name: SystemRole;
    label: string;
}

const ROLE_OPTIONS: RoleOption[] = [
    { name: 'ADMIN', label: 'ADMIN' },
    { name: 'DOCTOR', label: 'DOCTOR' },
    { name: 'USER', label: 'USER' },
];

const roleIdMap: Record<SystemRole, number> = {
    ADMIN: 3,
    DOCTOR: 2,
    USER: 1,
};

export default function AddSystemUser() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState<SystemRole | ''>('');
    const [isActive, setIsActive] = useState(true);

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [showPassword, setShowPassword] = useState(false);
    const [isRoleOpen, setIsRoleOpen] = useState(false);
    const [roleSearch, setRoleSearch] = useState('');

    const navigate = useNavigate();

    const filteredRoles = useMemo(() => {
        const searchTerm = roleSearch.trim().toLowerCase();
        if (!searchTerm) return ROLE_OPTIONS;
        return ROLE_OPTIONS.filter((roleOption) => roleOption.name.toLowerCase().includes(searchTerm));
    }, [roleSearch]);

    const selectedRole = ROLE_OPTIONS.find((roleOption) => roleOption.name === role);

    const handleSubmit = async (event: FormEvent) => {
        event.preventDefault();

        if (!name.trim() || !email.trim() || !password) {
            setError('يرجى إدخال الاسم والبريد الإلكتروني وكلمة المرور');
            return;
        }

        if (!role) {
            setError('يرجى اختيار دور');
            return;
        }

        setIsSubmitting(true);
        setError(null);

        try {
            await axiosInstance.post('/admin/admins', {
                name: name.trim(),
                email: email.trim(),
                password,
                role,
                roleId: roleIdMap[role],
                isActive,
            });

            navigate('/admins');
        } catch (requestError: any) {
            console.error('Error creating admin:', requestError);
            setError(requestError?.response?.data?.message || 'فشل في إنشاء المستخدم');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className='mx-auto max-w-3xl p-8 font-["SFArabic-Regular"]' dir='rtl'>
            <div className='mb-8 flex items-center justify-between'>
                <div>
                    <h1 className='mb-2 text-3xl font-bold text-primary'>إضافة مستخدم نظام</h1>
                    <p className='text-gray-600'>أدخل بيانات المستخدم وحدد الدور</p>
                </div>
            </div>

            {error && (
                <div className='mb-6 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-red-700'>
                    {error}
                </div>
            )}

            <form onSubmit={handleSubmit} className='rounded-2xl border border-gray-100 bg-white p-6 shadow-lg'>
                <div className='grid grid-cols-1 gap-6 md:grid-cols-2'>
                    <div>
                        <label className='mb-2 block text-lg font-semibold text-gray-700'>الاسم</label>
                        <input
                            type='text'
                            value={name}
                            onChange={(event) => setName(event.target.value)}
                            placeholder='أدخل الاسم بالكامل'
                            className='w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-primary'
                            required
                        />
                    </div>

                    <div>
                        <label className='mb-2 block text-lg font-semibold text-gray-700'>البريد الإلكتروني</label>
                        <input
                            type='email'
                            value={email}
                            onChange={(event) => setEmail(event.target.value)}
                            placeholder='example@email.com'
                            className='w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-primary'
                            required
                        />
                        <p className='mt-1 text-xs text-gray-500'>سيستخدم هذا البريد لتسجيل الدخول وإشعارات النظام.</p>
                    </div>

                    <div>
                        <label className='mb-2 block text-lg font-semibold text-gray-700'>كلمة المرور</label>
                        <div className='relative'>
                            <input
                                type={showPassword ? 'text' : 'password'}
                                value={password}
                                onChange={(event) => setPassword(event.target.value)}
                                placeholder='********'
                                className='w-full rounded-lg border border-gray-300 py-3 pr-12 pl-4 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-primary'
                                required
                            />
                            <button
                                type='button'
                                onClick={() => setShowPassword((current) => !current)}
                                className='absolute top-1/2 left-3 -translate-y-1/2 text-gray-500 hover:text-gray-700'
                                aria-label={showPassword ? 'إخفاء كلمة المرور' : 'إظهار كلمة المرور'}
                            >
                                {showPassword ? <AiOutlineEyeInvisible size={20} /> : <AiOutlineEye size={20} />}
                            </button>
                        </div>
                        <p className='mt-1 text-xs text-gray-500'>استخدم كلمة مرور قوية تحتوي على حروف وأرقام ورموز.</p>
                    </div>

                    <div className='md:col-span-2'>
                        <label className='mb-2 block text-lg font-semibold text-gray-700'>الدور</label>
                        <div className='relative'>
                            <button
                                type='button'
                                onClick={() => setIsRoleOpen((open) => !open)}
                                className='flex w-full items-center justify-between gap-3 rounded-lg border border-gray-300 bg-white px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary'
                            >
                                <span className='flex items-center gap-2 text-gray-800'>
                                    <BsShieldCheck className='text-primary' />
                                    {selectedRole ? selectedRole.label : 'اختر دورا'}
                                </span>
                                <FiChevronDown className={`transition-transform ${isRoleOpen ? 'rotate-180' : ''}`} />
                            </button>

                            {isRoleOpen && (
                                <div className='absolute right-0 z-50 mt-2 max-h-72 w-full overflow-hidden rounded-lg border border-gray-200 bg-white shadow-xl'>
                                    <div className='border-b border-gray-100 bg-gray-50 p-3'>
                                        <div className='relative'>
                                            <input
                                                type='text'
                                                value={roleSearch}
                                                onChange={(event) => setRoleSearch(event.target.value)}
                                                placeholder='ابحث عن دور...'
                                                className='w-full rounded-md border border-gray-300 py-2 pr-10 pl-3 focus:outline-none focus:ring-2 focus:ring-primary'
                                            />
                                            <FiSearch className='absolute top-1/2 right-3 -translate-y-1/2 text-gray-400' />
                                        </div>
                                    </div>

                                    <ul className='max-h-56 overflow-auto py-1'>
                                        {filteredRoles.length === 0 && (
                                            <li className='px-4 py-3 text-sm text-gray-500'>لا توجد نتائج</li>
                                        )}

                                        {filteredRoles.map((roleOption) => (
                                            <li key={roleOption.name}>
                                                <button
                                                    type='button'
                                                    onClick={() => {
                                                        setRole(roleOption.name);
                                                        setIsRoleOpen(false);
                                                    }}
                                                    className={`flex w-full items-center justify-between px-4 py-2 text-right hover:bg-gray-50 ${
                                                        role === roleOption.name ? 'bg-blue-50' : ''
                                                    }`}
                                                >
                                                    <span className='text-gray-800'>{roleOption.label}</span>
                                                    {role === roleOption.name && <span className='text-xs text-primary'>محدد</span>}
                                                </button>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}
                        </div>
                        <p className='mt-1 text-xs text-gray-500'>يتم عرض الأدوار الثابتة للنظام فقط.</p>
                    </div>

                    <div className='md:col-span-2'>
                        <label className='inline-flex items-center gap-3'>
                            <input
                                type='checkbox'
                                checked={isActive}
                                onChange={(event) => setIsActive(event.target.checked)}
                                className='h-5 w-5 rounded border-gray-300'
                            />
                            <span className='font-medium text-gray-700'>نشط</span>
                        </label>
                    </div>
                </div>

                <div className='mt-8 flex justify-end gap-4'>
                    <button
                        type='button'
                        onClick={() => navigate('/admins')}
                        className='rounded-lg bg-gray-200 px-6 py-3 font-semibold text-gray-700 transition-colors hover:bg-gray-300'
                        disabled={isSubmitting}
                    >
                        إلغاء
                    </button>
                    <button
                        type='submit'
                        disabled={isSubmitting}
                        className='flex items-center gap-2 rounded-lg bg-primary px-6 py-3 font-semibold text-white transition-colors hover:bg-primary-dark disabled:cursor-not-allowed disabled:opacity-50'
                    >
                        {isSubmitting ? 'جاري الإضافة...' : 'إضافة المستخدم'}
                    </button>
                </div>
            </form>
        </div>
    );
}
