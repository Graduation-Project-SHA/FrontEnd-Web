import React from 'react'

interface CardProps {
    color?: string
    circleColor?: string
    icon?: React.ReactNode
    title?: string
    count?: number
    percentage?: string
}

export default function Card({ color, circleColor, icon, title, count = 0, percentage = '+0%' }: CardProps) {
    const isPositive = percentage.startsWith('+')

    return (
        <div dir='ltr' className='w-[17.6rem] font-["SFArabic-Regular"] rounded-3xl flex flex-col gap-5 py-4 px-5' style={{ backgroundColor: color }}>
            <div className='flex gap-4 w-full items-center justify-between'>
                <div className="w-[4rem] h-[4rem] rounded-full flex items-center justify-center" style={{ backgroundColor: circleColor }}>
                    {icon}
                </div>
                <div className='text-lg'>{title}</div>
            </div>

            <div className='flex justify-between w-full'>
                <div className='text-3xl font-bold'>{count.toLocaleString()}</div>
                <div className={`text-lg font-bold ${isPositive ? 'text-green-500' : 'text-red-500'}`}>
                    {percentage}
                </div>
            </div>
        </div>
    )
}
