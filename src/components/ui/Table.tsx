import React, { useState } from 'react'

interface Column<T = any> {
    key: string
    header: string
    render?: (row: T, index: number) => React.ReactNode
    width?: string
}

interface ActionItem<T = any> {
    label: string
    onClick: (row: T, index: number) => void
    className?: string
    icon?: React.ReactNode
}

interface TableProps<T = any> {
    tableHeader?: string
    totalCount?: number
    showSearch?: boolean
    showFilter?: boolean
    searchPlaceholder?: string
    filterOptions?: { label: string; value: string }[]
    columns: Column<T>[]
    data: T[]
    onSearch?: (value: string) => void
    onFilterChange?: (value: string) => void
    actions?: ActionItem<T>[]
    actionsHeader?: string
}

export default function Table<T = any>({
    tableHeader,
    totalCount,
    showSearch = true,
    showFilter = true,
    searchPlaceholder = 'بحث',
    filterOptions = [{ label: 'الاحدث', value: 'all' }],
    columns,
    data,
    onSearch,
    onFilterChange,
    actions,
    actionsHeader = 'الإجراءات'
}: TableProps<T>) {
    const [openDropdownIndex, setOpenDropdownIndex] = useState<number | null>(null);

    return (
        <div>
            <div className='mt-10 shadow-md rounded-md p-5'>
                {/* Table Header */}
                <div className='flex justify-between mb-5'>
                    <div className='flex gap-5 items-center w-full'>
                        <p className='text-lg font-bold'>{tableHeader}</p>
                        {totalCount !== undefined && (
                            <div className='py-1 px-2 bg-[#2B73F3] text-white rounded-lg font-bold'>
                                <p>{totalCount}</p>
                            </div>
                        )}
                    </div>

                    <div>
                        <div className='flex w-full gap-2'>
                            {showSearch && (
                                <input
                                    type="text"
                                    placeholder={searchPlaceholder}
                                    className='border-neutral-100 border-2 w-[15rem] rounded-md p-2'
                                    onChange={(e) => onSearch?.(e.target.value)}
                                />
                            )}
                            {showFilter && (
                                <select
                                    className='border-neutral-100 border-2 rounded-md p-2'
                                    onChange={(e) => onFilterChange?.(e.target.value)}
                                >
                                    {filterOptions.map((option) => (
                                        <option key={option.value} value={option.value}>
                                            {option.label}
                                        </option>
                                    ))}
                                </select>
                            )}
                        </div>
                    </div>
                </div>

                {/* Table Body */}
                <div className='overflow-x-auto'>
                    <table className='w-full border-collapse'>
                        <thead>
                            <tr className='bg-[#EAF1FF]'>
                                {columns.map((column) => (
                                    <th
                                        key={column.key}
                                        className='text-right p-3 font-semibold text-gray-700'
                                        style={{ width: column.width }}
                                    >
                                        {column.header}
                                    </th>
                                ))}
                                {actions && actions.length > 0 && (
                                    <th className='text-center  p-3 font-semibold text-gray-700'>
                                        {actionsHeader}
                                    </th>
                                )}
                            </tr>
                        </thead>
                        <tbody>
                            {data.length > 0 ? (
                                data.map((row, index) => (
                                    <tr key={index} className='border-b-2 border-[#EAF1FF] hover:bg-gray-50 transition-colors'>
                                        {columns.map((column) => (
                                            <td key={column.key} className='p-3  text-gray-800'>
                                                {column.render
                                                    ? column.render(row, index)
                                                    : (row as any)[column.key]}
                                            </td>
                                        ))}
                                        {actions && actions.length > 0 && (
                                            <td className='p-3 text-center'>
                                                <div className='relative inline-block'>
                                                    <button
                                                        onClick={() => setOpenDropdownIndex(openDropdownIndex === index ? null : index)}
                                                        className='p-2 hover:bg-gray-200 rounded-md transition-colors'
                                                    >
                                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                                            <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
                                                        </svg>
                                                    </button>
                                                    {openDropdownIndex === index && (
                                                        <>
                                                            <div
                                                                className='fixed inset-0 z-10'
                                                                onClick={() => setOpenDropdownIndex(null)}
                                                            />
                                                            <div className='absolute left-0 mt-2 w-48 bg-white rounded-md shadow-lg z-20 border border-gray-200'>
                                                                {actions.map((action, actionIndex) => (
                                                                    <button
                                                                        key={actionIndex}
                                                                        onClick={() => {
                                                                            action.onClick(row, index);
                                                                            setOpenDropdownIndex(null);
                                                                        }}
                                                                        className={`w-full text-right px-4 py-2 hover:bg-gray-100 transition-colors flex items-center gap-2 ${action.className || 'text-gray-700'
                                                                            } ${actionIndex === 0 ? 'rounded-t-md' : ''} ${actionIndex === actions.length - 1 ? 'rounded-b-md' : ''
                                                                            }`}
                                                                    >
                                                                        {action.icon}
                                                                        {action.label}
                                                                    </button>
                                                                ))}
                                                            </div>
                                                        </>
                                                    )}
                                                </div>
                                            </td>
                                        )}
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={columns.length + (actions && actions.length > 0 ? 1 : 0)} className='text-center p-8 text-gray-500'>
                                        لا توجد بيانات
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>

                </div>
            </div>
        </div>
    )
}
