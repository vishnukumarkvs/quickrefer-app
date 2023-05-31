import * as React from "react";
import { Controller } from "react-hook-form";
import { XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

const statuses = [
  {
    value: "java",
    label: "java",
  },
  {
    value: "python",
    label: "python",
  },
  {
    value: "linux",
    label: "linux",
  },
  {
    value: "react",
    label: "react",
  },
  {
    value: "cloud",
    label: "cloud",
  },
];

function SkillAdder({ control, name }) {
  const [open, setOpen] = React.useState(false);

  return (
    <Controller
      control={control}
      name={name}
      render={({ field: { onChange, value = [] } }) => (
        <div className="flex flex-col items-start space-y-2">
          <div className="flex items-center space-x-4">
            <Popover open={open} onOpenChange={setOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  className="w-[150px] justify-start"
                >
                  <>+ Add skill</>
                </Button>
              </PopoverTrigger>
              <PopoverContent className="p-0" side="right" align="start">
                <Command>
                  <CommandInput placeholder="Change status..." />
                  <CommandList>
                    <CommandEmpty>No results found.</CommandEmpty>
                    <CommandGroup>
                      {statuses.map((status) => (
                        <CommandItem
                          key={status.value}
                          onSelect={() => {
                            const isStatusSelected = value.some(
                              (selectedStatus) =>
                                selectedStatus.value === status.value
                            );
                            if (!isStatusSelected) {
                              onChange([...value, status]);
                            }
                            setOpen(false);
                          }}
                        >
                          <span>{status.label}</span>
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>
          </div>
          <div className="flex flex-wrap gap-2">
            {value.map((status) => (
              <span
                key={status.value}
                className="flex items-center px-2 py-1 space-x-2 border border-blue-800 bg-indigo-100 rounded-sm"
              >
                <span>{status.label}</span>
                <XCircle
                  className="cursor-pointer"
                  onClick={() => {
                    onChange(
                      value.filter(
                        (selectedStatus) => selectedStatus !== status
                      )
                    );
                  }}
                />
              </span>
            ))}
          </div>
        </div>
      )}
    />
  );
}

export default SkillAdder;
