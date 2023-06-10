import * as React from "react";
import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import { Controller } from "react-hook-form";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

export function DatePicker({ control, name }) {
  const [isOpen, setIsOpen] = React.useState(false);

  return (
    <Controller
      control={control}
      name={name}
      // rules={{ required: true }} // not functioning as expected
      render={({ field: { onChange, value } }) => (
        <Popover isOpen={isOpen} onDismiss={() => setIsOpen(false)}>
          <PopoverTrigger asChild>
            <Button
              variant={"outline"}
              className={cn(
                "w-[280px] justify-start text-left font-normal",
                !value && "text-muted-foreground"
              )}
              onClick={() => setIsOpen(true)}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {value ? format(value, "PPP") : <span>Pick a date</span>}
            </Button>
          </PopoverTrigger>
          {isOpen && (
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={value}
                onSelect={(date) => {
                  onChange(date);
                  setIsOpen(false); // Close the popover after date selection
                }}
                initialFocus
              />
            </PopoverContent>
          )}
        </Popover>
      )}
    />
  );
}

export default DatePicker;
