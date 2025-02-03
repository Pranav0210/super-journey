// import { allowDigitsInputOnly } from "@/lib/utils";
import { useEffect, useRef, useState } from "react";
import { DateTimePicker } from "@/components/DateTimePicker";
import useStepperFormStore from "../store";
import cn from "classnames";
import PinDropIcon from "@/assets/icons/pin_drop.svg?react";
import { getGooglePlaces } from "../api";
import { OperatingCity, Step1Data } from "../types";
import { X } from "lucide-react";
// import { Button } from "@/components/ui/button";
// import {
//   Command,
//   CommandEmpty,
//   CommandGroup,
//   CommandInput,
//   CommandItem,
//   CommandList,
// } from "@/components/ui/command";
// import {
//   Popover,
//   PopoverContent,
//   PopoverTrigger,
// } from "@/components/ui/popover";
// import { Check, ChevronsUpDown } from "lucide-react";
// import { materialTypes } from "../data";

const Step1 = () => {
  const { step1Data, setStep1Data } = useStepperFormStore();
  const [homebaseSuggestions, setHomebaseSuggestions] = useState<OperatingCity[]>([]);
  const [operatingCitySuggestions, setOperatingCitySuggestions] = useState<OperatingCity[]>([]);
  const [operatingCity, setOperatingCity] = useState<boolean>(false);
  const [homebase, setHomebase] = useState(false);
  const [citySearch, setCitySearch] = useState<string>('')

  const debounceTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    // Update the store data
    setStep1Data({
      ...step1Data,
      [name]: value,
    });

    if (debounceTimeoutRef.current) {
      clearTimeout(debounceTimeoutRef.current);
    }

    if (name == 'operatingCity')
      setCitySearch(value)

    debounceTimeoutRef.current = setTimeout(() => {
      if (name === "homebase") {
        fetchSuggestions(value, setHomebaseSuggestions, setHomebase);
      }
      else if (name == "operatingCity") {
        fetchSuggestions(value, setOperatingCitySuggestions, setOperatingCity);
      }
    }, 300);
  };

  const fetchSuggestions = async (
    query: string,
    setSuggestions: React.Dispatch<React.SetStateAction<OperatingCity[]>>,
    setLoading: React.Dispatch<React.SetStateAction<boolean>>,
  ) => {
    if (query.trim().length > 2) {
      setLoading(true);
      try {
        const places = await getGooglePlaces(query);
        const allSuggestions = places?.predictions?.map(
          (obj: any) => {
            return {
              name: obj.description,
              placeId: obj.place_id
            }
          },
        );
        console.log(allSuggestions);
        setSuggestions(allSuggestions);
      } catch (error) {
        console.error("Error fetching places:", error);
        setSuggestions([]);
      } finally {
        setLoading(false);
      }
    } else {
      setSuggestions([]);
    }
  };

  const handleSuggestionClick = (
    suggestion: OperatingCity,
    fieldName: string,
  ) => {
    if (fieldName == "homebase") {
      setStep1Data({
        ...step1Data,
        [fieldName]: suggestion,
      });
      setHomebaseSuggestions([]);
    } 
    else if (fieldName == "operatingCity") {
      setStep1Data({
        ...step1Data,
        operatingCities: [...step1Data.operatingCities, suggestion],
      });
      setOperatingCitySuggestions([]);
      setCitySearch('')
    }
  };

  const handleRemoveCity = (indexToRemove: number) => {
    setStep1Data({
      ...step1Data,
      operatingCities: step1Data.operatingCities.filter(
        (_, index) => index !== indexToRemove
      ),
    });
  };

  return (
    <div className="p-4 flex flex-col gap-y-8">
      <div className="text-left text-xl font-semibold">Transporter Details</div>
      <div className="flex flex-col gap-2">
        <label className="text-left">Transporter Name<span className="text-brightRed">*</span></label>
        <input
          type="text"
          name="companyName"
          value={step1Data.companyName}
          onChange={handleChange}
          placeholder="Enter Transporter Name"
          className="w-full h-[2rem] flex-1 p-2 border-2 border-gray-300 rounded-md text-left text-xs placeholder:text-xs font-normal focus:outline-none focus:border-2 focus:border-primaryIndigo"
        />
      </div>

      <div className="flex flex-col gap-2 relative">
        <label className="text-left">Home Base Location<span className="text-brightRed">*</span></label>
        <div className="flex gap-4">
          <section className="relative flex items-center gap-2 font-semibold">
            <PinDropIcon className="text-pantoneGreen" />
          </section>
          <div className="w-full relative">
            <input
              type="text"
              placeholder="Search homebase"
              name="homebase"
              value={step1Data.homebase.name}
              onChange={handleChange}
              className="w-full h-[2rem] flex-1 p-2 border-2 border-gray-300 rounded-md text-left text-xs placeholder:text-xs font-normal focus:outline-none focus:border-2 focus:border-primaryIndigo"
            />
            {homebaseSuggestions.length > 0 && (
              <ul className="absolute top-full mt-2 left-0 w-full bg-white border-2 border-gray-300 rounded-md shadow-md max-h-40 overflow-auto z-10">
                {homebase ? (
                  <li className="p-2 text-sm text-gray-500">Loading...</li>
                ) : (
                  homebaseSuggestions.map((suggestion, index) => (
                    <li
                      key={index}
                      className="p-2 text-sm text-left hover:bg-gray-100 cursor-pointer"
                      onClick={() =>
                        handleSuggestionClick(suggestion, "homebase")
                      }
                    >
                      {suggestion.name}
                    </li>
                  ))
                )}
              </ul>
            )}
          </div>
        </div>
      </div>
      <div className="flex flex-col gap-2 relative">
        <label className="text-left">Add Operating Cities<span className="text-brightRed">*</span></label>
        <div className="flex gap-4">
          <section className="relative flex items-center gap-2 font-semibold">
            <PinDropIcon className="text-pantoneGreen" />
          </section>
          <div className="w-full relative">
            <input
              type="text"
              placeholder="Add operating city"
              name="operatingCity"
              value={citySearch}
              onChange={handleChange}
              className="w-full h-[2rem] flex-1 p-2 border-2 border-gray-300 rounded-md text-left text-xs placeholder:text-xs font-normal focus:outline-none focus:border-2 focus:border-primaryIndigo"
            />
            {operatingCitySuggestions.length > 0 && (
              <ul className="absolute top-full mt-2 left-0 w-full bg-white border-2 border-gray-300 rounded-md shadow-md max-h-40 overflow-auto z-10">
                {homebase ? (
                  <li className="p-2 text-sm text-gray-500">Loading...</li>
                ) : (
                  operatingCitySuggestions.map((suggestion, index) => (
                    <li
                      key={index}
                      className="p-2 text-sm text-left hover:bg-gray-100 cursor-pointer"
                      onClick={() =>
                        handleSuggestionClick(suggestion, "operatingCity")
                      }
                    >
                      {suggestion.name}
                    </li>
                  ))
                )}
              </ul>
            )}
          </div>
        </div>
        <div className="flex gap-2">
          {step1Data.operatingCities.map((item, index) => (
            <div className="p-2 border-2 border-gray-300 rounded-lg text-xs flex gap-1 items-center">
              {item.name}
              <span className="rounded-full flex items-center justify-center border p-[2px] border-gray-300 hover:border-gray-500 hover:cursor-pointer" onClick={() => handleRemoveCity(index)}><X className="w-3 h-3" /></span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
export default Step1;
