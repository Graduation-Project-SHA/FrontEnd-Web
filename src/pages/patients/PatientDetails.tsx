import { useEffect, useMemo, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import PatientDetailsHeader from './components/PatientDetailsHeader';
import PatientProfileCard from './components/PatientProfileCard';
import type { PatientInfo } from './components/PatientProfileCard';
import MedicalRecords from './components/MedicalRecords';
import axiosInstance from '../../utils/axiosInstance';

export default function PatientDetails() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [patient, setPatient] = useState<PatientInfo | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchPatient = async () => {
            if (!id) {
                setError('معرف المريض غير صالح.');
                setIsLoading(false);
                return;
            }

            setIsLoading(true);
            setError(null);

            try {
                const response = await axiosInstance.get(`/admin/patients/${id}`);
                setPatient(response.data.data as PatientInfo);
            } catch (requestError) {
                console.error('Failed to fetch patient details:', requestError);
                setError('تعذر تحميل تفاصيل المريض.');
            } finally {
                setIsLoading(false);
            }
        };

        fetchPatient();
    }, [id]);

    const patientName = useMemo(() => {
        if (!patient) {
            return undefined;
        }

        return `${patient.firstName} ${patient.lastName}`;
    }, [patient]);

    const handlePatientUpdated = (updated: PatientInfo) => {
        setPatient(updated);
    };

    const handlePatientDeleted = () => {
        navigate('/patients');
    };

    if (isLoading) {
        return (
            <div className='flex min-h-[40vh] items-center justify-center text-text-secondary'>
                جاري تحميل تفاصيل المريض...
            </div>
        );
    }

    if (error || !patient) {
        return (
            <div className='flex min-h-[40vh] items-center justify-center text-danger'>
                {error || 'لم يتم العثور على بيانات المريض.'}
            </div>
        );
    }

    return (
        <div className='px-2 md:px-5' dir='rtl'>
            <PatientDetailsHeader patientName={patientName} />
            <div className='mt-4 flex flex-col gap-8 xl:flex-row'>
                <PatientProfileCard
                    patient={patient}
                    onPatientUpdated={handlePatientUpdated}
                    onPatientDeleted={handlePatientDeleted}
                />

                <div className='mt-2 flex w-full flex-col gap-8'>
                    <MedicalRecords patientId={patient.id} />
                </div>
            </div>
        </div>
    );
}
