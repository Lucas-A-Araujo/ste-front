import React, { useState } from "react";
import { FaEye, FaEyeSlash, FaSearch, FaEnvelope, FaUser, FaLock, FaIdCard, FaCalendar } from "react-icons/fa";

type InputType = "text" | "email" | "password" | "search" | "cpf" | "date";

interface BaseInputProps {
  id: string;
  name: string;
  label?: string;
  placeholder?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  type?: InputType;
  error?: string;
  disabled?: boolean;
  required?: boolean;
  autoComplete?: string;
  loading?: boolean;
  className?: string;
  maxLength?: number;
  showRequiredIndicator?: boolean;
  min?: string;
  max?: string;
}

const getIcon = (type: InputType) => {
  switch (type) {
    case "email":
      return <FaEnvelope className="h-4 w-4 text-gray-400" />;
    case "password":
      return <FaLock className="h-4 w-4 text-gray-400" />;
    case "search":
      return <FaSearch className="h-5 w-5 text-gray-400" />;
    case "cpf":
      return <FaIdCard className="h-4 w-4 text-gray-400" />;
    case "date":
      return <FaCalendar className="h-4 w-4 text-gray-400" />;
    default:
      return <FaUser className="h-4 w-4 text-gray-400" />;
  }
};

const formatCPF = (value: string) => {
  const numbers = value.replace(/\D/g, "");
  const limitedNumbers = numbers.slice(0, 11);
  
  if (limitedNumbers.length <= 3) {
    return limitedNumbers;
  } else if (limitedNumbers.length <= 6) {
    return `${limitedNumbers.slice(0, 3)}.${limitedNumbers.slice(3)}`;
  } else if (limitedNumbers.length <= 9) {
    return `${limitedNumbers.slice(0, 3)}.${limitedNumbers.slice(3, 6)}.${limitedNumbers.slice(6)}`;
  } else {
    return `${limitedNumbers.slice(0, 3)}.${limitedNumbers.slice(3, 6)}.${limitedNumbers.slice(6, 9)}-${limitedNumbers.slice(9)}`;
  }
};

export const BaseInput: React.FC<BaseInputProps> = ({
  id,
  name,
  label,
  placeholder,
  value,
  onChange,
  type = "text",
  error,
  disabled = false,
  required = false,
  autoComplete,
  loading = false,
  className = "",
  maxLength,
  showRequiredIndicator = false,
  min,
  max,
}) => {
  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const getInputType = () => {
    if (type === "password") {
      return showPassword ? "text" : "password";
    }
    if (type === "date") {
      return "date";
    }
    if (type === "email") {
      return "email";
    }
    return "text";
  };

  const icon = getIcon(type);
  const hasIcon = type !== "text" || label;
  const isSearch = type === "search";
  const isPassword = type === "password";
  const isCPF = type === "cpf";
  const isDate = type === "date";

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (isCPF) {
      const formattedValue = formatCPF(e.target.value);
      const syntheticEvent = {
        ...e,
        target: {
          ...e.target,
          value: formattedValue,
          name: e.target.name,
        },
      };
      onChange(syntheticEvent);
    } else {
      onChange(e);
    }
  };

  return (
    <div className={className}>
      {label && (
        <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-2">
          {label} {required && showRequiredIndicator && <span className="text-gray-500">(obrigatório)</span>}
        </label>
      )}
      <div className="relative">
        {hasIcon && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            {icon}
          </div>
        )}
        <input
          id={id}
          name={name}
          type={getInputType()}
          autoComplete={autoComplete}
          required={required}
          maxLength={isCPF ? 14 : maxLength}
          min={isDate ? min : undefined}
          max={isDate ? max : undefined}
          className={`block w-full ${
            hasIcon ? 'pl-10' : 'pl-3'
          } ${
            isPassword ? 'pr-12' : isSearch && loading ? 'pr-10' : 'pr-3'
          } py-3 border rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-colors duration-200 ${
            error ? 'border-red-300' : 'border-gray-300'
          } ${disabled ? 'bg-gray-50 cursor-not-allowed' : ''}`}
          placeholder={placeholder}
          value={value}
          onChange={handleChange}
          disabled={disabled}
        />
        
        {isPassword && (
          <button
            type="button"
            className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 transition-colors duration-200"
            onClick={togglePasswordVisibility}
            disabled={disabled}
          >
            {showPassword ? (
              <FaEyeSlash className="h-4 w-4" />
            ) : (
              <FaEye className="h-4 w-4" />
            )}
          </button>
        )}
        
        {isSearch && loading && (
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
          </div>
        )}
      </div>
      {error && (
        <p className="mt-1 text-sm text-red-600">{error}</p>
      )}
    </div>
  );
}; 