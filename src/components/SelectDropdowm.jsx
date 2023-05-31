import * as React from "react";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export function SelectDropdown({ selectItems, defaultValue }) {
  console.log(defaultValue);
  const selectItemMap = selectItems.reduce((map, item) => {
    map[item.value] = item.label;
    return map;
  }, {});

  return (
    <Select>
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder={defaultValue} />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          {selectItems.map((item) => (
            <SelectItem key={item.value} value={item.value}>
              {item.label}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}

export default SelectDropdown;

// const selectItems = [
//   { value: "apple", label: "Apple" },
//   { value: "banana", label: "Banana" },
//   { value: "blueberry", label: "Blueberry" },
//   { value: "grapes", label: "Grapes" },
//   { value: "pineapple", label: "Pineapple" },
// ];
