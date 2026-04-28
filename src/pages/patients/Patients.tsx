import { useEffect, useMemo, useState } from 'react';
import type { FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import Card from '../../components/ui/Card';
import Table from '../../components/ui/Table';
import axiosInstance from '../../utils/axiosInstance';

interface PatientRecord {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
    phone: string | null;
    gender: string;
    dateOfBirth: string;
    profileImage: string | null;
    address: string | null;
    isEmailVerified: boolean;
    createdAt: string;
}

interface PaginationMeta {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
}

const initialPagination: PaginationMeta = {
    total: 0,
    page: 1,
    limit: 10,
    totalPages: 1,
};

const genderLabelMap: Record<string, string> = {
    MALE: 'ذكر',
    FEMALE: 'أنثى',
};

const formatDate = (isoDate: string) => {
    try {
        return new Date(isoDate).toLocaleString('ar-EG', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
        });
    } catch {
        return isoDate;
    }
};

export default function Patients() {
    const navigate = useNavigate();
    const [patients, setPatients] = useState<PatientRecord[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [pagination, setPagination] = useState<PaginationMeta>(initialPagination);
    const [filters, setFilters] = useState({ name: '', email: '' });
    const [appliedFilters, setAppliedFilters] = useState({ name: '', email: '' });
    const [deletingId, setDeletingId] = useState<number | null>(null);

    const fetchPatients = async (page?: number) => {
        setIsLoading(true);
        setError(null);

        try {
            const response = await axiosInstance.get('/admin/patients', {
                params: {
                    page: page ?? pagination.page,
                    limit: pagination.limit,
                    name: appliedFilters.name || undefined,
                    email: appliedFilters.email || undefined,
                },
            });

            const patientRows = Array.isArray(response.data?.data)
                ? (response.data.data as PatientRecord[])
                : [];
            const nextPagination = response.data?.pagination as PaginationMeta | undefined;

            setPatients(patientRows);
            setPagination((prev) => ({
                ...prev,
                page: page ?? prev.page,
                total: nextPagination?.total ?? prev.total,
                totalPages: Math.max(1, nextPagination?.totalPages ?? prev.totalPages),
            }));
        } catch (requestError) {
            console.error('Failed to fetch patients:', requestError);
            setError('تعذر تحميل بيانات المرضى حاليا.');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchPatients();
    }, [pagination.page, pagination.limit, appliedFilters]);

    const handleDeletePatient = async (patientId: number) => {
        setDeletingId(patientId);
        try {
            await axiosInstance.delete(`/admin/patients/${patientId}`);
            setPatients((prev) => prev.filter((p) => p.id !== patientId));
            setPagination((prev) => ({
                ...prev,
                total: Math.max(0, prev.total - 1),
            }));
        } catch (err) {
            console.error('Failed to delete patient:', err);
            setError('فشل حذف المريض. يرجى المحاولة لاحقا.');
        } finally {
            setDeletingId(null);
        }
    };

    const stats = useMemo(() => {
        const verifiedCount = patients.filter((item) => item.isEmailVerified).length;
        const maleCount = patients.filter((item) => item.gender === 'MALE').length;
        const femaleCount = patients.filter((item) => item.gender === 'FEMALE').length;

        return [
            {
                title: 'إجمالي المرضى',
                count: pagination.total,
                color: 'var(--ui-color-card-blue-bg)',
                circleColor: 'var(--ui-color-card-blue-circle)',
                icon: (
                    <svg className='w-6 h-6 text-primary' fill='currentColor' viewBox='0 0 20 20'>
                        <path d='M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z' />
                    </svg>
                ),
            },
            {
                title: 'بريد موثق',
                count: verifiedCount,
                color: 'var(--ui-color-success-bg)',
                circleColor: '#b8efd9',
                icon: (
                    <svg className='w-6 h-6 text-success' fill='currentColor' viewBox='0 0 20 20'>
                        <path fillRule='evenodd' d='M16.707 5.293a1 1 0 010 1.414l-7.414 7.414a1 1 0 01-1.414 0L3.293 9.535a1 1 0 011.414-1.414l3.172 3.172 6.707-6.707a1 1 0 011.414 0z' clipRule='evenodd' />
                    </svg>
                ),
            },
            {
                title: 'ذكور',
                count: maleCount,
                color: '#e8f4fd',
                circleColor: '#2b73f3',
                icon: (
                    <svg className='w-6 h-6 text-white' fill='currentColor' viewBox='0 0 20 20'>
                        <path d='M10 2a1 1 0 011 1v1h3a1 1 0 010 2h-1.586l2.793 2.793a1 1 0 01-1.414 1.414L11 7.414V9a1 1 0 11-2 0V3a1 1 0 011-1zM4 11a4 4 0 118 0 4 4 0 01-8 0z' />
                    </svg>
                ),
            },
            {
                title: 'إناث',
                count: femaleCount,
                color: 'var(--ui-color-purple-bg)',
                circleColor: '#e9d5ff',
                icon: (
                    <svg className='w-6 h-6 text-purple' fill='currentColor' viewBox='0 0 20 20'>
                        <path d='M9 2a5 5 0 00-1 9.9V14H6a1 1 0 000 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2v-2.1A5 5 0 009 2z' />
                    </svg>
                ),
            },
        ];
    }, [patients, pagination.total]);

    const tableRows = useMemo(() => {
        return patients.map((patient) => ({
            id: patient.id,
            fullName: `${patient.firstName} ${patient.lastName}`,
            email: patient.email,
            gender: genderLabelMap[patient.gender] ?? patient.gender,
            isEmailVerified: patient.isEmailVerified,
            createdAt: formatDate(patient.createdAt),
        }));
    }, [patients]);

    const handleSearchSubmit = (event: FormEvent) => {
        event.preventDefault();
        setAppliedFilters({
            name: filters.name.trim(),
            email: filters.email.trim(),
        });
        setPagination((prev) => ({ ...prev, page: 1 }));
    };

    const clearFilters = () => {
        setFilters({ name: '', email: '' });
        setAppliedFilters({ name: '', email: '' });
        setPagination((prev) => ({ ...prev, page: 1 }));
    };

    return (
        <div className='px-4 md:px-8 py-4 md:py-8' dir='rtl'>
            <form onSubmit={handleSearchSubmit} className='mb-5 rounded-2xl border border-border bg-surface p-4 shadow-card'>
                <div className='grid grid-cols-1 gap-3 md:grid-cols-2'>
                    <input
                        type='text'
                        value={filters.name}
                        onChange={(event) => setFilters((prev) => ({ ...prev, name: event.target.value }))}
                        placeholder='بحث بالاسم'
                        className='w-full rounded-lg border border-border px-3 py-2.5 outline-none focus:border-primary'
                    />
                    <input
                        type='email'
                        value={filters.email}
                        onChange={(event) => setFilters((prev) => ({ ...prev, email: event.target.value }))}
                        placeholder='بحث بالبريد الإلكتروني'
                        className='w-full rounded-lg border border-border px-3 py-2.5 outline-none focus:border-primary'
                    />
                </div>

                <div className='mt-3 flex justify-end gap-2'>
                    <button
                        type='button'
                        onClick={clearFilters}
                        className='rounded-lg border border-border px-4 py-2 text-sm font-medium text-text-secondary hover:bg-surface-alt'
                    >
                        إعادة تعيين
                    </button>
                    <button
                        type='submit'
                        className='rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white hover:bg-primary-dark'
                    >
                        بحث
                    </button>
                </div>
            </form>

            <div className='mb-6 flex flex-wrap w-full gap-4'>
                {stats.map((item) => (
                    <Card
                        key={item.title}
                        color={item.color}
                        circleColor={item.circleColor}
                        icon={item.icon}
                        title={item.title}
                        count={item.count}
                        percentage=''
                    />
                ))}
            </div>

            {error && (
                <div className='mb-4 rounded-xl border border-danger bg-danger-bg px-4 py-3 text-sm text-danger'>
                    {error}
                </div>
            )}

            {isLoading ? (
                <div className='rounded-2xl border border-border bg-surface p-6 shadow-card'>
                    <div className='mb-3 h-6 w-40 animate-pulse rounded bg-slate-200' />
                    <div className='space-y-3'>
                        {Array.from({ length: 8 }).map((_, index) => (
                            <div key={index} className='h-12 animate-pulse rounded-lg bg-slate-100' />
                        ))}
                    </div>
                </div>
            ) : (
                <>
                    <Table
                        tableHeader='قائمة المرضى'
                        columns={[
                            { key: 'id', header: 'رقم' },
                            { key: 'fullName', header: 'الاسم' },
                            { key: 'email', header: 'البريد الإلكتروني' },
                            { key: 'gender', header: 'النوع' },
                            {
                                key: 'isEmailVerified',
                                header: 'توثيق البريد',
                                render: (row) => (
                                    row.isEmailVerified ? (
                                        <span className='rounded-full bg-success-bg px-3 py-1 text-xs font-semibold text-success'>موثق</span>
                                    ) : (
                                        <span className='rounded-full bg-warning-bg px-3 py-1 text-xs font-semibold text-warning'>غير موثق</span>
                                    )
                                ),
                            },
                            { key: 'createdAt', header: 'تاريخ الإنشاء' },
                        ]}
                        totalCount={pagination.total}
                        data={tableRows}
                        showSearch={false}
                        showFilter={false}
                        actionsHeader='الإجراءات'
                        actions={[
                            {
                                label: 'التفاصيل',
                                onClick: (row) => {
                                    navigate(`/patients/${row.id}`);
                                },
                            },
                            {
                                label: 'حذف',
                                onClick: (row) => {
                                    if (deletingId === null) {
                                        handleDeletePatient(row.id);
                                    }
                                },
                                className: deletingId ? 'text-danger opacity-50' : 'text-danger',
                            },
                        ]}
                    />

                    <div className='mt-4 flex flex-wrap items-center justify-between gap-3'>
                        <p className='text-sm text-text-secondary'>
                            الصفحة {pagination.page} من {pagination.totalPages}
                        </p>
                        <div className='flex gap-2'>
                            <button
                                className='rounded-lg border border-border px-4 py-2 text-sm text-text-secondary disabled:cursor-not-allowed disabled:opacity-50'
                                onClick={() => setPagination((prev) => ({ ...prev, page: Math.max(1, prev.page - 1) }))}
                                disabled={pagination.page <= 1}
                            >
                                السابق
                            </button>
                            <button
                                className='rounded-lg border border-border px-4 py-2 text-sm text-text-secondary disabled:cursor-not-allowed disabled:opacity-50'
                                onClick={() => setPagination((prev) => ({
                                    ...prev,
                                    page: Math.min(prev.totalPages, prev.page + 1),
                                }))}
                                disabled={pagination.page >= pagination.totalPages}
                            >
                                التالي
                            </button>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}
