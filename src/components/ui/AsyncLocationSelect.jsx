"use client";

// AsyncLocationSelect
import { Controller } from "react-hook-form";
import AsyncSelect from "react-select/async";
import { options } from "@/assets/location-options";

// export const options = [
//   { value: "Tokyo, Japan", label: "Tokyo, Japan" },
//   { value: "Jakarta, Indonesia", label: "Jakarta, Indonesia" },
//   { value: "Delhi, India", label: "Delhi, India" },
//   { value: "Guangzhou, China", label: "Guangzhou, China" },
//   { value: "Mumbai, India", label: "Mumbai, India" },
//   { value: "Manila, Philippines", label: "Manila, Philippines" },
//   { value: "Shanghai, China", label: "Shanghai, China" },
//   { value: "SÃ£o Paulo, Brazil", label: "SÃ£o Paulo, Brazil" },
//   { value: "Seoul, South Korea", label: "Seoul, South Korea" },
//   { value: "Mexico City, Mexico", label: "Mexico City, Mexico" },
// ];

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
  const t = await options.filter((i) =>
    i.label.toLowerCase().includes(inputValue.toLowerCase())
  );
  return t;
};

const promiseOptions = (inputValue) =>
  new Promise((resolve) => {
    setTimeout(() => {
      resolve(filterColors(inputValue));
    }, 1000);
  });

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
              loadOptions={promiseOptions}
              defaultOptions={defaultLocationOptions}
              defaultValue={defaultSelectedLocation}
              defaultInputValue={defaultSelectedLocation || null}
            />
          </div>
        )}
      />
    </div>
  );
};

export default AsyncLocationSelect;
