import React from 'react'

export interface VitalSign {
    label: string
    value: string
    icon: string
    bgColor: string
}

const VitalCard: React.FC<VitalSign> = ({ label, value, icon, bgColor }) => (
    <div className='flex gap-4 w-[11.8rem]'>
        <div
            className='w-[3rem] h-[3rem] rounded-lg flex items-center justify-center'
            style={{ backgroundColor: bgColor }}
        >
            <img src={icon} alt={`${label} icon`} className='w-6 h-6' />
        </div>
        <div className='flex flex-col'>
            <p className='font-normal'>{label}</p>
            <p className='text-gray-600'>{value}</p>
        </div>
    </div>
)

export default VitalCard
