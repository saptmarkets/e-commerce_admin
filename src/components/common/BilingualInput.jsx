import React from "react";
import InputAreaTwo from "../form/input/InputAreaTwo";

const BilingualInput = ({
  label,
  nameEn,
  nameAr,
  register,
  placeholderEn,
  placeholderAr,
  required = false,
  type = "text"
}) => {
  return (
    <div className="mb-6">
      <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
        {label}
      </label>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-600 mb-2">
            English
          </label>
          <InputAreaTwo
            register={register}
            name={nameEn}
            placeholder={placeholderEn}
            required={required}
            type={type}
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-600 mb-2">
            العربية
          </label>
          <InputAreaTwo
            register={register}
            name={nameAr}
            placeholder={placeholderAr}
            required={required}
            type={type}
          />
        </div>
      </div>
    </div>
  );
};

export default BilingualInput; 