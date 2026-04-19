import config from '../../../config';

export interface PatientInfo {
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
    latitude?: number | null;
    longitude?: number | null;
}

interface InfoRowProps {
    label: string;
    value: string;
}

const genderLabelMap: Record<string, string> = {
    MALE: 'ذكر',
    FEMALE: 'أنثى',
};

const formatDate = (value: string) => {
    try {
        return new Date(value).toLocaleDateString('ar-EG', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        });
    } catch {
        return value;
    }
};

const resolveProfileImage = (profileImage: string | null) => {
    if (!profileImage) {
        return null;
    }

    if (profileImage.startsWith('http://') || profileImage.startsWith('https://')) {
        return profileImage;
    }

    return `${config.apiBaseUrl}${profileImage}`;
};

const InfoRow = ({ label, value }: InfoRowProps) => (
    <div className='flex justify-between gap-4'>
        <p className='text-gray-600'>{label}</p>
        <p className='font-medium text-left'>{value}</p>
    </div>
);

export default function PatientProfileCard({ patient }: { patient: PatientInfo }) {
    const fullName = `${patient.firstName} ${patient.lastName}`;
    const imageUrl = resolveProfileImage(patient.profileImage);

    const infoItems = [
        { label: 'تمت الإضافة في', value: formatDate(patient.createdAt) },
        { label: 'تاريخ الميلاد', value: formatDate(patient.dateOfBirth) },
        { label: 'النوع', value: genderLabelMap[patient.gender] ?? patient.gender },
        { label: 'رقم الهاتف', value: patient.phone || 'غير متاح' },
        { label: 'البريد الإلكتروني', value: patient.email },
        { label: 'حالة البريد', value: patient.isEmailVerified ? 'موثق' : 'غير موثق' },
    ];

    return (
        <div className='mt-10 w-full lg:w-[30.1rem]'>
            <div className='w-full rounded-xl bg-white p-6 shadow-lg md:px-8'>
                <div className='flex items-center gap-5 border-b-2 border-gray-200 pb-5'>
                    <div className='h-[4.5rem] w-[4.5rem] flex-shrink-0 overflow-hidden rounded-xl bg-slate-100'>
                        {imageUrl ? (
                            <img
                                src={imageUrl}
                                alt={`${fullName} profile`}
                                className='h-full w-full object-cover'
                            />
                        ) : (
                            <div className='flex h-full w-full items-center justify-center text-xl font-bold text-primary'>
                                {patient.firstName.charAt(0).toUpperCase()}
                            </div>
                        )}
                    </div>

                    <div className='flex flex-col gap-1'>
                        <span className='inline-block w-fit rounded-md bg-[#ebf2f9] px-2 py-0.5 text-sm font-medium text-[#1f6db2]'>
                            #{patient.id}
                        </span>
                        <h2 className='text-lg font-bold'>{fullName}</h2>
                        <p className='text-sm text-gray-500'>بيانات المريض الفعلية من النظام</p>
                    </div>
                </div>

                <div className='mt-5 border-b-2 border-gray-200 pb-5'>
                    <h3 className='mb-4 font-bold'>المعلومات الأساسية</h3>
                    <div className='flex flex-col gap-4'>
                        {infoItems.map((item) => (
                            <InfoRow key={item.label} label={item.label} value={item.value} />
                        ))}
                    </div>
                </div>

                <div className='mt-5'>
                    <h3 className='mb-4 font-bold'>معلومات العنوان</h3>
                    <p>{patient.address || 'لا يوجد عنوان مسجل'}</p>
                </div>
            </div>
        </div>
    );
}
