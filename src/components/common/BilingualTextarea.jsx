import React from "react";
import TextAreaCom from "../form/others/TextAreaCom";

const BilingualTextarea = ({
  label,
  nameEn,
  nameAr,
  register,
  placeholderEn,
  placeholderAr,
  required = false,
  rows = 4
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
          <TextAreaCom
            register={register}
            name={nameEn}
            placeholder={placeholderEn}
            required={required}
            rows={rows}
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-600 mb-2">
            العربية
          </label>
          <TextAreaCom
            register={register}
            name={nameAr}
            placeholder={placeholderAr}
            required={required}
            rows={rows}
          />
        </div>
      </div>
    </div>
  );
};

export default BilingualTextarea; 