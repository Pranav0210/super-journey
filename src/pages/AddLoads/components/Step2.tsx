import { allowPositiveDigitsOnly } from "@/lib/utils";
import { useEffect, useState } from "react";
import { DateTimePicker } from "@/components/DateTimePicker";
import useStepperFormStore from "../store";
import cn from "classnames";
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
import { Check, ChevronsUpDown } from "lucide-react";
import { materialTypes } from "../data";
import { useQuery } from "@tanstack/react-query";
import { getLoadValues } from "../api";

const Step2 = () => {
  const { step2Data, setStep2Data } = useStepperFormStore();

  const [open, setOpen] = useState(false);
  const [open2, setOpen2] = useState(false);
  const [date24, setDate24] = useState<Date | undefined>(
    step2Data.expirationTime ? new Date(step2Data.expirationTime) : undefined,
  );

  // const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  //   const { name, value } = e.target;

  //   setStep2Data({
  //     ...step2Data,
  //     [name]: value,
  //   });
  // };

  const { data: loadValuesData, isFetching } = useQuery({
    queryKey: ['allLoadvalues'],
    queryFn: () => getLoadValues(step2Data.unit)
  })

  useEffect(() => {
    if (date24)
      setStep2Data({ ...step2Data, expirationTime: date24.toISOString() });
  }, [date24]);

  return (
    <div className="p-4 flex flex-col gap-y-8">
      <div className="text-left text-xl font-semibold">Load Details</div>
      {/* <div className="flex flex-col gap-2">
        <label className="text-left">Title<span className="text-brightRed">*</span></label>
        <input
          type="text"
          placeholder="Enter Title"
          className="w-full h-[2rem] flex-1 p-2 border-2 border-gray-300 rounded-md text-left text-xs placeholder:text-xs font-normal focus:outline-none focus:border-2 focus:border-primaryIndigo"
        />
      </div>
      <div className="flex flex-col gap-2">
        <label className="text-left">Description</label>
        <input
          type="text"
          placeholder="Enter Description"
          className="w-full h-[2rem] flex-1 p-2 border-2 border-gray-300 rounded-md text-left text-xs placeholder:text-xs font-normal focus:outline-none focus:border-2 focus:border-primaryIndigo"
        />
      </div> */}
      <div className="flex flex-col gap-2">
        <label className="text-left">
          Material Type<span className="text-brightRed">*</span>
        </label>
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              role="combobox"
              // aria-expanded={open}
              className={cn(
                {
                  "text-textGray": !step2Data.material,
                },
                "w-[288px] border-2 font-normal text-xs border-gray-300 shadow-none hover:bg-white focus:border-2 focus:border-primaryIndigo hover:border-2 hover:border-primaryIndigo justify-between",
              )}
            >
              {step2Data.material
                ? materialTypes.find(
                  (item) => item.materials_type === step2Data.material,
                )?.materials_type
                : "Select Material Type"}
              <ChevronsUpDown className="opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-[200px] p-0">
            <Command>
              <CommandInput placeholder="Search item..." className="h-9" />
              <CommandList>
                <CommandEmpty>No item found.</CommandEmpty>
                <CommandGroup>
                  {materialTypes.map((item) => (
                    <CommandItem
                      key={item.ID}
                      value={item.materials_type}
                      onSelect={(currentValue) => {
                        setStep2Data({
                          ...step2Data,
                          material:
                            currentValue === step2Data.material
                              ? ""
                              : currentValue,
                        });
                        setOpen(false);
                      }}
                    >
                      {item.materials_type}
                      <Check
                        className={cn(
                          "ml-auto",
                          step2Data.material === item.materials_type
                            ? "opacity-100"
                            : "opacity-0",
                        )}
                      />
                    </CommandItem>
                  ))}
                </CommandGroup>
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>
      </div>
      <div className="flex flex-col gap-2">
        <label className="text-left">
          Tonnage<span className="text-brightRed">*</span>
        </label>
        <div className="flex flex-grow gap-4">
          <Popover open={open2} onOpenChange={setOpen2}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                role="combobox"
                // aria-expanded={open}
                className={cn(
                  {
                    "text-textGray": !step2Data.quantity,
                  },
                  "w-[288px] border-2 font-normal text-xs border-gray-300 shadow-none hover:bg-white focus:border-2 focus:border-primaryIndigo hover:border-2 hover:border-primaryIndigo justify-between",
                )}
              >
                {step2Data.quantity
                  ? `${step2Data.quantity}` : "Select Load"}
                <ChevronsUpDown className="opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[200px] p-0">
              <Command>
                <CommandInput placeholder="Search load value..." className="h-9" />
                <CommandList>
                  <CommandEmpty>No item found.</CommandEmpty>
                  <CommandGroup>
                    {loadValuesData?.data?.map((item) => (
                      <CommandItem
                        key={item}
                        value={item}
                        onSelect={(currentValue) => {
                          setStep2Data({
                            ...step2Data,
                            quantity:
                              currentValue === step2Data.quantity
                                ? ""
                                : currentValue,
                          });
                          setOpen(false);
                        }}
                      >
                        {item}
                        <Check
                          className={cn(
                            "ml-auto",
                            step2Data.quantity === item
                              ? "opacity-100"
                              : "opacity-0",
                          )}
                        />
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>
          <span
            className={cn(
              "border-2 border-gray-300 rounded-md flex items-center justify-center text-xs px-4 font-normal cursor-pointer hover:border-2 hover:border-primaryIndigo",
              {
                "border-primaryIndigo": step2Data.unit == "TN",
              },
            )}
            onClick={() => setStep2Data({ ...step2Data, unit: "TN" })}
          >
            Ton(s)
          </span>
          <span
            className={cn(
              "border-2 border-gray-300 rounded-md flex items-center justify-center text-xs px-4  font-normal cursor-pointer hover:border-2 hover:border-primaryIndigo",
              {
                "border-primaryIndigo": step2Data.unit == "KL",
              },
            )}
            onClick={() => setStep2Data({ ...step2Data, unit: "KL" })}
          >
            Kilo Litre(s)
          </span>
        </div>
      </div>
      {/* <div className="flex flex-col gap-2">
        <label className="text-left">
          Quantity<span className="text-brightRed">*</span>
        </label>
        <div className="grid grid-cols-8 gap-1 pr-1 border-2 border-gray-300 rounded-md text-left text-xs placeholder:text-xs font-normal hover:border-2 hover:border-primaryIndigo justify-between">
          <input
            type="text"
            placeholder="Enter Quantity"
            name="quantity"
            value={step2Data.quantity}
            onChange={(e) => handleChange(e)}
            className="col-span-6 flex-1 p-2 border-gray-300 rounded-md text-left text-xs placeholder:text-xs font-normal focus:outline-none focus:border-0 focus:border-primaryIndigo"
          />
          <span
            className={cn(
              "border-2 border-gray-300 rounded-md flex items-center justify-center text-xs my-1 font-normal cursor-pointer hover:border-2 hover:border-primaryIndigo",
              {
                "border-primaryIndigo": step2Data.unit == "TN",
              },
            )}
            onClick={() => setStep2Data({ ...step2Data, unit: "TN" })}
          >
            Ton(s)
          </span>
          <span
            className={cn(
              "border-2 border-gray-300 rounded-md flex items-center justify-center text-xs my-1 font-normal cursor-pointer hover:border-2 hover:border-primaryIndigo",
              {
                "border-primaryIndigo": step2Data.unit == "KL",
              },
            )}
            onClick={() => setStep2Data({ ...step2Data, unit: "KL" })}
          >
            Kilo Litre(s)
          </span>
        </div>
      </div> */}
      <div className="flex flex-col gap-2">
        <label className="text-left">
          Minimum Price<span className="text-brightRed">*</span> (₹)
        </label>
        <input
          type="text"
          placeholder="Approx. Fare (₹)"
          value={step2Data.approxFare}
          name="approxFare"
          onChange={(e) => {
            setStep2Data({ ...step2Data, approxFare: allowPositiveDigitsOnly(e) })
          }}
          className="w-full h-[2rem] relative flex-1 p-2 border-2 border-gray-300 rounded-md text-left text-xs placeholder:text-xs font-normal focus:outline-none focus:border-2 focus:border-primaryIndigo hover:border-2 hover:border-primaryIndigo justify-between"
        />
      </div>
      <div className="flex w-72 flex-col gap-2">
        <label className="text-left">
          Expiration Time<span className="text-brightRed">*</span>
        </label>
        <DateTimePicker
          hourCycle={12}
          value={date24}
          placeholder={"Set Expiration Time"}
          className={cn(
            { "text-textGray": !step2Data.expirationTime },
            "border-2 text-xs border-gray-300 shadow-none hover:bg-white focus:border-2 focus:border-primaryIndigo hover:border-2 hover:border-primaryIndigo",
          )}
          onChange={setDate24}
        />
      </div>
    </div>
  );
};
export default Step2;
