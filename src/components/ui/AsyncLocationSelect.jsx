"use client";

// AsyncLocationSelect
import { Controller } from "react-hook-form";
import AsyncSelect from "react-select/async";
import { options } from "@/assets/location-options";

const defaultLocationOptions = [
  { value: "Bangalore, India", label: "Bangalore, India" },
  { value: "Mumbai, India", label: "Mumbai, India" },
  { value: "Delhi, India", label: "Delhi, India" },
  { value: "Chennai, India", label: "Chennai, India" },
  { value: "Hyderabad, India", label: "Hyderabad, India" },
  { value: "Kolkata, India", label: "Kolkata, India" },
  { value: "Pune, India", label: "Pune, India" },
  { value: "Ahmedabad, India", label: "Ahmedabad, India" },
  { value: "Noida, India", label: "Noida, India" },
  { value: "Gurgaon, India", label: "Gurgaon, India" },
];

const filterColors = async (inputValue) => {
  return options.filter((i) =>
    i.label.toLowerCase().includes(inputValue.toLowerCase())
  );
};

const loadOptions = (inputValue, callback) => {
  setTimeout(() => {
    callback(filterColors(inputValue));
  }, 1000);
};

const AsyncLocationSelect = ({ control, name, defaultSelectedLocation }) => {
  return (
    <div className="w-[280px]">
      <Controller
        name={name}
        control={control}
        render={({ field }) => (
          <div className="w-full">
            <AsyncSelect
              {...field}
              placeholder="Search..."
              loadOptions={loadOptions}
              defaultOptions={defaultLocationOptions}
              defaultValue={defaultSelectedLocation}
              defaultInputValue={defaultSelectedLocation || null}
              isSearchable
            />
          </div>
        )}
      />
    </div>
  );
};

export default AsyncLocationSelect;
