import { Link } from 'react-router-dom';

export default function CreateRole() {
    return (
        <div className='mx-auto max-w-2xl p-8 font-["SFArabic-Regular"]' dir='rtl'>
            <div className='rounded-2xl border border-border bg-surface p-8 shadow-card'>
                <h1 className='mb-3 text-2xl font-bold text-primary'>تم إيقاف إنشاء الأدوار</h1>
                <p className='mb-6 text-text-secondary leading-7'>
                    النظام الحالي لا يدعم إنشاء أدوار مخصصة. الأدوار المتاحة ثابتة: USER و DOCTOR و ADMIN.
                </p>
                <Link
                    to='/roles'
                    className='inline-flex rounded-lg bg-primary px-5 py-2.5 font-semibold text-white transition-colors hover:bg-primary-dark'
                >
                    العودة إلى صفحة الأدوار
                </Link>
            </div>
        </div>
    );
}
