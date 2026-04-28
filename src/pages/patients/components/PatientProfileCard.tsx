import { useState } from 'react';
import config from '../../../config';
import axiosInstance from '../../../utils/axiosInstance';

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
    isEditing?: boolean;
    onValueChange?: (value: string) => void;
    inputType?: 'text' | 'email' | 'tel' | 'date';
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

const InfoRow = ({ label, value, isEditing, onValueChange, inputType = 'text' }: InfoRowProps) => (
    <div className='flex justify-between gap-4'>
        <p className='text-gray-600'>{label}</p>
        {isEditing && onValueChange ? (
            <input
                type={inputType}
                value={value}
                onChange={(e) => onValueChange(e.target.value)}
                className='rounded border border-border px-2 py-1 text-sm font-medium text-left focus:outline-none focus:border-primary'
            />
        ) : (
            <p className='font-medium text-left'>{value}</p>
        )}
    </div>
);

interface Props {
    patient: PatientInfo;
    onPatientUpdated?: (updated: PatientInfo) => void;
    onPatientDeleted?: () => void;
}

export default function PatientProfileCard({ patient, onPatientUpdated, onPatientDeleted }: Props) {
    const fullName = `${patient.firstName} ${patient.lastName}`;
    const imageUrl = resolveProfileImage(patient.profileImage);

    const [isEditing, setIsEditing] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const [deleteConfirm, setDeleteConfirm] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const [editData, setEditData] = useState({
        firstName: patient.firstName,
        lastName: patient.lastName,
        email: patient.email,
        phone: patient.phone || '',
    });

    const handleEdit = () => {
        setIsEditing(true);
        setError(null);
    };

    const handleCancel = () => {
        setIsEditing(false);
        setEditData({
            firstName: patient.firstName,
            lastName: patient.lastName,
            email: patient.email,
            phone: patient.phone || '',
        });
        setError(null);
    };

    const handleSave = async () => {
        setIsSaving(true);
        setError(null);

        try {
            const response = await axiosInstance.patch(`/admin/patients/${patient.id}`, editData);
            setIsEditing(false);
            if (onPatientUpdated) {
                onPatientUpdated(response.data.data);
            }
        } catch (err) {
            console.error('Failed to update patient:', err);
            setError('فشل تحديث بيانات المريض. يرجى المحاولة لاحقا.');
        } finally {
            setIsSaving(false);
        }
    };

    const handleDelete = async () => {
        if (!deleteConfirm) {
            setDeleteConfirm(true);
            return;
        }

        setIsDeleting(true);
        setError(null);

        try {
            await axiosInstance.delete(`/admin/patients/${patient.id}`);
            if (onPatientDeleted) {
                onPatientDeleted();
            }
        } catch (err) {
            console.error('Failed to delete patient:', err);
            setError('فشل حذف المريض. يرجى المحاولة لاحقا.');
        } finally {
            setIsDeleting(false);
            setDeleteConfirm(false);
        }
    };

    const infoItems = [
        { label: 'تمت الإضافة في', value: formatDate(patient.createdAt), editable: false },
        { label: 'تاريخ الميلاد', value: formatDate(patient.dateOfBirth), editable: false },
        { label: 'النوع', value: genderLabelMap[patient.gender] ?? patient.gender, editable: false },
        { label: 'رقم الهاتف', value: editData.phone, editable: true, key: 'phone' },
        { label: 'البريد الإلكتروني', value: editData.email, editable: true, key: 'email' },
        { label: 'حالة البريد', value: patient.isEmailVerified ? 'موثق' : 'غير موثق', editable: false },
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

                {error && (
                    <div className='mt-4 rounded-lg border border-danger bg-danger-bg px-3 py-2 text-sm text-danger'>
                        {error}
                    </div>
                )}

                <div className='mt-5 border-b-2 border-gray-200 pb-5'>
                    <div className='mb-4 flex items-center justify-between'>
                        <h3 className='font-bold'>المعلومات الأساسية</h3>
                        {!isEditing && (
                            <button
                                onClick={handleEdit}
                                className='rounded bg-primary px-3 py-1 text-sm text-white hover:bg-primary-dark'
                            >
                                تعديل
                            </button>
                        )}
                    </div>
                    <div className='flex flex-col gap-4'>
                        {isEditing ? (
                            <>
                                <InfoRow
                                    label='الاسم الأول'
                                    value={editData.firstName}
                                    isEditing
                                    onValueChange={(val) => setEditData({ ...editData, firstName: val })}
                                    inputType='text'
                                />
                                <InfoRow
                                    label='اسم العائلة'
                                    value={editData.lastName}
                                    isEditing
                                    onValueChange={(val) => setEditData({ ...editData, lastName: val })}
                                    inputType='text'
                                />
                                <InfoRow
                                    label='البريد الإلكتروني'
                                    value={editData.email}
                                    isEditing
                                    onValueChange={(val) => setEditData({ ...editData, email: val })}
                                    inputType='email'
                                />
                                <InfoRow
                                    label='رقم الهاتف'
                                    value={editData.phone}
                                    isEditing
                                    onValueChange={(val) => setEditData({ ...editData, phone: val })}
                                    inputType='tel'
                                />
                            </>
                        ) : (
                            infoItems.map((item) => (
                                <InfoRow key={item.label} label={item.label} value={item.value} />
                            ))
                        )}
                    </div>

                    {isEditing && (
                        <div className='mt-4 flex gap-2'>
                            <button
                                onClick={handleSave}
                                disabled={isSaving}
                                className='flex-1 rounded bg-success px-4 py-2 text-sm text-white hover:bg-green-600 disabled:opacity-50'
                            >
                                {isSaving ? 'جاري الحفظ...' : 'حفظ'}
                            </button>
                            <button
                                onClick={handleCancel}
                                disabled={isSaving}
                                className='flex-1 rounded border border-border bg-white px-4 py-2 text-sm hover:bg-gray-50 disabled:opacity-50'
                            >
                                إلغاء
                            </button>
                        </div>
                    )}
                </div>

                <div className='mt-5'>
                    <div className='mb-3 flex items-center justify-between'>
                        <h3 className='font-bold'>معلومات العنوان</h3>
                    </div>
                    <p>{patient.address || 'لا يوجد عنوان مسجل'}</p>
                </div>

                {!isEditing && (
                    <div className='mt-5 flex gap-2'>
                        <button
                            onClick={handleDelete}
                            disabled={isDeleting}
                            className={`flex-1 rounded px-4 py-2 text-sm text-white ${
                                deleteConfirm
                                    ? 'bg-red-600 hover:bg-red-700'
                                    : 'bg-danger hover:bg-red-600'
                            } disabled:opacity-50`}
                        >
                            {isDeleting ? 'جاري الحذف...' : deleteConfirm ? 'تأكيد الحذف' : 'حذف'}
                        </button>
                        {deleteConfirm && (
                            <button
                                onClick={() => setDeleteConfirm(false)}
                                className='flex-1 rounded border border-border bg-white px-4 py-2 text-sm hover:bg-gray-50'
                            >
                                إلغاء
                            </button>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
