import React from 'react'

interface InputProps {
    label: string;
    type: string;
    placeholder: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    name: string;
}

export default function Input({
    label,
    type,
    placeholder,
    onChange,
    name,
}: InputProps) {
    return (
        <div className=' flex flex-col ' dir='rtl'>
            <label className='font-medium mb-2'>{label}</label>
            <input
                className=' w-[30.5rem] text-[#717171] bg-white  placeholder:text-[#717171] placeholder:opacity-100 px-5 h-[3.8rem] rounded-2xl opacity-50 shadow-lg border-1 border-black/10 '
                type={type}
                name={name}
                placeholder={placeholder}
                onChange={onChange}
            />
        </div>
    )
}
