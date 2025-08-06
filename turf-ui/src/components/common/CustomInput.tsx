import React from 'react';

interface CustomInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  icon?: React.ReactNode;
  label?: string;
  error?: string;
}

const CustomInput: React.FC<CustomInputProps> = ({
  icon,
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
        <input
          {...props}
          className={`w-full pr-10 py-3 px-2 rounded-lg border focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition text-gray-900 ${error ? 'border-red-500' : 'border-gray-300'} ${className}`}
        />
        {icon && (
          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
            {icon}
          </span>
        )}
      </div>
      {error && <small className="p-error block mt-1">{error}</small>}
    </div>
  );
};

export default CustomInput; 