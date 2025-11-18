import React from 'react'
import { MdOutlineKeyboardDoubleArrowLeft } from "react-icons/md";
import { TiArrowLeft } from "react-icons/ti";
import { Link } from 'react-router-dom';
import PatientDetailsHeader from './components/PatientDetailsHeader';
import PatientProfileCard from './components/PatientProfileCard';
import Vitals from './components/Vitals';
import DoctorVists from './components/DoctorVists';

export default function PatientDetails() {
    return (
        <div className='px-5'>
            <PatientDetailsHeader />
            <div className='flex gap-10'>
                <PatientProfileCard />

                <div className='flex flex-col gap-10 mt-10'>
                    <Vitals />
                    <DoctorVists />
                </div>

            </div>
        </div>

    )
}
