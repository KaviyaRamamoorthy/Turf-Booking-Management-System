import React from 'react';
import CustomInput from './CustomInput';

interface CustomEmailInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

const CustomEmailInput = ({ label, error, ...props }: CustomEmailInputProps) => {
  return (
    <CustomInput
      type="email"
      label={label}
      error={error}
      icon={<i className="pi pi-envelope" />}
      autoComplete="email"
      {...props}
    />
  );
};

export default CustomEmailInput; 