import { useEffect, useMemo, useState } from 'react';
import { FiDroplet, FiSearch } from 'react-icons/fi';
import { FaHandHoldingMedical } from 'react-icons/fa6';
import Table from '../../components/ui/Table';
import axiosInstance from '../../utils/axiosInstance';

type DonationTypeFilter = 'ALL' | 'BLOOD' | 'MEDICAL_DEVICE';
type DonationStatus = 'PENDING' | 'FULFILLED' | 'CANCELLED';

interface RequesterInfo {
    id: number;
    firstName: string;
    lastName: string;
    profileImage: string | null;
}

interface DonationItem {
    id: number;
    donationType: DonationTypeFilter | string;
    bloodType: string | null;
    deviceType: string | null;
    reason: string | null;
    location: string;
    status: DonationStatus;
    createdAt: string;
    requester: RequesterInfo | null;
}

interface DonationsPagination {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
}

const initialPagination: DonationsPagination = {
    total: 0,
    page: 1,
    limit: 10,
    totalPages: 1,
};

const typeTabs: Array<{ label: string; value: DonationTypeFilter }> = [
    { label: 'الكل', value: 'ALL' },
    { label: 'تبرع دم', value: 'BLOOD' },
    { label: 'جهاز طبي', value: 'MEDICAL_DEVICE' },
];

const statusMap: Record<DonationStatus, { label: string; className: string }> = {
    PENDING: {
        label: 'قيد المراجعة',
        className: 'bg-warning-bg text-warning',
    },
    FULFILLED: {
        label: 'تم التنفيذ',
        className: 'bg-success-bg text-success',
    },
    CANCELLED: {
        label: 'ملغي',
        className: 'bg-danger-bg text-danger',
    },
};

const typeLabelMap: Record<string, string> = {
    BLOOD: 'تبرع دم',
    MEDICAL_DEVICE: 'جهاز طبي',
};

