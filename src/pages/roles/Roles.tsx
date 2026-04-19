import { useEffect, useMemo, useState } from 'react';
import type { ReactNode } from 'react';
import { FaUserDoctor, FaUserShield } from 'react-icons/fa6';
import { FiUser } from 'react-icons/fi';
import axiosInstance from '../../utils/axiosInstance';

type RoleName = 'USER' | 'DOCTOR' | 'ADMIN';

interface SystemRole {
    name: RoleName;
    label: string;
    description: string;
    count?: number;
    color: string;
    icon: ReactNode;
}

interface PaginationMeta {
    total?: number;
}

const staticRoles: SystemRole[] = [
    {
        name: 'USER',
        label: 'المستخدم',
        description: 'يمكنه إدارة ملفه الصحي، حجز المواعيد، وطلب التبرعات.',
        color: 'var(--ui-color-primary)',
        icon: <FiUser size={24} />,
    },
    {
        name: 'DOCTOR',
        label: 'الطبيب',
        description: 'يدير المواعيد، الخدمات الطبية، ويطّلع على بيانات المرضى المصرح بها.',
        color: 'var(--ui-color-success)',
        icon: <FaUserDoctor size={24} />,
    },
    {
        name: 'ADMIN',
        label: 'مدير النظام',
        description: 'يمتلك صلاحيات إشرافية كاملة على بيانات المنصة ولوحات الإدارة.',
        color: 'var(--ui-color-purple)',
        icon: <FaUserShield size={24} />,
    },
];

export default function Roles() {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [userCount, setUserCount] = useState<number | undefined>(undefined);
    const [doctorCount, setDoctorCount] = useState<number | undefined>(undefined);

    useEffect(() => {
        const fetchCounts = async () => {
            setIsLoading(true);
            setError(null);

            const [patientsResult, doctorsResult] = await Promise.allSettled([
                axiosInstance.get('/admin/patients', { params: { page: 1, limit: 1 } }),
                axiosInstance.get('/admin/doctors', { params: { page: 1, limit: 1 } }),
            ]);

            if (patientsResult.status === 'fulfilled') {
                const pagination = patientsResult.value.data.pagination as PaginationMeta | undefined;
                setUserCount(typeof pagination?.total === 'number' ? pagination.total : undefined);
            }

            if (doctorsResult.status === 'fulfilled') {
                const pagination = doctorsResult.value.data.pagination as PaginationMeta | undefined;
                setDoctorCount(typeof pagination?.total === 'number' ? pagination.total : undefined);
            }

            if (patientsResult.status === 'rejected' || doctorsResult.status === 'rejected') {
                setError('تعذر تحميل بعض الإحصاءات، لكن الأدوار النظامية معروضة بالكامل.');
            }

            setIsLoading(false);
        };

        fetchCounts();
    }, []);

    const roles = useMemo<SystemRole[]>(() => {
        return staticRoles.map((role) => {
            if (role.name === 'USER') {
                return { ...role, count: userCount };
            }

            if (role.name === 'DOCTOR') {
                return { ...role, count: doctorCount };
            }

            return role;
        });
    }, [userCount, doctorCount]);

    return (
        <div className='p-4 md:p-8 font-["SFArabic-Regular"]' dir='rtl'>
            <div className='mb-8'>
                <h1 className='text-3xl font-bold text-primary mb-2'>الأدوار النظامية</h1>
                <p className='text-text-secondary'>
                    النظام يعتمد على أدوار ثابتة فقط: مستخدم، طبيب، مدير.
                </p>
            </div>

            {error && (
                <div className='mb-6 rounded-xl border border-warning bg-warning-bg px-4 py-3 text-sm text-[#8a5a00]'>
                    {error}
                </div>
            )}

            {isLoading ? (
                <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5'>
                    {Array.from({ length: 3 }).map((_, index) => (
                        <div key={index} className='h-52 rounded-2xl border border-border bg-surface animate-pulse' />
                    ))}
                </div>
            ) : (
                <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
                    {roles.map((role) => (
                        <article
                            key={role.name}
                            className='rounded-2xl border border-border bg-surface p-6 shadow-card transition-transform duration-200 hover:-translate-y-1 hover:shadow-card-hover'
                        >
                            <div className='mb-5 flex items-center justify-between'>
                                <div
                                    className='flex h-12 w-12 items-center justify-center rounded-xl text-white'
                                    style={{ backgroundColor: role.color }}
                                >
                                    {role.icon}
                                </div>
                                <span className='rounded-full bg-primary-bg px-3 py-1 text-xs font-semibold text-primary'>
                                    {role.name}
                                </span>
                            </div>

                            <h2 className='mb-2 text-xl font-bold text-text-primary'>{role.label}</h2>
                            <p className='mb-6 min-h-14 text-sm leading-7 text-text-secondary'>{role.description}</p>

                            <div className='rounded-xl border border-border-light bg-surface-alt px-4 py-3'>
                                <p className='text-xs text-text-muted'>عدد الحسابات</p>
                                <p className='mt-1 text-2xl font-bold text-text-primary'>
                                    {typeof role.count === 'number' ? role.count.toLocaleString('ar-EG') : 'غير متاح حاليا'}
                                </p>
                            </div>
                        </article>
                    ))}
                </div>
            )}
        </div>
    );
}
