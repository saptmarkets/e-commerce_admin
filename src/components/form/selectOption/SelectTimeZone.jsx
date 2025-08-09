import { Select } from "@windmill/react-ui";
import React from "react";

// Basic timezone data
const timeZones = [
  { tzCode: "UTC", label: "UTC (Coordinated Universal Time)" },
  { tzCode: "America/New_York", label: "Eastern Time (ET)" },
  { tzCode: "America/Chicago", label: "Central Time (CT)" },
  { tzCode: "America/Denver", label: "Mountain Time (MT)" },
  { tzCode: "America/Los_Angeles", label: "Pacific Time (PT)" },
  { tzCode: "Europe/London", label: "London (GMT)" },
  { tzCode: "Europe/Paris", label: "Paris (CET)" },
  { tzCode: "Asia/Dubai", label: "Dubai (GST)" },
  { tzCode: "Asia/Kolkata", label: "India (IST)" },
  { tzCode: "Asia/Shanghai", label: "China (CST)" },
  { tzCode: "Asia/Tokyo", label: "Japan (JST)" },
  { tzCode: "Australia/Sydney", label: "Sydney (AEST)" },
];

const SelectTimeZone = ({ register, name, label, required }) => {
  return (
    <Select
      name={name}
      {...register(`${name}`, {
        required: required ? `${label} is required!` : false,
      })}
    >
      <option value="" defaultValue hidden>
        Default Time Zone
      </option>
      {timeZones.map((timeZone, i) => (
        <option
          key={i + 1}
          value={timeZone.tzCode}
          className="py-12 hover:bg-white"
        >
          {timeZone.label}
        </option>
      ))}
    </Select>
  );
};

export default SelectTimeZone;
