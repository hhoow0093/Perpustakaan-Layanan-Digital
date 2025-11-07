import React from "react";

export default function Dropdown({ label, options, value, onChange }) {
  return (
    <div className="flex flex-col w-full">
      {label && <label className="mb-2 text-gray-700 font-medium">{label}</label>}
      <select
        value={value}
        onChange={onChange}
        className="p-2 border-gray-400 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 "
      >
        <option value="">-- Choose an option --</option>
        {options.map((opt, idx) => (
          <option key={idx} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  );
}
