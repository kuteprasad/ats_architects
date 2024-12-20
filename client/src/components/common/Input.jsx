import React from 'react';

const Input = ({ 
  type = 'text', 
  label, 
  name, 
  value, 
  onChange, 
  placeholder = '', 
  required = false,
  error = '',
  isTextArea = false
}) => {
  return (
    <div className="mb-4">
      {label && (
        <label 
          htmlFor={name} 
          className="block text-gray-700 text-sm font-bold mb-2"
        >
          {label}
        </label>
      )}
      {isTextArea ? (
        <textarea
          id={name}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          required={required}
          className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 
            ${error ? 'border-red-500' : 'border-gray-300'}
            leading-tight focus:outline-none focus:shadow-outline`}
        />
      ) : (
        <input
          type={type}
          id={name}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          required={required}
          className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 
            ${error ? 'border-red-500' : 'border-gray-300'}
            leading-tight focus:outline-none focus:shadow-outline`}
        />
      )}
      {error && (
        <p className="text-red-500 text-xs italic">{error}</p>
      )}
    </div>
  );
};

export default Input;