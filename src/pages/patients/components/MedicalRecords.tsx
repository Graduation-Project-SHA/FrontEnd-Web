import { useEffect, useState } from 'react';
import axiosInstance from '../../../utils/axiosInstance';

interface MedicalProfile {
  id: number;
  bloodType?: string;
  height?: number;
  weight?: number;
  allergies?: string;
  chronicDiseases?: string;
  currentMedications?: string;
  emergencyContact?: string;
  emergencyPhone?: string;
  insuranceProvider?: string;
  insuranceNumber?: string;
}

interface MedicalRecordsProps {
  patientId: number;
}

export default function MedicalRecords({ patientId }: MedicalRecordsProps) {
  const [profile, setProfile] = useState<MedicalProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMedicalProfile = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const response = await axiosInstance.get<{ data: MedicalProfile }>(
          `/admin/patients/${patientId}/medical-records`
        );
        setProfile(response.data.data || null);
      } catch (err) {
        console.error('Failed to fetch medical profile:', err);
        setError('تعذر تحميل الملف الطبي.');
      } finally {
        setIsLoading(false);
      }
    };

    if (patientId) {
      fetchMedicalProfile();
    }
  }, [patientId]);

  if (isLoading) {
    return (
      <div className='w-full rounded-2xl bg-white px-8 py-6 shadow-lg lg:w-[70rem]'>
        <h3 className='mb-6 text-lg font-bold'>الملف الطبي</h3>
        <div className='space-y-3'>
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className='h-10 animate-pulse rounded-lg bg-slate-200' />
          ))}
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className='w-full rounded-2xl bg-white px-8 py-6 shadow-lg lg:w-[70rem]'>
        <h3 className='mb-6 text-lg font-bold'>الملف الطبي</h3>
        <div className='rounded-xl border border-dashed border-border bg-surface-alt p-5 text-sm text-text-secondary'>
          لا توجد بيانات طبية متاحة لهذا المريض.
        </div>
      </div>
    );
  }

  return (
    <div className='w-full rounded-2xl bg-white px-8 py-6 shadow-lg lg:w-[70rem]'>
      <h3 className='mb-6 text-lg font-bold'>الملف الطبي</h3>

      {error && (
        <div className='mb-4 rounded-lg border border-danger bg-danger-bg px-4 py-3 text-sm text-danger'>
          {error}
        </div>
      )}

      <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
        {/* Blood Type */}
        {profile.bloodType && (
          <div className='rounded-lg border border-border bg-surface-alt p-4'>
            <p className='text-xs font-medium text-text-secondary'>فصيلة الدم</p>
            <p className='mt-1 text-sm font-semibold text-text-primary'>
              {profile.bloodType}
            </p>
          </div>
        )}

        {/* Height */}
        {profile.height && (
          <div className='rounded-lg border border-border bg-surface-alt p-4'>
            <p className='text-xs font-medium text-text-secondary'>الطول</p>
            <p className='mt-1 text-sm font-semibold text-text-primary'>
              {profile.height} سم
            </p>
          </div>
        )}

        {/* Weight */}
        {profile.weight && (
          <div className='rounded-lg border border-border bg-surface-alt p-4'>
            <p className='text-xs font-medium text-text-secondary'>الوزن</p>
            <p className='mt-1 text-sm font-semibold text-text-primary'>
              {profile.weight} كجم
            </p>
          </div>
        )}

        {/* Insurance Provider */}
        {profile.insuranceProvider && (
          <div className='rounded-lg border border-border bg-surface-alt p-4'>
            <p className='text-xs font-medium text-text-secondary'>مزود التأمين</p>
            <p className='mt-1 text-sm font-semibold text-text-primary'>
              {profile.insuranceProvider}
            </p>
          </div>
        )}
      </div>

      {/* Allergies */}
      {profile.allergies && (
        <div className='mt-4 rounded-lg border border-border bg-surface-alt p-4'>
          <p className='text-xs font-medium text-text-secondary'>الحساسيات</p>
          <p className='mt-2 text-sm text-text-primary'>{profile.allergies}</p>
        </div>
      )}

      {/* Chronic Diseases */}
      {profile.chronicDiseases && (
        <div className='mt-4 rounded-lg border border-border bg-surface-alt p-4'>
          <p className='text-xs font-medium text-text-secondary'>الأمراض المزمنة</p>
          <p className='mt-2 text-sm text-text-primary'>
            {profile.chronicDiseases}
          </p>
        </div>
      )}

      {/* Current Medications */}
      {profile.currentMedications && (
        <div className='mt-4 rounded-lg border border-border bg-surface-alt p-4'>
          <p className='text-xs font-medium text-text-secondary'>الأدوية الحالية</p>
          <p className='mt-2 text-sm text-text-primary'>
            {profile.currentMedications}
          </p>
        </div>
      )}

      {/* Emergency Contact */}
      {profile.emergencyContact && (
        <div className='mt-4 grid grid-cols-1 gap-4 md:grid-cols-2'>
          <div className='rounded-lg border border-border bg-surface-alt p-4'>
            <p className='text-xs font-medium text-text-secondary'>
              جهة الاتصال في الطوارئ
            </p>
            <p className='mt-1 text-sm font-semibold text-text-primary'>
              {profile.emergencyContact}
            </p>
          </div>
          {profile.emergencyPhone && (
            <div className='rounded-lg border border-border bg-surface-alt p-4'>
              <p className='text-xs font-medium text-text-secondary'>
                هاتف الطوارئ
              </p>
              <p className='mt-1 text-sm font-semibold text-text-primary'>
                {profile.emergencyPhone}
              </p>
            </div>
          )}
        </div>
      )}

      {/* Insurance Number */}
      {profile.insuranceNumber && (
        <div className='mt-4 rounded-lg border border-border bg-surface-alt p-4'>
          <p className='text-xs font-medium text-text-secondary'>رقم التأمين</p>
          <p className='mt-1 text-sm font-semibold text-text-primary'>
            {profile.insuranceNumber}
          </p>
        </div>
      )}
    </div>
  );
}
