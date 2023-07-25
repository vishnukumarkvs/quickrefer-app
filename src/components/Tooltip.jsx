import * as React from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { HelpCircle } from "lucide-react";

const HoverToolTip = ({ text }) => {
  return (
    <TooltipProvider>
      <span style={{ position: "relative" }}>
        <Tooltip>
          <TooltipTrigger>
            <span>
              <HelpCircle className="text-gray-500 p-1" />
            </span>
          </TooltipTrigger>
          <TooltipContent>
            <p>{text}</p>
          </TooltipContent>
        </Tooltip>
      </span>
    </TooltipProvider>
  );
};

export default HoverToolTip;
