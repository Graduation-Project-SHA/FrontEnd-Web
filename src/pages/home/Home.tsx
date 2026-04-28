import { useMemo } from 'react';
import Card from '../../components/ui/Card';
import { useDashboardStats } from '../../hooks/useDashboardStats';

export default function Home() {
  const { stats, isLoading, error, refetch } = useDashboardStats();

  const mainCards = useMemo(() => {
    if (!stats) return [];

    return [
      {
        title: 'إجمالي المرضى',
        count: stats.patients.total,
        color: '#EAF3FF',
        circleColor: '#2B73F3',
        icon: (
          <svg className='h-6 w-6 text-white' fill='currentColor' viewBox='0 0 20 20'>
            <path d='M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z' />
          </svg>
        ),
      },
      {
        title: 'إجمالي الأطباء',
        count: stats.doctors.total,
        color: '#EEFBF4',
        circleColor: '#10B981',
        icon: (
          <svg className='h-6 w-6 text-white' fill='currentColor' viewBox='0 0 20 20'>
            <path d='M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z' />
          </svg>
        ),
      },
      {
        title: 'إجمالي المواعيد',
        count: stats.appointments.total,
        color: '#F4ECFF',
        circleColor: '#8B5CF6',
        icon: (
          <svg className='h-6 w-6 text-white' fill='currentColor' viewBox='0 0 20 20'>
            <path fillRule='evenodd' d='M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v9a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zM4 8h12v7H4V8z' clipRule='evenodd' />
          </svg>
        ),
      },
      {
        title: 'إجمالي طلبات التبرع',
        count: stats.donations.total,
        color: '#FFF4E6',
        circleColor: '#F59E0B',
        icon: (
          <svg className='h-6 w-6 text-white' fill='currentColor' viewBox='0 0 20 20'>
            <path d='M10 2C7 6 5 8.5 5 11a5 5 0 0010 0c0-2.5-2-5-5-9z' />
          </svg>
        ),
      },
      {
        title: 'إجمالي حجوزات الرعاية',
        count: stats.homeCare.totalBookings,
        color: '#E8F7FB',
        circleColor: '#0891B2',
        icon: (
          <svg className='h-6 w-6 text-white' fill='currentColor' viewBox='0 0 20 20'>
            <path d='M10 2a2 2 0 012 2v2h2a2 2 0 012 2v3a7 7 0 11-12 0V8a2 2 0 012-2h2V4a2 2 0 012-2z' />
          </svg>
        ),
      },
      {
        title: 'إجمالي الممرضين',
        count: stats.homeCare.totalNurses,
        color: '#F0FDF4',
        circleColor: '#22C55E',
        icon: (
          <svg className='h-6 w-6 text-white' fill='currentColor' viewBox='0 0 20 20'>
            <path d='M10 2a4 4 0 00-4 4v1H5a2 2 0 00-2 2v6a3 3 0 003 3h8a3 3 0 003-3V9a2 2 0 00-2-2h-1V6a4 4 0 00-4-4zm-1 5V6a1 1 0 112 0v1h-2z' />
          </svg>
        ),
      },
    ];
  }, [stats]);

  const statusMetrics = useMemo(() => {
    if (!stats) return [];

    return [
      {
        label: 'مرضى موثقون',
        value: stats.patients.verified,
        percentage: stats.patients.total
          ? Math.round((stats.patients.verified / stats.patients.total) * 100)
          : 0,
        bgColor: '#E5F7F0',
        textColor: '#10B981',
      },
      {
        label: 'أطباء موثقون',
        value: stats.doctors.verified,
        percentage: stats.doctors.total
          ? Math.round((stats.doctors.verified / stats.doctors.total) * 100)
          : 0,
        bgColor: '#E5F7F0',
        textColor: '#10B981',
      },
      {
        label: 'أطباء بانتظار التوثيق',
        value: stats.doctors.pending,
        percentage: stats.doctors.total
          ? Math.round((stats.doctors.pending / stats.doctors.total) * 100)
          : 0,
        bgColor: '#FFF4E5',
        textColor: '#F59E0B',
      },
      {
        label: 'مواعيد مؤكدة',
        value: stats.appointments.confirmed,
        percentage: stats.appointments.total
          ? Math.round((stats.appointments.confirmed / stats.appointments.total) * 100)
          : 0,
        bgColor: '#E5F7F0',
        textColor: '#10B981',
      },
      {
        label: 'مواعيد قيد الانتظار',
        value: stats.appointments.pending,
        percentage: stats.appointments.total
          ? Math.round((stats.appointments.pending / stats.appointments.total) * 100)
          : 0,
        bgColor: '#FFF4E5',
        textColor: '#F59E0B',
      },
      {
        label: 'مواعيد اليوم',
        value: stats.appointments.today,
        percentage: stats.appointments.total
          ? Math.round((stats.appointments.today / stats.appointments.total) * 100)
          : 0,
        bgColor: '#EEF4FF',
        textColor: '#2B73F3',
      },
      {
        label: 'ممرضون موثقون',
        value: stats.homeCare.verifiedNurses,
        percentage: stats.homeCare.totalNurses
          ? Math.round((stats.homeCare.verifiedNurses / stats.homeCare.totalNurses) * 100)
          : 0,
        bgColor: '#E5F7F0',
        textColor: '#10B981',
      },
      {
        label: 'ممرضون بانتظار التوثيق',
        value: stats.homeCare.pendingNurses,
        percentage: stats.homeCare.totalNurses
          ? Math.round((stats.homeCare.pendingNurses / stats.homeCare.totalNurses) * 100)
          : 0,
        bgColor: '#FFF4E5',
        textColor: '#F59E0B',
      },
    ];
  }, [stats]);

  return (
    <div className='px-4 py-4 md:px-8 md:py-8 font-["SFArabic-Regular"]' dir='rtl'>
      {/* Header */}
      <div className='mb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4'>
        <div>
          <h2 className='text-2xl md:text-3xl font-bold text-text-primary'>لوحة الإحصاءات</h2>
          <p className='mt-1 text-sm md:text-base text-text-secondary'>
            نظرة عامة على أنشطة النظام والإحصائيات الرئيسية
          </p>
        </div>
        <button
          onClick={() => refetch()}
          disabled={isLoading}
          className='rounded-lg border border-border bg-white px-4 py-2 text-sm font-medium text-text-secondary hover:border-primary hover:text-primary disabled:opacity-50'
        >
          {isLoading ? 'جاري التحديث...' : 'تحديث'}
        </button>
      </div>

      {/* Error Alert */}
      {error && (
        <div className='mb-6 rounded-xl border border-danger bg-danger-bg px-4 py-3 text-sm text-danger'>
          {error}
        </div>
      )}

      {/* Main Stats Cards */}
      {isLoading ? (
        <div className='mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3'>
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className='h-40 animate-pulse rounded-3xl border border-border bg-surface' />
          ))}
        </div>
      ) : (
        <div className='mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3'>
          {mainCards.map((card) => (
            <Card
              key={card.title}
              title={card.title}
              count={card.count}
              color={card.color}
              circleColor={card.circleColor}
              icon={card.icon}
              percentage=''
            />
          ))}
        </div>
      )}

      {/* Status Metrics Grid */}
      {!isLoading && stats && (
        <section className='rounded-2xl border border-border bg-surface p-4 md:p-6 shadow-card'>
          <h3 className='mb-4 text-lg md:text-xl font-bold text-text-primary'>التفاصيل التشغيلية</h3>
          <div className='grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4'>
            {statusMetrics.map((metric) => (
              <div
                key={metric.label}
                className='rounded-xl border border-border-light p-4'
                style={{ backgroundColor: metric.bgColor }}
              >
                <p className='text-sm text-text-secondary'>{metric.label}</p>
                <p className='mt-2 text-2xl font-bold' style={{ color: metric.textColor }}>
                  {metric.value.toLocaleString('ar-EG')}
                </p>
                <p className='mt-2 text-xs' style={{ color: metric.textColor }}>
                  {metric.percentage}%
                </p>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
