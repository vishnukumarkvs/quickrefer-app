import * as React from "react";
import {
  ArrowUpCircle,
  CheckCircle2,
  Circle,
  HelpCircle,
  LucideIcon,
  XCircle,
} from "lucide-react";

import { cn } from "@/lib/utils";
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
    value: "backlog",
    label: "Backlog",
  },
  {
    value: "todo",
    label: "Todo",
  },
  {
    value: "in progress",
    label: "In Progress",
  },
  {
    value: "done",
    label: "Done",
  },
  {
    value: "canceled",
    label: "Canceled",
  },
];

function SkillAdder() {
  const [open, setOpen] = React.useState(false);
  const [selectedStatuses, setSelectedStatuses] = React.useState([]); // New state variable to store selected statuses

  const handleStatusSelect = (status) => {
    // Check if the selected status is already present
    const isStatusSelected = selectedStatuses.some(
      (selectedStatus) => selectedStatus.value === status.value
    );

    if (!isStatusSelected) {
      setSelectedStatuses((prevSelectedStatuses) => [
        ...prevSelectedStatuses,
        status,
      ]);
    }

    setOpen(false);
  };

  const handleStatusRemove = (status) => {
    setSelectedStatuses((prevSelectedStatuses) =>
      prevSelectedStatuses.filter((selectedStatus) => selectedStatus !== status)
    );
  };

  return (
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
                      onSelect={() => handleStatusSelect(status)}
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
        {selectedStatuses.map((status) => (
          <span
            key={status.value}
            className="flex items-center px-2 py-1 space-x-2 border border-blue-800 bg-blue-100 rounded-sm"
          >
            <span>{status.label}</span>
            <XCircle
              className="cursor-pointer"
              onClick={() => handleStatusRemove(status)}
            />
          </span>
        ))}
      </div>
    </div>
  );
}

export default SkillAdder;
