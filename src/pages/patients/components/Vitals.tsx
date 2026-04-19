import VitalCard from './VitalCard'
import type { VitalSign } from './VitalCard'

interface VitalsProps {
    vitals?: VitalSign[]
}

export default function Vitals({ vitals }: VitalsProps) {
    const defaultVitals: VitalSign[] = [
        {
            label: 'ضغط الدم',
            value: '120/80 mmHg',
            icon: '/icons/Icon.svg',
            bgColor: '#EEFBF4'
        },
        {
            label: 'معدل النبض',
            value: '89 Bpm',
            icon: '/icons/Icon-1.svg',
            bgColor: '#FDEEED'
        },
        {
            label: 'تشبع الأكسجين',
            value: '98%',
            icon: '/icons/Icon-2.svg',
            bgColor: '#E8F4FD'
        },
        {
            label: 'الوزن',
            value: '75 kg',
            icon: '/icons/Icon-3.svg',
            bgColor: '#FFF4E6'
        },
        {
            label: 'معدل التنفس',
            value: '16 /min',
            icon: '/icons/Icon-4.svg',
            bgColor: '#F3E8FF'
        },
        {
            label: 'درجة الحرارة',
            value: '37°C',
            icon: '/icons/Icon-5.svg',
            bgColor: '#FEF2F2'
        }
    ]

    const vitalData = vitals || defaultVitals

    return (
        <div className=''>
            <h3 className='font-bold mb-4 px-10'>العلامات الحيوية</h3>
            <div className='flex w-full flex-wrap gap-6 rounded-2xl px-6 py-5 shadow-lg lg:w-[70rem]'>
                {vitalData.map((vital, index) => (
                    <VitalCard key={index} {...vital} />
                ))}
            </div>
        </div>
    )
}

