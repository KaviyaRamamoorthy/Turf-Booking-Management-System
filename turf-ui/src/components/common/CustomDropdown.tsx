import React from 'react';
import { Dropdown } from 'primereact/dropdown';

interface CustomDropdownProps extends React.ComponentProps<typeof Dropdown> {
    icon?: React.ReactNode;
    label?: string;
    error?: string;
}

const CustomDropdown: React.FC<CustomDropdownProps> = ({
    label,
    error,
    className = '',
    ...props
}) => {
    return (
        <div className="space-y-2">
            {label && (
                <label htmlFor={props.id} className="block text-sm font-medium text-gray-700">
                    {label}
                </label>
            )}
            <div className="relative">
                <Dropdown
                    {...props}
                    className={`w-full py-1 ps-2 rounded-lg border focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition text-gray-900 ${error ? 'border-red-500' : 'border-gray-300'} ${className}`}
                />
            </div>
            {error && <small className="p-error block mt-1">{error}</small>}
        </div>
    );
};

export default CustomDropdown; 