const formatBloodType = (bloodType: string | null) => {
    if (!bloodType) {
        return '-';
    }

    const bloodMap: Record<string, string> = {
        A_POSITIVE: 'A+',
        A_NEGATIVE: 'A-',
        B_POSITIVE: 'B+',
        B_NEGATIVE: 'B-',
        AB_POSITIVE: 'AB+',
        AB_NEGATIVE: 'AB-',
        O_POSITIVE: 'O+',
        O_NEGATIVE: 'O-',
    };

    return bloodMap[bloodType] ?? bloodType;
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

export default function Donations() {
    const [donations, setDonations] = useState<DonationItem[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [activeType, setActiveType] = useState<DonationTypeFilter>('ALL');
    const [searchTerm, setSearchTerm] = useState('');
    const [pagination, setPagination] = useState<DonationsPagination>(initialPagination);

    useEffect(() => {
        const fetchDonations = async () => {
            setIsLoading(true);
            setError(null);

            try {
                const response = await axiosInstance.get('/donations', {
                    params: {
                        page: pagination.page,
                        limit: pagination.limit,
                        type: activeType === 'ALL' ? undefined : activeType,
                        search: searchTerm.trim() || undefined,
                    },
                });

                const list = Array.isArray(response.data?.data)
                    ? (response.data.data as DonationItem[])
                    : [];

                const nextPagination = response.data?.pagination as Partial<DonationsPagination> | undefined;

                setDonations(list);
                setPagination((prev) => ({
                    ...prev,
                    total: typeof nextPagination?.total === 'number' ? nextPagination.total : prev.total,
                    totalPages:
                        typeof nextPagination?.totalPages === 'number'
                            ? Math.max(1, nextPagination.totalPages)
                            : prev.totalPages,
                }));
            } catch (requestError: unknown) {
                console.error('Failed to load donations:', requestError);
                setError('تعذر تحميل طلبات التبرع حاليا.');
            } finally {
                setIsLoading(false);
            }
        };

        fetchDonations();
    }, [pagination.page, pagination.limit, activeType, searchTerm]);

    const tableRows = useMemo(() => {
        return donations.map((item) => {
            const requesterName = item.requester
                ? `${item.requester.firstName} ${item.requester.lastName}`
                : 'غير معروف';

            const details = item.donationType === 'BLOOD'
                ? formatBloodType(item.bloodType)
                : item.deviceType || '-';

            return {
                id: item.id,
                requester: requesterName,
                donationType: typeLabelMap[item.donationType] ?? item.donationType,
                details,
                location: item.location,
                status: item.status,
                createdAt: formatDate(item.createdAt),
            };
        });
    }, [donations]);

    const goToPage = (nextPage: number) => {
        setPagination((prev) => ({ ...prev, page: nextPage }));
    };

    return (
        <div className='p-4 md:p-8 font-["SFArabic-Regular"]' dir='rtl'>
            <div className='mb-6 flex flex-wrap items-center justify-between gap-3'>
                <div>
                    <h1 className='text-3xl font-bold text-primary'>طلبات التبرع</h1>
                    <p className='mt-1 text-text-secondary'>
                        متابعة الطلبات حسب النوع والموقع وحالة التنفيذ.
                    </p>
                </div>
                <div className='rounded-full bg-primary px-4 py-2 text-sm font-semibold text-white'>
                    الإجمالي: {pagination.total.toLocaleString('ar-EG')}
                </div>
            </div>

            <div className='mb-5 rounded-2xl border border-border bg-surface p-4 shadow-card'>
                <div className='mb-4 flex flex-wrap gap-2'>
                    {typeTabs.map((tab) => (
                        <button
                            key={tab.value}
                            onClick={() => {
                                setActiveType(tab.value);
                                goToPage(1);
                            }}
                            className={`rounded-full border px-4 py-2 text-sm font-medium transition-colors ${
                                activeType === tab.value
                                    ? 'border-primary bg-primary text-white'
                                    : 'border-border bg-white text-text-secondary hover:border-primary hover:text-primary'
                            }`}
                        >
                            {tab.value === 'BLOOD' && <FiDroplet className='ml-1 inline' />}
                            {tab.value === 'MEDICAL_DEVICE' && <FaHandHoldingMedical className='ml-1 inline' />}
                            {tab.label}
                        </button>
                    ))}
                </div>

                <div className='relative'>
                    <FiSearch className='pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-text-muted' />
                    <input
                        type='text'
                        value={searchTerm}
                        onChange={(event) => {
                            setSearchTerm(event.target.value);
                            goToPage(1);
                        }}
                        placeholder='ابحث بفصيلة الدم أو نوع الجهاز'
                        className='w-full rounded-xl border border-border px-10 py-2.5 outline-none transition-colors focus:border-primary'
                    />
                </div>
            </div>

            {error && (
                <div className='mb-4 rounded-xl border border-danger bg-danger-bg px-4 py-3 text-sm text-danger'>
                    {error}
                </div>
            )}

            {isLoading ? (
                <div className='rounded-2xl border border-border bg-surface p-6 shadow-card'>
                    <div className='mb-4 h-6 w-48 animate-pulse rounded bg-slate-200' />
                    <div className='space-y-3'>
                        {Array.from({ length: 6 }).map((_, index) => (
                            <div key={index} className='h-12 animate-pulse rounded-lg bg-slate-100' />
                        ))}
                    </div>
                </div>
            ) : donations.length === 0 ? (
                <div className='rounded-2xl border border-dashed border-border bg-surface p-10 text-center shadow-card'>
                    <div className='mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-primary-bg text-primary'>
                        <FiDroplet size={24} />
                    </div>
                    <h2 className='mb-2 text-xl font-bold text-text-primary'>لا توجد طلبات مطابقة</h2>
                    <p className='text-text-secondary'>
                        جرّب تغيير النوع أو تعديل عبارة البحث لإظهار نتائج أخرى.
                    </p>
                </div>
            ) : (
                <>
                    <Table
                        tableHeader='قائمة الطلبات'
                        totalCount={pagination.total}
                        showSearch={false}
                        showFilter={false}
                        columns={[
                            { key: 'id', header: 'رقم الطلب' },
                            { key: 'requester', header: 'صاحب الطلب' },
                            { key: 'donationType', header: 'النوع' },
                            { key: 'details', header: 'فصيلة الدم / الجهاز' },
                            { key: 'location', header: 'الموقع' },
                            {
                                key: 'status',
                                header: 'الحالة',
                                render: (row) => {
                                    const statusData = statusMap[(row.status as DonationStatus) || 'PENDING'];

                                    return (
                                        <span className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${statusData.className}`}>
                                            {statusData.label}
                                        </span>
                                    );
                                },
                            },
                            { key: 'createdAt', header: 'تاريخ الإنشاء' },
                        ]}
                        data={tableRows}
                    />

                    <div className='mt-4 flex flex-wrap items-center justify-between gap-3'>
                        <p className='text-sm text-text-secondary'>
                            الصفحة {pagination.page} من {pagination.totalPages}
                        </p>

                        <div className='flex gap-2'>
                            <button
                                onClick={() => goToPage(Math.max(1, pagination.page - 1))}
                                disabled={pagination.page === 1}
                                className='rounded-lg border border-border bg-white px-4 py-2 text-sm text-text-secondary disabled:cursor-not-allowed disabled:opacity-50'
                            >
                                السابق
                            </button>
                            <button
                                onClick={() => goToPage(Math.min(pagination.totalPages, pagination.page + 1))}
                                disabled={pagination.page === pagination.totalPages}
                                className='rounded-lg border border-border bg-white px-4 py-2 text-sm text-text-secondary disabled:cursor-not-allowed disabled:opacity-50'
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
