import { MdOutlineKeyboardDoubleArrowLeft } from 'react-icons/md';
import { TiArrowLeft } from 'react-icons/ti';
import { Link } from 'react-router-dom';

interface PatientDetailsHeaderProps {
    patientName?: string;
}

export default function PatientDetailsHeader({ patientName }: PatientDetailsHeaderProps) {
    return (
        <div>
            <div className='flex flex-wrap items-center justify-between gap-3 w-full'>
                <div className='flex items-center gap-2 font-bold'>
                    <p>صفحة المرضى</p>
                    <MdOutlineKeyboardDoubleArrowLeft />
                    <p>{patientName ? `تفاصيل ${patientName}` : 'تفاصيل المريض'}</p>
                </div>
                <div>
                    <Link to='/patients' className='flex items-center gap-2 font-bold text-[#2B73F3]'>
                        العودة
                        <TiArrowLeft />
                    </Link>
                </div>
            </div>

            <div className='mt-8 flex gap-3'>
                <button className='h-[2.5rem] w-[8.2rem] cursor-default rounded-lg bg-[#2B73F3] font-medium text-white'>
                    تفاصيل المريض
                </button>
                <button className='h-[2.5rem] w-[8.2rem] cursor-not-allowed rounded-lg border border-[#E2E8F0] font-medium text-gray-500'>
                    التأمين الصحي
                </button>
            </div>
        </div>
    );
}
