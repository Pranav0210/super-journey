// import { allowDigitsInputOnly } from "@/lib/utils";
import { useEffect, useState } from "react";
import { DateTimePicker } from "@/components/DateTimePicker";
import useStepperFormStore from "../store";
import cn from "classnames";
import { allowPositiveDigitsOnly } from "@/lib/utils";
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
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Check, ChevronsUpDown } from "lucide-react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { getLoadValues, getTruckConfigs } from "../api";
// import { materialTypes } from "../data";

const Step2 = () => {
  const { step2Data, setStep2Data } = useStepperFormStore();

  const [open, setOpen] = useState(false);
  const [date24, setDate24] = useState<Date | undefined>(
    step2Data.expirationTime ? new Date(step2Data.expirationTime) : undefined,
  );

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    // Update the entire object
    setStep2Data({
      ...step2Data,
      [name]: value,
    });
  };

  const { data: loadValuesData } = useQuery({
    queryKey: ['allLoadvalues'],
    queryFn: () => getLoadValues(step2Data.unit),
  })

  const { data, mutate, isSuccess } = useMutation({
    mutationKey: ["get-configs"],
    mutationFn: () =>
      getTruckConfigs({ toneage: step2Data.quantity, unit: step2Data.unit }),
  });
  // console.log(data, isLoading);

  useEffect(() => {
    if (date24)
      setStep2Data({ ...step2Data, expirationTime: date24.toISOString() });
  }, [date24]);

  useEffect(() => {
    if (step2Data.quantity)
      mutate()
    console.log(length, step2Data.length)
  }, [])

  return (
    <div className="p-4 flex flex-col gap-y-8">
      <div className="text-left text-xl font-semibold">Truck Details</div>
      <div className="flex flex-col gap-2">
        <label className="text-left">
          Vehicle Registration Number<span className="text-brightRed">*</span>
        </label>
        <input
          type="text"
          placeholder="Enter Registration number"
          value={step2Data.regNo}
          name="regNo"
          onChange={handleChange}
          className="w-full h-[2rem] relative flex-1 p-2 border-2 border-gray-300 rounded-md text-left text-xs placeholder:text-xs font-normal focus:outline-none focus:border-2 focus:border-primaryIndigo hover:border-2 hover:border-primaryIndigo justify-between"
        />
      </div>
      <div className="flex flex-col gap-2">
        <label className="text-left">
          Minimum Price<span className="text-brightRed">*</span> (₹)
        </label>
        <input
          type="text"
          placeholder="Minimum Price (₹)"
          value={step2Data.minPrice}
          name="minPrice"
          onChange={(e) => {
            setStep2Data({ ...step2Data, minPrice: allowPositiveDigitsOnly(e) })
          }}
          className="w-full h-[2rem] relative flex-1 p-2 border-2 border-gray-300 rounded-md text-left text-xs placeholder:text-xs font-normal focus:outline-none focus:border-2 focus:border-primaryIndigo hover:border-2 hover:border-primaryIndigo justify-between"
        />
      </div>
      <div className="flex w-72 flex-col gap-2">
        <label className="text-left">
          Truck Leaving On<span className="text-brightRed"></span>
        </label>
        <DateTimePicker
          hourCycle={12}
          value={date24}
          placeholder={"Set Truck Leaving Time"}
          className={cn(
            { "text-textGray": !step2Data.expirationTime },
            "border-2 text-xs border-gray-300 shadow-none hover:bg-white focus:border-2 focus:border-primaryIndigo hover:border-2 hover:border-primaryIndigo",
          )}
          onChange={setDate24}
        />
      </div>
      <div className="flex flex-col gap-2">
        <label className="text-left">
          Tonnage<span className="text-brightRed">*</span>
        </label>
        <div className="flex flex-grow gap-4">
          <Popover open={open} onOpenChange={setOpen}>
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
                          if (step2Data.unit)
                            mutate()
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
            onClick={() => {
              setStep2Data({ ...step2Data, unit: "TN" })
              if (step2Data.quantity) mutate()
            }}
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
            onClick={() => {
              setStep2Data({ ...step2Data, unit: "KL" })
              if (step2Data.quantity) mutate()
            }}
          >
            Kilo Litre(s)
          </span>
        </div>
      </div>
      { data && data[0]?.configuration[0] &&
        <>
          <div className="text-left -mb-4">
            Select Body Type<span className="text-brightRed">*</span>
          </div>
          <ToggleGroup type="single" variant="default" value={step2Data.body}>
            {isSuccess &&
              data[0]?.configuration &&
              Object.keys(data[0]?.configuration[0]).map((item) => (
                <ToggleGroupItem
                  value={item}
                  className=""
                  onClick={() => {
                    if (step2Data.body !== item)
                      setStep2Data({ ...step2Data, body: item, length: "" });
                    else setStep2Data({ ...step2Data, body: item });
                  }}
                >
                  <span className="text-xs ">{item}</span>
                </ToggleGroupItem>
              ))}
          </ToggleGroup>
        </>
      }
      {data && data[0]?.configuration[0] && step2Data.body && (
        data[0]?.configuration[0][`${step2Data.body}`].length > 0 ?
          <>
            <div className="text-left -mb-4">
              Select Truck Length<span className="text-brightRed">*</span>
            </div>
            <ToggleGroup
              type="single"
              variant="default"
              value={step2Data.length.toString()}
              className="grid grid-cols-6 w-fit"
            >
              {data[0]?.configuration[0][`${step2Data.body}`]?.map((length) => (
                <ToggleGroupItem
                  value={length.toString()}
                  aria-label="Toggle bold"
                  className="w-24"
                  onClick={() =>
                    setStep2Data({ ...step2Data, length: length.toString() })
                  }
                >
                  <span className="text-xs">{`${length} ft`}</span>
                </ToggleGroupItem>
              ))}
            </ToggleGroup>
          </> :
          <div className="text-left text-sm text-terraCotta">
            There are no length options available for this body type and have fixed body length.
          </div>
      )}
    </div>
  );
};
export default Step2;
