import { ReactNode } from "react";
import LoadsIcon from "../../assets/icons/loads.svg?react";
import BoxesIcon from "../../assets/icons/boxes.svg?react";
import HourGlassIcon from "../../assets/icons/hourglass.svg?react";
import BulkIcon from "../../assets/icons/layers.svg?react";
import { MenuItem } from "@/types";
import { BusFrontIcon, ListIcon, RocketIcon, TruckIcon } from "lucide-react";

export const demandSidebar: MenuItem[][] = [
  [
    {
      icon: <LoadsIcon className="h-5 w-5" />,
      path: "my-loads",
      name: "My Loads",
    },
    {
      icon: <BoxesIcon className="stroke-[1.5px] h-5 w-5" />,
      path: "all-loads",
      name: "Loads Bazaar",
    },
    {
      icon: <BulkIcon className="stroke-[1.5px] h-5 w-5" />,
      path: "add-bulk",
      name: "Upload Bulk Loads",
    },
  ],
  // [
  //   {
  //     icon: <HourGlassIcon className="w-5 h-5" />,
  //     path: "",
  //     name: "Coming Soon",
  //   },
  // ],
];

export const supplySidebar: MenuItem[][] = [
  [
    {
      icon: <TruckIcon className="stroke-[1.5px] h-5 w-5" />,
      path: "my-trucks",
      name: "My Trucks",
    },
    {
      icon: <div className="relative flex items-center">
        <BusFrontIcon className="stroke-[1.5px] h-5 w-5" />
        <BusFrontIcon
          className="absolute right-2 top-0 stroke-[1.5px] h-5 w-5"
          style={{
            clipPath: 'inset(0 50% 0 0)',
          }}
        />
      </div>,
      path: "all-trucks",
      name: "Trucks Bazaar",
    },
    {
      icon: <ListIcon className="stroke-[1.5px] h-5 w-5" />,
      path: "directory",
      name: "Transporter Directory",
    },
    {
      icon: <BulkIcon className="stroke-[1.5px] h-5 w-5" />,
      path: "add-bulk",
      name: "Upload Bulk Trucks",
    },
  ],
  [
    {
      icon: <RocketIcon className="stroke-[1.5px] w-5 h-5" />,
      path: "services",
      name: "Other Services",
    },
  ],
];
